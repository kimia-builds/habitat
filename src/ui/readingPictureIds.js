// readingPictureIds.js — which drawing each written picture description gets
// (T5.3o). The descriptions are Kimia's own words from readingTexts.js,
// matched without their brackets, capital or full stop; the ids are the
// drawings in readingPictures.jsx. Plain data, so no word sits in a screen
// file. Add a line here when a new description gets a drawing.

export const PICTURE_IDS = {
  'one star': 'star',
  'a luminous crystal': 'crystal',
  'a ghust of wind around tall cliffs': 'cliffs',
  'a bubbling mud-pool': 'mudpool',
  'one unif': 'unif',
  'a unif': 'unif',
  'a toom': 'toom',
  "the pataya's seasonal blossoms": 'blossoms',
  'a gubl and its bauble yields': 'gubl',
  'a plip': 'plip',
  'three plips': 'plips',
  'one baluhm': 'baluhm',
  'charm 1': 'charm-1',
  'charm 2': 'charm-2',
  'charm 3': 'charm-3',
  'charm 4': 'charm-4',
  'charm 5': 'charm-5',
  'charm 6': 'charm-6',
  'rail symbol 1': 'rail-1',
  'rail symbol 2': 'rail-2',
  'rail symbol 3': 'rail-3',
  'rail symbol 4': 'rail-4',
  'rail symbol 5': 'rail-5',
  'rail symbol 6': 'rail-6',
  'rail symbol 7': 'rail-7',
  'rail symbol 8': 'rail-8',
}

// '[A gubl and its bauble yields.]' -> 'a gubl and its bauble yields'
export function pictureName(description) {
  return String(description ?? '')
    .replace(/^\[|\]$/g, '')
    .replace(/\.$/, '')
    .trim()
    .toLowerCase()
}
