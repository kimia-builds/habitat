// A controlled fixture for the friend-name slots (T6.1a).
//
// The names in `src/content/names.js` are Kimia's, and she edits them
// straight on GitHub. So no test may depend on what they actually say —
// or on whether they are blank yet. That trap has bitten this project
// twice: a test quoting her words broke CI in July, and one asserting a
// slot was EMPTY broke the deploy the moment she filled it. Since a
// failing suite blocks the deploy, a content-coupled test silently stops
// her own edits from going live.
//
// So every test that needs a friend to have (or not have) a name sets it
// here and restores afterwards. Tests assert the behaviour — a name
// shows, a blank shows nothing — never a particular word.

import { NAMES } from '../content/names.js'

const ORIGINAL = structuredClone(NAMES)

// Give one species a name for the duration of a test.
export function setSpeciesName(key, name) {
  NAMES.species[key] = name
}

// Give one individual friend a name. `individual` is 1-based.
export function setIndividualName(key, individual, name) {
  NAMES.individuals[key][individual] = name
}

// Wipe every slot — the state Habitat ships in until Kimia writes.
export function blankAllNames() {
  for (const key of Object.keys(NAMES.species)) NAMES.species[key] = ''
  for (const roster of Object.values(NAMES.individuals)) {
    for (const n of Object.keys(roster)) roster[n] = ''
  }
}

// Put the real file back. Call in afterEach, always.
export function restoreNames() {
  NAMES.species = structuredClone(ORIGINAL.species)
  NAMES.individuals = structuredClone(ORIGINAL.individuals)
}
