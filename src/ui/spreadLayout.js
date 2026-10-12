// spreadLayout.js — how one open spread is laid out (T6.24, Kimia's call
// 2026-10-12, settled by eye on a trial page). Pure and tiny so it can be
// tested; the drawing itself is in SpreadPopup.jsx and index.css.
//
// The rules:
//   - A spread is ONE landscape page by default.
//   - The fold down the middle exists only when there is something for
//     two pages to do: a picture AND words together (picture on the left
//     page, words on the right), or words long enough to fill two columns.
//   - Words are set big when they are a single short word, medium for a
//     short line, small for a longer passage (so it can fit its page).

// Longer than this many characters and a words-only text pours into two
// columns with a fold between them. Tunable by eye.
export const LONG_TEXT_CHARS = 100

// Up to this many characters counts as "a single short word" (set big);
// up to MEDIUM_TEXT_CHARS is a line (set medium); beyond is a passage.
export const WORD_CHARS = 14
export const MEDIUM_TEXT_CHARS = 60

// { fold, size } for a publication's picture + text (either may be null).
//   fold: 'none' | 'pages' (picture + words) | 'columns' (long words)
//   size: 'big' | 'mid' | 'small'
export function spreadLayout({ picture, text }) {
  const length = text ? text.length : 0
  if (picture && text) {
    return { fold: 'pages', size: length <= WORD_CHARS ? 'big' : 'mid' }
  }
  if (text && length > LONG_TEXT_CHARS) {
    return { fold: 'columns', size: 'small' }
  }
  const size =
    length <= WORD_CHARS ? 'big' : length <= MEDIUM_TEXT_CHARS ? 'mid' : 'small'
  return { fold: 'none', size }
}
