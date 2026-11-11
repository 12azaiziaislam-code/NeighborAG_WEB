import React, { useState } from 'react'
import { useI18n } from '../i18n.js'
import { Link, useAuth } from '../App.jsx'
import Pixel from '../avatar/Pixel.jsx'

const PATHS = {
  screen: 'M3 5h18v11H3zM8 20h8M12 16v4',
  shield: 'M12 3l7 3v5.5c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V6zM9 12l2 2 4-4',
  sync: 'M20 11a8 8 0 0 0-14.6-3.5M4 13a8 8 0 0 0 14.6 3.5M4 4v4h4M20 20v-4h-4',
  smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14.5a4.5 4.5 0 0 0 7 0M9 10h.01M15 10h.01',
  focus: 'M4 9V5h4M16 5h4v4M20 15v4h-4M8 19H4v-4M12 12h.01',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5zM12 15v2',
  windows: 'M3 5.5l8-1.1v7.1H3zM12.5 4.2L21 3v8.5h-8.5zM3 13h8v7.1l-8-1.1zM12.5 13H21v8l-8.5-1.2z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  chat: 'M4 5h16v11H9l-5 4z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1',
}
export function Icon({ name, fill = false }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={fill ? 'ic ic--fill' : 'ic'}><path d={PATHS[name]} /></svg>
}

const FEATURES = [
  ['screen', 'f_beside_t', 'f_beside_d'], ['shield', 'f_private_t', 'f_private_d'],
  ['sync', 'f_current_t', 'f_current_d'], ['smile', 'f_character_t', 'f_character_d'],
  ['focus', 'f_focused_t', 'f_focused_d'], ['lock', 'f_secure_t', 'f_secure_d'],
]
const SPECS = [['spec_privacy', 'trust_dev'], ['spec_updates', 'trust_sign'], ['spec_platform', 'trust_win'], ['spec_lang', 'trust_lang']]
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
            <span>{t(q)}</span><span className="faq-ic"><Icon name="plus" /></span>
          </button>
          {open === i && <div className="faq-a">{t(a)}</div>}
        </div>
      ))}
    </div>
  )
}

// The product as it sits on a Windows desktop: the chat window, and the companion docked beside it.
function ProductShot() {
  const { t } = useI18n()
  return (
    <div className="stage fade-in" aria-hidden="true">
      <div className="desk">
        <div className="win">
          <div className="win-bar">
            <span className="win-title">NeighborAGI</span>
            <span className="win-ctl"><i className="c-min" /><i className="c-max" /><i className="c-x" /></span>
          </div>
          <div className="win-body">
            <aside className="win-rail">
              <span className="on"><Icon name="chat" /></span><span><Icon name="grid" /></span><span><Icon name="focus" /></span><span className="rail-end"><Icon name="cog" /></span>
            </aside>
            <div className="win-chat">
              <div className="m m--user">{t('mock_user')}</div>
              <div className="m m--bot">
                <p>{t('mock_bot')}</p>
                <div className="m-block">
                  <b>{t('mock_summary')}</b>
                  <i style={{ width: '92%' }} /><i style={{ width: '78%' }} /><i style={{ width: '64%' }} />
                </div>
                <div className="m-block">
                  <b>{t('mock_reply')}</b>
                  <i style={{ width: '86%' }} /><i style={{ width: '52%' }} />
                </div>
              </div>
              <div className="win-input"><span>{t('support_ph')}</span><kbd>Enter</kbd></div>
            </div>
          </div>
        </div>
        <div className="desk-pet">
          <Pixel state="idle" scale={3.4} look={[1, 1]} />
          <kbd>Ctrl + B</kbd>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { t } = useI18n()
  const { user } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="wrap">
          <Link to="/download" className="announce fade-in"><i />{t('hero_badge')}<Icon name="arrow" /></Link>
          <h1 className="fade-in">{t('hero_title')}</h1>
          <p className="lede fade-in">{t('hero_sub')}</p>
          <div className="hero-cta fade-in">
            <Link to="/download" className="btn btn--primary btn--lg"><Icon name="windows" fill />{t('hero_cta')}</Link>
            <Link to="/#features" className="btn btn--lg">{t('hero_see')}</Link>
          </div>
          <ProductShot />
        </div>
      </section>

      <section className="specs">
        <div className="wrap specs-row">
          {SPECS.map(([label, value]) => (
            <div className="spec" key={label}><span>{t(label)}</span><b>{t(value)}</b></div>
          ))}
        </div>
      </section>

      <section className="section reveal" id="features">
        <div className="wrap">
          <div className="sect-head">
            <span className="eyebrow">{t('nav_features')}</span>
            <h2>{t('features_title')}</h2>
            <p>{t('features_sub')}</p>
          </div>
          <div className="bento">
            {FEATURES.map(([icon, tt, td]) => (
              <article className="cell" key={tt}>
                <span className="cell-ic"><Icon name={icon} /></span>
                <h3>{t(tt)}</h3>
                <p>{t(td)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" id="focused">
        <div className="wrap split">
          <div className="split-copy">
            <span className="eyebrow">{t('focus_eyebrow')}</span>
            <h2>{t('focus_title')}</h2>
            <p className="split-sub">{t('focus_sub')}</p>
            <ul className="ticks">
              <li>{t('focus_1')}</li><li>{t('focus_2')}</li><li>{t('focus_3')}</li>
            </ul>
            <div className="kbd-row"><kbd>Ctrl</kbd><span>+</span><kbd>Space</kbd></div>
          </div>
          <div className="duo" aria-hidden="true">
            <div className="duo-half">
              <span className="duo-tag">{t('focus_a')}</span>
              <Pixel state="idle" scale={3.6} look={[1, 1]} />
              <span className="duo-cap">{t('cap_companion')}</span>
            </div>
            <div className="duo-half duo-half--on">
              <span className="duo-tag">{t('focus_eyebrow')}</span>
              <Pixel state="thinking" serious scale={3.6} look={[1, 1]} />
              <span className="duo-cap">{t('cap_focused')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="how">
        <div className="wrap">
          <div className="sect-head">
            <span className="eyebrow">{t('how_title')}</span>
            <h2>{t('how_sub')}</h2>
          </div>
          <ol className="steps">
            {HOW.map(([tt, td], i) => (
              <li className="step" key={tt}>
                <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t(tt)}</h3>
                <p>{t(td)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section reveal" id="faq">
        <div className="wrap faq-grid">
          <div className="sect-head"><span className="eyebrow">{t('nav_faq')}</span><h2>{t('faq_title')}</h2></div>
          <Faq />
        </div>
      </section>

      <section className="section section--cta reveal">
        <div className="wrap">
          <div className="cta">
            <h2>{t('cta_title')}</h2>
            <p>{t('download_need_login')}</p>
            <Link to="/download" className="btn btn--primary btn--lg"><Icon name="windows" fill />{user ? t('download_now') : t('hero_cta')}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
