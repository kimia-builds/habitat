// The drawn drops (T3.2): one small code-drawn SVG per reveal family
// (spec §7 — all visuals SVG). Placeholder drawings until the real art
// pass (M5/T6.1); everything uses currentColor, so the surrounding
// component picks the stream's pastel — or its neon, for reveals.

const GLYPHS = {
  // A sprig of N-Z-D flora: a stem with three leaves.
  flora: (
    <>
      <path
        d="M12 22C12 15 12 9 12 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 16C8.5 15.4 6.4 12.8 6 9.5C9.4 10 11.6 12.6 12 16Z" />
      <path d="M12 11.5C15.5 10.9 17.6 8.3 18 5C14.6 5.5 12.4 8.1 12 11.5Z" />
      <path d="M12 7C10.2 6.6 9.1 5.2 8.8 3.2C10.6 3.5 11.7 4.9 12 7Z" />
    </>
  ),
  // A magazine: open pages with a centre fold.
  magazine: (
    <>
      <path
        d="M3 6.5C6 5 9 5 12 6.5C15 5 18 5 21 6.5V18.5C18 17 15 17 12 18.5C9 17 6 17 3 18.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.5V18.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5.5 9.5C7.5 8.8 9.5 8.8 10.5 9.2M13.5 9.2C14.5 8.8 16.5 8.8 18.5 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </>
  ),
  // A novel: a slim upright book with its spine.
  novel: (
    <>
      <rect
        x="6.5"
        y="3.5"
        width="11"
        height="17"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 3.5V20.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </>
  ),
  // A dictionary: a thick tome with page edges showing.
  dictionary: (
    <>
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 4.5V19.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M11 9H17M11 12H17M11 15H15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </>
  ),
  // Glowing fungi: a capped mushroom with spots.
  fungi: (
    <>
      <path d="M4 12C4 7.3 7.6 3.5 12 3.5C16.4 3.5 20 7.3 20 12H4Z" />
      <path
        d="M10 12C10 15.5 9.6 18 9 20.5H15C14.4 18 14 15.5 14 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="8.5" r="1" fill="#0b0e14" />
      <circle cx="14.5" cy="7" r="1" fill="#0b0e14" />
    </>
  ),
}

function DropGlyph({ kind, className = 'drop-glyph', ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      {...rest}
    >
      {GLYPHS[kind]}
    </svg>
  )
}

export default DropGlyph
