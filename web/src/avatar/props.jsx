import React from 'react'

// The character's props, one small drawing each, in the slot it belongs to:
//   r, l   held in the right / left hand — drawn around (0, 0) = the centre of the hand, upright
//   front  in front of the body (a book, a laptop) — in the character's own coordinates (120 x 140)
//   head   worn or held at the head (a hat, headphones, binoculars)
//   fx     in the air around it (a lightbulb, notes, confetti)
// The acts that use them are in director.js; the poses that hold them and the motions are in nabi.css.

const GOLD = 'url(#nabi-trim)'
const INK = '#1d2944'
const WHITE = '#f6f7fb'
const LIT = 'var(--eye)'
const LAMP = 'var(--light)'

const mug = (fill) => (
  <g>
    <path d="M5 -10 q5 0 5 4 t-5 4" fill="none" stroke={fill} strokeWidth="2" />
    <rect x="-6" y="-15" width="12" height="14" rx="2.5" fill={fill} />
    <ellipse cx="0" cy="-15" rx="6" ry="1.6" fill="#5b3a1e" />
    <g className="prop-steam" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.1" strokeLinecap="round">
      <path d="M-2 -19 q-2 -3 0 -6 t0 -6" /><path d="M2.5 -19 q-2 -3 0 -6 t0 -6" />
    </g>
  </g>
)
const pencil = (
  <g transform="rotate(-30)">
    <rect x="-1.4" y="-16" width="2.8" height="13" rx="0.8" fill="#f5c66b" />
    <path d="M-1.4 -3 L0 1 L1.4 -3 Z" fill="#f3dcb0" /><rect x="-1.4" y="-17.6" width="2.8" height="2" fill="#ff8fab" />
  </g>
)
const stick = (len) => <rect x="-0.9" y={-len} width="1.8" height={len + 3} rx="0.9" fill="#8a6a3a" />

export const PROPS = {
  // -- rest: the companion -------------------------------------------------------------------------
  coffee: { r: mug('#ffffff') },
  book: {
    front: (
      <g className="prop-book">
        <path d="M44 96 Q52 93 60 96 L60 114 Q52 111 44 114 Z" fill="#3b6fd8" />
        <path d="M76 96 Q68 93 60 96 L60 114 Q68 111 76 114 Z" fill="#3060c4" />
        <path d="M46 97.5 Q52 95.4 58.6 97.6 L58.6 112 Q52 110 46 112 Z" fill={WHITE} />
        <path d="M74 97.5 Q68 95.4 61.4 97.6 L61.4 112 Q68 110 74 112 Z" fill={WHITE} />
        <g stroke="#9aa7c4" strokeWidth="0.7"><path d="M48 101 H56 M48 104 H56 M48 107 H54 M64 101 H72 M64 104 H72 M64 107 H70" /></g>
      </g>
    ),
  },
  headphones: {
    head: (
      <g>
        <path d="M14 56 Q14 18 60 18 Q106 18 106 56" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <rect x="6" y="48" width="12" height="20" rx="5" fill={LIT} /><rect x="102" y="48" width="12" height="20" rx="5" fill={LIT} />
        <rect x="8" y="51" width="8" height="14" rx="3" fill={INK} /><rect x="104" y="51" width="8" height="14" rx="3" fill={INK} />
      </g>
    ),
    fx: <g className="prop-notes" fill={LAMP}><text x="98" y="30" fontSize="11">♪</text><text x="10" y="36" fontSize="9">♫</text><text x="104" y="16" fontSize="8">♪</text></g>,
  },
  yoyo: {
    r: (
      <g>
        <path className="prop-string" d="M0 0 V14" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.6" />
        <g className="prop-yoyo"><circle cx="0" cy="17" r="4.2" fill="#ff6f81" /><circle cx="0" cy="17" r="1.4" fill={WHITE} /></g>
      </g>
    ),
  },
  balloon: {
    l: (
      <g className="prop-balloon">
        <path d="M0 0 Q-3 -14 1 -28" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.6" />
        <ellipse cx="1" cy="-36" rx="7" ry="8.5" fill="#ff6f81" /><path d="M-1 -27.5 L1 -29 L3 -27.5 Z" fill="#ff6f81" />
        <ellipse cx="-1.5" cy="-39" rx="1.8" ry="2.6" fill="#fff" opacity="0.45" />
      </g>
    ),
  },
  plane: {
    fx: <g className="prop-plane"><path d="M86 96 L106 90 L96 100 Z" fill={WHITE} /><path d="M96 100 L98 94 L106 90 Z" fill="#cfd6e6" /></g>,
  },
  binoculars: {
    head: (
      <g>
        <rect x="35" y="50" width="20" height="16" rx="6" fill={INK} /><rect x="65" y="50" width="20" height="16" rx="6" fill={INK} />
        <rect x="53" y="54" width="14" height="6" rx="2" fill={INK} />
        <circle cx="45" cy="58" r="5.5" fill={LIT} opacity="0.85" /><circle cx="75" cy="58" r="5.5" fill={LIT} opacity="0.85" />
        <circle cx="43.5" cy="56.5" r="1.6" fill="#fff" /><circle cx="73.5" cy="56.5" r="1.6" fill="#fff" />
      </g>
    ),
  },
  juggle: {
    fx: (
      <g className="prop-juggle">
        <circle className="j1" cx="40" cy="70" r="3.6" fill="#ff6f81" /><circle className="j2" cx="60" cy="70" r="3.6" fill="#74c6ff" /><circle className="j3" cx="80" cy="70" r="3.6" fill="#f5c66b" />
      </g>
    ),
  },
  watering: {
    r: (
      <g className="prop-can">
        <rect x="-7" y="-12" width="12" height="11" rx="2" fill="#4fd1a1" /><path d="M5 -10 L14 -15 L15 -13 L6 -7 Z" fill="#3fb98d" />
        <path d="M-7 -11 q-5 1 -4 6" fill="none" stroke="#3fb98d" strokeWidth="1.6" />
        <g className="prop-drops" fill="#74c6ff"><circle cx="16" cy="-10" r="0.9" /><circle cx="17.5" cy="-6" r="0.9" /><circle cx="16.5" cy="-2" r="0.9" /></g>
      </g>
    ),
    front: <g><path d="M96 124 L104 124 L102.5 132 L97.5 132 Z" fill="#c26a3a" /><path d="M100 124 Q96 116 99 112 M100 124 Q104 117 102 113" fill="none" stroke="#4fd1a1" strokeWidth="1.6" /></g>,
  },
  flashlight: {
    r: (
      <g>
        <path className="prop-beam" d="M2 -4 L34 -18 L34 10 Z" fill="#ffe7a3" opacity="0.28" />
        <rect x="-6" y="-6" width="10" height="5" rx="1.5" fill={INK} /><rect x="3" y="-7" width="3" height="7" rx="1" fill="#f5c66b" />
      </g>
    ),
  },
  cube: {
    front: (
      <g className="prop-cube">
        <rect x="52" y="96" width="16" height="16" rx="2" fill={INK} />
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={53 + c * 5} y={97 + r * 5} width="4.2" height="4.2" rx="0.8" fill={['#ff6f81', '#74c6ff', '#f5c66b', '#4fd1a1', '#ffffff', '#ff9f43'][(r * 3 + c * 2) % 6]} />
        )))}
      </g>
    ),
  },
  icecream: {
    r: (
      <g><path d="M-4 -6 L0 4 L4 -6 Z" fill="#e2ad4f" /><circle cx="0" cy="-9" r="4.6" fill="#ffb3c6" /><circle cx="-1.5" cy="-13" r="3.4" fill="#fff3d6" /><circle cx="1" cy="-16" r="1.1" fill="#ff6f81" /></g>
    ),
  },
  bubbles: {
    r: <g>{stick(12)}<circle cx="0" cy="-15" r="3.6" fill="none" stroke="#f5c66b" strokeWidth="1.2" /></g>,
    fx: (
      <g className="prop-bubbles" fill="none" stroke="#bfe3ff" strokeWidth="0.8">
        <circle className="b1" cx="100" cy="70" r="4" /><circle className="b2" cx="108" cy="58" r="2.6" /><circle className="b3" cx="96" cy="48" r="3.2" />
      </g>
    ),
  },
  aura: { fx: <g className="prop-aura" fill="none" stroke={LIT} strokeWidth="1"><ellipse cx="60" cy="74" rx="52" ry="58" opacity="0.35" /><ellipse cx="60" cy="74" rx="44" ry="50" opacity="0.2" /></g> },
  cloth: { r: <g className="prop-cloth"><path d="M-6 -6 Q0 -9 6 -6 L5 4 Q0 6 -5 4 Z" fill="#f5c66b" /><path d="M-4 -3 H4 M-4 0 H4" stroke="#c9932f" strokeWidth="0.6" /></g> },
  phone: {
    r: <g><rect x="-4" y="-16" width="8" height="14" rx="1.8" fill={INK} /><rect x="-3" y="-15" width="6" height="11" rx="1" fill={LIT} opacity="0.75" /></g>,
    fx: <g className="prop-flash"><circle cx="96" cy="66" r="14" fill="#fff" opacity="0.5" /></g>,
  },
  flag: {
    r: <g>{stick(26)}<path className="prop-flag" d="M1 -26 Q8 -29 15 -25 Q20 -22 24 -24 L24 -13 Q20 -11 15 -14 Q8 -17 1 -15 Z" fill="#4f8dff" /><circle cx="12" cy="-20" r="2.4" fill="#f5c66b" /></g>,
  },
  sunglasses: {
    head: (
      <g>
        <path d="M33 52 H87" stroke={INK} strokeWidth="2" />
        <path d="M34 51 h22 v6 q0 7 -11 7 q-11 0 -11 -7 Z" fill="#0b0f1c" /><path d="M64 51 h22 v6 q0 7 -11 7 q-11 0 -11 -7 Z" fill="#0b0f1c" />
        <path d="M37 54 l7 0" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.4" /><path d="M67 54 l7 0" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.4" />
      </g>
    ),
  },
  wand: {
    r: <g><rect x="-1" y="-18" width="2" height="18" rx="1" fill={INK} /><rect x="-1" y="-18" width="2" height="4" fill="#fff" /></g>,
    fx: <g className="prop-sparkle" fill="#ffe2a6"><path d="M108 74 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4z" /><path d="M114 64 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1z" /></g>,
  },
  umbrella: {
    r: <g><path d="M0 0 V-26" stroke={INK} strokeWidth="1.6" /><path d="M-16 -24 Q0 -42 16 -24 Q12 -27 8 -24 Q4 -27 0 -24 Q-4 -27 -8 -24 Q-12 -27 -16 -24 Z" fill="#4f8dff" /><path d="M0 0 q0 3 2.5 3" fill="none" stroke={INK} strokeWidth="1.6" /></g>,
  },
  cookie: { r: <g><circle cx="0" cy="-7" r="6" fill="#d9a05b" /><g fill="#5b3a1e"><circle cx="-2" cy="-9" r="1" /><circle cx="2" cy="-6" r="1" /><circle cx="-1" cy="-4" r="0.8" /></g></g> },
  nightcap: {
    head: <g><path d="M24 34 Q40 6 74 14 Q96 18 104 4 Q104 22 92 30 Z" fill="#4f5fd8" /><circle cx="104" cy="4" r="4" fill={WHITE} /><path d="M22 34 Q60 22 96 32" fill="none" stroke={WHITE} strokeWidth="5" strokeLinecap="round" /></g>,
  },
  telescope: {
    head: <g><g transform="rotate(-24 74 58)"><rect x="70" y="52" width="40" height="11" rx="2" fill="#4f5fd8" /><rect x="104" y="50" width="6" height="15" rx="1.5" fill={GOLD} /><rect x="70" y="53.5" width="40" height="2" fill="#fff" opacity="0.2" /></g></g>,
    fx: <g className="prop-stars" fill="#ffe7a3"><circle cx="110" cy="8" r="1.2" /><circle cx="96" cy="4" r="0.9" /><circle cx="116" cy="22" r="0.8" /></g>,
  },
  notes: { fx: <g className="prop-notes" fill={LAMP}><text x="96" y="32" fontSize="12">♪</text><text x="12" y="40" fontSize="10">♫</text><text x="104" y="14" fontSize="9">♪</text></g> },

  // -- rest: the professional -------------------------------------------------------------------------
  newspaper: {
    front: (
      <g className="prop-paper">
        <rect x="40" y="88" width="40" height="30" rx="1.5" fill={WHITE} />
        <rect x="43" y="91" width="34" height="4" fill="#2a2f45" />
        <g fill="#9aa3b8"><rect x="43" y="97.5" width="16" height="9" /><rect x="61" y="97.5" width="16" height="1.4" /><rect x="61" y="100.5" width="16" height="1.4" /><rect x="61" y="103.5" width="12" height="1.4" /><rect x="43" y="109" width="34" height="1.4" /><rect x="43" y="112" width="28" height="1.4" /></g>
      </g>
    ),
  },
  teacup: {
    r: (
      <g>
        <ellipse cx="0" cy="0" rx="9" ry="2" fill={WHITE} /><path d="M-6 -9 h12 q0 9 -6 9 q-6 0 -6 -9 Z" fill={WHITE} />
        <path d="M6 -7 q4 0 3 3 q-1 2 -4 2" fill="none" stroke={WHITE} strokeWidth="1.4" /><path d="M-5.5 -8.4 h11" stroke={GOLD} strokeWidth="1" />
        <g className="prop-steam" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round"><path d="M-1.5 -12 q-2 -3 0 -6 t0 -6" /><path d="M2.5 -12 q-2 -3 0 -6 t0 -6" /></g>
      </g>
    ),
  },
  notebook: {
    l: <g><rect x="-2" y="-20" width="18" height="22" rx="1.5" fill="#2a2160" /><rect x="0" y="-18" width="14" height="18" rx="0.8" fill={WHITE} /><g stroke="#b9c0d4" strokeWidth="0.6"><path d="M2 -14 H12 M2 -11 H12 M2 -8 H10 M2 -5 H11" /></g><rect x="-2.6" y="-20" width="2.4" height="22" fill={GOLD} /></g>,
    r: <g transform="rotate(-30)"><rect x="-1.2" y="-15" width="2.4" height="12" rx="1" fill={INK} /><path d="M-1.2 -3 L0 1.5 L1.2 -3 Z" fill={GOLD} /><rect x="-1.2" y="-15" width="2.4" height="2" fill={GOLD} /></g>,
  },
  briefcase: {
    l: <g><path d="M-4 0 v-3 q0 -2 2 -2 h4 q2 0 2 2 v3" fill="none" stroke={INK} strokeWidth="1.6" /><rect x="-10" y="0" width="20" height="14" rx="2.5" fill="#5b3a1e" /><rect x="-10" y="5" width="20" height="1.6" fill="#3e2714" /><rect x="-2" y="4" width="4" height="4" rx="0.8" fill={GOLD} /></g>,
  },
  pointer: { r: <g><rect x="-0.8" y="-30" width="1.6" height="32" rx="0.8" fill="#c9cfdd" /><circle cx="0" cy="-30" r="1.6" fill="#ff6f81" /></g> },
  phonecall: {
    head: <g><rect x="94" y="52" width="9" height="20" rx="2.5" fill={INK} /><rect x="95.5" y="55" width="6" height="12" rx="1" fill={LIT} opacity="0.6" /></g>,
    fx: <g className="prop-waves" fill="none" stroke={LAMP} strokeWidth="1.2" strokeLinecap="round"><path d="M110 50 q3 4 0 8" /><path d="M113 47 q5 7 0 14" /></g>,
  },
  tablet: {
    front: <g className="prop-tablet"><rect x="45" y="94" width="30" height="21" rx="2.6" fill={INK} /><rect x="47" y="96" width="26" height="17" rx="1.2" fill={LIT} opacity="0.35" /><g className="prop-swipe" fill="#fff" opacity="0.8"><rect x="49" y="99" width="12" height="2" rx="1" /><rect x="49" y="103" width="18" height="2" rx="1" /><rect x="49" y="107" width="9" height="2" rx="1" /></g></g>,
  },
  stopwatch: { r: <g><rect x="-1.5" y="-21" width="3" height="3" fill={GOLD} /><circle cx="0" cy="-11" r="8" fill={GOLD} /><circle cx="0" cy="-11" r="6.4" fill={WHITE} /><path className="prop-hand-tick" d="M0 -11 V-16" stroke={INK} strokeWidth="1.2" strokeLinecap="round" /></g> },
  globe: {
    r: <g><path d="M-6 0 h12" stroke={GOLD} strokeWidth="1.6" /><path d="M0 0 V-4" stroke={GOLD} strokeWidth="1.6" /><g className="prop-globe"><circle cx="0" cy="-13" r="9" fill="#3b6fd8" /><path d="M-6 -18 q4 2 3 6 q-2 2 0 5 M3 -20 q4 3 2 7 q3 2 2 5" fill="none" stroke="#4fd1a1" strokeWidth="2.4" strokeLinecap="round" /></g><path d="M-9 -13 a9 9 0 0 1 18 0" fill="none" stroke={GOLD} strokeWidth="1" /></g>,
  },
  chart: {
    r: <g><rect x="-0.8" y="-30" width="1.6" height="32" rx="0.8" fill="#c9cfdd" /><circle cx="0" cy="-30" r="1.6" fill="#ff6f81" /></g>,
    fx: (
      <g className="prop-board">
        <rect x="-2" y="56" width="22" height="18" rx="1.5" fill={WHITE} stroke={GOLD} strokeWidth="0.8" />
        <rect x="2" y="66" width="3" height="6" fill="#74c6ff" /><rect x="7" y="62" width="3" height="10" fill="#8b5cf6" /><rect x="12" y="59" width="3" height="13" fill="#e2ad4f" />
      </g>
    ),
  },

  // -- at work ----------------------------------------------------------------------------------------
  magnifier: { r: <g className="prop-mag"><path d="M0 0 L6 -8" stroke="#5b3a1e" strokeWidth="3" strokeLinecap="round" /><circle cx="10" cy="-14" r="7" fill="#bfe3ff" fillOpacity="0.25" stroke={GOLD} strokeWidth="2" /><path d="M6 -17 q2 -2 5 -2" fill="none" stroke="#fff" strokeWidth="1" opacity="0.7" /></g> },
  bulb: {
    fx: (
      <g className="prop-bulb">
        <circle cx="96" cy="16" r="12" fill="#ffe7a3" opacity="0.22" />
        <path d="M91 18 q-4 -4 -4 -8 a9 9 0 0 1 18 0 q0 4 -4 8 v3 h-10 Z" fill="#ffe7a3" />
        <rect x="91.5" y="21" width="9" height="4" rx="1" fill="#9aa3b8" /><path d="M93 12 q3 4 6 0" fill="none" stroke="#e2ad4f" strokeWidth="1" />
      </g>
    ),
  },
  chess: { fx: <g className="prop-chess"><path d="M92 30 h12 l-1.5 -3 h-9 Z M94 27 q-1 -6 2 -10 q-2 -2 0 -4 h4 q2 2 0 4 q3 4 2 10 Z" fill={WHITE} stroke={INK} strokeWidth="0.8" /><circle cx="98" cy="10" r="2" fill={WHITE} stroke={INK} strokeWidth="0.8" /></g> },
  map: {
    front: <g className="prop-map"><path d="M40 96 L53 93 L67 96 L80 93 L80 114 L67 117 L53 114 L40 117 Z" fill="#f3e2b8" /><path d="M53 93 V114 M67 96 V117" stroke="#d1b886" strokeWidth="0.8" /><path d="M45 108 q6 -8 12 -2 t14 -6" fill="none" stroke="#ff6f81" strokeWidth="1" strokeDasharray="2 1.5" /><path d="M71 98 l2 2 m0 -2 l-2 2" stroke="#ff6f81" strokeWidth="1.2" /></g>,
  },
  laptop: {
    front: (
      <g className="prop-laptop">
        <path d="M42 120 L78 120 L82 125 L38 125 Z" fill="#9aa3b8" />
        <rect x="44" y="99" width="32" height="21" rx="2" fill={INK} />
        <rect x="46" y="101" width="28" height="17" rx="1" fill={LIT} opacity="0.3" />
        <g className="prop-code" fill={LIT}><rect x="48" y="104" width="10" height="1.6" rx="0.8" /><rect x="51" y="107.5" width="14" height="1.6" rx="0.8" /><rect x="51" y="111" width="9" height="1.6" rx="0.8" /><rect x="48" y="114.5" width="6" height="1.6" rx="0.8" /></g>
        <circle cx="60" cy="102.4" r="0.8" fill={GOLD} />
      </g>
    ),
  },
  hardhat: {
    head: <g><path d="M24 34 Q26 10 60 10 Q94 10 96 34 Z" fill="#f5c66b" /><rect x="18" y="31" width="84" height="5" rx="2.5" fill="#e2ad4f" /><rect x="56" y="10" width="8" height="22" rx="3" fill="#ffd98a" /></g>,
    r: <g className="prop-hammer"><rect x="-1.2" y="-18" width="2.4" height="20" rx="1" fill="#8a6a3a" /><rect x="-6" y="-22" width="12" height="5" rx="1.2" fill="#9aa3b8" /></g>,
  },
  gears: {
    fx: (
      <g className="prop-gears" fill="#9aa3b8">
        <g className="g1"><circle cx="100" cy="22" r="7" /><circle cx="100" cy="22" r="2.6" fill="#0b0f1c" />{[0, 45, 90, 135].map((a) => <rect key={a} x="98.6" y="12.5" width="2.8" height="19" rx="0.8" transform={`rotate(${a} 100 22)`} />)}</g>
        <g className="g2"><circle cx="112" cy="34" r="4.6" fill="#e2ad4f" /><circle cx="112" cy="34" r="1.6" fill="#0b0f1c" /></g>
      </g>
    ),
  },
  'antenna-dish': { r: <g className="prop-dish"><rect x="-1" y="-10" width="2" height="10" fill="#9aa3b8" /><path d="M-10 -14 Q0 -2 10 -14 Z" fill={WHITE} /><path d="M0 -10 L4 -18" stroke={INK} strokeWidth="1" /><circle cx="4" cy="-18" r="1.4" fill={LIT} /></g> },
  quill: {
    r: <g className="prop-quill" transform="rotate(-25)"><path d="M0 2 Q-4 -12 2 -24 Q6 -12 0 2 Z" fill={WHITE} /><path d="M0 2 L1 -22" stroke="#c9cfdd" strokeWidth="0.6" /></g>,
    front: <g><rect x="44" y="100" width="32" height="18" rx="1" fill="#f3e2b8" /><rect x="42" y="98" width="4" height="22" rx="2" fill="#d1b886" /><rect x="74" y="98" width="4" height="22" rx="2" fill="#d1b886" /><g className="prop-ink" stroke="#5b3a1e" strokeWidth="0.7"><path d="M49 104 H71 M49 108 H71 M49 112 H64" /></g></g>,
  },
  clipboard: {
    l: <g><rect x="-2" y="-22" width="18" height="24" rx="2" fill="#8a6a3a" /><rect x="0" y="-19" width="14" height="19" rx="1" fill={WHITE} /><rect x="3" y="-24" width="8" height="4" rx="1" fill="#9aa3b8" /><g stroke="#9aa7c4" strokeWidth="0.7"><path d="M2 -14 H12 M2 -10 H12 M2 -6 H9" /></g><path d="M2.5 -17 l1.4 1.4 2.4 -2.6" fill="none" stroke="#4fd1a1" strokeWidth="0.9" /></g>,
    r: pencil,
  },
  megaphone: { r: <g><path d="M-2 -6 L16 -14 L16 6 L-2 -1 Z" fill="#ff6f81" /><rect x="-6" y="-6" width="5" height="6" rx="1" fill={INK} /><g className="prop-waves" fill="none" stroke={LAMP} strokeWidth="1.2"><path d="M20 -10 q4 6 0 12" /><path d="M24 -13 q6 9 0 18" /></g></g> },
  sign: {
    r: <g className="prop-sign">{stick(22)}<rect x="-11" y="-38" width="22" height="18" rx="2.5" fill={WHITE} stroke={GOLD} strokeWidth="1.2" /><text x="0" y="-24" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4f8dff">?</text></g>,
  },
  hourglass: { r: <g className="prop-hourglass"><rect x="-7" y="-22" width="14" height="2.4" rx="1" fill={GOLD} /><rect x="-7" y="-2.4" width="14" height="2.4" rx="1" fill={GOLD} /><path d="M-5.5 -19.6 h11 q0 6 -5.5 8.6 q5.5 2.6 5.5 8.6 h-11 q0 -6 5.5 -8.6 q-5.5 -2.6 -5.5 -8.6 Z" fill="#bfe3ff" fillOpacity="0.35" stroke="#c9cfdd" strokeWidth="0.6" /><path className="prop-sand" d="M-3 -17 h6 l-3 5 Z M-3.5 -3 q3.5 -4 7 0 Z" fill="#f5c66b" /></g> },
  trophy: { r: <g className="prop-trophy"><path d="M-8 -26 h16 v4 q0 9 -8 11 q-8 -2 -8 -11 Z" fill={GOLD} /><path d="M-8 -23 q-5 0 -4 4 q1 3 5 3 M8 -23 q5 0 4 4 q-1 3 -5 3" fill="none" stroke={GOLD} strokeWidth="1.4" /><rect x="-1.6" y="-11" width="3.2" height="6" fill={GOLD} /><rect x="-6" y="-5" width="12" height="4" rx="1" fill="#5b3a1e" /><path d="M-3 -22 l1.5 3" stroke="#fff" strokeOpacity="0.6" strokeWidth="1" /></g> },
  party: {
    head: <g><path d="M44 30 L60 -6 L76 30 Z" fill="#8b5cf6" /><path d="M48 21 L72 21 M52 12 L68 12" stroke={GOLD} strokeWidth="2" /><circle cx="60" cy="-6" r="3.4" fill="#f5c66b" /></g>,
    fx: <g className="prop-confetti">{[[14, 20, '#ff6f81'], [24, 8, '#74c6ff'], [100, 12, '#f5c66b'], [110, 30, '#4fd1a1'], [92, 2, '#8b5cf6'], [8, 40, '#f5c66b'], [116, 50, '#ff6f81']].map(([x, y, c], i) => <rect key={i} className={`c${i % 3}`} x={x} y={y} width="3" height="5" rx="0.8" fill={c} />)}</g>,
  },
  star: { r: <g className="prop-star"><path d="M0 -28 l3.5 7.2 7.9 1.1 -5.7 5.6 1.3 7.9 -7 -3.7 -7 3.7 1.3 -7.9 -5.7 -5.6 7.9 -1.1z" fill={GOLD} /></g> },
  bandage: {
    head: <g><g transform="rotate(-20 82 34)"><rect x="70" y="30" width="24" height="8" rx="3" fill="#f3d6b0" /><rect x="78" y="30" width="8" height="8" fill="#e8c296" /><g fill="#c99a6a"><circle cx="80" cy="32.5" r="0.6" /><circle cx="84" cy="32.5" r="0.6" /><circle cx="80" cy="35.5" r="0.6" /><circle cx="84" cy="35.5" r="0.6" /></g></g></g>,
    fx: <g className="prop-dizzy" fill="#f5c66b"><path d="M30 14 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4z" /><path d="M90 10 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1z" /></g>,
  },
  raincloud: {
    fx: <g className="prop-cloud"><path d="M40 14 q0 -9 10 -9 q4 -7 12 -4 q9 -2 11 6 q8 1 7 8 Z" fill="#8a93a8" /><g className="prop-rain" stroke="#74c6ff" strokeWidth="1.2" strokeLinecap="round"><path d="M48 18 l-1.5 5" /><path d="M58 18 l-1.5 5" /><path d="M68 18 l-1.5 5" /></g></g>,
  },
  stopsign: { r: <g>{stick(22)}<path d="M-6 -40 h12 l6 6 v12 l-6 6 h-12 l-6 -6 v-12 Z" fill="#e5484d" stroke={WHITE} strokeWidth="1.2" /><rect x="-6" y="-29.5" width="12" height="3" rx="1" fill={WHITE} /></g> },
  notepad: {
    l: <g><rect x="-2" y="-20" width="16" height="20" rx="1.5" fill="#ffe7a3" /><g stroke="#c9a85b" strokeWidth="0.6"><path d="M1 -15 H11 M1 -11 H11 M1 -7 H8" /></g><path d="M0 -20 h12" stroke="#ff6f81" strokeWidth="1.6" /></g>,
    r: pencil,
  },
  eartrumpet: { head: <g><path d="M104 60 L114 52 Q120 58 114 66 Z" fill={GOLD} /><circle cx="105" cy="60" r="2.4" fill="#a8761f" /></g> },
  pen: { r: <g transform="rotate(-40)"><rect x="-1.2" y="-16" width="2.4" height="14" rx="1" fill={INK} /><rect x="-1.2" y="-16" width="2.4" height="2.4" fill={GOLD} /><path d="M-1.2 -2 L0 2 L1.2 -2 Z" fill={GOLD} /></g> },
  dossier: { front: <g><rect x="42" y="94" width="36" height="24" rx="1.5" fill="#d9c08c" /><rect x="44" y="91" width="14" height="4" rx="1" fill="#d9c08c" /><rect x="46" y="98" width="28" height="17" fill={WHITE} /><g stroke="#9aa7c4" strokeWidth="0.7"><path d="M49 102 H71 M49 105 H71 M49 108 H66 M49 111 H69" /></g><text x="70" y="98" fontSize="4" fill="#e5484d" fontWeight="800">●</text></g> },
  stamp: {
    r: <g className="prop-stamp"><rect x="-2.4" y="-14" width="4.8" height="8" rx="1.6" fill="#5b3a1e" /><rect x="-6" y="-6" width="12" height="4" rx="1" fill="#e5484d" /></g>,
    front: <g><rect x="44" y="104" width="32" height="18" rx="1" fill={WHITE} /><g stroke="#9aa7c4" strokeWidth="0.7"><path d="M47 108 H63 M47 111 H60" /></g><g className="prop-approved"><rect x="56" y="110" width="17" height="9" rx="1.5" fill="none" stroke="#4fd1a1" strokeWidth="1.2" transform="rotate(-8 64 114)" /><path d="M59 114.5 l2.2 2.2 4.4 -4.6" fill="none" stroke="#4fd1a1" strokeWidth="1.4" transform="rotate(-8 64 114)" /></g></g>,
  },
  // -- the subject of the question ----------------------------------------------------------------------
  calculator: {
    r: <g className="prop-calc"><rect x="-8" y="-24" width="16" height="22" rx="2.4" fill={INK} /><rect x="-6" y="-22" width="12" height="5" rx="1" fill="#9fe9cb" /><text x="5" y="-18" fontSize="4" textAnchor="end" fill={INK} fontWeight="800">42</text>{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} className={`key k${(r + c) % 3}`} x={-6 + c * 4.2} y={-15 + r * 4.2} width="3.4" height="3" rx="0.8" fill={r === 2 && c === 2 ? '#f5c66b' : '#3a4566'} />))}</g>,
  },
  sun: {
    fx: <g className="prop-sun"><circle cx="100" cy="18" r="8" fill="#ffd36b" /><g className="rays" stroke="#ffd36b" strokeWidth="2" strokeLinecap="round">{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d="M100 4 V7" transform={`rotate(${a} 100 18)`} />)}</g></g>,
  },
  chef: {
    head: <g><path d="M30 34 Q22 22 32 16 Q36 4 50 10 Q60 0 70 10 Q84 4 88 16 Q98 22 90 34 Z" fill={WHITE} /><rect x="30" y="28" width="60" height="8" rx="2" fill="#e8ecf4" /></g>,
    r: <g className="prop-spoon"><rect x="-1" y="-22" width="2" height="22" rx="1" fill="#8a6a3a" /><ellipse cx="0" cy="-23" rx="3" ry="4" fill="#9aa3b8" /></g>,
    front: <g><path d="M44 112 h32 l-2 12 q-14 4 -28 0 Z" fill="#9aa3b8" /><rect x="42" y="109" width="36" height="4" rx="2" fill="#c9cfdd" /><g className="prop-steam" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.1" strokeLinecap="round"><path d="M52 106 q-2 -3 0 -6 t0 -6" /><path d="M60 106 q-2 -3 0 -6 t0 -6" /><path d="M68 106 q-2 -3 0 -6 t0 -6" /></g></g>,
  },
  medkit: {
    l: <g><path d="M-4 0 v-3 q0 -2 2 -2 h4 q2 0 2 2 v3" fill="none" stroke={INK} strokeWidth="1.6" /><rect x="-10" y="0" width="20" height="14" rx="2.5" fill={WHITE} /><rect x="-1.8" y="2.6" width="3.6" height="9" rx="0.8" fill="#e5484d" /><rect x="-4.5" y="5.3" width="9" height="3.6" rx="0.8" fill="#e5484d" /></g>,
  },
  lovehearts: {
    fx: <g className="prop-lovehearts" fill="#ff7a9c"><path className="h1" d="M98 32 c-3 -5 -10 -1 -6 5 l6 6 6 -6 c4 -6 -3 -10 -6 -5z" /><path className="h2" d="M20 40 c-2 -3.5 -7 -0.7 -4 3.5 l4 4 4 -4 c3 -4.2 -2 -7 -4 -3.5z" /><path className="h3" d="M108 56 c-1.6 -2.6 -5 -0.5 -3 2.6 l3 3 3 -3 c2 -3 -1.4 -5.2 -3 -2.6z" /></g>,
  },
  coins: {
    r: <g className="prop-coins">{[0, 1, 2, 3].map((i) => <ellipse key={i} cx="0" cy={-3 - i * 3} rx="7" ry="2.6" fill={GOLD} stroke="#a8761f" strokeWidth="0.6" />)}<text x="0" y="-11" fontSize="5" textAnchor="middle" fill="#7a5414" fontWeight="800">$</text></g>,
  },
  clock: {
    r: <g><circle cx="0" cy="-12" r="9" fill={WHITE} stroke={GOLD} strokeWidth="1.8" /><g className="prop-clock-hands" stroke={INK} strokeWidth="1.2" strokeLinecap="round"><path className="hh" d="M0 -12 V-17" /><path className="mh" d="M0 -12 H5" /></g><circle cx="0" cy="-12" r="1" fill={INK} /></g>,
  },
  flask: {
    r: <g><path d="M-3 -24 h6 v7 l6 12 q1 3 -2 3 h-14 q-3 0 -2 -3 l6 -12 Z" fill="#bfe3ff" fillOpacity="0.35" stroke="#c9cfdd" strokeWidth="0.8" /><path d="M-8 -6 l3 -6 h10 l3 6 q1 3 -2 3 h-12 q-3 0 -2 -3 Z" fill="#4fd1a1" /><g className="prop-fizz" fill="#c6ffe9"><circle cx="-2" cy="-8" r="1" /><circle cx="2" cy="-10" r="0.8" /><circle cx="0" cy="-14" r="0.9" /></g></g>,
  },
  ball: {
    r: <g className="prop-ball"><circle cx="0" cy="-10" r="8" fill={WHITE} /><path d="M0 -14 l3.4 2.4 -1.3 4 h-4.2 l-1.3 -4 Z" fill={INK} /><path d="M0 -14 V-18 M3.4 -11.6 l3.6 -1.4 M2.1 -7.6 l2.4 3 M-2.1 -7.6 l-2.4 3 M-3.4 -11.6 l-3.6 -1.4" stroke={INK} strokeWidth="0.8" /></g>,
  },

  dizzystars: {
    fx: <g className="prop-dizzy" fill="#f5c66b"><path d="M30 14 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4z" /><path d="M90 10 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1z" /><path d="M60 4 l1.2 2.8 2.8 1.2 -2.8 1.2 -1.2 2.8 -1.2 -2.8 -2.8 -1.2 2.8 -1.2z" /></g>,
  },

  // -- occasions ----------------------------------------------------------------------------------------
  lantern: {
    r: (
      <g className="prop-lantern">
        <path d="M0 0 V6" stroke={GOLD} strokeWidth="1" />
        <circle cx="0" cy="-1" r="1.6" fill="none" stroke={GOLD} strokeWidth="0.9" />
        <path d="M-5 6 Q0 2 5 6 Z" fill={GOLD} />
        <path className="lantern-glass" d="M-6 8 L6 8 L7.5 20 L0 25 L-7.5 20 Z" fill="#ffd36b" opacity="0.9" />
        <path d="M-6 8 L6 8 L7.5 20 L0 25 L-7.5 20 Z M0 8 V25 M-7 14 H7" fill="none" stroke={GOLD} strokeWidth="1.1" />
        <circle className="lantern-flame" cx="0" cy="16" r="2.2" fill="#fff6d6" />
        <path d="M-1.6 25 L0 29 L1.6 25 Z" fill={GOLD} />
      </g>
    ),
  },
  fireworks: {
    fx: (
      <g className="prop-fireworks">
        {[[22, 18, '#ffd36b'], [98, 14, '#ff8fab'], [60, 4, '#74c6ff']].map(([x, y, c], i) => (
          <g key={i} className={`burst b${i}`} stroke={c} strokeWidth="1.4" strokeLinecap="round">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d={`M${x} ${y - 3} V${y - 9}`} transform={`rotate(${a} ${x} ${y})`} />)}
          </g>
        ))}
      </g>
    ),
  },

  // -- reactions to the person ------------------------------------------------------------------------
  letter: {
    r: <g><rect x="-8" y="-18" width="16" height="11" rx="1.2" fill={WHITE} /><path d="M-8 -18 L0 -11 L8 -18" fill="none" stroke="#9aa7c4" strokeWidth="0.9" /><circle cx="0" cy="-12" r="1.6" fill="#ff6f81" /></g>,
    fx: <g className="prop-incoming"><path d="M14 122 L34 114 L24 124 Z" fill={WHITE} /><path d="M24 124 L26 118 L34 114 Z" fill="#cfd6e6" /></g>,
  },
  camera: {
    head: <g><rect x="34" y="46" width="52" height="26" rx="5" fill={INK} /><rect x="38" y="42" width="12" height="6" rx="2" fill={INK} /><circle cx="60" cy="59" r="10" fill="#0b0f1c" stroke={GOLD} strokeWidth="1.6" /><circle cx="60" cy="59" r="6" fill={LIT} opacity="0.55" /><circle cx="57.5" cy="56.5" r="2" fill="#fff" opacity="0.7" /><circle cx="80" cy="51" r="1.8" fill="#ff6f81" /></g>,
    fx: <g className="prop-flash"><circle cx="60" cy="58" r="40" fill="#fff" opacity="0.45" /></g>,
  },
  thumb: { r: <g className="prop-thumb"><rect x="-5" y="-6" width="10" height="9" rx="3.4" fill="url(#nabi-case)" /><rect x="-2" y="-15" width="4.6" height="11" rx="2.3" fill="url(#nabi-case)" /><path d="M-4 -2 H4 M-4 0.6 H4" stroke="#000" strokeOpacity="0.15" strokeWidth="0.7" /></g> },
  broom: { r: <g className="prop-broom"><rect x="-1.1" y="-24" width="2.2" height="30" rx="1" fill="#8a6a3a" /><path d="M-6 6 L6 6 L9 16 L-9 16 Z" fill="#e2ad4f" /><path d="M-6 9 L-7 16 M-2 9 L-2.5 16 M2 9 L2.5 16 M6 9 L7 16" stroke="#a8761f" strokeWidth="0.7" /><rect x="-6.5" y="4.5" width="13" height="2.4" rx="1" fill="#c26a3a" /></g> },
  document: { r:<g><rect x="-8" y="-22" width="16" height="20" rx="1.2" fill={WHITE} /><g stroke="#9aa7c4" strokeWidth="0.7"><path d="M-5 -18 H5 M-5 -15 H5 M-5 -12 H3" /></g><path d="M-3 -7 l2 2 4 -4.4" fill="none" stroke="#4fd1a1" strokeWidth="1.3" /></g> },
}

// What the person dressed it in (the companion page): worn all the time in the everyday look, hidden under a
// hat a role puts on, and never with the Serious Mode suit. Slots: back (behind the body), neck, head.
export const ACCESSORIES = {
  scarf: {
    neck: (
      <g className="acc-scarf">
        <path d="M42 85 Q60 94 78 85 L79 91.5 Q60 100.5 41 91.5 Z" fill="#e5484d" />
        <path d="M44 88 Q60 96 76 88" fill="none" stroke="#ff8b99" strokeWidth="1" strokeDasharray="2 2" />
        <path className="scarf-tail" d="M67 92 L73 108 L67.5 109.5 L63 94 Z" fill="#c93a3f" />
        <path d="M67.6 105 L73 104 M66.4 101 L71.8 100" stroke="#ff8b99" strokeWidth="0.9" />
      </g>
    ),
  },
  bowtie: {
    neck: <g><path d="M52 85 L60 89 L52 93 Z M68 85 L60 89 L68 93 Z" fill="#4f8dff" /><rect x="57.6" y="86.6" width="4.8" height="4.8" rx="1.4" fill="#3b6fd8" /><path d="M53.5 87 L57 89 M66.5 87 L63 89" stroke="#9fc3ff" strokeWidth="0.7" /></g>,
  },
  cap: {
    head: <g><path d="M24 36 Q24 12 60 11 Q94 12 96 34 Z" fill="#4f8dff" /><path d="M84 31 Q104 27 114 35 Q100 39 86 37 Z" fill="#3b6fd8" /><circle cx="60" cy="12" r="2.6" fill="#3b6fd8" /><path d="M60 13 V34 M40 15 Q46 26 44 35 M80 15 Q74 26 76 35" stroke="#3b6fd8" strokeWidth="0.9" fill="none" /><text x="60" y="29" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">N</text></g>,
  },
  flower: {
    head: <g className="acc-flower">{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="27" cy="24" rx="3.4" ry="5.4" fill="#ff8fab" transform={`rotate(${a} 27 30)`} />)}<circle cx="27" cy="30" r="3" fill="#ffd36b" /><path d="M31 34 q4 2 6 0" stroke="#4fd1a1" strokeWidth="1.6" fill="none" /></g>,
  },
  headband: {
    head: <g><path d="M27 32 Q60 24 93 32 L93.5 37.5 Q60 29.5 26.5 37.5 Z" fill="#ff6f81" /><path d="M27 34.6 Q60 26.6 93 34.6" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" /></g>,
  },
  cape: {
    back: <g className="acc-cape"><path d="M38 84 Q60 79 82 84 L95 126 Q60 135 25 126 Z" fill="#c93a3f" /><path d="M38 84 Q60 79 82 84 L84 90 Q60 85 36 90 Z" fill="#e5484d" /></g>,
  },
  crown: {
    head: <g className="acc-crown"><path d="M42 27 L44 13 L51.5 20.5 L60 10 L68.5 20.5 L76 13 L78 27 Z" fill="url(#nabi-trim)" stroke="#a8761f" strokeWidth="0.6" /><circle cx="60" cy="21" r="2" fill="#e5484d" /><circle cx="49" cy="23" r="1.4" fill="#4f8dff" /><circle cx="71" cy="23" r="1.4" fill="#4fd1a1" /><rect x="42" y="24.6" width="36" height="2.6" fill="#ffe3a3" opacity="0.6" /></g>,
  },
}

// Its friends (the companion page): small beings that keep it company, drawn around (0, 0) and flown by CSS.
export const PET_ART = {
  drone: (
    <g className="pet-art pet-drone">
      <ellipse className="rotor" cx="0" cy="-9" rx="9" ry="1.4" fill="#cfe0ff" opacity="0.8" />
      <rect x="-0.8" y="-9" width="1.6" height="4" fill="#9aa3b8" />
      <circle cx="0" cy="0" r="6.4" fill="#e9eef8" />
      <circle cx="0" cy="0" r="6.4" fill="url(#nabi-shade)" />
      <rect x="-4.4" y="-2.6" width="8.8" height="5.2" rx="2.6" fill="#0d1322" />
      <circle className="pet-eye" cx="0" cy="0" r="1.6" fill="#74c6ff" />
      <path d="M-6 3 L-9 6 M6 3 L9 6" stroke="#9aa3b8" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  ),
  bird: (
    <g className="pet-art pet-bird">
      <ellipse cx="0" cy="0" rx="6.6" ry="5.6" fill="#ffd36b" />
      <path className="wing" d="M-2 -1 Q-9 -8 -11 0 Q-6 1 -2 2 Z" fill="#f5b942" />
      <circle cx="3" cy="-1.6" r="1.1" fill="#1d2944" />
      <path d="M6 -0.6 L9.6 0.4 L6 1.6 Z" fill="#ff9f43" />
      <path d="M-6 2 L-9.5 4.5 L-6.4 4.6 Z" fill="#f5b942" />
      <ellipse cx="-1" cy="3" rx="3" ry="1.4" fill="#fff3d6" opacity="0.7" />
    </g>
  ),
  sprite: (
    <g className="pet-art pet-sprite">
      <circle cx="0" cy="0" r="9" fill="#bfe3ff" opacity="0.18" />
      <path d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8 Z" fill="#fff6d6" />
      <circle cx="0" cy="0" r="2.4" fill="#ffffff" />
      <g className="trail" fill="#ffe7a3"><circle cx="-10" cy="4" r="1.1" /><circle cx="-14" cy="7" r="0.8" /><circle cx="-17" cy="9" r="0.5" /></g>
    </g>
  ),
}

/** One slot of an accessory, or nothing. */
export function accessoryPart(id, slot) {
  const a = id && ACCESSORIES[id]
  return (a && a[slot]) || null
}

/** One slot of a prop, or nothing. */
export function propPart(prop, slot) {
  const p = prop && PROPS[prop]
  return (p && p[slot]) || null
}
