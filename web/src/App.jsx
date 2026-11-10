import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { I18nProvider, useI18n, LANGS } from './i18n.js'
import { api, getToken, setToken } from './api.js'
import Pixel from './avatar/Pixel.jsx'
import Home from './pages/Home.jsx'
import Download from './pages/Download.jsx'
import Auth from './pages/Auth.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import './app.css'

// ---- a tiny history router (no dependency) -------------------------------------------------
const RouterContext = createContext(null)
export const useRouter = () => useContext(RouterContext)
export function Link({ to, children, ...rest }) {
  const { navigate } = useRouter()
  return <a href={to} onClick={(e) => { if (e.metaKey || e.ctrlKey || e.button) return; e.preventDefault(); navigate(to) }} {...rest}>{children}</a>
}

// ---- auth context --------------------------------------------------------------------------
const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function Shell() {
  const [path, setPath] = useState(() => window.location.pathname)
  const navigate = useCallback((to) => {
    // Links may carry an in-page anchor, e.g. "/#features". Separate the route
    // from the hash so "/#features" lands on "/" and then scrolls — never 404s.
    const hashAt = to.indexOf('#')
    const route = (hashAt === -1 ? to : to.slice(0, hashAt)) || '/'
    const hash = hashAt === -1 ? '' : to.slice(hashAt + 1)
    if (route !== window.location.pathname) { window.history.pushState({}, '', route + (hash ? '#' + hash : '')); setPath(route) }
    if (hash) { requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }
    else window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Gentle reveal-on-scroll: sections ease in as they enter the viewport (and instantly, if the viewer
  // prefers reduced motion). Re-scanned on every route change, once the new page has mounted.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    if (!els.length) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((el) => el.classList.add('in')); return undefined }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [path])

  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const refresh = useCallback(async () => {
    if (!getToken()) { setUser(null); setReady(true); return }
    try { const r = await api.me(); setUser(r.user) } catch { setToken(''); setUser(null) }
    setReady(true)
  }, [])
  useEffect(() => { refresh() }, [refresh])
  const signOut = useCallback(async () => { try { await api.logout() } catch { /* ignore */ } setToken(''); setUser(null); navigate('/') }, [navigate])

  const router = useMemo(() => ({ path, navigate }), [path, navigate])
  const auth = useMemo(() => ({ user, setUser, ready, refresh, signOut }), [user, ready, refresh, signOut])

  let page
  if (path === '/' ) page = <Home />
  else if (path === '/download') page = <Download />
  else if (path === '/login') page = <Auth mode="login" />
  else if (path === '/signup') page = <Auth mode="signup" />
  else if (path === '/profile') page = <Profile />
  else if (path.startsWith('/admin')) page = <Admin />
  else page = <NotFound />

  const hideChrome = path.startsWith('/admin')
  return (
    <RouterContext.Provider value={router}>
      <AuthContext.Provider value={auth}>
        {!hideChrome && <Nav />}
        <main>{page}</main>
        {!hideChrome && <Footer />}
      </AuthContext.Provider>
    </RouterContext.Provider>
  )
}

function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark"><Pixel state="idle" scale={1.7} look={[1, 1]} /></span>
      <b>NeighborAGI</b>
    </Link>
  )
}

function LangPicker() {
  const { lang, setLang } = useI18n()
  return (
    <div className="langs">
      {LANGS.map(([code, label]) => (
        <button key={code} className={`lang ${code === lang ? 'on' : ''}`} onClick={() => setLang(code)} title={label} aria-label={label}>{code.toUpperCase()}</button>
      ))}
    </div>
  )
}

function Nav() {
  const { t } = useI18n()
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-row">
        <Brand />
        <button className="nav-toggle" aria-label="menu" onClick={() => setOpen((v) => !v)}>☰</button>
        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <Link to="/#features">{t('nav_features')}</Link>
          <Link to="/download">{t('nav_download')}</Link>
          <LangPicker />
          {user
            ? <><Link to="/profile" className="btn btn--sm btn--ghost">{t('nav_profile')}</Link><button className="btn btn--sm" onClick={signOut}>{t('nav_logout')}</button></>
            : <><Link to="/login" className="btn btn--sm btn--ghost">{t('nav_login')}</Link><Link to="/download" className="btn btn--sm btn--primary">{t('nav_download')}</Link></>}
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  const { t } = useI18n()
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>{t('hero_sub')}</p>
        </div>
        <nav className="footer-col">
          <h4>{t('nav_features')}</h4>
          <Link to="/#features">{t('nav_features')}</Link>
          <Link to="/download">{t('nav_download')}</Link>
        </nav>
        <nav className="footer-col">
          <h4>{t('nav_profile')}</h4>
          <Link to="/login">{t('nav_login')}</Link>
          <Link to="/signup">{t('auth_signup_btn')}</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span className="muted">© 2026 NeighborAGI. All rights reserved.</span>
        <Link to="/admin" className="muted footer-admin" aria-label="admin">·</Link>
      </div>
    </footer>
  )
}

function NotFound() {
  return <div className="wrap center" style={{ padding: '120px 0' }}><h1>404</h1><Link to="/" className="btn btn--primary">NeighborAGI</Link></div>
}

export default function App() {
  return <I18nProvider><Shell /></I18nProvider>
}
