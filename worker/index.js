// NeighborAGI_WEB backend — one Cloudflare Worker.
//
// It serves the built site (the ASSETS binding) and the /api/* backend over a free D1 database, with support-chat
// images in R2. An account IS a per-user key: it is bound to the one device it is first used on, and the admin
// decides for how long (and whether) it may run the program. The program itself calls /api/app/login to check
// access; the AI-usage permission is a different project entirely (../alternateApiKey) and is not handled here.
//
// Security notes for the operator:
//   * the admin password is a Worker secret (ADMIN_PASSWORD), never in this code;
//   * passwords are stored only as salted PBKDF2 hashes, with a server pepper (AUTH_PEPPER secret);
//   * every account is bound to its first device, so sharing one account across machines fails by design.

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }
const WEB_SESSION_MS = 30 * 24 * 3600 * 1000
const APP_SESSION_MS = 365 * 24 * 3600 * 1000
const FOREVER = 4102444800000 // ~2100-01-01, used as "banned forever"
const PBKDF2_ITERATIONS = 100000
const ADMIN_USER_ID = '__admin__'

// ---- small helpers -------------------------------------------------------------------------
const now = () => Date.now()
const uuid = () => crypto.randomUUID()
const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...extra } })
const bad = (message, status = 400) => json({ error: message }, status)
const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)))
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
const token = () => b64(crypto.getRandomValues(new Uint8Array(32))).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' }[c]))

function corsHeaders(request) {
  // The desktop app (file://, no Origin) and the site both call this; echo the Origin so credentials work.
  const origin = request.headers.get('Origin') || '*'
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-credentials': 'true',
    'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
    'access-control-max-age': '86400',
  }
}

async function hashPassword(password, pepper, saltBytes, iterations = PBKDF2_ITERATIONS) {
  const salt = saltBytes || crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password + (pepper || '')), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256)
  return `pbkdf2$${iterations}$${b64(salt)}$${b64(bits)}`
}

async function verifyPassword(password, pepper, stored) {
  try {
    const [, iter, salt, want] = stored.split('$')
    const got = await hashPassword(password, pepper, fromB64(salt), Number(iter))
    const a = new TextEncoder().encode(got.split('$')[3])
    const b = new TextEncoder().encode(want)
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
    return diff === 0
  } catch {
    return false
  }
}

function bearer(request) {
  const header = request.headers.get('Authorization') || ''
  if (header.startsWith('Bearer ')) return header.slice(7).trim()
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(/(?:^|;\s*)nagi_session=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

async function sessionUser(env, request, kind) {
  const value = bearer(request)
  if (!value) return null
  const row = await env.DB.prepare('SELECT user_id, kind, expires_at FROM sessions WHERE token = ?').bind(value).first()
  if (!row || row.expires_at < now() || (kind && row.kind !== kind)) return null
  if (row.user_id === ADMIN_USER_ID) return { id: ADMIN_USER_ID, is_admin: 1, kind: row.kind }
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(row.user_id).first()
  return user ? { ...user, kind: row.kind } : null
}

async function newSession(env, userId, kind, ms) {
  const t = token()
  await env.DB.prepare('INSERT INTO sessions (token, user_id, kind, created_at, expires_at) VALUES (?,?,?,?,?)')
    .bind(t, userId, kind, now(), now() + ms).run()
  return t
}

const publicUser = (u) => ({
  id: u.id, email: u.email, username: u.username, createdAt: u.created_at,
  country: u.signup_country, city: u.signup_city, deviceName: u.device_name, deviceBound: !!u.device_id,
  activatedUntil: u.activated_until, bannedUntil: u.banned_until, isAdmin: !!u.is_admin,
})

const accessState = (u) => {
  if (u.banned_until && u.banned_until > now()) return { access: false, reason: 'banned', bannedUntil: u.banned_until }
  if (!u.activated_until || u.activated_until < now()) return { access: false, reason: 'not_activated', activatedUntil: u.activated_until }
  return { access: true, activatedUntil: u.activated_until }
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const USERNAME_RE = /^[A-Za-z0-9_.-]{3,32}$/

// ---- routes --------------------------------------------------------------------------------
async function signup(env, request, body) {
  const email = String(body.email || '').trim().toLowerCase()
  const username = String(body.username || '').trim()
  const password = String(body.password || '')
  if (!EMAIL_RE.test(email)) return bad('enter a valid email')
  if (!USERNAME_RE.test(username)) return bad('the username must be 3-32 letters, numbers, . _ or -')
  if (password.length < 8) return bad('the password must be at least 8 characters')
  const clash = await env.DB.prepare('SELECT 1 FROM users WHERE email = ? OR username = ?').bind(email, username).first()
  if (clash) return bad('that email or username is already taken', 409)
  const id = uuid()
  const cf = request.cf || {}
  await env.DB.prepare(
    `INSERT INTO users (id, email, username, password_hash, created_at, signup_ip, signup_country, signup_city)
     VALUES (?,?,?,?,?,?,?,?)`,
  ).bind(id, email, username, await hashPassword(password, env.AUTH_PEPPER), now(),
    request.headers.get('CF-Connecting-IP') || '', cf.country || '', cf.city || '').run()
  const t = await newSession(env, id, 'web', WEB_SESSION_MS)
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
  return json({ token: t, user: publicUser(user) })
}

async function login(env, request, body) {
  const who = String(body.email || body.username || '').trim().toLowerCase()
  const password = String(body.password || '')
  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? OR username = ?').bind(who, who).first()
  if (!user || !(await verifyPassword(password, env.AUTH_PEPPER, user.password_hash))) return bad('wrong email or password', 401)
  await env.DB.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').bind(now(), user.id).run()
  const t = await newSession(env, user.id, 'web', WEB_SESSION_MS)
  return json({ token: t, user: publicUser(user) })
}

// The desktop program logs in here. The account binds to this device the first time, and only this device after.
async function appLogin(env, request, body) {
  const who = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const deviceId = String(body.device_id || '').trim()
  const deviceName = String(body.device_name || '').slice(0, 120)
  if (!deviceId) return bad('a device id is required')
  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(who).first()
  if (!user || !(await verifyPassword(password, env.AUTH_PEPPER, user.password_hash))) {
    return json({ ok: false, reason: 'bad_credentials', signupUrl: '/signup' }, 401)
  }
  if (!user.device_id) {
    await env.DB.prepare('UPDATE users SET device_id = ?, device_name = ?, device_bound_at = ? WHERE id = ?')
      .bind(deviceId, deviceName || 'PC', now(), user.id).run()
    user.device_id = deviceId
    user.device_name = deviceName || 'PC'
  } else if (user.device_id !== deviceId) {
    return json({ ok: false, reason: 'other_device', deviceName: user.device_name || 'Another device' }, 403)
  }
  const state = accessState(user)
  const t = await newSession(env, user.id, 'app', APP_SESSION_MS)
  return json({ ok: true, token: t, user: publicUser(user), ...state })
}

// The program polls this to learn its access and any admin notifications.
async function appStatus(env, request) {
  const user = await sessionUser(env, request, 'app')
  if (!user || user.id === ADMIN_USER_ID) return bad('not signed in', 401)
  const unread = await env.DB.prepare(
    "SELECT id, body, created_at FROM support_messages WHERE user_id = ? AND sender = 'admin' AND read_by_user = 0 ORDER BY created_at",
  ).bind(user.id).all()
  return json({ ...accessState(user), notifications: (unread.results || []).map((m) => ({ id: m.id, body: m.body, at: m.created_at })) })
}

async function download(env, request) {
  const user = await sessionUser(env, request)
  if (!user) return bad('sign in to download', 401)
  return json({ url: env.HF_INSTALLER_URL })
}

// ---- support chat --------------------------------------------------------------------------
async function supportList(env, request) {
  const user = await sessionUser(env, request)
  if (!user || user.id === ADMIN_USER_ID) return bad('not signed in', 401)
  const rows = await env.DB.prepare('SELECT id, sender, body, image_key, created_at FROM support_messages WHERE user_id = ? ORDER BY created_at').bind(user.id).all()
  await env.DB.prepare("UPDATE support_messages SET read_by_user = 1 WHERE user_id = ? AND sender = 'admin'").bind(user.id).run()
  return json({ messages: rows.results || [] })
}

async function supportSend(env, request, body) {
  const user = await sessionUser(env, request)
  if (!user || user.id === ADMIN_USER_ID) return bad('not signed in', 401)
  const text = String(body.body || '').slice(0, 4000)
  let imageKey = null
  if (body.image) imageKey = await storeImage(env, user.id, body.image)
  if (!text && !imageKey) return bad('write a message')
  const id = uuid()
  await env.DB.prepare('INSERT INTO support_messages (id, user_id, sender, body, image_key, created_at, read_by_admin) VALUES (?,?,?,?,?,?,0)')
    .bind(id, user.id, 'user', text, imageKey, now()).run()
  return json({ id, imageKey })
}

async function storeImage(env, userId, dataUrl) {
  if (!env.IMAGES) return null // R2 not enabled: image attachments are skipped, text still sends
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(String(dataUrl))
  if (!match) return null
  const bytes = fromB64(match[2])
  if (bytes.length > 3 * 1024 * 1024) throw new Error('image too large')
  const key = `${userId}/${uuid()}`
  await env.IMAGES.put(key, bytes, { httpMetadata: { contentType: match[1] } })
  return key
}

async function supportImage(env, request, key) {
  const user = await sessionUser(env, request)
  if (!user) return bad('not signed in', 401)
  if (user.id !== ADMIN_USER_ID && !key.startsWith(user.id + '/')) return bad('not found', 404)
  if (!env.IMAGES) return bad('not found', 404)
  const obj = await env.IMAGES.get(key)
  if (!obj) return bad('not found', 404)
  return new Response(obj.body, { headers: { 'content-type': obj.httpMetadata?.contentType || 'image/png', 'cache-control': 'private, max-age=86400' } })
}

// ---- admin ---------------------------------------------------------------------------------
async function adminLogin(env, body) {
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  if (!env.ADMIN_PASSWORD) return bad('the admin password is not configured on the server', 500)
  if (email !== String(env.ADMIN_EMAIL || '').toLowerCase() || password !== env.ADMIN_PASSWORD) return bad('wrong admin credentials', 401)
  const t = await newSession(env, ADMIN_USER_ID, 'admin', WEB_SESSION_MS)
  return json({ token: t })
}

async function requireAdmin(env, request) {
  const who = await sessionUser(env, request, 'admin')
  return who && who.id === ADMIN_USER_ID
}

async function adminUsers(env) {
  const rows = await env.DB.prepare(
    `SELECT id, email, username, created_at, signup_country, signup_city, device_id, device_name, device_bound_at,
            activated_until, banned_until, last_login_at FROM users ORDER BY created_at DESC`,
  ).all()
  return json({ users: (rows.results || []).map(publicUser) })
}

async function adminSetField(env, id, sql, ...args) {
  const r = await env.DB.prepare(sql).bind(...args, id).run()
  if (!r.meta || r.meta.changes === 0) return bad('no such user', 404)
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
  return json({ user: publicUser(user) })
}

async function adminAction(env, request, id, action, body) {
  const ms = Number(body.duration_ms) || 0
  switch (action) {
    case 'activate':
      return adminSetField(env, id, 'UPDATE users SET activated_until = ? WHERE id = ?', now() + ms)
    case 'extend': {
      const u = await env.DB.prepare('SELECT activated_until FROM users WHERE id = ?').bind(id).first()
      const base = u && u.activated_until && u.activated_until > now() ? u.activated_until : now()
      return adminSetField(env, id, 'UPDATE users SET activated_until = ? WHERE id = ?', base + ms)
    }
    case 'ban':
      return adminSetField(env, id, 'UPDATE users SET banned_until = ? WHERE id = ?', body.forever ? FOREVER : now() + ms)
    case 'unban':
      return adminSetField(env, id, 'UPDATE users SET banned_until = NULL WHERE id = ?')
    case 'unbind':
      return adminSetField(env, id, 'UPDATE users SET device_id = NULL, device_name = NULL, device_bound_at = NULL WHERE id = ?')
    case 'message': {
      const text = String(body.body || '').slice(0, 4000)
      if (!text) return bad('write a message')
      await env.DB.prepare('INSERT INTO support_messages (id, user_id, sender, body, created_at, read_by_admin) VALUES (?,?,?,?,?,1)')
        .bind(uuid(), id, 'admin', text, now()).run()
      return json({ ok: true })
    }
    default:
      return bad('unknown action', 404)
  }
}

async function adminDelete(env, id) {
  // sessions carry no FK, so drop the account's tokens explicitly; support_messages cascade with the user.
  await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id).run()
  await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
  return json({ ok: true })
}

async function adminSupportThread(env, id) {
  const rows = await env.DB.prepare('SELECT id, sender, body, image_key, created_at FROM support_messages WHERE user_id = ? ORDER BY created_at').bind(id).all()
  await env.DB.prepare("UPDATE support_messages SET read_by_admin = 1 WHERE user_id = ? AND sender = 'user'").bind(id).run()
  return json({ messages: rows.results || [] })
}

async function adminSupportSend(env, id, body) {
  const text = String(body.body || '').slice(0, 4000)
  let imageKey = null
  if (body.image) imageKey = await storeImage(env, id, body.image)
  if (!text && !imageKey) return bad('write a message')
  const mid = uuid()
  await env.DB.prepare('INSERT INTO support_messages (id, user_id, sender, body, image_key, created_at, read_by_admin) VALUES (?,?,?,?,?,1)')
    .bind(mid, id, 'admin', text, imageKey, now()).run()
  return json({ id: mid, imageKey })
}

// ---- entry ---------------------------------------------------------------------------------
async function api(request, env, url) {
  const path = url.pathname
  const method = request.method
  let body = {}
  if (method === 'POST') { try { body = await request.json() } catch { body = {} } }

  // public
  if (path === '/api/signup' && method === 'POST') return signup(env, request, body)
  if (path === '/api/login' && method === 'POST') return login(env, request, body)
  if (path === '/api/app/login' && method === 'POST') return appLogin(env, request, body)
  if (path === '/api/app/status' && method === 'GET') return appStatus(env, request)

  // signed-in user
  if (path === '/api/me' && method === 'GET') {
    const user = await sessionUser(env, request)
    if (!user || user.id === ADMIN_USER_ID) return bad('not signed in', 401)
    const unread = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM support_messages WHERE user_id = ? AND sender = 'admin' AND read_by_user = 0",
    ).bind(user.id).first()
    return json({ user: publicUser(user), ...accessState(user), unreadSupport: (unread && unread.n) || 0 })
  }
  if (path === '/api/logout' && method === 'POST') {
    const t = bearer(request)
    if (t) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(t).run()
    return json({ ok: true })
  }
  if (path === '/api/download' && method === 'GET') return download(env, request)
  if (path === '/api/support' && method === 'GET') return supportList(env, request)
  if (path === '/api/support' && method === 'POST') return supportSend(env, request, body)
  const img = path.match(/^\/api\/support\/image\/(.+)$/)
  if (img && method === 'GET') return supportImage(env, request, decodeURIComponent(img[1]))

  // admin
  if (path === '/api/admin/login' && method === 'POST') return adminLogin(env, body)
  if (path.startsWith('/api/admin/')) {
    if (!(await requireAdmin(env, request))) return bad('admin only', 403)
    if (path === '/api/admin/users' && method === 'GET') return adminUsers(env)
    const act = path.match(/^\/api\/admin\/users\/([^/]+)\/([a-z]+)$/)
    if (act && method === 'POST') return adminAction(env, request, act[1], act[2], body)
    const del = path.match(/^\/api\/admin\/users\/([^/]+)$/)
    if (del && method === 'DELETE') return adminDelete(env, del[1])
    const thread = path.match(/^\/api\/admin\/users\/([^/]+)\/support$/)
    if (thread && method === 'GET') return adminSupportThread(env, thread[1])
    if (thread && method === 'POST') return adminSupportSend(env, thread[1], body)
  }
  return bad('not found', 404)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      const cors = corsHeaders(request)
      if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
      let res
      try {
        res = await api(request, env, url)
      } catch (err) {
        res = json({ error: 'server error', detail: String(err && err.message || err).slice(0, 200) }, 500)
      }
      const headers = new Headers(res.headers)
      for (const [k, v] of Object.entries(cors)) headers.set(k, v)
      return new Response(res.body, { status: res.status, headers })
    }
    // everything else: the built site (ASSETS handles the SPA fallback)
    return env.ASSETS.fetch(request)
  },
}
