import React, { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n.js'
import { api } from '../api.js'

// Compress a picked image to a small JPEG data URL before it ever leaves the browser.
function compress(file, max = 1280, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      resolve(c.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// A two-way thread. `mine` says which sender is "me" ('user' in the profile, 'admin' in the panel).
export default function SupportChat({ mine, load, send }) {
  const { t } = useI18n()
  const [messages, setMessages] = useState(null)
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)

  const refresh = async () => { try { setMessages((await load()).messages || []) } catch { setMessages([]) } }
  useEffect(() => { refresh(); const id = setInterval(refresh, 8000); return () => clearInterval(id) }, [load])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const pick = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    try { setImage(await compress(file)) } catch { /* ignore */ }
    e.target.value = ''
  }
  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim() && !image) return
    setBusy(true)
    try { await send(text.trim(), image); setText(''); setImage(null); await refresh() } finally { setBusy(false) }
  }

  return (
    <div className="chat">
      <div className="chat-log">
        {messages === null && <div className="center" style={{ padding: 30 }}><span className="spin" /></div>}
        {messages && messages.length === 0 && <div className="center muted" style={{ padding: 30 }}>{t('support_empty')}</div>}
        {(messages || []).map((m) => (
          <div key={m.id} className={`bubble ${m.sender === mine ? 'me' : 'them'}`}>
            {m.body && <div className="bubble-text">{m.body}</div>}
            {m.image_key && <img className="bubble-img" src={api.imageUrl(m.image_key)} alt="" loading="lazy" />}
            <time>{new Date(m.created_at).toLocaleString()}</time>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="chat-input" onSubmit={submit}>
        {image && <div className="chat-preview"><img src={image} alt="" /><button type="button" onClick={() => setImage(null)}>✕</button></div>}
        <label className="chat-attach" title={t('support_image')}>
          <input type="file" accept="image/*" onChange={pick} hidden /><svg viewBox="0 0 24 24" className="ic" aria-hidden="true"><path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7-7l8-8a3.3 3.3 0 0 1 4.700 4.700l-8 8a1.700 1.700 0 0 1-2.400-2.400l7.300-7.300" /></svg>
        </label>
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('support_ph')} />
        <button className="btn btn--primary btn--sm" type="submit" disabled={busy}>{busy ? '…' : t('support_send')}</button>
      </form>
    </div>
  )
}
