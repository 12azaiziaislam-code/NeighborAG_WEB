import React, { useState } from 'react'
import { useI18n } from '../i18n.js'
import { Link, useAuth } from '../App.jsx'
import Pixel from '../avatar/Pixel.jsx'

function Icon({ name }) {
  const p = {
    spark: 'M12 2l2.4 6.3L21 10.7l-5.1 4.2L17.6 22 12 18.1 6.4 22l1.7-7.1L3 10.7l6.6-2.4z',
    shield: 'M12 2l8 3.2v6.4c0 5-3.3 8.6-8 10.4-4.7-1.8-8-5.4-8-10.4V5.2z',
    sync: 'M20 10a8 8 0 0 0-14.9-3M4 14a8 8 0 0 0 14.9 3M4 3v4.5h4.5M20 21v-4.5h-4.5',
    sparkle: 'M12 3v5m0 8v5M3 12h5m8 0h5M6 6l3 3m6 6l3 3m0-12l-3 3M9 15l-3 3',
    focus: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M12 12h.01',
    lock: 'M6 10V8a6 6 0 0 1 12 0v2M5 10h14v10H5zM12 15v2',
    check: 'M20 6L9 17l-5-5',
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={p[name]} /></svg>
}

const FEATURES = [
  ['spark', 'f_beside_t', 'f_beside_d'], ['shield', 'f_private_t', 'f_private_d'],
  ['sync', 'f_current_t', 'f_current_d'], ['sparkle', 'f_character_t', 'f_character_d'],
  ['focus', 'f_focused_t', 'f_focused_d'], ['lock', 'f_secure_t', 'f_secure_d'],
]
const MODES = [
  ['idle', false, 'Companion', 'cap_companion'],
  ['thinking', true, 'Focused mode', 'cap_focused'],
  ['done', false, 'Control Center', 'cap_control'],
]
const TRUST = ['trust_dev', 'trust_sign', 'trust_win', 'trust_lang']
const HOW = [['how_1_t', 'how_1_d'], ['how_2_t', 'how_2_d'], ['how_3_t', 'how_3_d'], ['how_4_t', 'how_4_d']]
const FAQ = [['faq_1_q', 'faq_1_a'], ['faq_2_q', 'faq_2_a'], ['faq_3_q', 'faq_3_a'], ['faq_4_q', 'faq_4_a'], ['faq_5_q', 'faq_5_a']]

function Faq() {
  const { t } = useI18n()
  const [open, setOpen] = useState(0)
  return (
    <div className="faq">
      {FAQ.map(([q, a], i) => (
        <div className={`faq-item ${open === i ? 'open' : ''}`} key={q}>
          <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{t(q)}</span><span className="faq-ic">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <div className="faq-a">{t(a)}</div>}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { t } = useI18n()
  const { user } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy fade-in">
            <span className="eyebrow">{t('hero_badge')}</span>
            <h1>{t('hero_title')}</h1>
            <p className="lede">{t('hero_sub')}</p>
            <div className="hero-cta">
              <Link to="/download" className="btn btn--primary btn--lg">{t('hero_cta')}</Link>
              <Link to="/#features" className="btn btn--ghost btn--lg">{t('hero_see')}</Link>
            </div>
            <ul className="trust">
              {TRUST.map((k) => (
                <li key={k}><span className="trust-ic"><Icon name="check" /></span>{t(k)}</li>
              ))}
            </ul>
          </div>

          {/* A realistic desktop-app window — the product, not a floating mascot. */}
          <div className="hero-shot fade-in">
            <div className="appwin">
              <div className="appwin-bar">
                <i /><i /><i />
                <span className="appwin-title">NeighborAGI</span>
              </div>
              <div className="appwin-body">
                <aside className="appwin-rail">
                  <span className="rail-dot on" /><span className="rail-dot" /><span className="rail-dot" /><span className="rail-dot" />
                </aside>
                <div className="appwin-chat">
                  <div className="mock-msg user">{t('mock_user')}</div>
                  <div className="mock-msg bot">{t('mock_bot')}</div>
                  <div className="appwin-input"><span>{t('support_ph')}</span><b>↵</b></div>
                </div>
              </div>
            </div>
            <div className="appwin-pet"><Pixel state="idle" scale={3.3} look={[1, 1]} /></div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="features">
        <div className="sect-head center">
          <span className="eyebrow">{t('nav_features')}</span>
          <h2>{t('features_title')}</h2>
          <p>{t('features_sub')}</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(([icon, tt, td]) => (
            <article className="feature" key={tt}>
              <span className="feature-ic"><Icon name={icon} /></span>
              <h3>{t(tt)}</h3>
              <p>{t(td)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Focused mode — its own spotlight. */}
      <section className="section spotlight reveal">
        <div className="spot-grid">
          <div className="spot-copy">
            <span className="eyebrow eyebrow--v">{t('focus_eyebrow')}</span>
            <h2>{t('focus_title')}</h2>
            <p className="lede">{t('focus_sub')}</p>
            <ul className="spot-list">
              <li>{t('focus_1')}</li><li>{t('focus_2')}</li><li>{t('focus_3')}</li>
            </ul>
            <div className="kbd-row"><kbd>{t('focus_kbd')}</kbd></div>
          </div>
          <div className="spot-shot">
            <div className="focus-win">
              <div className="appwin-bar focus-bar"><i /><i /><i /><span className="appwin-title">{t('focus_eyebrow')}</span></div>
              <div className="focus-stage"><Pixel state="thinking" serious scale={4.6} look={[1, 1]} /></div>
            </div>
            <div className="focus-win focus-win--playful">
              <div className="appwin-bar"><i /><i /><i /><span className="appwin-title">Companion</span></div>
              <div className="focus-stage focus-stage--playful"><Pixel state="idle" scale={3.2} look={[1, 1]} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="sect-head center">
          <h2>{t('shots_title')}</h2>
          <p>{t('shots_sub')}</p>
        </div>
        <div className="modes">
          {MODES.map(([pose, serious, label, capKey]) => (
            <div className="mode" key={label}>
              <div className="appwin-bar"><i /><i /><i /><span className="appwin-title">{label}</span></div>
              <div className="mode-scene"><Pixel state={pose} serious={serious} scale={3.2} look={[1, 1]} /></div>
              <div className="mode-cap"><b>{label}</b><span>{t(capKey)}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section how-sec reveal">
        <div className="sect-head center">
          <h2>{t('how_title')}</h2>
          <p>{t('how_sub')}</p>
        </div>
        <div className="how-grid">
          {HOW.map(([tt, td], i) => (
            <div className="how-step" key={tt}>
              <span className="how-num">{i + 1}</span>
              <h3>{t(tt)}</h3>
              <p>{t(td)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section faq-sec reveal">
        <div className="sect-head center"><h2>{t('faq_title')}</h2></div>
        <Faq />
      </section>

      <section className="section reveal" style={{ paddingTop: 0 }}>
        <div className="cta-band">
          <h2>{t('download_title')}</h2>
          <p>{t('download_need_login')}</p>
          <Link to="/download" className="btn btn--primary btn--lg">{user ? t('download_now') : t('download_go')}</Link>
        </div>
      </section>
    </div>
  )
}
