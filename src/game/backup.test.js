import { describe, expect, test } from 'vitest'

import { backupAgeLabel } from './backup.js'

describe('backupAgeLabel', () => {
  test('says so plainly when no backup has ever been taken', () => {
    expect(backupAgeLabel(null, '2026-08-06')).toBe('no backup yet')
  })

  test('treats a missing marker like no backup', () => {
    expect(backupAgeLabel(undefined, '2026-08-06')).toBe('no backup yet')
  })

  test('names today and yesterday rather than counting them', () => {
    expect(backupAgeLabel('2026-08-06', '2026-08-06')).toBe('backed up today')
    expect(backupAgeLabel('2026-08-05', '2026-08-06')).toBe(
      'backed up yesterday',
    )
  })

  test('counts whole days once it is older than that', () => {
    expect(backupAgeLabel('2026-08-04', '2026-08-06')).toBe(
      'backed up 2 days ago',
    )
    expect(backupAgeLabel('2026-07-07', '2026-08-06')).toBe(
      'backed up 30 days ago',
    )
  })

  test('counts across a month and a year boundary', () => {
    expect(backupAgeLabel('2026-07-30', '2026-08-06')).toBe(
      'backed up 7 days ago',
    )
    expect(backupAgeLabel('2025-12-28', '2026-01-04')).toBe(
      'backed up 7 days ago',
    )
  })

  test('counts across a spring-forward daylight-saving change', () => {
    // UK clocks go forward on 2026-03-29. Day keys are calendar days,
    // so the count must not be knocked off by the missing hour.
    expect(backupAgeLabel('2026-03-27', '2026-03-31')).toBe(
      'backed up 4 days ago',
    )
  })

  test('a backup dated in the future says something calm, not alarming', () => {
    // Possible after importing a file made on a machine whose clock or
    // timezone runs ahead. Never a scold, never a negative number.
    expect(backupAgeLabel('2026-08-09', '2026-08-06')).toBe('backed up')
  })

  test('never scolds, whatever the gap', () => {
    for (const day of ['2026-08-06', '2026-06-01', '2024-01-01', null]) {
      const label = backupAgeLabel(day, '2026-08-06')
      expect(label).not.toMatch(/should|must|!|overdue|warning|forgot/i)
    }
  })
})
