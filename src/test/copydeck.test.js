// The copy deck stays COMPLETE (T6.14 slice 4, 2026-10-09).
//
// Every word Habitat says lives in src/ui/ui.js, so a word can be changed
// — or translated — in one place without hunting through components. That
// only stays true if nobody quietly types a word straight into a screen.
// The failure mode is silent: a new button says "undo" in English, the
// English screen looks perfect, and the Farsi screen shows one stray
// English word nobody notices until a Farsi speaker does.
//
// So this test reads every component the way the app does (with a real
// parser, not a text search, so it sees words inside conditions and
// template strings too) and fails when it finds a word that is not read
// from the deck. It looks at:
//   - text sitting between tags:           <p>hello</p>
//   - the attributes a person reads or a screen reader speaks:
//     aria-label, title, placeholder, alt …
//   - words chosen inside braces:          {done ? 'done' : 'not yet'}
//   - any sentence-like string in a component (two or more words), which
//     catches a word parked in a variable before it is shown.
//
// When it fails, the fix is one of two decisions: add the word to ui.js
// and read it from there (almost always right), or — if it genuinely never
// reaches a user — add it to the short list below WITH ITS REASON.
//
// Like pebbles.test.js and tokens.test.js this reads source as text: no
// rendering, no knowledge of Kimia's content.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { parseSync, Visitor } from 'rolldown/utils'
import { describe, expect, it } from 'vitest'

// Attributes whose value a person reads or hears.
const SHOWN_ATTRIBUTES = new Set([
  'aria-label',
  'aria-description',
  'aria-roledescription',
  'aria-valuetext',
  'title',
  'placeholder',
  'alt',
  'label',
])

// A "word": two or more letters in a row, Latin or Persian. Single
// letters and symbols (+, -1, ✓, ←) are marks, not words.
const hasWord = (text) => /[A-Za-z؀-ۿ]{2,}/.test(text)
// A "sentence": two words with a space between them.
const hasSentence = (text) => /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(text)
// A list of CSS class names parked in a variable ("abode-flora-art held"):
// every piece lower-case, and at least one hyphenated. Code, not words.
const isClassList = (text) => {
  const pieces = text.trim().split(/\s+/)
  return (
    pieces.every((piece) => /^[a-z0-9_]+(-[a-z0-9_]+)*$/.test(piece)) &&
    pieces.some((piece) => piece.includes('-'))
  )
}

// Returns every hardcoded user-facing string in a piece of JSX source, as
// { line, kind, text }. Exported only to this file's own self-checks.
export function findHardcodedWords(source, { sentences = true } = {}) {
  const program = parseSync('component.jsx', source, { lang: 'jsx' }).program
  const lineOf = (offset) => source.slice(0, offset).split('\n').length
  const found = new Map()
  const add = (node, kind, text) =>
    found.set(`${node.start}:${kind}`, {
      line: lineOf(node.start),
      kind,
      text: text.trim(),
    })

  // Places a word cannot reach a screen, collected as source ranges:
  // console lines, <style> blocks (CSS), and the value of any attribute
  // that is not a shown one (className, style, d, viewBox … hold code).
  const silent = []
  const isSilent = (node) =>
    silent.some(([start, end]) => node.start >= start && node.end <= end)
  const attributeContainers = new Set()

  // The strings a braces-expression might display: the string itself, a
  // template, either branch of a condition, the right side of && / ||, or
  // pieces joined with +.
  function strings(node, kind) {
    if (!node) return
    if (node.type === 'Literal' && typeof node.value === 'string') {
      if (hasWord(node.value)) add(node, kind, node.value)
    } else if (node.type === 'TemplateLiteral') {
      const text = node.quasis.map((q) => q.value.cooked).join('')
      if (hasWord(text)) add(node, kind, text)
    } else if (node.type === 'ConditionalExpression') {
      strings(node.consequent, kind)
      strings(node.alternate, kind)
    } else if (node.type === 'LogicalExpression') {
      strings(node.right, kind)
    } else if (node.type === 'BinaryExpression' && node.operator === '+') {
      strings(node.left, kind)
      strings(node.right, kind)
    }
  }

  // First pass: mark the silent ranges. (A visitor sees an outer node
  // before its children, so one pass is enough for the attribute ranges,
  // but console calls can sit anywhere — keep it simple and do two.)
  new Visitor({
    CallExpression(node) {
      const callee = node.callee
      if (
        callee.type === 'MemberExpression' &&
        callee.object.name === 'console'
      )
        silent.push([node.start, node.end])
    },
    JSXAttribute(node) {
      if (!SHOWN_ATTRIBUTES.has(node.name.name) && node.value)
        silent.push([node.value.start, node.value.end])
    },
    JSXElement(node) {
      if (node.openingElement.name.name === 'style')
        silent.push([node.start, node.end])
    },
  }).visit(program)

  new Visitor({
    JSXText(node) {
      if (hasWord(node.value)) add(node, 'text', node.value)
    },
    JSXAttribute(node) {
      if (node.value?.type === 'JSXExpressionContainer')
        attributeContainers.add(node.value)
      if (!SHOWN_ATTRIBUTES.has(node.name.name) || !node.value) return
      if (node.value.type === 'Literal') strings(node.value, node.name.name)
      else if (node.value.type === 'JSXExpressionContainer')
        strings(node.value.expression, node.name.name)
    },
    JSXExpressionContainer(node) {
      if (!attributeContainers.has(node) && !isSilent(node))
        strings(node.expression, 'braces')
    },
    Literal(node) {
      if (
        sentences &&
        typeof node.value === 'string' &&
        hasSentence(node.value) &&
        !isClassList(node.value) &&
        !isSilent(node)
      )
        add(node, 'sentence', node.value)
    },
  }).visit(program)

  return [...found.values()].sort((a, b) => a.line - b.line)
}

// Every .jsx under src/, tests excluded.
function componentFiles(dir = 'src') {
  const files = []
  for (const entry of readdirSync(join(process.cwd(), dir), {
    withFileTypes: true,
  })) {
    const path = `${dir}/${entry.name}`
    if (entry.isDirectory()) files.push(...componentFiles(path))
    else if (entry.name.endsWith('.jsx') && !entry.name.includes('.test.'))
      files.push(path)
  }
  return files
}

// Files that deliberately hold English words outside the deck. Each says
// why, because the reason is the actual rule — the list is only bookkeeping.
const NOT_IN_THE_DECK = {
  'src/ui/DesignPage.jsx':
    'the design workbench — a private tool for Kimia and the assets, stays ' +
    'English by decision (its door slot says so); never part of the game',
}
// Files exempt from the sentence check only (their screens are still
// scanned for text, labels and braces).
const CATALOGUE_DATA = {
  'src/ui/sky.jsx':
    'the sky asset catalogue ("shared night sky", usage notes) — ' +
    'workbench listing data, shown only on the design page',
  'src/ui/textures.jsx':
    'the texture catalogue ("weathered rock", usage notes) — workbench ' +
    'listing data, shown only on the design page',
}

describe('the copy deck is complete', () => {
  it('no component types a user-facing word straight into a screen', () => {
    const problems = []
    for (const file of componentFiles()) {
      if (file in NOT_IN_THE_DECK) continue
      const hits = findHardcodedWords(readFileSync(file, 'utf8'), {
        sentences: !(file in CATALOGUE_DATA),
      })
      for (const hit of hits)
        problems.push(
          `${file}:${hit.line} (${hit.kind}) ${JSON.stringify(hit.text)}`,
        )
    }
    // An empty list is the pass. A non-empty one names each stray word so
    // the fix is a one-line decision: add it to ui.js, or list it above.
    expect(problems).toEqual([])
  })

  it('the exemption lists name files that exist', () => {
    const files = new Set(componentFiles())
    for (const file of [
      ...Object.keys(NOT_IN_THE_DECK),
      ...Object.keys(CATALOGUE_DATA),
    ])
      expect(files.has(file), `${file} no longer exists`).toBe(true)
  })
})

// The scan is only worth trusting if it is seen to catch a new word and to
// leave alone the things that are not words.
describe('the scan itself', () => {
  const kinds = (source) => findHardcodedWords(source).map((hit) => hit.kind)

  it('catches a word between tags', () => {
    expect(kinds('const a = <p>undo that</p>')).toEqual(['text'])
  })
  it('catches a word in a label a screen reader speaks', () => {
    expect(kinds('const a = <button aria-label="close">x</button>')).toEqual([
      'aria-label',
    ])
  })
  it('catches a word chosen inside a condition', () => {
    expect(kinds("const a = <p>{done ? 'done' : t('pending')}</p>")).toEqual([
      'braces',
    ])
  })
  it('catches a sentence parked in a variable', () => {
    expect(kinds("const note = 'nothing here yet'")).toEqual(['sentence'])
  })
  it('leaves words that are read from the deck alone', () => {
    expect(kinds("const a = <p aria-label={t('x')}>{t('y')} {n}</p>")).toEqual(
      [],
    )
  })
  it('leaves marks, numbers and symbols alone', () => {
    expect(kinds('const a = <button>+1</button>')).toEqual([])
    expect(kinds('const a = <span>← ✓ -1 · 12</span>')).toEqual([])
  })
  it('leaves code-only attributes (class names, drawing paths) alone', () => {
    expect(
      kinds(
        "const a = <svg viewBox='0 0 10 10' className={`pebble ${x ? 'wide shape' : ''}`} />",
      ),
    ).toEqual([])
  })
  it('leaves CSS blocks and class lists in variables alone', () => {
    expect(kinds('const a = <style>{`.box { color: red; }`}</style>')).toEqual(
      [],
    )
    expect(kinds("const c = held ? 'flora-art held' : 'flora-art'")).toEqual([])
  })
  it('leaves console lines alone — they never reach a screen', () => {
    expect(kinds("console.error('it went wrong here', e)")).toEqual([])
  })
})
