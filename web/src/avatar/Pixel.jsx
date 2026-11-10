import React from 'react'

import './nabi.css'
import { PET_ART, accessoryPart, propPart } from './props.jsx'
import { paintVars } from './nabiPrefs.js'
import { SamuraiDefs, Hachimaki, SamuraiTorso, ArmSamuraiRight } from './Samurai.jsx'

// "Nabi", the neighbour who runs your computer. A detailed little machine: a porcelain shell with gold
// trim, a dark glass visor with light-capsule eyes and brows that carry the mood, ear modules with gold
// rings, a chest core, an antenna with a gold collar. It reacts to the person: the eyes follow the
// pointer, the head turns and the body leans after them, it looks at the box while the person types
// (`attentive`) and answers a hover (nabi.css).
//
// Serious Mode (`serious`) dresses it for work, not for play: a graphite shell, a dark suit with lapels,
// a white shirt, a purple tie with a gold clip, a pocket square, cufflinks and thin gold-rimmed glasses.
// Both outfits are drawn here and nabi.css shows one of them.
// Props: `state`, `scale` (size), `look` (a 3x3 pupil position, 1,1 = centre), `serious`, `attentive`.
const EYE_COLOR = {
  idle: '#74c6ff', thinking: '#ffd48a', working: '#7fe3bd', typing: '#74c6ff', waiting: '#ffb86b', done: '#7fe3bd',
  error: '#ff7383', stopped: '#ffb86b', sleeping: '#8a93e6', wave: '#74c6ff', curious: '#74c6ff', stretch: '#7fe3bd',
  annoyed: '#ffd48a', angry: '#ff7383', furious: '#ff7383', smash: '#ff7383',
  dance: '#7fe3bd', peek: '#74c6ff', yawn: '#8a93e6', shy: '#ffb3c6', love: '#ffb3c6',
  // Serious Mode: a calm violet.
  focus: '#c4b5fd', 'think-deep': '#c4b5fd', nod: '#a7f3d0',
}
// The lamps (antenna, ear lights): gold at rest, the state's colour when something is happening.
const LIGHT = {
  idle: '#f5c66b', thinking: '#ffd48a', working: '#7fe3bd', typing: '#74c6ff', waiting: '#ffb86b', done: '#7fe3bd',
  error: '#ff7383', stopped: '#ffb86b', sleeping: '#6b72c9', wave: '#f5c66b', curious: '#f5c66b', stretch: '#7fe3bd',
  annoyed: '#ffd48a', angry: '#ff7383', furious: '#ff7383', smash: '#ff7383',
  dance: '#7fe3bd', peek: '#f5c66b', yawn: '#6b72c9', shy: '#ffb3c6', love: '#ff8fab',
  focus: '#a78bfa', 'think-deep': '#8b5cf6', nod: '#a7f3d0',
}
const FACE = {
  idle: 'open', thinking: 'look-up', working: 'look-down', typing: 'open', waiting: 'wide', done: 'happy', error: 'x',
  stopped: 'open', sleeping: 'closed', wave: 'happy', curious: 'wide', stretch: 'happy', annoyed: 'scowl', angry: 'scowl',
  furious: 'wide', smash: 'x', dance: 'happy', peek: 'open', yawn: 'closed', shy: 'happy', love: 'happy',
  focus: 'narrow', 'think-deep': 'narrow-up', nod: 'happy',
}
const MOUTH = {
  idle: 'smile', thinking: 'none', working: 'none', typing: 'talk', waiting: 'flat', done: 'smile', error: 'frown',
  stopped: 'flat', sleeping: 'none', wave: 'smile', curious: 'o', stretch: 'smile', annoyed: 'flat', angry: 'frown',
  furious: 'o', smash: 'o', dance: 'smile', peek: 'none', yawn: 'o', shy: 'smile', love: 'smile',
  focus: 'none', 'think-deep': 'none', nod: 'none',
}
// Props that sit on the head like a hat: they cover what it wears there (a telescope or a phone does not).
const HATS = new Set(['nightcap', 'hardhat', 'party', 'chef', 'headphones', 'bandage'])
// The states where the character may stop and listen to the person typing.
const CAN_LISTEN = new Set(['idle', 'sleeping', 'curious', 'peek', 'yawn', 'stretch', 'wave', 'done', 'focus', 'nod'])

function Eye({ x, kind, flip }) {
  const c = 'var(--eye)'
  if (kind === 'happy') return <path className="eye-arc" d={`M${x - 6.5} 61 Q${x} 52.5 ${x + 6.5} 61`} fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round" />
  if (kind === 'closed') return <path className="eye-arc" d={`M${x - 6} 59 Q${x} 62.5 ${x + 6} 59`} fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round" opacity="0.7" />
  if (kind === 'x') {
    return (
      <g stroke={c} strokeWidth="3" strokeLinecap="round">
        <path d={`M${x - 4.5} 53.5 L${x + 4.5} 62.5`} /><path d={`M${x + 4.5} 53.5 L${x - 4.5} 62.5`} />
      </g>
    )
  }
  const h = kind === 'wide' ? 16 : kind === 'scowl' ? 9 : kind === 'narrow' ? 6 : 13
  const w = kind === 'narrow' ? 12 : 9
  return (
    <g className="eye">
      <rect className="eye-glow" x={x - w / 2 - 4} y={58 - h / 2 - 4} width={w + 8} height={h + 8} rx={(w + 8) / 2} fill={c} opacity="0.16" />
      <rect x={x - w / 2} y={58 - h / 2} width={w} height={h} rx={Math.min(w, h) / 2} fill={c} />
      {kind !== 'narrow' && <rect className="pupil" x={x - w * 0.22} y={58 - h * 0.18} width={w * 0.44} height={h * 0.5} rx={w * 0.22} fill="#000" opacity="0.2" />}
      {kind !== 'narrow' && <circle cx={x - w / 4} cy={58 - h / 4} r="1.3" fill="#fff" opacity="0.85" />}
      {kind !== 'narrow' && <circle cx={x + w / 5} cy={58 + h / 5} r="0.7" fill="#fff" opacity="0.5" />}
      <rect className="lid" x={x - w / 2 - 1.5} y={58 - h / 2 - 1.5} width={w + 3} height={h / 2 + 1.5} rx="1.5" fill="var(--glass-top)" />
      {kind === 'scowl' && <path d={`M${x - 7} ${flip ? 49 : 52} L${x + 7} ${flip ? 52 : 49}`} stroke={c} strokeWidth="2.4" strokeLinecap="round" />}
    </g>
  )
}

function Mouth({ kind }) {
  const c = 'var(--eye)'
  if (kind === 'none') return null
  if (kind === 'smile') return <path d="M54 71.5 Q60 75.5 66 71.5" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
  if (kind === 'frown') return <path d="M54 74.5 Q60 70.5 66 74.5" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
  if (kind === 'o') return <ellipse cx="60" cy="73" rx="2.8" ry="3.2" fill="none" stroke={c} strokeWidth="2" opacity="0.85" />
  if (kind === 'talk') return <rect className="talk" x="55" y="71.5" width="10" height="3" rx="1.5" fill={c} opacity="0.85" />
  return <path d="M55.5 73 H64.5" stroke={c} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
}

function Arm({ side, prop, samurai }) {
  const x = side === 'l' ? 24 : 88
  const cx = x + 4
  return (
    <g className={`arm arm-${side}`}>
      <rect x={x} y="92" width="8" height="20" rx="4" fill="url(#nabi-case)" />
      <rect x={x + 1.5} y="96" width="5" height="1.2" rx="0.6" fill="#000" opacity="0.12" />
      <g className={`ph ph-${side}`}><g transform={`translate(${cx} 113.5) scale(1.35)`}>{prop}</g></g>
      {samurai && side === "r" && <ArmSamuraiRight cx={cx} cy={113.5} />}
      <circle className="hand" cx={cx} cy={113.5} r="4.8" fill="url(#nabi-case)" />
      <circle cx={cx} cy={113.5} r="4.8" fill="url(#nabi-shade)" />
      {samurai && (
        <g className="sg-tekko">
          <circle cx={cx} cy={113.5} r="3.2" fill="url(#lacq)" stroke="url(#gold)" strokeWidth="0.6" />
          <circle cx={cx} cy={113.5} r="1.1" fill="url(#gold)" />
        </g>
      )}
      {/* casual: a gold band at the wrist */}
      {!samurai && <rect className="wear-casual" x={x - 0.4} y="105.6" width="8.8" height="2.4" rx="1.2" fill="url(#nabi-trim)" />}
      {/* suit: a sleeve, the shirt cuff and a gold cufflink */}
      <g className="wear-suit">
        <rect x={x - 1.2} y="90.5" width="10.4" height="17" rx="4.6" fill="url(#nabi-suit)" />
        <rect x={x - 0.6} y="106.4" width="9.2" height="2.6" rx="1.1" fill="var(--shirt)" />
        <circle cx={cx} cy={107.7} r="0.95" fill="url(#nabi-trim)" />
        {side === 'l' && <g className="watch"><rect x={x - 0.8} y="109.6" width="9.6" height="2.4" rx="1" fill="#2a2140" /><circle cx={cx} cy={110.8} r="2.2" fill="url(#nabi-trim)" /><circle cx={cx} cy={110.8} r="1.3" fill="#f8f4ff" /></g>}
      </g>
    </g>
  )
}

export default function Pixel({ state = 'idle', scale = 5, look = [1, 1], serious = false, attentive = false, act = null, paint = null, accessory = 'none', pet = 'none', samurai = false }) {
  const prop = act && act.prop
  // a hat from a role covers what it wears on its head; the suit replaces its everyday clothes
  const headBusy = HATS.has(prop)
  const wear = serious ? null : accessory
  const paintStyle = serious ? null : paintVars(paint)
  const actClass = act ? `act act-${act.id} ${act.pose ? `pose-${act.pose}` : ''} ${act.motion ? `motion-${act.motion}` : ''} ${act.move ? `move-${act.move}` : ''} ${prop ? `has-${prop}` : ''}` : ''
  const actStyle = act && act.ms ? { '--act-ms': `${act.ms}ms` } : null
  const s = EYE_COLOR[state] ? state : 'idle'
  const listening = attentive && CAN_LISTEN.has(s)
  const face = listening ? (serious ? 'narrow' : 'open') : FACE[s]
  const [lx, ly] = look || [1, 1]
  const gaze = listening
    ? [(lx - 1) * 1.5, 3]  // down, toward the box the person is typing in
    : face === 'look-up' || face === 'narrow-up' ? [0, -2.6] : face === 'look-down' ? [0, 2.6] : [(lx - 1) * 3, (ly - 1) * 2]
  const kind = face === 'look-up' || face === 'look-down' ? 'open' : face === 'narrow-up' ? 'narrow' : face
  const size = scale * 20
  const eyeColor = samurai ? '#7fe3bd' : EYE_COLOR[s]; const lightColor = samurai ? '#ffd48a' : (listening && !serious ? '#74c6ff' : LIGHT[s]); const style = { '--eye': eyeColor, '--light': lightColor, width: size, height: size * 1.17 }
  // The head turns after the eyes and the body leans a little after the head.
  const headTurn = { transform: `translate(${gaze[0] * 0.7}px, ${gaze[1] * 0.45}px) rotate(${gaze[0] * 0.9}deg)` }
  const lean = { transform: `translateX(${gaze[0] * 0.25}px)` }
  return (
    <svg
      className={`nabi nabi--${s} ${serious ? 'nabi--dressed' : ''} ${listening ? 'nabi--attend' : ''} ${actClass} ${headBusy ? 'head-busy' : ''} ${wear && wear !== 'none' ? `wears-${wear}` : ''}`}
      viewBox="0 0 120 140" style={{ ...style, ...(actStyle || {}), ...(paintStyle || {}) }} role="img" aria-label="NeighborAGI"
    >
      <defs>
        <linearGradient id="nabi-case" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--case-top)' }} /><stop offset="1" style={{ stopColor: 'var(--case-bottom)' }} />
        </linearGradient>
        <linearGradient id="nabi-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="nabi-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--glass-top)' }} /><stop offset="1" style={{ stopColor: 'var(--glass-bottom)' }} />
        </linearGradient>
        <linearGradient id="nabi-trim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe3a3" /><stop offset="0.5" stopColor="#e2ad4f" /><stop offset="1" stopColor="#a8761f" />
        </linearGradient>
        <linearGradient id="nabi-suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--suit)' }} /><stop offset="1" style={{ stopColor: 'var(--suit-dark)' }} />
        </linearGradient>
        <radialGradient id="nabi-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--light)" stopOpacity="0.85" /><stop offset="1" stopColor="var(--light)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nabi-flame" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="var(--eye)" stopOpacity="0.95" /><stop offset="0.6" stopColor="var(--eye)" stopOpacity="0.25" /><stop offset="1" stopColor="var(--eye)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="nabi-torso"><rect x="35" y="87" width="50" height="34" rx="15" /></clipPath>
        <clipPath id="nabi-tie"><path d="M58.5 92.2 L61.5 92.2 L63.3 106.5 L60 110.5 L56.7 106.5 Z" /></clipPath>
        {samurai && <SamuraiDefs />}
      </defs>

      <ellipse className="nabi-shadow" cx="60" cy="134" rx="25" ry="3.6" fill="#000" opacity="0.34" />

      <g className="nabi-move">
      {/* its friend: flies beside it, loops over its head now and then (not with the suit on) */}
      {!serious && PET_ART[pet] ? <g className={`pet-fly pet-${pet}`}><g transform="translate(108 50) scale(1.8)">{PET_ART[pet]}</g></g> : null}
      <g className="nabi-float">
        {/* a small hover thruster under the body: it is how the character floats */}
        <g className="thruster">
          <ellipse cx="60" cy="123" rx="9" ry="2.2" fill="var(--joint)" />
          <path className="flame" d="M54.5 123.5 Q60 133 65.5 123.5 Z" fill="url(#nabi-flame)" />
        </g>
        <g className="nabi-lean" style={lean}>
          <g className="nabi-body">
            <g className="acc acc-back">{accessoryPart(wear, 'back')}</g>
            {/* the shoulder yoke and the jetpack behind the body */}
            <rect x="37" y="81" width="46" height="12" rx="6" fill="var(--joint)" />
            <rect x="31" y="92" width="7" height="20" rx="3.5" fill="var(--joint)" /><rect x="82" y="92" width="7" height="20" rx="3.5" fill="var(--joint)" />
            <rect x="31.8" y="94" width="5.4" height="2" rx="1" fill="url(#nabi-trim)" /><rect x="82.8" y="94" width="5.4" height="2" rx="1" fill="url(#nabi-trim)" />
            <rect x="53" y="83" width="14" height="8" rx="3" fill="var(--joint)" />
            <rect x="35" y="87" width="50" height="34" rx="15" fill="url(#nabi-case)" />

            {/* the companion's chest: a glass panel in a gold frame, a core light, two meters, a gold belt */}
            <g className="wear-casual" clipPath="url(#nabi-torso)">
              <rect x="46" y="94" width="28" height="17" rx="6" fill="url(#nabi-glass)" stroke="url(#nabi-trim)" strokeWidth="1.3" />
              <circle className="core-ring" cx="60" cy="102.5" r="6" fill="none" stroke="var(--eye)" strokeWidth="1" opacity="0.4" />
              <circle className="core" cx="60" cy="102.5" r="3.6" fill="var(--eye)" />
              <circle cx="58.9" cy="101.4" r="1" fill="#fff" opacity="0.8" />
              <rect className="meter m1" x="49.5" y="98" width="2.6" height="9" rx="1.3" fill="var(--light)" opacity="0.7" />
              <rect className="meter m2" x="67.9" y="98" width="2.6" height="9" rx="1.3" fill="var(--light)" opacity="0.7" />
              <rect x="35" y="114.5" width="50" height="3.2" fill="url(#nabi-trim)" />
              <rect x="56" y="113.4" width="8" height="5.4" rx="1.4" fill="url(#nabi-trim)" stroke="#7a5414" strokeWidth="0.6" />
              <circle cx="40.5" cy="96" r="1" fill="url(#nabi-trim)" /><circle cx="79.5" cy="96" r="1" fill="url(#nabi-trim)" />
            </g>

            {/* the serious suit: jacket, shirt, lapels, purple tie with a gold clip, pocket square, buttons */}
            <g className="wear-suit" clipPath="url(#nabi-torso)">
              <rect x="35" y="87" width="50" height="34" rx="15" fill="url(#nabi-suit)" />
              <path d="M49 86 L60 105 L71 86 Z" fill="var(--shirt)" />
              <path d="M49.5 86.5 L57.2 86.5 L56.4 92 Z" fill="var(--shirt)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
              <path d="M70.5 86.5 L62.8 86.5 L63.6 92 Z" fill="var(--shirt)" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
              <path d="M57.3 88.4 L62.7 88.4 L61.6 92.4 L58.4 92.4 Z" fill="var(--tie-dark)" />
              <path className="tie" d="M58.5 92.2 L61.5 92.2 L63.3 106.5 L60 110.5 L56.7 106.5 Z" fill="var(--tie)" />
              <g clipPath="url(#nabi-tie)" stroke="url(#nabi-trim)" strokeWidth="0.9" opacity="0.85">
                <path d="M56 96 L64 92" /><path d="M56 101 L64 97" /><path d="M56 106 L64 102" />
              </g>
              <rect x="56.4" y="99.6" width="7.2" height="1.4" rx="0.7" fill="url(#nabi-trim)" />
              <path d="M47.5 86.5 L58.6 105.5 L53.2 107.8 L42.5 92.5 Z" fill="var(--lapel)" stroke="#fff" strokeOpacity="0.28" strokeWidth="0.8" />
              <path d="M72.5 86.5 L61.4 105.5 L66.8 107.8 L77.5 92.5 Z" fill="var(--lapel)" stroke="#fff" strokeOpacity="0.28" strokeWidth="0.8" />
              <path d="M46 89.5 L56.2 106 M74 89.5 L63.8 106" stroke="#fff" strokeOpacity="0.22" strokeWidth="0.5" strokeDasharray="1.2 1.2" />
              <circle cx="47" cy="96.5" r="1.3" fill="var(--tie)" stroke="url(#nabi-trim)" strokeWidth="0.5" />
              <path d="M68 100.4 H76" stroke="#fff" strokeOpacity="0.14" strokeWidth="0.8" />
              <path d="M69.2 100.4 L70.6 97.4 L72 99 L73.4 97.2 L74.8 100.4 Z" fill="url(#nabi-trim)" />
              <path d="M60 108 V121" stroke="#000" strokeOpacity="0.35" strokeWidth="0.8" />
              <circle cx="61.8" cy="113" r="1.2" fill="url(#nabi-trim)" /><circle cx="61.8" cy="118.2" r="1.2" fill="url(#nabi-trim)" />
              <rect x="35.5" y="87.5" width="49" height="33" rx="14.5" fill="none" stroke="#fff" strokeOpacity="0.16" />
            </g>

            <rect x="35" y="87" width="50" height="34" rx="15" fill="url(#nabi-shade)" />
            <path className="rim" d="M44 91.5 Q60 88.5 76 91.5" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M38 104 H41 M79 104 H82" stroke="#000" strokeOpacity="0.14" strokeWidth="1" strokeLinecap="round" />
            <g className="acc acc-neck">{accessoryPart(wear, 'neck')}</g>
            <g className="prop-front">{propPart(prop, 'front')}</g>
            {samurai && <SamuraiTorso />}
            <Arm side="l" prop={propPart(prop, 'l')} samurai={samurai} />
            <Arm side="r" prop={propPart(prop, 'r')} samurai={samurai} />
            <circle cx="28" cy="93.5" r="2.4" fill="url(#nabi-trim)" /><circle cx="92" cy="93.5" r="2.4" fill="url(#nabi-trim)" />
          </g>
        </g>

        <g className="head-look" style={headTurn}>
          <g className="nabi-head">
            <g className="antenna">
              <path d="M60 26 V15" stroke="var(--joint)" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="55.5" y="23.4" width="9" height="3.4" rx="1.7" fill="url(#nabi-trim)" />
              <circle className="bulb-glow" cx="60" cy="12" r="9" fill="url(#nabi-glow)" />
              <circle className="bulb" cx="60" cy="12" r="3.6" fill="var(--light)" />
              <circle cx="58.8" cy="10.8" r="1.1" fill="#fff" opacity="0.8" />
            </g>
            {/* ear modules: a gold ring and a status light on each side */}
            {[13.5, 106.5].map((cx) => (
              <g key={cx} className="ear">
                <rect x={cx - 5} y="47" width="10" height="22" rx="5" fill="var(--joint)" />
                <circle cx={cx} cy="58" r="4.3" fill="url(#nabi-case)" stroke="url(#nabi-trim)" strokeWidth="1.4" />
                <circle className="ear-led" cx={cx} cy="58" r="1.6" fill="var(--light)" />
              </g>
            ))}
            {/* shell */}
            <rect x="15" y="26" width="90" height="64" rx="28" fill="url(#nabi-case)" />
            <rect x="15" y="26" width="90" height="64" rx="28" fill="url(#nabi-shade)" />
            <path className="rim" d="M34 30.5 Q60 26.5 86 30.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 31.6 H51 M69 31.6 H76" stroke="#000" strokeOpacity="0.16" strokeWidth="1.3" strokeLinecap="round" />
            <rect x="55" y="28.4" width="10" height="2.2" rx="1.1" fill="url(#nabi-trim)" />
            <circle cx="21.5" cy="74" r="1.3" fill="url(#nabi-trim)" /><circle cx="98.5" cy="74" r="1.3" fill="url(#nabi-trim)" />
            {/* visor, with its seam and a reflection */}
            <rect x="21.2" y="33.2" width="77.6" height="49.6" rx="22.8" fill="none" stroke="#000" strokeOpacity="0.14" />
            <rect x="23" y="35" width="74" height="46" rx="21" fill="url(#nabi-glass)" />
            <rect x="23.5" y="35.5" width="73" height="45" rx="20.5" fill="none" stroke="#fff" strokeOpacity="0.08" />
            <path d="M33 43 Q40 38.5 52 38" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M86 74 Q90 70 91 64" fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="2" strokeLinecap="round" />
            {/* the visor's HUD: corner ticks and a scan line that reads while it thinks */}
            <g className="hud" stroke="var(--eye)" strokeWidth="1" strokeLinecap="round" fill="none">
              <path d="M30 44 v-3 h3" /><path d="M90 44 v-3 h-3" /><path d="M30 72 v3 h3" /><path d="M90 72 v3 h-3" />
            </g>
            <rect className="scan" x="28" y="40" width="64" height="1.4" rx="0.7" fill="var(--eye)" />
            <g className="face" style={{ transform: `translate(${gaze[0]}px, ${gaze[1]}px)` }}>
              <g className="brows">
                <path className="brow brow-l" d="M39.5 47 Q46 44.6 52.5 47" />
                <path className="brow brow-r" d="M67.5 47 Q74 44.6 80.5 47" />
              </g>
              <g className="eyes">
                <Eye x={46} kind={kind} />
                <Eye x={74} kind={kind} flip />
              </g>
            </g>
            {/* serious: thin gold-rimmed glasses */}
            <g className="specs">
              <rect x="34.5" y="49.5" width="23" height="17" rx="5.5" />
              <rect x="62.5" y="49.5" width="23" height="17" rx="5.5" />
              <path d="M57.5 56 Q60 53.8 62.5 56" />
              <path d="M34.5 54.5 L24 52.5" /><path d="M85.5 54.5 L96 52.5" />
              <path className="lens-glint" d="M38.5 63 L44.5 52.5" /><path className="lens-glint g2" d="M66.5 63 L72.5 52.5" />
            </g>
            {/* serious: a slim headset with a gold microphone, the interpreter's kit */}
            <g className="headset">
              <path d="M103 64 Q101 78 86 77.5" fill="none" stroke="var(--joint)" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="85.5" cy="77.5" r="1.9" fill="url(#nabi-trim)" />
            </g>
            <g className="blush"><ellipse cx="33" cy="69" rx="4.5" ry="2.4" /><ellipse cx="87" cy="69" rx="4.5" ry="2.4" /></g>
            <g className="mouth"><Mouth kind={listening ? 'none' : MOUTH[s]} /></g>
            <g className="acc acc-head">{accessoryPart(wear, 'head')}</g>
            <g className="prop-head">{propPart(prop, 'head')}</g>
            {samurai && <Hachimaki />}
          </g>
        </g>

        <g className="fx">
          <g className="prop-fx">{propPart(prop, 'fx')}</g>
          <g className="orbit"><circle cx="69" cy="12" r="1.5" /><circle cx="55.5" cy="19.8" r="1.2" /><circle cx="55.5" cy="4.2" r="1" /></g>
          <g className="writing"><rect className="w1" x="88" y="9" width="18" height="2.4" rx="1.2" /><rect className="w2" x="88" y="14" width="24" height="2.4" rx="1.2" /><rect className="w3" x="88" y="19" width="12" height="2.4" rx="1.2" /></g>
          <g className="listen-waves"><path d="M112 52 q3.5 6 0 12" /><path d="M115.5 48.5 q5.5 9.5 0 19" /></g>
          <g className="think-dots"><circle cx="88" cy="14" r="2.4" /><circle cx="97" cy="11" r="2.4" /><circle cx="106" cy="8" r="2.4" /></g>
          <g className="zzz"><text x="96" y="28" fontSize="12" fontWeight="700">z</text><text x="105" y="17" fontSize="9" fontWeight="700">z</text></g>
          <g className="sparks">
            <path d="M12 32 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" /><path d="M105 40 l1.3 3.2 3.2 1.3 -3.2 1.3 -1.3 3.2 -1.3 -3.2 -3.2 -1.3 3.2 -1.3z" />
          </g>
          <g className="hearts"><path d="M96 30 c-3 -5 -10 -1 -6 5 l6 6 6 -6 c4 -6 -3 -10 -6 -5z" /><path className="h2" d="M18 40 c-2 -3.5 -7 -0.7 -4 3.5 l4 4 4 -4 c3 -4.2 -2 -7 -4 -3.5z" /></g>
          <g className="alert"><rect x="106" y="8" width="4.4" height="12" rx="2.2" /><circle cx="108.2" cy="25" r="2.6" /></g>
          <g className="steam"><path d="M8 24 q4 -6 0 -12" /><path d="M112 24 q-4 -6 0 -12" /></g>
          <g className="keys"><rect x="28" y="126" width="64" height="7" rx="3.5" fill="var(--joint)" stroke="url(#nabi-trim)" strokeWidth="0.6" /><rect className="k1" x="34" y="128" width="9" height="3" rx="1.5" /><rect className="k2" x="47" y="128" width="9" height="3" rx="1.5" /><rect className="k3" x="60" y="128" width="9" height="3" rx="1.5" /><rect className="k4" x="73" y="128" width="9" height="3" rx="1.5" /></g>
        </g>
      </g>
      </g>
    </svg>
  )
}
