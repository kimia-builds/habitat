// A controlled fixture for the narration slots (2026-08-20).
//
// The twin of nameFixture.js, and it exists for the same reason: the
// words in `src/content/narration.js` are Kimia's, and she edits them
// straight on GitHub. So no test may depend on what a slot actually
// says — or on whether it is blank yet. A failing suite blocks the
// deploy, so a content-coupled test silently stops her own edits from
// going live; that has bitten this project twice already.
//
// The cameo messages need it because they now write {holes} that
// Habitat fills in from the win (a real streak length, a real habit
// name). Testing that the filling WORKS means knowing what went in, so
// tests set their own sentence here and restore afterwards.

import { NARRATION } from '../content/narration.js'

const ORIGINAL = structuredClone(NARRATION)

// Set one slot by its dotted path, e.g.
// setNarrationSlot('cameos.bigDay', '{n} steps'). The path must already
// exist — inventing a slot in a test would prove nothing about the app.
export function setNarrationSlot(path, text) {
  const keys = path.split('.')
  const last = keys.pop()
  let node = NARRATION
  for (const key of keys) node = node[key]
  if (!(last in node)) throw new Error(`No narration slot at "${path}".`)
  node[last] = text
}

// Blank one slot — the state Habitat ships in until Kimia writes.
export function blankNarrationSlot(path) {
  setNarrationSlot(path, '')
}

// Put the real file back. Call in afterEach, always.
export function restoreNarration() {
  for (const key of Object.keys(NARRATION)) delete NARRATION[key]
  Object.assign(NARRATION, structuredClone(ORIGINAL))
}
