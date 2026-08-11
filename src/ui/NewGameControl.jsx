// "start a new game" (T6.6) — the door to a fresh planet that keeps
// every habit and every completion. Two guards, both Kimia's call
// (2026-08-11):
//
//   - it cannot be pressed until a backup has been exported IN THIS
//     visit. Not "today", not "recently": the point of the guard is
//     that the file on disk holds the world about to be discarded, and
//     only an export made just now can promise that. Until then the
//     button is disabled and says plainly why.
//   - pressing it still asks, naming exactly what goes and exactly
//     what stays, so nothing about the outcome is a surprise.
//
// Quiet by design (design-notes): no alarm colour, no shake, no
// tallying of what is about to be lost. It states the facts and waits.

import { useState } from 'react'

function NewGameControl({ backedUp, onStartNewGame }) {
  const [message, setMessage] = useState('')

  function handleClick() {
    const sure = window.confirm(
      'Start a new game?\n\n' +
        'GOES: the whole world — every flora, book, friend and fungus, ' +
        'everything bought at the market, your abode and bookcase ' +
        'arrangements, and the expedition trail. The world seed is ' +
        'replaced too, so the planet ahead is genuinely a different one.\n\n' +
        'STAYS: every habit, and every completion you have ever logged. ' +
        'Your grid, your streaks and your field notes are untouched.\n\n' +
        'The backup you just exported can put all of it back.',
    )
    if (!sure) return
    onStartNewGame()
    setMessage('a new game has begun — your habits and history are untouched')
  }

  return (
    <div className="new-game-control">
      <button
        className="pill-button"
        onClick={handleClick}
        disabled={!backedUp}
      >
        start a new game
      </button>
      {!backedUp && (
        <span className="new-game-note">export a backup first</span>
      )}
      {message && <p role="status">{message}</p>}
    </div>
  )
}

export default NewGameControl
