// mishap.js — the reader for the one message shown if Habitat ever hits
// an unexpected error and a screen can't finish drawing (the
// ErrorBoundary safety net, added 2026-07-27). Without it React unmounts
// everything and the page goes black with no explanation.
//
// THE WORDS NO LONGER LIVE HERE. Since T6.14 slice 3 the message is the
// `mishap.message` entry in the copy deck, src/content/ui.js — edit it
// there. Please don't leave it blank: a blank slot here means a wordless
// screen, which is the very thing the net exists to prevent. Nothing is
// lost when this shows: your habits are saved, and a refresh returns to
// the habits list.
//
// Blank-rule: this is a safety screen, so it follows the INTERFACE rule
// (a blank in another language falls back to English). It sits in the
// interface half of the deck for that reason.

import { UI } from './ui.js'

export const MISHAP = {
  message: UI.en['mishap.message'],
}

// The message text, trimmed, or null when the slot is blank — mirrors
// blockedMessage() in blocked.js.
export function mishapMessage() {
  const text = typeof MISHAP.message === 'string' ? MISHAP.message.trim() : ''
  return text === '' ? null : text
}
