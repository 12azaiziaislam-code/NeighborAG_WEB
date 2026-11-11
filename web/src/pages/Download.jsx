import React, { useEffect, useState } from 'react'
import { useI18n } from '../i18n.js'
import { Link, useAuth, useRouter } from '../App.jsx'
import { api } from '../api.js'
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
          <li>{t('trust_win')}</li>
        </ul>
      </div>
    </aside>
  )
}

export default function Download() {
  const { t } = useI18n()
  const { user, ready } = useAuth()
  const { navigate } = useRouter()
  const [started, setStarted] = useState(false)

  // Downloading requires an account; if signed in, fetch the gated URL and begin.
  useEffect(() => {
    if (!ready || !user || started) return
    let alive = true
    api.download().then((r) => {
      if (!alive || !r.url) return
      setStarted(true)
      const a = document.createElement('a')
      a.href = r.url; a.download = ''; document.body.appendChild(a); a.click(); a.remove()
    }).catch(() => {})
    return () => { alive = false }
  }, [ready, user, started])

  return (
    <div className="authsplit">
      <AsidePanel pose={user ? 'done' : 'curious'} />
      <main className="auth-main">
        {ready && !user ? (
          <div className="auth-card fade-in center">
            <h1>{t('download_title')}</h1>
            <p className="auth-lede muted">{t('download_need_login')}</p>
            <div className="row" style={{ justifyContent: 'center', marginTop: 10 }}>
              <Link to="/signup?next=download" className="btn btn--primary btn--lg">{t('auth_signup_btn')}</Link>
              <Link to="/login?next=download" className="btn btn--ghost btn--lg">{t('auth_login_btn')}</Link>
            </div>
          </div>
        ) : (
          <div className="auth-card fade-in center">
            <h1>{t('download_start')}</h1>
            <p className="auth-lede muted">{t('download_need_login').split('.')[0]}.</p>
            <button className="btn btn--primary btn--lg" onClick={() => api.download().then((r) => r.url && window.location.assign(r.url))}>{t('download_now')}</button>
            <div className="dl-steps">
              <div className="dl-steps-h">{t('download_steps_t')}</div>
              <ol className="dl-list">
                <li>{t('download_s1')}</li><li>{t('download_s2')}</li><li>{t('download_s3')}</li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
