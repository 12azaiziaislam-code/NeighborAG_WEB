// The one place the site talks to the Worker. Tokens live in localStorage; the user token and the admin token
// are kept apart so an admin session never leaks into the public pages.
const USER_KEY = 'nagi_token'
const ADMIN_KEY = 'nagi_admin_token'

export const getToken = () => { try { return localStorage.getItem(USER_KEY) || '' } catch { return '' } }
export const setToken = (t) => { try { t ? localStorage.setItem(USER_KEY, t) : localStorage.removeItem(USER_KEY) } catch { /* ignore */ } }
export const getAdminToken = () => { try { return localStorage.getItem(ADMIN_KEY) || '' } catch { return '' } }
export const setAdminToken = (t) => { try { t ? localStorage.setItem(ADMIN_KEY, t) : localStorage.removeItem(ADMIN_KEY) } catch { /* ignore */ } }

async function req(path, { method = 'GET', body, admin = false } = {}) {
  const token = admin ? getAdminToken() : getToken()
  const res = await fetch('/api' + path, {
    method,
    headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  let data = {}
  try { data = await res.json() } catch { /* empty body */ }
  if (!res.ok) throw Object.assign(new Error(data.error || 'error'), { status: res.status, data })
  return data
}

export const api = {
  // public / user
  signup: (email, username, password) => req('/signup', { method: 'POST', body: { email, username, password } }),
  login: (who, password) => req('/login', { method: 'POST', body: { email: who, password } }),
  me: () => req('/me'),
  logout: () => req('/logout', { method: 'POST' }),
  download: () => req('/download'),
  support: () => req('/support'),
  sendSupport: (body, image) => req('/support', { method: 'POST', body: { body, image } }),
  imageUrl: (key) => '/api/support/image/' + encodeURIComponent(key),
  // admin
  adminLogin: (email, password) => req('/admin/login', { method: 'POST', body: { email, password } }),
  adminUsers: () => req('/admin/users', { admin: true }),
  adminAction: (id, action, extra = {}) => req(`/admin/users/${id}/${action}`, { method: 'POST', admin: true, body: extra }),
  adminDelete: (id) => req(`/admin/users/${id}`, { method: 'DELETE', admin: true }),
  adminSupport: (id) => req(`/admin/users/${id}/support`, { admin: true }),
  adminSendSupport: (id, body, image) => req(`/admin/users/${id}/support`, { method: 'POST', admin: true, body: { body, image } }),
}
