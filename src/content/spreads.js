// spreads.js — which picture belongs to which publication (T3.5).
//
// THIS FILE IS KIMIA'S, like narration.js: the double-page spreads are
// pictures you provide (photograph / scan / collage — never
// AI-generated, design-notes §7), and only images you have the right
// to publish in this public repo.
//
// To add a spread:
//   1. put the image file in the repo's  public/spreads/  folder
//      (create the folder if it doesn't exist yet)
//   2. add a line inside SPREADS below, like:
//        'publication-id': 'spreads/your-file.jpg',
//
// The publication ids arrive with the T6.1 content pools — until
// publications have names, nothing can be listed here and the app
// shows its quiet empty state instead. A publication left out (or
// left blank) simply has no spread yet: nothing breaks, nothing is
// invented.

export const SPREADS = {
  // 'example-publication-id': 'spreads/example.jpg',
}

// The spread image path for one publication, or null when there isn't
// one (no id yet, no entry, or a blank entry) — so callers show the
// empty state rather than a broken image.
export function spreadFor(publicationId, table = SPREADS) {
  if (typeof publicationId !== 'string') return null
  const path = table[publicationId]
  if (typeof path !== 'string') return null
  const trimmed = path.trim()
  return trimmed === '' ? null : trimmed
}
