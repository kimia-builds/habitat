// The drawn blob (T5.2e, Kimia's call 2026-08-13) — the shape language
// the Map's regions already speak, rather than a clean card.
//
// Three outlines authored ONCE in one 120×44 frame and stretched to
// whatever they are laid over. `border-radius` cannot do this and was
// tried: a wide, short box rounds into a clean lozenge whatever the
// eight percentages say.
//
// Lifted out of ArrivalShelf.jsx on 2026-08-16, when Kimia asked for the
// cameo's friend to sit in one too. Two places drawing the same shape
// from two tables is how a shape language stops being one.

// The outlines. Uneven on purpose — a region of ground, not a pill.
const BLOBS = [
  'M122.5,22.0C123.3,25.7 114.6,30.7 107.1,33.8C99.6,36.9 88.1,39.2 77.3,40.4C66.5,41.5 54.1,41.4 42.6,40.5C31.1,39.6 14.5,38.0 8.5,34.9C2.5,31.8 5.7,26.1 6.5,22.0C7.3,17.9 7.4,13.6 13.3,10.3C19.1,7.0 30.6,3.6 41.5,2.3C52.3,1.0 68.3,0.9 78.4,2.4C88.6,4.0 95.0,8.1 102.3,11.4C109.7,14.7 121.7,18.3 122.5,22.0Z',
  'M124.4,22.0C123.3,25.7 108.3,28.9 100.6,32.2C93.0,35.5 88.4,40.0 78.5,41.6C68.6,43.3 51.9,43.4 41.1,42.1C30.2,40.7 18.8,37.0 13.4,33.7C7.9,30.3 9.5,26.2 8.4,22.0C7.3,17.8 1.1,11.7 6.8,8.7C12.5,5.6 31.0,4.4 42.6,3.6C54.3,2.8 66.2,2.9 76.9,4.0C87.7,5.1 99.3,7.2 107.2,10.2C115.1,13.2 125.5,18.3 124.4,22.0Z',
  'M113.3,22.0C112.5,26.0 111.7,30.1 106.0,33.5C100.4,37.0 90.0,41.4 79.4,42.6C68.8,43.8 52.9,42.2 42.5,40.6C32.0,39.0 24.4,35.9 16.8,32.8C9.3,29.7 -2.0,25.8 -2.7,22.0C-3.5,18.2 4.5,12.9 12.2,10.0C19.9,7.1 32.5,5.8 43.5,4.5C54.6,3.3 67.1,1.8 78.3,2.6C89.5,3.4 104.8,6.1 110.7,9.3C116.5,12.5 114.0,18.0 113.3,22.0Z',
]

// Which of the three something wears — from its own id, so it is the
// same blob every render, and two side by side rarely match.
function blobFor(id) {
  let sum = 0
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i)
  return BLOBS[sum % BLOBS.length]
}

// Decoration only: it carries no words, so it is hidden from screen
// readers wherever it is used. `className` is how each caller sizes and
// places it — the drawing is shared, the placing is not.
function Blob({ id, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 44"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={blobFor(id)} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default Blob
