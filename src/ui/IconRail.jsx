// The left icon rail (T4.5, spec §5b, design-notes §12d): five icon
// buttons descending the left edge of the home screen. A rail, not a
// navbar — no background, no active state; faint at rest, each
// brightening to its own charm colour on hover (the CSS does that via
// the per-button classes; this file only names them).
//
// The order is Kimia's — map · abode · community · library · market:
// the two lived-in places under the planet, the two collections below.
// Each button's hover label (its title, which is also its aria-label)
// is the page's display title. The three meters stay clickable
// alongside the rail (Kimia's call 2026-07-20): two doors to the same
// three pages.

// One rail button: the page's display title on hover, and a small glyph
// in the charm style (design-notes §11a) — one or two simple strokes in
// currentColor, so the hover rule owns the colour. The button's
// aria-label names the destination, so the svg itself stays hidden
// from screen readers.
function RailButton({ className, title, page, onOpen, children }) {
  return (
    <button
      type="button"
      className={`rail-icon ${className}`}
      title={title}
      aria-label={title}
      onClick={() => onOpen(page)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  )
}

function IconRail({ onOpen }) {
  return (
    <nav className="icon-rail" aria-label="pages">
      <RailButton
        className="rail-map"
        title="map of N-Z-D"
        page="map"
        onOpen={onOpen}
      >
        {/* a planet: a circle with a tilted elliptical ring around it */}
        <circle cx="12" cy="12" r="5" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="3.5"
          transform="rotate(-20 12 12)"
        />
      </RailButton>
      <RailButton
        className="rail-abode"
        title="your abode"
        page="abode"
        onOpen={onOpen}
      >
        {/* open ground under sky: a ground line, a small dome on it */}
        <line x1="4" y1="17" x2="20" y2="17" />
        <path d="M9 17 a3 3 0 0 1 6 0" />
      </RailButton>
      <RailButton
        className="rail-community"
        title="local community"
        page="guestbook"
        onOpen={onOpen}
      >
        {/* two beings: two small overlapping circles */}
        <circle cx="9" cy="12" r="4.5" />
        <circle cx="15" cy="12" r="4.5" />
      </RailButton>
      <RailButton
        className="rail-library"
        title="readers library"
        page="bookcase"
        onOpen={onOpen}
      >
        {/* a standing book: the cover with its centre spine line */}
        <rect x="6.5" y="4.5" width="11" height="15" rx="1" />
        <line x1="12" y1="4.5" x2="12" y2="19.5" />
      </RailButton>
      <RailButton
        className="rail-market"
        title="local market"
        page="market"
        onOpen={onOpen}
      >
        {/* a stall: a scalloped awning line over the counter line */}
        <path d="M4 9 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0" />
        <line x1="5" y1="16" x2="19" y2="16" />
      </RailButton>
    </nav>
  )
}

export default IconRail
