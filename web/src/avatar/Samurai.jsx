// The samurai scene on the installing screen: the companion stands in authentic samurai armour with a drawn katana,
// a red sun rises behind it with slow rays, and cherry blossom (sakura) petals fall in two depth layers.
// All warrior gear is designed in the character's exact 120x140 viewBox so it attaches directly to Nabi's anatomy:
// the hachimaki headband to the head, the dō and sode to the torso, and the Katana gripped solidly in the right hand.
import React, { useMemo } from 'react'

function rnd(i, salt) { return ((Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1 }

// Two layers of petals: a far field (small, slow, soft) and a near field (larger, quicker, sharp), for depth.
export function Sakura() {
  const petals = useMemo(() => {
    const make = (i, layer) => {
      const near = layer === 'near'
      return {
        key: `${layer}-${i}`, layer,
        left: `${Math.round(rnd(i + (near ? 50 : 0), 1) * 100)}%`,
        delay: `${(rnd(i, 2) * -16).toFixed(2)}s`,
        duration: `${((near ? 6 : 10) + rnd(i, 3) * (near ? 5 : 8)).toFixed(2)}s`,
        drift: `${Math.round((near ? 30 : 16) + rnd(i, 4) * (near ? 70 : 40)) * (rnd(i, 9) > 0.5 ? 1 : -1)}px`,
        size: (near ? 9 : 5) + Math.round(rnd(i, 5) * (near ? 7 : 5)),
        spin: `${rnd(i, 6) > 0.5 ? '' : '-'}${Math.round(300 + rnd(i, 7) * 420)}deg`,
        tone: rnd(i, 8) > 0.55 ? 'a' : rnd(i, 8) > 0.25 ? 'b' : 'c',
      }
    }
    return [...Array.from({ length: 22 }, (_, i) => make(i, 'far')), ...Array.from({ length: 11 }, (_, i) => make(i, 'near'))]
  }, [])
  return (
    <div className="sakura" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.key}
          className={`petal petal-${p.layer} tone-${p.tone}`}
          style={{ left: p.left, width: p.size, height: p.size, '--d': p.duration, '--delay': p.delay, '--drift': p.drift, '--spin': p.spin }}
        />
      ))}
    </div>
  )
}

// The rising sun: a deep-red disc with slow radiating rays behind the character.
export function RisingSun() {
  const rays = Array.from({ length: 24 }, (_, i) => i * 15)
  return (
    <svg className="rising-sun" viewBox="-100 -100 200 200" aria-hidden="true">
      <g className="sun-rays">
        {rays.map((a) => (
          <path key={a} d="M0 0 L7 -98 L-7 -98 Z" fill="rgba(216,60,52,0.16)" transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r="34" fill="url(#sun-fill)" />
      <defs>
        <radialGradient id="sun-fill"><stop offset="0" stopColor="#f0564a" /><stop offset="0.7" stopColor="#c7352d" /><stop offset="1" stopColor="rgba(160,30,24,0)" /></radialGradient>
      </defs>
    </svg>
  )
}

// SVG Defs required for steel blades, lacquer armor, polished gold, and slash glow VFX.
export function SamuraiDefs() {
  return (
    <>
      <linearGradient id="blade-metal" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#8898b3" />
        <stop offset="35%" stopColor="#d5e0f2" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#c2d2ea" />
        <stop offset="100%" stopColor="#8fa2c0" />
      </linearGradient>
      <linearGradient id="blade-mune" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4a5975" />
        <stop offset="100%" stopColor="#2c374d" />
      </linearGradient>
      <linearGradient id="lacq" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d83c34" />
        <stop offset="50%" stopColor="#a32420" />
        <stop offset="100%" stopColor="#631311" />
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fff1c7" />
        <stop offset="40%" stopColor="#f4cb66" />
        <stop offset="75%" stopColor="#d89f36" />
        <stop offset="100%" stopColor="#9a6e1a" />
      </linearGradient>
      <linearGradient id="slash-arc-grad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
        <stop offset="25%" stopColor="rgba(126, 227, 189, 0.45)" />
        <stop offset="60%" stopColor="rgba(255, 255, 255, 0.98)" />
        <stop offset="85%" stopColor="rgba(244, 203, 102, 0.85)" />
        <stop offset="100%" stopColor="rgba(216, 60, 52, 0)" />
      </linearGradient>
      <filter id="slash-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </>
  )
}

// Hachimaki headband worn on Nabi's head, turning with Nabi's gaze.
export function Hachimaki() {
  return (
    <g className="sg-band">
      <path className="sg-tail" d="M34 40 q-13 1 -21 7 q10 -1 21 -1z" fill="#eef1f6" opacity="0.92" />
      <path className="sg-tail sg-tail2" d="M34 43 q-14 5 -20 13 q11 -5 21 -7z" fill="#dbe0ea" opacity="0.8" />
      <rect x="31" y="35" width="58" height="7.4" rx="2.2" fill="#f4f6fb" stroke="#c6ccd8" strokeWidth="0.5" />
      <circle cx="60" cy="38.7" r="3.6" fill="#d8322c" />
      <path d="M86 35 l6 -3 -1 4 4 1 -5 2z" fill="#f4f6fb" opacity="0.85" />
    </g>
  )
}

// Chest armor (dō), left shoulder plate, and hip scabbard (saya) attached to Nabi's torso.
export function SamuraiTorso() {
  return (
    <g className="sg-torso-gear">
      {/* saya: lacquered black scabbard worn at left hip */}
      <g className="sg-saya">
        <path d="M 28 104 Q 20 115, 10 130 L 7.5 128 Q 18 113, 26 102 Z" fill="#141824" stroke="url(#gold)" strokeWidth="0.5" />
        {/* koiguchi (mouth) gold fitting */}
        <ellipse cx="27" cy="103" rx="2.2" ry="1.6" fill="url(#gold)" transform="rotate(-35 27 103)" />
        {/* kojiri (chape) gold end cap */}
        <path d="M 10 130 L 7.5 128 L 8 132 Z" fill="url(#gold)" />
      </g>

      {/* dō: the chest plate, lacquered crimson with three rows of gold lacing and rivets */}
      <g className="sg-do">
        <path d="M46 96 q14 -5 28 0 l1.5 20 q-15 6 -31 0z" fill="url(#lacq)" stroke="#5a1412" strokeWidth="0.6" />
        {[101, 106.5, 112].map((y, i) => (
          <g key={i}>
            <line x1="47.5" y1={y} x2="72.5" y2={y} stroke="url(#gold)" strokeWidth="1.5" strokeLinecap="round" />
            {[50, 56, 60, 64, 70].map((x) => <circle key={x} cx={x} cy={y} r="0.9" fill="#f4d98a" />)}
          </g>
        ))}
      </g>

      {/* sode: left shoulder armor plates */}
      <g className="sg-sode sg-sode-left">
        {[0, 1, 2, 3].map((n) => (
          <g key={n}>
            <rect x={20} y={88 + n * 4.4} width={16} height={3.8} rx={1.4} fill="url(#lacq)" stroke="#5a1412" strokeWidth="0.4" />
            <line x1={22} y1={90 + n * 4.4} x2={34} y2={90 + n * 4.4} stroke="url(#gold)" strokeWidth="0.7" opacity="0.85" />
          </g>
        ))}
      </g>
    </g>
  )
}

// Right arm gear: shoulder plate and the authentic Katana gripped firmly in hand.
// cx=92, cy=113.5 is the exact center of the right hand. The Katana is held in a noble Kamae guard,
// with the gleaming blade pointing cleanly forward-downward, completely clear of the head and face.
export function ArmSamuraiRight({ cx, cy }) {
  return (
    <g className="sg-arm-r-gear">
      {/* sode: right shoulder armor plates attached to arm */}
      <g className="sg-sode sg-sode-right">
        {[0, 1, 2, 3].map((n) => (
          <g key={n}>
            <rect x={84} y={88 + n * 4.4} width={16} height={3.8} rx={1.4} fill="url(#lacq)" stroke="#5a1412" strokeWidth="0.4" />
            <line x1={86} y1={90 + n * 4.4} x2={98} y2={90 + n * 4.4} stroke="url(#gold)" strokeWidth="0.7" opacity="0.85" />
          </g>
        ))}
      </g>

      {/* The Masterpiece Katana gripped in the hand, pointing cleanly downward-forward in noble Kamae guard */}
      <g className="sg-katana-in-hand">
        {/* sageo silk tassel flowing below guard */}
        <path className="sg-sageo" d="M 93 117 Q 89 126, 93 133 Q 96 127, 95 119" fill="#d83c34" opacity="0.85" />

        {/* tsuka (handle): gripped firmly in hand, running through (cx=92, cy=113.5) */}
        <path d="M 86 103 L 94 116" stroke="#161b2a" strokeWidth="4.6" strokeLinecap="round" />
        {/* tsuka-ito wrap & menuki in gold */}
        <path d="M 86 103 L 94 116" stroke="url(#gold)" strokeWidth="4.6" strokeLinecap="round" strokeDasharray="1.2 2.4" opacity="0.95" />
        {/* kashira (pommel cap) */}
        <circle cx="86" cy="103" r="2.5" fill="url(#gold)" stroke="#825c16" strokeWidth="0.5" />
        <circle cx="86" cy="103" r="1.1" fill="#241a3a" />

        {/* tsuba (sword guard): sculpted iron oval disc with gold rim */}
        <ellipse cx="94" cy="116" rx="4.8" ry="3.4" fill="#1b2030" stroke="url(#gold)" strokeWidth="1.2" transform="rotate(52 94 116)" />
        <circle cx="94" cy="116" r="1.5" fill="url(#gold)" />

        {/* habaki (blade collar) in solid gold */}
        <polygon points="93,116.5 96.5,115 98,118.5 94.5,120" fill="url(#gold)" stroke="#7a5512" strokeWidth="0.4" />

        {/* Shinogi-Zukuri Katana Blade: curved spine, polished body, hamon, and razor kissaki */}
        {/* Spine shadow */}
        <path d="M 95 118 Q 102 127, 108 136.5 L 109.5 137 Q 103.5 126, 96.5 117 Z" fill="url(#blade-mune)" opacity="0.75" />
        {/* Polished steel body */}
        <path className="sg-blade-body" d="M 94.5 118.5 Q 101.5 127.5, 107.5 137 L 109 137.5 Q 103 126.5, 96 117.5 Z" fill="url(#blade-metal)" />
        {/* Shinogi ridge highlight */}
        <path d="M 95.5 118 Q 102.5 127, 108.5 137" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
        {/* Undulating hamon temper line */}
        <path className="sg-hamon" d="M 94.5 119 Q 97 122.5, 98 124 Q 101 127.5, 103 130 Q 105 133, 107.5 137" fill="none" stroke="#eef6ff" strokeWidth="0.65" strokeDasharray="2 1 1 1" opacity="0.85" />
        {/* Razor cutting edge */}
        <path d="M 93.8 119.5 Q 100.8 128.5, 107 137.5" fill="none" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" />

        {/* Traveling light gleam along blade edge */}
        <path className="sg-gleam" d="M 94.5 119 Q 101.5 128, 107.5 137" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        {/* Tip spark glint at kissaki */}
        <g className="sg-tip-spark" transform="translate(108, 137)">
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#fff" strokeWidth="1" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#fff" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.5" fill="#fff" />
        </g>
      </g>
    </g>
  )
}

// Dynamic crescent slash light wave & motion cut VFX (overlaid in stage).
export function SlashVFX() {
  return (
    <svg className="sg-slash-overlay" viewBox="0 0 120 140" aria-hidden="true">
      <defs>
        <linearGradient id="slash-arc-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="25%" stopColor="rgba(126, 227, 189, 0.45)" />
          <stop offset="60%" stopColor="rgba(255, 255, 255, 0.98)" />
          <stop offset="85%" stopColor="rgba(244, 203, 102, 0.85)" />
          <stop offset="100%" stopColor="rgba(216, 60, 52, 0)" />
        </linearGradient>
        <filter id="slash-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g className="sg-slash-group" filter="url(#slash-glow)">
        <path className="sg-slash-arc" d="M 8 98 C 6 42, 54 10, 112 42" fill="none" stroke="url(#slash-arc-grad)" strokeWidth="4.8" strokeLinecap="round" />
        <path className="sg-slash-core" d="M 14 94 C 12 46, 56 16, 108 44" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        <path className="sg-slash-streak" d="M 24 88 C 22 52, 60 26, 98 48" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="8 14" />
        <g className="sg-tip-spark" transform="translate(18, 86)">
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#fff" strokeWidth="1" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#fff" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.5" fill="#fff" />
        </g>
      </g>
    </svg>
  )
}
