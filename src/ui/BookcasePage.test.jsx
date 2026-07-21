import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import BookcasePage from './BookcasePage.jsx'

afterEach(cleanup)

// One publication on the shelf, as game/bookcase.js's bookcaseItems
// resolves it (stored place or default slot, always complete).
const item = (id, type = 'magazine', over = {}) => ({
  id,
  type,
  dayKey: '2026-07-16',
  publicationId: null,
  x: 0.3,
  y: 0.99,
  facing: 'spine',
  ...over,
})

const handlers = () => ({
  onMove: vi.fn(),
  onFace: vi.fn(),
  onRead: vi.fn(),
  onBack: vi.fn(),
})

beforeAll(() => {
  // jsdom can't measure SVG; give the shelf a frame so drags have
  // somewhere to land. Clicks are guarded and work regardless.
  SVGSVGElement.prototype.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 240,
    height: 180,
    right: 240,
    bottom: 180,
    x: 0,
    y: 0,
    toJSON: () => {},
  })
})

describe('the constant bookshelf', () => {
  it('shows bare shelves when empty — no prose, no count', () => {
    const { container } = render(<BookcasePage items={[]} {...handlers()} />)
    expect(
      screen.getByRole('heading', { name: 'readers library' }),
    ).toBeDefined()
    expect(screen.getByRole('group', { name: 'the bookshelf' })).toBeDefined()
    expect(container.querySelectorAll('.bookshelf-plank')).toHaveLength(3)
    expect(container.querySelectorAll('p')).toHaveLength(0)
    expect(screen.queryByRole('button', { name: /a magazine/ })).toBeNull()
  })

  it('renders every publication as a spine', () => {
    render(
      <BookcasePage
        items={[item('c1:0', 'magazine'), item('c2:0', 'novel')]}
        {...handlers()}
      />,
    )
    expect(screen.getByRole('button', { name: 'a magazine' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'a novel' })).toBeDefined()
    // Nothing face-out yet: no read buttons anywhere.
    expect(screen.queryByRole('button', { name: /read/ })).toBeNull()
  })
})

describe('spine ↔ front', () => {
  it('a click (press without movement) turns a spine face-out', () => {
    const spies = handlers()
    render(<BookcasePage items={[item('c1:0')]} {...spies} />)
    const book = screen.getByRole('button', { name: 'a magazine' })
    fireEvent.pointerDown(book, { clientX: 20, clientY: 150 })
    fireEvent.pointerUp(window, { clientX: 20, clientY: 150 })
    expect(spies.onFace).toHaveBeenCalledWith('c1:0', 'front')
    expect(spies.onMove).not.toHaveBeenCalled()
  })

  it('the keyboard turns a book too', () => {
    const spies = handlers()
    render(<BookcasePage items={[item('c1:0')]} {...spies} />)
    fireEvent.keyDown(screen.getByRole('button', { name: 'a magazine' }), {
      key: 'Enter',
    })
    expect(spies.onFace).toHaveBeenCalledWith('c1:0', 'front')
  })

  it('a face-out cover shows the quiet eye, and a click elsewhere on the cover turns it back', () => {
    const spies = handlers()
    render(
      <BookcasePage
        items={[item('c1:0', 'novel', { facing: 'front' })]}
        {...spies}
      />,
    )
    expect(screen.getByRole('button', { name: 'read a novel' })).toBeDefined()
    const cover = screen.getByRole('button', { name: 'a novel' })
    fireEvent.pointerDown(cover, { clientX: 20, clientY: 150 })
    fireEvent.pointerUp(window, { clientX: 21, clientY: 150 })
    expect(spies.onFace).toHaveBeenCalledWith('c1:0', 'spine')
  })

  it('the eye opens the spread popup — and reading stores nothing (no facing flip)', () => {
    const spies = handlers()
    const front = item('c1:0', 'dictionary', { facing: 'front' })
    render(<BookcasePage items={[front]} {...spies} />)
    fireEvent.click(screen.getByRole('button', { name: 'read a dictionary' }))
    expect(spies.onRead).toHaveBeenCalledWith(front)
    expect(spies.onFace).not.toHaveBeenCalled()
    expect(spies.onMove).not.toHaveBeenCalled()
  })
})

describe('dragging', () => {
  it('commits the place as shelf fractions on pointer-up, clamped to the interior', () => {
    const spies = handlers()
    render(<BookcasePage items={[item('c1:0')]} {...spies} />)
    const book = screen.getByRole('button', { name: 'a magazine' })
    fireEvent.pointerDown(book, { clientX: 72, clientY: 150 })
    // A wiggle below the threshold is not a drag yet.
    fireEvent.pointerMove(window, { clientX: 73, clientY: 150 })
    // Then a real move: three quarters across, halfway down.
    fireEvent.pointerMove(window, { clientX: 180, clientY: 90 })
    fireEvent.pointerUp(window, { clientX: 180, clientY: 90 })
    expect(spies.onMove).toHaveBeenCalledWith('c1:0', { x: 0.75, y: 0.5 })
    expect(spies.onFace).not.toHaveBeenCalled()
  })

  it('never sends a place outside the shelf, even if the pointer leaves it', () => {
    const spies = handlers()
    render(<BookcasePage items={[item('c1:0')]} {...spies} />)
    const book = screen.getByRole('button', { name: 'a magazine' })
    fireEvent.pointerDown(book, { clientX: 72, clientY: 150 })
    fireEvent.pointerMove(window, { clientX: 400, clientY: -50 })
    fireEvent.pointerUp(window, { clientX: 400, clientY: -50 })
    expect(spies.onMove).toHaveBeenCalledWith('c1:0', { x: 1, y: 0 })
  })
})
