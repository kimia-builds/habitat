// blocked.js — the one message shown when Habitat is opened on a screen
// narrower than desktop (spec §3, the T5.1b device gate). Habitat is
// desktop/laptop only; below 1024px the whole app is replaced by this.
//
// THIS FILE IS KIMIA'S (design-notes §7): Claude Code builds the slot
// and the plumbing; the words are human-written. Put your message
// between the quotes. Left blank, the block screen simply shows nothing
// rather than inventing copy — so this slot is worth filling.

export const BLOCKED = {
  // TODO: written by Kimia — the message a phone/tablet visitor sees.
  message: 'N-Z-D is currently only a habitat that can be experienced on a big browser, like a laptop or desktop computer. check back in on the big screen!',
}

// The message text, trimmed, or null when the slot is still blank — so
// the screen shows nothing rather than an empty paragraph or invented
// copy (mirrors narrationSlot in narration.js).
export function blockedMessage() {
  const text = typeof BLOCKED.message === 'string' ? BLOCKED.message.trim() : ''
  return text === '' ? null : text
}
