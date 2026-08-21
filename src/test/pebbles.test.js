// The pebbles stay a decided set (design-notes §11e, 2026-08-12).
//
// "Button" means nothing useful in this codebase: the charms are buttons,
// so are the meters, the drops, the friend cards, the wordmark and every
// icon in the rail. The PEBBLES are the ones that say what they do in
// words or numbers — save, cancel, +1, -1, the tick, buy, done, close,
// back to the habits, and their kin — and they are meant to be changeable
// as one family, which only works while every one of them wears
// `.pebble`.
//
// The failure mode this test exists for is silent: someone adds a button,
// styles it by hand or not at all, nothing looks broken, and the family
// quietly stops being a family. So every <button> in the app must be
// classified — either it is a pebble, or its class is on the list below
// of things that deliberately are not one. A new button that is neither
// fails the suite, and the fix is a one-line decision: make it a pebble,
// or add it here with its reason.
//
// Like tokens.test.js this reads the source as text: no rendering, no
// knowledge of Kimia's content, so it can never break the deploy on one
// of her edits.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

// Every .jsx under src/, tests excluded — walked by hand rather than
// pulling in a glob dependency for four lines of work.
function componentFiles(dir = 'src') {
  const found = []
  for (const entry of readdirSync(join(process.cwd(), dir), {
    withFileTypes: true,
  })) {
    const path = `${dir}/${entry.name}`
    if (entry.isDirectory()) found.push(...componentFiles(path))
    else if (entry.name.endsWith('.jsx') && !entry.name.includes('.test.'))
      found.push(path)
  }
  return found
}

// Not a pebble, on purpose. Each entry says why, because the reason is
// the actual rule — the list is only its bookkeeping.
const NOT_PEBBLES = {
  // Drawings you press. A pebble speaks; these show.
  'symbol-button': 'a charm — a drawing, and a drawing needs no frame',
  'icon-button':
    'icon-only furniture: the eye, edit, archive, unarchive, delete. ' +
    'The eye is a LENS by family (design-notes §11f) rather than an ' +
    'action, but it is furniture on a tile and dresses like the pencil ' +
    'and the box it sits beside (T6.23a, 2026-08-21)',
  'lens-word':
    'a word lens (design-notes §11f) — today, un-hide all and their kin. ' +
    'A pebble acts on the world and settles; a lens only changes how the ' +
    'habit list is being LOOKED at, so it wears no frame of its own ' +
    '(T6.23b, 2026-08-21)',
  'rail-icon': 'the left rail — icons as furniture, never a navbar',
  'arrival-hold': 'the drop object itself, pressed to hold it',
  'cameo-press':
    "the friend's visit itself, pressed to go and see the record it is " +
    'about — a bare hit area over a drawing and its caption, and the ' +
    'visit shows nothing else (2026-08-20)',
  'guestbook-friend': 'a friend card — the friend IS the button',
  meter: 'a meter bar, pressed for its bare number',
  'home-link': 'the HABITAT wordmark, dressed as a button',
  'empty-tile': 'a whole tile-shaped invitation, not a control',
  // States rather than actions: these hold something on or off, and a
  // pebble does a thing and settles.
  'zoom-button': 'a graph zoom — a toggle set, with a pressed state',
  'abode-mode-switch': 'party mode — a switch, not an action',
  'abode-sky-swatch':
    "one of the Abode's four skies — the sky IS the button, and the four " +
    'are one radio group answering one question, never four actions',
  // The one moment Habitat is allowed to shout (design-notes §5): this
  // button belongs to the reveal and wears its neon, not the chrome's.
  'reveal-button': 'dismisses a first-occurrence reveal or friend arrival',
  // A deliberately faint door, quieter than anything around it.
  'door-link': 'the workbench door at the foot of the home screen',
}

// `<button …>` openings, with whatever className they carry.
const BUTTONS = /<button\b(?:=>|[^>])*>/gs
const CLASS = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/

function classesOf(tag) {
  const found = tag.match(CLASS)
  if (!found) return []
  const value = found[1] ?? found[2] ?? found[3] ?? ''
  // `charm-${symbol}` and friends: strip the interpolations, keep the
  // plain class names around them.
  return value
    .replace(/\$\{[^}]*\}/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

describe('the pebbles (design-notes §11e)', () => {
  const files = componentFiles()

  it('finds the app, not an empty list', () => {
    // A walk that silently found nothing would make every check below
    // pass while testing nothing at all.
    expect(files.length).toBeGreaterThan(20)
  })

  it('every button is either a pebble or a documented non-pebble', () => {
    const unclassified = []
    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      for (const tag of source.match(BUTTONS) ?? []) {
        const classes = classesOf(tag)
        if (classes.includes('pebble')) continue
        if (classes.some((name) => name in NOT_PEBBLES)) continue
        // The offender is reported with its file and its opening tag, so
        // the decision to make is obvious from the failure alone.
        unclassified.push(`${file}: ${tag.replace(/\s+/g, ' ').slice(0, 90)}`)
      }
    }
    expect(unclassified).toEqual([])
  })

  it('the counter circles are pebbles first, circles second', () => {
    // `.pebble-counter` only reshapes; everything that makes it a pebble
    // — the font, the edge, the dilution — comes from `.pebble`. Wearing
    // the modifier alone would look right today and drift tomorrow.
    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      for (const tag of source.match(BUTTONS) ?? []) {
        const classes = classesOf(tag)
        if (classes.includes('pebble-counter')) {
          expect(classes, `${file}: ${tag}`).toContain('pebble')
        }
      }
    }
  })

  it('the one pebble that is not a <button> still wears the family', () => {
    // The to-do tick is an <input type="checkbox"> — the only pebble the
    // scan above cannot see. It is the third face of the counter trio, so
    // it has to carry the classes by hand or it silently drifts out of a
    // family it is supposed to match exactly.
    for (const file of files) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      for (const [, classes] of source.matchAll(
        /className="([^"]*todo-check[^"]*)"/g,
      )) {
        expect(classes.split(/\s+/), file).toEqual(
          expect.arrayContaining(['pebble', 'pebble-counter']),
        )
      }
    }
  })

  it('the stylesheet still dresses the whole family from one place', () => {
    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    expect(css).toMatch(/^\.pebble \{/m)
    expect(css).toMatch(/^\.pebble-counter \{/m)
    // The point of the family: one dial softens every edge (§11b).
    const family = css.slice(css.indexOf('\n.pebble {'))
    expect(family).toContain('--button-edge-strength')
  })
})

// A CONTROL UNDER A pointer-events: none ANCESTOR MUST TURN THEM BACK
// ON (2026-08-20).
//
// The cameo's press shipped dead: `.cameo` disables pointer events for
// the whole visit — right, and still right, because a celebration must
// never come between a finger and the habit underneath — and the press
// inherited that. It took no clicks and showed no pointer cursor, and
// Kimia found it rather than any test here.
//
// It hid because of HOW it was checked. A component test fires its
// click straight at the element, and jsdom does no hit-testing or
// pointer-events at all; the live check called .click() in JavaScript.
// Both bypass this property completely, so no amount of clicking in a
// test can ever prove a control is reachable by a real finger.
//
// This reads the stylesheet as text instead, the way the rest of this
// file does — the one check that CAN see the property. Anything
// pressable that lives inside a switched-off box belongs on the list.
describe('controls inside a switched-off box', () => {
  const REVIVED = {
    'cameo-press': 'lives inside .cameo, which switches pointer events off',
  }

  it('turn pointer events back on for themselves', () => {
    const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8')
    for (const [name, why] of Object.entries(REVIVED)) {
      const start = css.indexOf(`\n.${name} {`)
      expect(start, `${name}: ${why} — but has no rule of its own`).not.toBe(-1)
      const rule = css.slice(start, css.indexOf('\n}', start))
      expect(rule, `${name}: ${why}`).toContain('pointer-events: auto')
    }
  })
})
