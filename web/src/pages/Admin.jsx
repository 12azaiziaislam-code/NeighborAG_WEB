import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useI18n, LANGS } from '../i18n.js'
import { Link } from '../App.jsx'
import { api, getAdminToken, setAdminToken } from '../api.js'
import SupportChat from '../components/SupportChat.jsx'

const HOUR = 3600000
const UNIT_MS = { h: HOUR, d: 24 * HOUR, mo: 30 * 24 * HOUR, y: 365 * 24 * HOUR }
const PRESETS = [[7, 'd'], [30, 'd'], [3, 'mo'], [1, 'y']]
const fmt = (ts) => (ts ? new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—')
const fmtDay = (ts) => (ts ? new Date(ts).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—')
const FOREVER_AFTER = Date.now() + 50 * UNIT_MS.y

function accessOf(u) {
  if (u.bannedUntil && u.bannedUntil > Date.now()) return 'ban'
  if (u.activatedUntil && u.activatedUntil > Date.now()) return 'ok'
  if (u.activatedUntil) return 'off'
  return 'warn'
}
const durMs = (v) => Math.max(0, Number(v.n) || 0) * UNIT_MS[v.unit]

function Svg({ d }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="ic"><path d={d} /></svg>
}
const I = {
  users: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.3M15.5 4.2a3 3 0 0 1 0 5.6',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  back: 'M19 12H5M11 6l-6 6 6 6',
  chevron: 'M9 6l6 6-6 6',
  out: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5zM12 15v2',
}

// One amount + one unit, with the common choices a click away. Replaces five cramped number boxes.
function Duration({ value, onChange }) {
  const { t } = useI18n()
  const unitLabel = { h: t('admin_u_h'), d: t('admin_u_d'), mo: t('admin_u_mo'), y: t('admin_u_y') }
  const short = { h: t('admin_hours'), d: t('admin_days'), mo: t('admin_months'), y: t('admin_years') }
  return (
    <div className="dur">
      <div className="dur-presets">
        {PRESETS.map(([n, unit]) => (
          <button type="button" key={n + unit} className={`chip ${Number(value.n) === n && value.unit === unit ? 'on' : ''}`} onClick={() => onChange({ n, unit })}>{n} {short[unit]}</button>
        ))}
      </div>
      <div className="dur-custom">
        <input className="input" type="number" min="1" inputMode="numeric" value={value.n} aria-label={t('admin_duration')}
          onChange={(e) => onChange({ ...value, n: e.target.value })} />
        <select className="input" value={value.unit} onChange={(e) => onChange({ ...value, unit: e.target.value })} aria-label={t('admin_duration')}>
          {Object.keys(UNIT_MS).map((k) => <option key={k} value={k}>{unitLabel[k]}</option>)}
        </select>
      </div>
    </div>
  )
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
      <div className="auth-card fade-in">
        <div className="admin-key"><Svg d={I.lock} /></div>
        <h1>{t('admin_login_t')}</h1>
        <form onSubmit={submit}>
          <div className="field"><label>{t('auth_email')}</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" /></div>
          <div className="field"><label>{t('auth_password')}</label><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="off" /></div>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn btn--primary" style={{ width: '100%' }} disabled={busy}>{busy ? <span className="spin" /> : t('auth_login_btn')}</button>
        </form>
        <div className="center auth-switch"><Link to="/">{t('back')}</Link></div>
      </div>
    </div>
  )
}

function Avatar({ name, size = '' }) {
  return <span className={`ava ${size}`}>{(name || '?')[0].toUpperCase()}</span>
}

function StatusBadge({ user }) {
  const { t } = useI18n()
  const s = accessOf(user)
  const label = { ok: t('admin_active'), ban: t('admin_banned'), off: t('admin_expired'), warn: t('admin_never') }[s]
  return <span className={`badge badge--${s}`}>{label}</span>
}

// The full page for one account: what it is on the left, the support thread on the right.
function Detail({ user, onBack, act, del }) {
  const { t } = useI18n()
  const [access, setAccess] = useState({ n: 30, unit: 'd' })
  const [ban, setBan] = useState({ n: 7, unit: 'd' })
  const st = accessOf(user)
  const loadThread = useCallback(() => api.adminSupport(user.id), [user.id])
  const sendThread = useCallback((body, image) => api.adminSendSupport(user.id, body, image), [user.id])
  const accessMs = durMs(access)
  const banMs = durMs(ban)
  const activeNow = user.activatedUntil && user.activatedUntil > Date.now()
  const bannedForever = user.bannedUntil && user.bannedUntil > FOREVER_AFTER

  return (
    <div className="adetail fade-in">
      <button className="aback" onClick={onBack}><Svg d={I.back} />{t('admin_users')}</button>

      <header className="ad-head">
        <Avatar name={user.username} size="ava--lg" />
        <div className="ad-id">
          <h1>{user.username}</h1>
          <span>{user.email}</span>
        </div>
        <StatusBadge user={user} />
      </header>

      <div className="ad-grid">
        <div className="ad-col">
          <section className="acard">
            <dl className="facts">
              <div><dt>{t('admin_country')}</dt><dd>{[user.city, user.country].filter(Boolean).join(', ') || '—'}</dd></div>
              <div><dt>{t('admin_joined')}</dt><dd>{fmtDay(user.createdAt)}</dd></div>
              <div><dt>{t('profile_active_until')}</dt><dd>{fmt(user.activatedUntil)}</dd></div>
              <div><dt>{t('admin_device')}</dt><dd>{user.deviceName || t('profile_none')}</dd></div>
            </dl>
          </section>

          <section className="acard">
            <h2>{t('admin_access_t')}</h2>
            <Duration value={access} onChange={setAccess} />
            <p className="hint">
              {accessMs > 0 && <>{t('admin_activate')}: <b>{fmt(Date.now() + accessMs)}</b>{activeNow && <> · {t('admin_extend')}: <b>{fmt(user.activatedUntil + accessMs)}</b></>}</>}
            </p>
            <div className="acard-actions">
              <button className="btn btn--primary" disabled={accessMs <= 0} onClick={() => act(user.id, 'activate', { duration_ms: accessMs })}>{t('admin_activate')}</button>
              <button className="btn" disabled={accessMs <= 0 || !activeNow} onClick={() => act(user.id, 'extend', { duration_ms: accessMs })}>{t('admin_extend')}</button>
            </div>
          </section>

          <section className="acard">
            <h2>{t('admin_ban_t')}</h2>
            {st === 'ban' ? (
              <div className="acard-line">
                <span>{bannedForever ? t('admin_forever') : fmt(user.bannedUntil)}</span>
                <button className="btn" onClick={() => act(user.id, 'unban')}>{t('admin_unban')}</button>
              </div>
            ) : (
              <>
                <Duration value={ban} onChange={setBan} />
                <div className="acard-actions">
                  <button className="btn btn--danger" disabled={banMs <= 0} onClick={() => act(user.id, 'ban', { duration_ms: banMs })}>{t('admin_ban')}</button>
                  <button className="btn btn--danger" onClick={() => act(user.id, 'ban', { forever: true })}>{t('admin_forever')}</button>
                </div>
              </>
            )}
          </section>

          <section className="acard">
            <h2>{t('admin_device')}</h2>
            <div className="acard-line">
              <span>{user.deviceName || t('profile_none')}</span>
              <button className="btn" disabled={!user.deviceBound && !user.deviceName} onClick={() => act(user.id, 'unbind')}>{t('admin_unbind')}</button>
            </div>
          </section>

          <section className="acard acard--danger">
            <h2>{t('admin_danger_t')}</h2>
            <div className="acard-line">
              <span>{t('admin_confirm_delete')}</span>
              <button className="btn btn--danger" onClick={() => del(user.id)}>{t('admin_delete')}</button>
            </div>
          </section>
        </div>

        <section className="acard acard--chat">
          <h2>{t('admin_support')}</h2>
          <SupportChat key={user.id} mine="admin" load={loadThread} send={sendThread} />
        </section>
      </div>
    </div>
  )
}

export default function Admin() {
  const { t, lang, setLang } = useI18n()
  const [authed, setAuthed] = useState(!!getAdminToken())
  const [users, setUsers] = useState(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')

  const flash = useCallback((msg) => { setToast(msg); window.clearTimeout(flash._t); flash._t = window.setTimeout(() => setToast(''), 2400) }, [])

  const load = useCallback(async () => {
    try { setUsers((await api.adminUsers()).users || []) }
    catch (e) { if (e.status === 403 || e.status === 401) { setAdminToken(''); setAuthed(false) } }
  }, [])
  useEffect(() => { if (authed) load() }, [authed, load])

  const act = async (id, action, extra) => {
    try { await api.adminAction(id, action, extra); await load(); flash(t('admin_saved')) }
    catch (e) { flash(e.data?.error || t('common_error')) }
  }
  const del = async (id) => {
    if (!window.confirm(t('admin_confirm_delete'))) return
    try { await api.adminDelete(id); setSelected(null); await load(); flash(t('admin_deleted')) }
    catch (e) { flash(e.data?.error || t('common_error')) }
  }

  // "Pending" is everyone who can't use the program yet and isn't banned: never activated, or expired.
  const bucket = (u) => { const s = accessOf(u); return s === 'off' ? 'warn' : s }
  const stats = useMemo(() => {
    const c = { all: (users || []).length, ok: 0, warn: 0, ban: 0 }
    for (const u of users || []) c[bucket(u)]++
    return c
  }, [users])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return (users || []).filter((u) => (filter === 'all' || bucket(u) === filter)
      && (!s || u.email.toLowerCase().includes(s) || u.username.toLowerCase().includes(s)))
  }, [users, q, filter])

  const sel = users?.find((u) => u.id === selected) || null
  if (!authed) return <AdminLogin onDone={() => setAuthed(true)} />

  const TABS = [['all', t('admin_all')], ['ok', t('admin_active')], ['warn', t('admin_s_pending')], ['ban', t('admin_banned')]]

  return (
    <div className="admin">
      <aside className="aside">
        <Link to="/" className="aside-brand"><b>NeighborAGI</b><span>{t('admin_t')}</span></Link>
        <nav className="aside-nav">
          <button className="aside-item on" onClick={() => setSelected(null)}><Svg d={I.users} />{t('admin_users')}<em>{stats.all}</em></button>
        </nav>
        <div className="aside-foot">
          <div className="langs">
            {LANGS.map(([code, label]) => <button key={code} className={`lang ${code === lang ? 'on' : ''}`} onClick={() => setLang(code)} title={label}>{code.toUpperCase()}</button>)}
          </div>
          <button className="aside-item" onClick={() => { setAdminToken(''); setAuthed(false) }}><Svg d={I.out} />{t('nav_logout')}</button>
        </div>
      </aside>

      <main className="amain">
        {sel ? <Detail user={sel} onBack={() => setSelected(null)} act={act} del={del} /> : (
          <>
            <header className="atop">
              <h1>{t('admin_users')}</h1>
              <label className="asearch"><Svg d={I.search} /><input placeholder={t('admin_search')} value={q} onChange={(e) => setQ(e.target.value)} /></label>
            </header>

            <div className="atabs" role="tablist">
              {TABS.map(([k, label]) => (
                <button key={k} role="tab" aria-selected={filter === k} className={`atab atab--${k} ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>
                  <span>{label}</span><b>{stats[k]}</b>
                </button>
              ))}
            </div>

            <div className="apanel">
              {users === null ? <div className="aempty"><span className="spin" /></div> : filtered.length === 0 ? (
                <div className="aempty"><Svg d={I.users} /><span>{t('admin_empty')}</span></div>
              ) : (
                <table className="atable">
                  <thead><tr><th>{t('admin_username')}</th><th>{t('admin_status')}</th><th className="c-until">{t('profile_active_until')}</th><th className="c-loc">{t('admin_country')}</th><th className="c-dev">{t('admin_device')}</th><th className="c-join">{t('admin_joined')}</th><th /></tr></thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} tabIndex={0} onClick={() => setSelected(u.id)} onKeyDown={(e) => { if (e.key === 'Enter') setSelected(u.id) }}>
                        <td>
                          <div className="u-cell">
                            <Avatar name={u.username} />
                            <div><div className="u-name">{u.username}</div><div className="u-mail">{u.email}</div></div>
                          </div>
                        </td>
                        <td><StatusBadge user={u} /></td>
                        <td className="dim c-until">{fmtDay(u.activatedUntil)}</td>
                        <td className="dim c-loc">{[u.city, u.country].filter(Boolean).join(', ') || '—'}</td>
                        <td className="dim c-dev">{u.deviceName || '—'}</td>
                        <td className="dim c-join">{fmtDay(u.createdAt)}</td>
                        <td className="u-go"><Svg d={I.chevron} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>

      {toast && <div className="admin-toast" role="status">{toast}</div>}
    </div>
  )
}
