import React, { useState } from 'react'
import { useI18n } from '../i18n.js'
import { Link, useAuth, useRouter } from '../App.jsx'
import { api, setToken } from '../api.js'
import Pixel from '../avatar/Pixel.jsx'

function AsidePanel({ pose }) {
  const { t } = useI18n()
  return (
    <aside className="auth-aside">
      <div className="auth-aside-in">
        <div className="auth-aside-fig"><Pixel state={pose} scale={4.4} look={[1, 1]} /></div>
        <h2>{t('hero_title')}</h2>
        <p>{t('download_need_login')}</p>
        <ul className="auth-points">
          <li>{t('trust_dev')}</li>
          <li>{t('trust_sign')}</li>
          <li>{t('trust_lang')}</li>
        </ul>
      </div>
    </aside>
  )
}

export default function Auth({ mode }) {
  const signup = mode === 'signup'
  const { t } = useI18n()
  const { setUser } = useAuth()
  const { navigate } = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [who, setWho] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      const r = signup ? await api.signup(email, username, password) : await api.login(who, password)
      setToken(r.token); setUser(r.user)
      const next = new URLSearchParams(window.location.search).get('next')
      navigate(next === 'download' ? '/download' : '/profile')
    } catch (err) {
      setError(err.data?.error || err.message || t('common_error'))
    } finally { setBusy(false) }
  }

  return (
    <div className="authsplit">
      <AsidePanel pose={signup ? 'curious' : 'wave'} />
      <main className="auth-main">
        <div className="auth-card fade-in">
          <h1>{signup ? t('auth_signup_t') : t('auth_login_t')}</h1>
          <p className="auth-lede muted">{signup ? t('download_need_login').split('.')[0] + '.' : t('auth_login_t')}</p>
          <form onSubmit={submit}>
            {signup ? (
              <>
                <div className="field"><label>{t('auth_email')}</label><input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="field"><label>{t('auth_username')}</label><input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
              </>
            ) : (
              <div className="field"><label>{t('auth_or_username')}</label><input className="input" value={who} onChange={(e) => setWho(e.target.value)} autoComplete="username" required /></div>
            )}
            <div className="field"><label>{t('auth_password')}</label><input className="input" type="password" autoComplete={signup ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            {error && <div className="auth-error">{error}</div>}
            <button className="btn btn--primary" type="submit" disabled={busy} style={{ width: '100%', marginTop: 6 }}>
              {busy ? <span className="spin" /> : (signup ? t('auth_signup_btn') : t('auth_login_btn'))}
            </button>
          </form>
          <div className="center muted auth-switch">
            {signup ? <Link to="/login">{t('auth_to_login')}</Link> : <Link to="/signup">{t('auth_to_signup')}</Link>}
          </div>
        </div>
      </main>
    </div>
  )
}
