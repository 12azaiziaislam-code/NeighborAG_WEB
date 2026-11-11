import React, { useEffect, useState, useCallback } from 'react'
import { useI18n, LANGS } from '../i18n.js'
import { Link, useAuth, useRouter } from '../App.jsx'
import { api } from '../api.js'
import Pixel from '../avatar/Pixel.jsx'
import SupportChat from '../components/SupportChat.jsx'

function fmt(ts) { return ts ? new Date(ts).toLocaleString() : '—' }
function accessBadge(user, t) {
  if (user.bannedUntil && user.bannedUntil > Date.now()) return <span className="badge badge--ban">{t('profile_banned')}</span>
  if (user.activatedUntil && user.activatedUntil > Date.now()) return <span className="badge badge--ok">{t('profile_active_until')} {fmt(user.activatedUntil)}</span>
  if (user.activatedUntil) return <span className="badge badge--off">{t('profile_expired')}</span>
  return <span className="badge badge--warn">{t('profile_not_active')}</span>
}

export default function Profile() {
  const { t, lang, setLang } = useI18n()
  const { user, ready, signOut, refresh } = useAuth()
  const { navigate } = useRouter()
  const [tab, setTab] = useState('account')
  const [unread, setUnread] = useState(0)

  useEffect(() => { if (ready && !user) navigate('/login') }, [ready, user, navigate])
  // Access is granted from the admin panel at any time: read it again on open, on return to the tab, and every 6 s
  // while the page is in view, so an activation shows up by itself within seconds.
  useEffect(() => {
    refresh()
    const again = () => { if (document.visibilityState === 'visible') refresh() }
    const id = window.setInterval(again, 6000)
    window.addEventListener('focus', again)
    document.addEventListener('visibilitychange', again)
    return () => { window.clearInterval(id); window.removeEventListener('focus', again); document.removeEventListener('visibilitychange', again) }
  }, [refresh])
  // The unread admin-message count rides alongside the user in /api/me (a sibling of `user`), so fetch it here.
  useEffect(() => { let on = true; api.me().then((r) => { if (on) setUnread(r.unreadSupport || 0) }).catch(() => {}); return () => { on = false } }, [])
  const loadSupport = useCallback(() => api.support(), [])
  const sendSupport = useCallback((body, image) => api.sendSupport(body, image), [])

  if (!user) return <div className="wrap center" style={{ padding: 120 }}><span className="spin" /></div>

  return (
    <div className="wrap profile fade-in">
      <aside className="profile-side glass">
        <div className="profile-id">
          <span className="profile-face"><Pixel state="idle" scale={2.6} look={[1, 1]} /></span>
          <div><b>{user.username}</b><div className="muted" style={{ fontSize: 13 }}>{user.email}</div></div>
        </div>
        <nav className="profile-tabs">
          {[['account', t('profile_account')], ['settings', t('profile_settings')], ['support', t('profile_support')]].map(([k, label]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); if (k === 'support') setUnread(0) }}>
              {label}
              {k === 'support' && unread > 0 && <span className="tab-badge">{unread}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <section className="profile-main">
        {tab === 'account' && (
          <div className="card">
            <h2>{t('profile_account')}</h2>
            <div className="kv"><span>{t('auth_email')}</span><b>{user.email}</b></div>
            <div className="kv"><span>{t('auth_username')}</span><b>{user.username}</b></div>
            <div className="kv"><span>{t('profile_device')}</span><b>{user.deviceName || t('profile_none')}</b></div>
            <div className="kv"><span>{t('profile_access')}</span><b>{accessBadge(user, t)}</b></div>
            {(!user.activatedUntil || user.activatedUntil < Date.now()) && !(user.bannedUntil > Date.now()) && (
              <p className="muted" style={{ marginTop: 14 }}>{user.activatedUntil ? t('profile_expired_hint') : t('profile_not_active')}</p>
            )}
          </div>
        )}
        {tab === 'settings' && (
          <div className="card">
            <h2>{t('profile_settings')}</h2>
            <div className="kv"><span>{t('profile_lang')}</span>
              <div className="row">{LANGS.map(([c, l]) => <button key={c} className={`btn btn--sm ${c === lang ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setLang(c)}>{l}</button>)}</div>
            </div>
            <div className="row" style={{ marginTop: 18 }}>
              <Link to="/login" className="btn btn--ghost">{t('profile_switch')}</Link>
              <button className="btn btn--danger" onClick={signOut}>{t('profile_signout')}</button>
            </div>
          </div>
        )}
        {tab === 'support' && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px 0' }}><h2>{t('support_t')}</h2></div>
            <SupportChat mine="user" load={loadSupport} send={sendSupport} />
          </div>
        )}
      </section>
    </div>
  )
}
