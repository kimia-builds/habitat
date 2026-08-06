// Keeps the README's Status section honest.
//
// The README drifted badly once (it still said "early days — in M1"
// long after M4 shipped) because CLAUDE.md's end-of-session doc-sync
// rule listed plan.md, spec.md, design-notes.md and history.md — but
// not the README. A rule alone had already failed, so this is the
// safety net: if the README names a different milestone than the one
// plan.md is actually working on, the suite fails and the deploy stops.
//
// Deliberately narrow. It reads ONE fact out of each file — the
// milestone id — so it can only be broken by ticking a plan.md
// checkbox, which only ever happens in a coding session. Kimia edits
// her content files (src/content/) straight on GitHub; nothing she
// touches can break this test. That rule matters: a test coupled to
// her edits silently blocks her own changes from going live.

// Paths are resolved from the project root (where `npm test` runs), not
// from this file: tests run in a jsdom sandbox where `import.meta.url`
// is an http:// address, which node:fs won't read.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const root = process.cwd()
const plan = readFileSync(join(root, 'plan.md'), 'utf8')
const readme = readFileSync(join(root, 'README.md'), 'utf8')

// Walk plan.md top to bottom, remembering the most recent milestone
// heading ("## M5 — Design pass …"), and stop at the first unticked
// task ("- [ ] **T5.2 …"). That milestone is the current one.
function currentMilestoneInPlan() {
  let milestone = null
  for (const line of plan.split('\n')) {
    const heading = line.match(/^## (M\d+)\b/)
    if (heading) milestone = heading[1]
    if (/^- \[ \] /.test(line) && milestone) return milestone
  }
  return null
}

// The README declares which milestone it describes in one marker
// comment, sitting directly above the prose that describes it.
function declaredMilestoneInReadme() {
  return readme.match(/<!-- current-milestone: (M\d+) -->/)?.[1] ?? null
}

describe('README status stays in step with plan.md', () => {
  test('plan.md still has an unticked task under a milestone heading', () => {
    // If this fails the whole project is finished, which would be lovely
    // — retire this file rather than papering over it.
    expect(currentMilestoneInPlan()).toMatch(/^M\d+$/)
  })

  test('the README carries its current-milestone marker', () => {
    expect(declaredMilestoneInReadme()).toMatch(/^M\d+$/)
  })

  test('the marker names the milestone plan.md is working on', () => {
    expect(declaredMilestoneInReadme()).toBe(currentMilestoneInPlan())
  })

  test('the Status prose names that milestone too', () => {
    const status = readme.slice(readme.indexOf('## Status'))
    expect(status).toContain(declaredMilestoneInReadme())
  })
})
