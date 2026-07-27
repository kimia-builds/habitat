// mishap.js — the one message shown if Habitat ever hits an unexpected
// error and a screen can't finish drawing (the ErrorBoundary safety net,
// added 2026-07-27). Without it React unmounts everything and the page
// goes black with no explanation.
//
// THIS FILE IS KIMIA'S (design-notes §7): Claude Code builds the slot
// and the plumbing; the words are human-written. Unlike the other
// content slots, please don't leave this one blank — a blank slot here
// means a wordless screen, which is the very thing the net exists to
// prevent. Nothing is lost when this shows: your habits are saved, and
// a refresh returns to the habits list.

export const MISHAP = {
  // Written by Kimia, 2026-07-27.
  message:
    'something seems to have gone wrong: please inform the maker. ' +
    'refresh page to get back to habits.',
}

// The message text, trimmed, or null when the slot is blank — mirrors
// blockedMessage() in blocked.js.
export function mishapMessage() {
  const text = typeof MISHAP.message === 'string' ? MISHAP.message.trim() : ''
  return text === '' ? null : text
}
