// One publication drawn on its own (2026-10-11): the T5.3n book, standing
// face-out in a little picture of its own, for the places a book appears
// away from the Bookcase — the arrival shelf and the first-time reveal.
// Kimia picked the front cover for both off an option sheet: the shelf at
// about the old icon's size, the reveal much larger.
//
// It is the same book the Bookcase will hold: the look comes from the
// publication's id (bookLook), and an arrival carries the very id its
// Bookcase entry has, so a drop arrives already wearing the shade it will
// keep on the shelf. Same shapes, same three-type size difference, same
// faint glow and gently wobbled edge as BookcasePage draws.

import { useId } from 'react'
import { BOOK_GLOW, bookArt, bookLook } from './bookArt.js'

// The Bookcase's book sizes, in its drawing units (BOOK_SHAPES there:
// height x 2.4, front cover 0.68 as wide as tall).
const COVER_HEIGHT = {
  magazine: 42 * 2.4,
  novel: 48 * 2.4,
  dictionary: 52 * 2.4,
}
const COVER_RATIO = 0.68
// Room round the book so its glow is not cut off.
const PAD = 6

// `remPerUnit` sets the size: how many rem one drawing unit becomes.
function BookFigure({ type, id, remPerUnit, className }) {
  const uid = useId().replace(/:/g, '')
  const height = COVER_HEIGHT[type]
  const width = height * COVER_RATIO
  const art = bookArt({
    type,
    facing: 'front',
    width,
    height,
    ...bookLook(id),
  })
  const boxWidth = width + PAD * 2
  const boxHeight = height + PAD * 2
  return (
    <svg
      className={className}
      viewBox={`${-boxWidth / 2} ${-height - PAD} ${boxWidth} ${boxHeight}`}
      style={{
        width: `${boxWidth * remPerUnit}rem`,
        height: `${boxHeight * remPerUnit}rem`,
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="2"
            floodColor={BOOK_GLOW[type]}
            floodOpacity="0.35"
          />
        </filter>
        <clipPath id={`${uid}-clip`}>
          <path d={art.outline} />
        </clipPath>
      </defs>
      <g>
        <path
          d={art.outline}
          fill={art.fill}
          fillOpacity="0.92"
          filter={`url(#${uid}-glow)`}
        />
        <path d={art.bandPath} fill={art.band} clipPath={`url(#${uid}-clip)`} />
        <path
          className="book-edge"
          d={art.outline}
          fill="none"
          stroke={art.ink}
        />
        {art.beads.map((bead, index) => (
          <circle
            key={index}
            cx={bead.cx}
            cy={bead.cy}
            r={bead.r}
            fill={bead.colour}
          />
        ))}
      </g>
    </svg>
  )
}

export default BookFigure
