// blocked.js — the reader for the one message shown when Habitat is
// opened on a screen too narrow for its layout (spec §3, the T5.1b width
// gate). Habitat is built for wide screens; below MIN_APP_WIDTH (740px
// since 2026-08-12) the whole app is replaced by this.
//
// THE WORDS NO LONGER LIVE HERE. Since T6.14 slice 3 the message is the
// `blocked.message` entry in the copy deck, src/content/ui.js — edit it
// there. Left blank, the block screen simply shows nothing rather than
// inventing copy, so this slot is worth filling.
//
// Blank-rule: a safety screen, so it follows the INTERFACE rule (a blank
// in another language falls back to English) and sits in the interface
// half of the deck.

import { UI } from './ui.js'

export const BLOCKED = {
  message: UI.en['blocked.message'],
}

// The message text, trimmed, or null when the slot is still blank — so
// the screen shows nothing rather than an empty paragraph or invented
// copy (mirrors narrationSlot in narration.js).
export function blockedMessage() {
  const text = typeof BLOCKED.message === 'string' ? BLOCKED.message.trim() : ''
  return text === '' ? null : text
}
