import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import AbodePage from './AbodePage.jsx'

afterEach(cleanup)

// One flora find, as game/flora.js's floraFinds reports it.
const find = (completionId, status) => ({
  completionId,
  habitId: 'h1',
  dayKey: '2026-07-16',
  status,
})

// One gathered flora on the ground, as game/abode.js's abodeItems
// resolves it (stored place or default spot) — since T4.3b carrying a
// kind and the single id the layout map keys on.
const item = (completionId, over = {}) => ({
  ...find(completionId, 'gathered'),
  kind: 'flora',
  id: completionId,
  x: 0.3,
  y: 0.58,
  ...over,
})

// One owned market object on the ground (T4.3b), keyed by its purchase id.
const objectItem = (id, over = {}) => ({
  kind: 'object',
  id,
  objectKey: '0:1',
  price: 12,
  boughtAt: 5000,
  x: 0.3,
  y: 0.58,
  ...over,
})

const handlers = () => ({
  onDecide: vi.fn(),
  onMove: vi.fn(),
  onSell: vi.fn(),
  onBack: vi.fn(),
})

beforeAll(() => {
  // jsdom can't measure SVG; give the scene a frame so drags have
  // somewhere to land. Clicks are guarded and work regardless.
  SVGSVGElement.prototype.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 240,
    height: 160,
    right: 240,
    bottom: 160,
    x: 0,
    y: 0,
    toJSON: () => {},
  })
})

describe('the open ground', () => {
  it('shows bare ground when empty — no prose, no count', () => {
    const { container } = render(
      <AbodePage finds={[]} items={[]} {...handlers()} />,
    )
    expect(screen.getByRole('heading', { name: 'the Abode' })).toBeDefined()
    expect(screen.getByRole('group', { name: 'the ground' })).toBeDefined()
    expect(container.querySelector('.abode-horizon')).not.toBeNull()
    expect(container.querySelectorAll('p')).toHaveLength(0)
    expect(screen.queryByRole('button', { name: 'a flora find' })).toBeNull()
  })

  it('stands every gathered flora on the ground — no found dates anywhere', () => {
    render(
      <AbodePage
        finds={[find('c1', 'gathered'), find('c2', 'gathered')]}
        items={[item('c1'), item('c2', { x: 0.7 })]}
        {...handlers()}
      />,
    )
    expect(
      screen.getAllByRole('button', { name: 'a flora find' }),
    ).toHaveLength(2)
    expect(screen.queryByText(/found/)).toBeNull()
  })
})

describe('the waiting list', () => {
  it('keeps undecided flora apart from the ground, with gather / leave it', () => {
    const spies = handlers()
    render(<AbodePage finds={[find('c1', 'pending')]} items={[]} {...spies} />)
    expect(
      screen.getByRole('list', { name: 'waiting to decide' }),
    ).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'gather' }))
    expect(spies.onDecide).toHaveBeenCalledWith('c1', 'gathered')
    fireEvent.click(screen.getByRole('button', { name: 'leave it' }))
    expect(spies.onDecide).toHaveBeenCalledWith('c1', 'left')
  })

  it('shows no list at all when nothing is waiting', () => {
    render(
      <AbodePage
        finds={[find('c1', 'gathered')]}
        items={[item('c1')]}
        {...handlers()}
      />,
    )
    expect(screen.queryByRole('list', { name: 'waiting to decide' })).toBeNull()
  })
})

describe('holding and composting', () => {
  it('a click (press without movement) holds a flora, revealing its name and the quiet compost button', () => {
    const spies = handlers()
    render(
      <AbodePage
        finds={[find('c1', 'gathered')]}
        items={[item('c1')]}
        {...spies}
      />,
    )
    expect(screen.queryByRole('button', { name: 'compost' })).toBeNull()
    const flora = screen.getByRole('button', { name: 'a flora find' })
    fireEvent.pointerDown(flora, { clientX: 72, clientY: 90 })
    fireEvent.pointerUp(window, { clientX: 72, clientY: 90 })
    expect(screen.getByRole('button', { name: 'compost' })).toBeDefined()
    expect(spies.onMove).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'compost' }))
    expect(spies.onDecide).toHaveBeenCalledWith('c1', 'composted')
    // The button went with the hold — no lingering controls.
    expect(screen.queryByRole('button', { name: 'compost' })).toBeNull()
  })

  it('the keyboard holds a flora too', () => {
    render(
      <AbodePage
        finds={[find('c1', 'gathered')]}
        items={[item('c1')]}
        {...handlers()}
      />,
    )
    fireEvent.keyDown(screen.getByRole('button', { name: 'a flora find' }), {
      key: 'Enter',
    })
    expect(screen.getByRole('button', { name: 'compost' })).toBeDefined()
  })

  it('a click on the held flora — or on the empty ground — lets it settle back', () => {
    render(
      <AbodePage
        finds={[find('c1', 'gathered')]}
        items={[item('c1')]}
        {...handlers()}
      />,
    )
    const flora = screen.getByRole('button', { name: 'a flora find' })
    fireEvent.pointerDown(flora, { clientX: 72, clientY: 90 })
    fireEvent.pointerUp(window, { clientX: 72, clientY: 90 })
    expect(screen.getByRole('button', { name: 'compost' })).toBeDefined()

    // Clicking the held flora again releases it.
    fireEvent.pointerDown(flora, { clientX: 72, clientY: 90 })
    fireEvent.pointerUp(window, { clientX: 72, clientY: 90 })
    expect(screen.queryByRole('button', { name: 'compost' })).toBeNull()

    // Hold once more, then press the empty ground: released again.
    fireEvent.pointerDown(flora, { clientX: 72, clientY: 90 })
    fireEvent.pointerUp(window, { clientX: 72, clientY: 90 })
    fireEvent.pointerDown(screen.getByRole('group', { name: 'the ground' }))
    expect(screen.queryByRole('button', { name: 'compost' })).toBeNull()
  })
})

describe('dragging', () => {
  it('commits the place as scene fractions on pointer-up, clamped in', () => {
    const spies = handlers()
    render(
      <AbodePage
        finds={[find('c1', 'gathered')]}
        items={[item('c1')]}
        {...spies}
      />,
    )
    const flora = screen.getByRole('button', { name: 'a flora find' })
    fireEvent.pointerDown(flora, { clientX: 72, clientY: 93 })
    // A wiggle below the threshold is not a drag yet.
    fireEvent.pointerMove(window, { clientX: 73, clientY: 93 })
    // Then a real move: three quarters across, halfway down.
    fireEvent.pointerMove(window, { clientX: 180, clientY: 80 })
    fireEvent.pointerUp(window, { clientX: 180, clientY: 80 })
    expect(spies.onMove).toHaveBeenCalledWith('c1', { x: 0.75, y: 0.5 })
    // A drag is not a click: nothing got held.
    expect(screen.queryByRole('button', { name: 'compost' })).toBeNull()
  })

  it('never sends a place outside the scene, even if the pointer leaves it', () => {
    const spies = handlers()
    render(
      <AbodePage
        finds={[find('c1', 'gathered')]}
        items={[item('c1')]}
        {...spies}
      />,
    )
    const flora = screen.getByRole('button', { name: 'a flora find' })
    fireEvent.pointerDown(flora, { clientX: 72, clientY: 93 })
    fireEvent.pointerMove(window, { clientX: 400, clientY: -50 })
    fireEvent.pointerUp(window, { clientX: 400, clientY: -50 })
    expect(spies.onMove).toHaveBeenCalledWith('c1', { x: 1, y: 0 })
  })
})

describe('owned objects on the ground (T4.3b)', () => {
  it('stands an owned object among the flora, named a curiosity', () => {
    render(
      <AbodePage
        finds={[find('c1', 'gathered')]}
        items={[item('c1'), objectItem('p1')]}
        worldSeed="seed"
        {...handlers()}
      />,
    )
    expect(screen.getByRole('button', { name: 'a flora find' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'a curiosity' })).toBeDefined()
  })

  it('a click holds an object, revealing its name and the quiet sell button — never compost', () => {
    const spies = handlers()
    render(
      <AbodePage
        finds={[]}
        items={[objectItem('p1')]}
        worldSeed="seed"
        {...spies}
      />,
    )
    expect(screen.queryByRole('button', { name: 'sell' })).toBeNull()
    const object = screen.getByRole('button', { name: 'a curiosity' })
    fireEvent.pointerDown(object, { clientX: 72, clientY: 90 })
    fireEvent.pointerUp(window, { clientX: 72, clientY: 90 })
    expect(screen.getByRole('button', { name: 'sell' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'compost' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'sell' }))
    expect(spies.onSell).toHaveBeenCalledWith('p1')
    // The button went with the hold — no lingering controls.
    expect(screen.queryByRole('button', { name: 'sell' })).toBeNull()
    // And a sell never touches the flora decisions.
    expect(spies.onDecide).not.toHaveBeenCalled()
  })

  it('drags an object like any flora — onMove with its purchase id', () => {
    const spies = handlers()
    render(
      <AbodePage
        finds={[]}
        items={[objectItem('p1')]}
        worldSeed="seed"
        {...spies}
      />,
    )
    const object = screen.getByRole('button', { name: 'a curiosity' })
    fireEvent.pointerDown(object, { clientX: 72, clientY: 93 })
    fireEvent.pointerMove(window, { clientX: 180, clientY: 80 })
    fireEvent.pointerUp(window, { clientX: 180, clientY: 80 })
    expect(spies.onMove).toHaveBeenCalledWith('p1', { x: 0.75, y: 0.5 })
  })
})
