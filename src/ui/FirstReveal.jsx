// The first-occurrence reveals (T3.2): each of the five drop families
// introduces itself the first time it ever arrives (spec §5 "How
// rewards arrive"). This is where the neon POP lives (spec §7) — the
// one place bright colour is allowed to shout. The overlay waits to be
// dismissed; nothing fades on its own.

import DropGlyph from './DropGlyph.jsx'

const REVEALS = {
  flora: {
    stream: 'flora',
    title: 'your first flora find',
    line:
      'Something growing, right where you passed — the first plant of ' +
      'N-Z-D you have come to know. The land has plenty more to show you.',
  },
  magazine: {
    stream: 'reading',
    title: 'your first magazine',
    line:
      'Printed pages in the local script. You cannot read much yet — ' +
      'but the pictures help, and it goes straight to your bookcase.',
  },
  novel: {
    stream: 'reading',
    title: 'your first novel',
    line:
      'A whole story in the language of N-Z-D. One day you will read ' +
      'it cover to cover. It waits on your bookcase.',
  },
  dictionary: {
    stream: 'reading',
    title: 'your first dictionary',
    line:
      'A rare treasure: the language of N-Z-D, explained in its own ' +
      'words. Your bookcase will never hold anything more precious.',
  },
  fungi: {
    stream: 'fungi',
    title: 'your first fungi',
    line:
      'Glowing mushrooms — the currency here. They go straight to ' +
      'your wallet, ready for the market one day.',
  },
}

function FirstReveal({ arrival, onDismiss }) {
  const reveal = REVEALS[arrival.key]
  return (
    <div className="reveal-overlay" role="dialog" aria-label={reveal.title}>
      <div className={`reveal reveal-${reveal.stream}`}>
        <DropGlyph kind={arrival.key} className="reveal-glyph" />
        <h2 className="reveal-title">{reveal.title}</h2>
        <p className="reveal-line">{reveal.line}</p>
        <button className="reveal-button" onClick={onDismiss}>
          onward
        </button>
      </div>
    </div>
  )
}

export default FirstReveal
