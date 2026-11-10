// The companion's own settings — its colour, what it wears, its name and which of its habits are on — and
// the counts that unlock its wardrobe. Pure functions over a storage object, so `npm test` covers them.
//
// Both windows read the same record: the floating card and the Control Center are pages of one local origin,
// so they share `localStorage`, and a change made on the companion page reaches the card through the
// `storage` event at once (useNabiPrefs.js).

export const PREFS_KEY = 'nabi.prefs'
export const TOTAL_KEY = 'nabi.total'
export const DAY_KEY = 'nabi.day'
export const SEEN_KEY = 'nabi.seen'
export const BEST_KEY = 'nabi.best'

/** Shell colours for the everyday character. Serious Mode keeps its graphite and its suit. */
export const PAINTS = [
  { id: 'porcelain', label: 'Porcelain', top: '#ffffff', bottom: '#d3d8e2', joint: '#1d2944' },
  { id: 'midnight', label: 'Midnight', top: '#5b6ea8', bottom: '#27315e', joint: '#0d1328' },
  { id: 'gold', label: 'Gold', top: '#ffeab5', bottom: '#d9a443', joint: '#5b3a12' },
  { id: 'mint', label: 'Mint', top: '#eafff6', bottom: '#8fd9bd', joint: '#1d4a3c' },
  { id: 'rose', label: 'Rose', top: '#fff0f4', bottom: '#f1a7bd', joint: '#5a2238' },
  { id: 'sky', label: 'Sky', top: '#eef6ff', bottom: '#9cc4f2', joint: '#1d3556' },
]

/** What it can wear, and how many questions (in all) unlock each piece. */
export const WARDROBE = [
  { id: 'none', label: 'Nothing', at: 0 },
  { id: 'scarf', label: 'Scarf', at: 1 },
  { id: 'bowtie', label: 'Bow tie', at: 5 },
  { id: 'cap', label: 'Cap', at: 10 },
  { id: 'flower', label: 'Flower', at: 20 },
  { id: 'headband', label: 'Headband', at: 35 },
  { id: 'cape', label: 'Cape', at: 50 },
  { id: 'crown', label: 'Crown', at: 100 },
]

/** Friends that keep it company, unlocked like the wardrobe. */
export const PETS = [
  { id: 'none', label: 'Nobody', at: 0 },
  { id: 'drone', label: 'Drone', at: 15 },
  { id: 'bird', label: 'Bird', at: 30 },
  { id: 'sprite', label: 'Sprite', at: 75 },
]

// Sounds are off until the person turns them on: a window that beeps on its own is a window people close.
export const DEFAULT_PREFS = { paint: 'porcelain', accessory: 'none', pet: 'none', name: '', roam: true, seasons: true, talk: true, play: true, sounds: false }

function read(storage, key) {
  try { return storage ? storage.getItem(key) : null } catch { return null }
}
function write(storage, key, value) {
  try { if (storage) storage.setItem(key, value) } catch { /* private window or full: the defaults stand */ }
}

/** The settings, with every missing or unknown value replaced by its default. */
export function loadPrefs(storage) {
  let raw = null
  try { raw = JSON.parse(read(storage, PREFS_KEY) || 'null') } catch { raw = null }
  const prefs = { ...DEFAULT_PREFS, ...(raw && typeof raw === 'object' ? raw : {}) }
  if (!PAINTS.some((p) => p.id === prefs.paint)) prefs.paint = DEFAULT_PREFS.paint
  if (!WARDROBE.some((w) => w.id === prefs.accessory)) prefs.accessory = DEFAULT_PREFS.accessory
  if (!PETS.some((w) => w.id === prefs.pet)) prefs.pet = DEFAULT_PREFS.pet
  prefs.name = String(prefs.name || '').slice(0, 24)
  for (const key of ['roam', 'seasons', 'talk', 'play']) prefs[key] = prefs[key] !== false
  prefs.sounds = prefs.sounds === true
  return prefs
}

export function savePrefs(storage, changes) {
  const next = loadPrefs({ getItem: () => JSON.stringify({ ...loadPrefs(storage), ...changes }) })
  write(storage, PREFS_KEY, JSON.stringify(next))
  return next
}

/** All the questions it has ever been asked here. */
export function readTotal(storage) {
  const n = Number(read(storage, TOTAL_KEY))
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

/** One more question; returns the new total and the wardrobe piece it unlocked, if any. */
export function bumpTotal(storage) {
  const total = readTotal(storage) + 1
  write(storage, TOTAL_KEY, String(total))
  const piece = [...WARDROBE, ...PETS].find((w) => w.at === total && w.id !== 'none') || null
  return { total, unlocked: piece }
}

export function isUnlocked(id, total) {
  const piece = [...WARDROBE, ...PETS].find((w) => w.id === id)
  return Boolean(piece) && total >= piece.at
}

/** The paint for the everyday shell, as the CSS variables the drawing reads; null for the default. */
export function paintVars(id) {
  const paint = PAINTS.find((p) => p.id === id)
  if (!paint || paint.id === 'porcelain') return null
  return { '--case-top': paint.top, '--case-bottom': paint.bottom, '--joint': paint.joint }
}

/** How long it has been away from the person, from the last time it saw them. */
export function awayFor(storage, now) {
  const last = Number(read(storage, SEEN_KEY))
  write(storage, SEEN_KEY, String(now))
  return Number.isFinite(last) && last > 0 ? now - last : 0
}

/** The best score at catching stars. */
export function readBest(storage) {
  const n = Number(read(storage, BEST_KEY))
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

/** Records a game; returns whether it beat the best. */
export function recordGame(storage, score) {
  const best = readBest(storage)
  if (score > best) { write(storage, BEST_KEY, String(score)); return true }
  return false
}
