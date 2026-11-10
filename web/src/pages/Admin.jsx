import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n.js'
import { Link } from '../App.jsx'
import { api, getAdminToken, setAdminToken } from '../api.js'
import SupportChat from '../components/SupportChat.jsx'

const DAY = 86400000
const fmt = (ts) => (ts ? new Date(ts).toLocaleString() : '—')
const fmtDate = (ts) => (ts ? new Date(ts).toLocaleDateString() : '—')

function accessOf(u) {
  if (u.bannedUntil && u.bannedUntil > Date.now()) return 'ban'
  if (u.activatedUntil && u.activatedUntil > Date.now()) return 'ok'
  if (u.activatedUntil) return 'off'
  return 'warn'
}
const toMs = (v) => ((v.y * 365 + v.mo * 30 + v.d) * DAY) + (v.h * 3600000) + (v.m * 60000)

function DurationFields({ value, onChange }) {
  const { t } = useI18n()
  const u = (k, label) => (
    <label className="dur2-u"><input className="input" type="number" min="0" value={value[k]}
      onChange={(e) => onChange({ ...value, [k]: Math.max(0, Number(e.target.value) || 0) })} /><span>{label}</span></label>
  )
  return <div className="dur2">{u('y', t('admin_years'))}{u('mo', t('admin_months'))}{u('d', t('admin_days'))}{u('h', t('admin_hours'))}{u('m', t('admin_minutes'))}</div>
}

function AdminLogin({ onDone }) {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('')
    try { const r = await api.adminLogin(email, password); setAdminToken(r.token); onDone() }
    catch (err) { setError(err.data?.error || t('common_error')) } finally { setBusy(false) }
  }
  return (
    <div className="authpage">
      <div className="auth-card glass fade-in">
        <div className="admin-key">⚿</div>
        <h1>{t('admin_login_t')}</h1>
        <form onSubmit={submit}>
          <div className="field"><label>{t('auth_email')}</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" /></div>
          <div className="field"><label>{t('auth_password')}</label><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="off" /></div>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn btn--primary" style={{ width: '100%' }} disabled={busy}>{busy ? <span className="spin" /> : t('auth_login_btn')}</button>
        </form>
        <div className="center" style={{ marginTop: 14 }}><Link to="/" className="muted">{t('back')}</Link></div>
      </div>
    </div>
  )
}

function Drawer({ user, onClose, act, del, t }) {
  const [access, setAccess] = useState({ y: 0, mo: 0, d: 30, h: 0, m: 0 })
  const [ban, setBan] = useState({ y: 0, mo: 0, d: 7, h: 0, m: 0 })
  const st = accessOf(user)
  const label = { ok: t('admin_active'), ban: t('admin_banned'), off: t('admin_expired'), warn: t('admin_never') }[st]
  const loadThread = useCallback(() => api.adminSupport(user.id), [user.id])
  const sendThread = useCallback((body, image) => api.adminSendSupport(user.id, body, image), [user.id])

  return (
    <>
      <div className="adrawer-ov" onClick={onClose} />
      <aside className="adrawer">
        <button className="adr-close" onClick={onClose} aria-label="close">✕</button>
        <div className="adr-head">
          <span className="adr-ava" style={{ background: tint(user.username) }}>{(user.username || '?')[0].toUpperCase()}</span>
          <div className="adr-id">
            <b>{user.username}</b>
            <span className="muted">{user.email}</span>
          </div>
        </div>
        <div className={`badge badge--${st} adr-status`}>{label}</div>

        <div className="adr-kv"><span>{t('admin_country')}</span><b>{[user.city, user.country].filter(Boolean).join(', ') || '—'}</b></div>
        <div className="adr-kv"><span>{t('profile_active_until')}</span><b>{fmt(user.activatedUntil)}</b></div>
        <div className="adr-kv"><span>{t('admin_device')}</span><b>{user.deviceName || '—'}</b></div>

        {/* Access */}
        <section className="adr-sect">
          <h4>{t('admin_access_t')}</h4>
          <DurationFields value={access} onChange={setAccess} />
          <div className="adr-row">
            <button className="btn btn--sm btn--primary" disabled={toMs(access) <= 0} onClick={() => act(user.id, 'activate', { duration_ms: toMs(access) })}>{t('admin_activate')}</button>
            <button className="btn btn--sm" disabled={toMs(access) <= 0} onClick={() => act(user.id, 'extend', { duration_ms: toMs(access) })}>{t('admin_extend')}</button>
          </div>
        </section>

        {/* Ban */}
        <section className="adr-sect">
          <h4>{t('admin_ban_t')}</h4>
          {st === 'ban' ? (
            <button className="btn btn--sm" onClick={() => act(user.id, 'unban')}>{t('admin_unban')}</button>
          ) : (
            <>
              <DurationFields value={ban} onChange={setBan} />
              <div className="adr-row">
                <button className="btn btn--sm btn--danger" disabled={toMs(ban) <= 0} onClick={() => act(user.id, 'ban', { duration_ms: toMs(ban) })}>{t('admin_ban')}</button>
                <button className="btn btn--sm btn--danger" onClick={() => act(user.id, 'ban', { forever: true })}>{t('admin_forever')}</button>
              </div>
            </>
          )}
        </section>

        {/* Device */}
        <section className="adr-sect">
          <h4>{t('admin_device')}</h4>
          <div className="adr-device">
            <span className="muted">{user.deviceName || t('profile_none')}</span>
            <button className="btn btn--sm" disabled={!user.deviceName} onClick={() => act(user.id, 'unbind')}>{t('admin_unbind')}</button>
          </div>
        </section>

        {/* Support */}
        <section className="adr-sect">
          <h4>{t('admin_support')}</h4>
          <div className="adr-chat"><SupportChat key={user.id} mine="admin" load={loadThread} send={sendThread} /></div>
        </section>

        {/* Danger */}
        <section className="adr-sect danger-zone">
          <h4>{t('admin_danger_t')}</h4>
          <button className="btn btn--sm btn--danger" onClick={() => del(user.id)}>{t('admin_delete')}</button>
        </section>
      </aside>
    </>
  )
}

// a stable soft colour from a name, for the avatar chip
function tint(s = '') {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
  return `linear-gradient(135deg, hsl(${h} 60% 42%), hsl(${(h + 40) % 360} 60% 34%))`
}

export default function Admin() {
  const { t } = useI18n()
  const [authed, setAuthed] = useState(!!getAdminToken())
  const [users, setUsers] = useState(null)
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')

  const flash = useCallback((msg) => { setToast(msg); window.clearTimeout(flash._t); flash._t = window.setTimeout(() => setToast(''), 2400) }, [])

  const load = useCallback(async () => {
    try { setUsers((await api.adminUsers()).users || []) }
    catch (e) { if (e.status === 403 || e.status === 401) { setAdminToken(''); setAuthed(false) } }
  }, [])
  useEffect(() => { if (authed) load() }, [authed, load])

  const act = async (id, action, extra) => { try { await api.adminAction(id, action, extra); await load(); flash(t('admin_saved')) } catch { /* ignore */ } }
  const del = async (id) => { if (confirm(t('admin_confirm_delete'))) { await api.adminDelete(id); setSelected(null); await load(); flash(t('admin_deleted')) } }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return (users || []).filter((u) => !s || u.email.toLowerCase().includes(s) || u.username.toLowerCase().includes(s))
  }, [users, q])

  const stats = useMemo(() => {
    const list = users || []
    const c = { total: list.length, ok: 0, ban: 0, warn: 0 }
    for (const u of list) { const s = accessOf(u); if (s === 'ok') c.ok++; else if (s === 'ban') c.ban++; else c.warn++ }
    return c
  }, [users])

  const sel = users?.find((u) => u.id === selected) || null
  if (!authed) return <AdminLogin onDone={() => setAuthed(true)} />

  return (
    <div className="admin2">
      <aside className="asider">
        <Link to="/" className="asider-brand"><b>NeighborAGI</b><span>Admin</span></Link>
        <nav className="anav">
          <span className="anav-item on">{t('admin_users')}</span>
        </nav>
        <div className="asider-foot">
          <button className="btn btn--sm btn--ghost" onClick={() => { setAdminToken(''); setAuthed(false) }}>{t('nav_logout')}</button>
        </div>
      </aside>

      <main className="amain">
        <header className="atop">
          <h1>{t('admin_users')}</h1>
          <input className="input asearch" placeholder={t('admin_search')} value={q} onChange={(e) => setQ(e.target.value)} />
        </header>

        <div className="stats">
          <div className="stat"><span className="stat-n">{stats.total}</span><span className="stat-l">{t('admin_s_total')}</span></div>
          <div className="stat"><span className="stat-n stat-ok">{stats.ok}</span><span className="stat-l">{t('admin_active')}</span></div>
          <div className="stat"><span className="stat-n stat-warn">{stats.warn}</span><span className="stat-l">{t('admin_s_pending')}</span></div>
          <div className="stat"><span className="stat-n stat-ban">{stats.ban}</span><span className="stat-l">{t('admin_banned')}</span></div>
        </div>

        <div className="apanel">
          {users === null ? <div className="center" style={{ padding: 60 }}><span className="spin" /></div> : (
            <table className="atable">
              <thead><tr><th>{t('admin_username')}</th><th>{t('admin_country')}</th><th>{t('admin_device')}</th><th>{t('admin_status')}</th><th></th></tr></thead>
              <tbody>
                {filtered.map((u) => {
                  const s = accessOf(u)
                  const label = { ok: t('admin_active'), ban: t('admin_banned'), off: t('admin_expired'), warn: t('admin_never') }[s]
                  return (
                    <tr key={u.id} className={selected === u.id ? 'sel' : ''} onClick={() => setSelected(u.id)}>
                      <td>
                        <div className="u-cell">
                          <span className="u-ava" style={{ background: tint(u.username) }}>{(u.username || '?')[0].toUpperCase()}</span>
                          <div><div className="u-name">{u.username}</div><div className="u-mail">{u.email}</div></div>
                        </div>
                      </td>
                      <td className="muted">{[u.city, u.country].filter(Boolean).join(', ') || '—'}</td>
                      <td>{u.deviceName ? <span className="u-dev">{u.deviceName}</span> : <span className="muted">—</span>}</td>
                      <td><span className={`badge badge--${s}`}>{label}</span></td>
                      <td className="u-manage"><button className="btn btn--sm" onClick={(e) => { e.stopPropagation(); setSelected(u.id) }}>{t('admin_manage')}</button></td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && <tr><td colSpan={5} className="center muted" style={{ padding: 40 }}>{t('admin_empty')}</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {sel && <Drawer user={sel} onClose={() => setSelected(null)} act={act} del={del} t={t} />}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  )
}
