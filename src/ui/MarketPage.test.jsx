import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import MarketPage from './MarketPage.jsx'

afterEach(cleanup)

// One catalogue object, as game/market.js's stallObjects hands them over.
const object = (key, price) => {
  const [region, objectIndex] = key.split(':').map(Number)
  return { key, region, objectIndex, price }
}

const handlers = () => ({
  onBuy: vi.fn(),
  onBack: vi.fn(),
})

const stall = [object('0:0', 6), object('0:1', 12), object('0:2', 18)]

describe('the stall', () => {
  it('shows every offered object with its price in fungi', () => {
    render(
      <MarketPage
        stall={stall}
        purchases={[]}
        wallet={30}
        worldSeed="seed"
        {...handlers()}
      />,
    )
    expect(screen.getByRole('heading', { name: 'local market' })).toBeDefined()
    const items = screen.getByRole('list', { name: 'the stall' }).children
    expect(items).toHaveLength(3)
    for (const price of [6, 12, 18]) {
      expect(
        screen.getByRole('button', {
          name: `buy a curiosity for ${price} fungi`,
        }),
      ).toBeDefined()
    }
  })

  it('shows a bare stall when nothing is on offer — no prose, no count', () => {
    const { container } = render(
      <MarketPage
        stall={[]}
        purchases={[]}
        wallet={0}
        worldSeed="seed"
        {...handlers()}
      />,
    )
    expect(screen.getByRole('heading', { name: 'local market' })).toBeDefined()
    expect(screen.queryByRole('list')).toBeNull()
    expect(container.querySelectorAll('p')).toHaveLength(0)
    expect(screen.queryByRole('button', { name: /buy/ })).toBeNull()
  })

  it('a buy calls onBuy with the object itself', () => {
    const spies = handlers()
    render(
      <MarketPage
        stall={stall}
        purchases={[]}
        wallet={12}
        worldSeed="seed"
        {...spies}
      />,
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'buy a curiosity for 12 fungi' }),
    )
    expect(spies.onBuy).toHaveBeenCalledWith(stall[1])
  })

  it('dims the buy button for what the wallet cannot reach — no alarm', () => {
    render(
      <MarketPage
        stall={stall}
        purchases={[]}
        wallet={10}
        worldSeed="seed"
        {...handlers()}
      />,
    )
    expect(
      screen.getByRole('button', { name: 'buy a curiosity for 6 fungi' })
        .disabled,
    ).toBe(false)
    expect(
      screen.getByRole('button', { name: 'buy a curiosity for 12 fungi' })
        .disabled,
    ).toBe(true)
    expect(
      screen.getByRole('button', { name: 'buy a curiosity for 18 fungi' })
        .disabled,
    ).toBe(true)
  })

  it('says quietly how many copies are already owned — duplicates allowed', () => {
    const purchases = [
      { id: 'p1', objectKey: '0:1', price: 12, boughtAt: 1 },
      { id: 'p2', objectKey: '0:1', price: 12, boughtAt: 2 },
    ]
    render(
      <MarketPage
        stall={stall}
        purchases={purchases}
        wallet={30}
        worldSeed="seed"
        {...handlers()}
      />,
    )
    expect(screen.getByText('×2 at home')).toBeDefined()
    // Owning copies never takes the object off the stall.
    expect(
      screen.getByRole('button', { name: 'buy a curiosity for 12 fungi' })
        .disabled,
    ).toBe(false)
  })
})
