// The Map (T4.1) — pure logic, no React, no storage.
//
// The planet of N-Z-D reveals itself region by region as the
// expedition advances: 16 equal regions of MAP_REGION_STEPS steps
// each (Kimia's decision 2026-07-19). Everything here is DERIVED from
// completion history, the same principle as the meters (decision
// 2026-07-15): a completion's expedition step IS its position in the
// history, so undoing a completion pulls the frontier — and any
// landmark marker its find placed — back by itself, with nothing
// stored that could go stale.

import {
  LANDMARK_FLORA,
  MAP_REGION_COUNT,
  MAP_REGION_STEPS,
} from './constants.js'

function validateStep(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a whole number, zero or more.`)
  }
}

// Which region an expedition step falls in (0-based). Steps beyond the
// last region belong to the last region — the planet's ~5-year
// practical sizing (spec §5); T6.2's recalibration revisits the
// numbers if the real pace ever outgrows them.
export function regionForStep(stepIndex) {
  validateStep(stepIndex, 'stepIndex')
  return Math.min(
    Math.floor(stepIndex / MAP_REGION_STEPS),
    MAP_REGION_COUNT - 1,
  )
}

// How many regions this many total steps has come to know: the region
// the latest step reached, plus every one before it. Zero steps means
// the whole planet is still a faint outline.
export function discoveredRegionCount(totalSteps) {
  validateStep(totalSteps, 'totalSteps')
  if (totalSteps === 0) return 0
  return regionForStep(totalSteps - 1) + 1
}

// The day each known region was first stepped into, in discovery
// order: [{ region, dayKey }]. The dayKey is the day the discovering
// completion was DONE (date attribution as ever, spec §4.2) — a
// check-in mark that crossed a region boundary attributes the
// discovery to the day the habit actually happened.
export function regionDiscoveries(completions) {
  const discoveries = []
  for (let step = 0; step < completions.length; step++) {
    const region = regionForStep(step)
    if (region === discoveries.length) {
      discoveries.push({ region, dayKey: completions[step].dayKey })
    }
  }
  return discoveries
}

// Landmark flora markers (plumbing only until T6.1, Kimia's decision
// 2026-07-19): every flora find whose species is a landmark, placed in
// the region its expedition step falls in. The marker is permanent by
// construction — it exists exactly as long as the completion that
// dropped the find does, so only undoing that completion removes it
// (spec §5 Stream 1). Flora have no species until the T6.1 content
// pools, so with the default (empty) landmark set this returns []
// and the Map shows no markers yet.
export function landmarkMarkers(completions, landmarkSpecies = LANDMARK_FLORA) {
  const markers = []
  for (let step = 0; step < completions.length; step++) {
    const completion = completions[step]
    for (const drop of completion.drops) {
      if (drop.kind !== 'flora') continue
      if (!landmarkSpecies.has(drop.species)) continue
      markers.push({
        completionId: completion.id,
        species: drop.species,
        dayKey: completion.dayKey,
        stepIndex: step,
        region: regionForStep(step),
      })
    }
  }
  return markers
}
