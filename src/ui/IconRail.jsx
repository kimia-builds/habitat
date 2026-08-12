// The left icon rail (T4.5, spec §5b, design-notes §12d): icon buttons
// descending the left edge. Since 2026-07-21 (Kimia's call) it persists
// on EVERY screen but the check-in pop-up — whose done button stays the
// only exit — so the world pages are always one tap away.
// A rail, not a navbar — no background, no active state; faint at rest,
// each brightening to its own charm colour on hover (the CSS does that
// via the per-button classes; this file only names them).
//
// Since 2026-08-12 (Kimia's call) the rail carries EIGHT icons in two
// groups, and this file is the only place that knows the order:
//
//   the three doers, at the top — + (add a habit) · pencil (edit past
//     days) · graph (field notes). They used to sit in a row at the foot
//     of the habit list; they moved here whole, same order, same
//     conditions, and simply took the rail's own look: same 1.5rem
//     glyph, same 1.4 stroke, same dim-white rest, same brighten-and-
//     glow hover. Because the rail is on every screen but the check-in,
//     the two that only make sense at home carry themselves home first.
//   the five places, below — map · abode · community · library · market:
//     the two lived-in places under the planet, the two collections
//     below.
//
// Each button's hover label (its title, which is also its aria-label)
// is the page's display title, or the action's name. The three meters
// stay clickable alongside the rail (Kimia's call 2026-07-20): two doors
// to the same three pages.

// One rail button: its name on hover, and a small glyph in the charm
// style (design-notes §11a) — one or two simple strokes in currentColor,
// so the hover rule owns the colour. The button's aria-label names the
// destination, so the svg itself stays hidden from screen readers.
function RailButton({ className, title, onClick, children }) {
  return (
    <button
      type="button"
      className={`rail-icon ${className}`}
      title={title}
      aria-label={title}
      onClick={onClick}
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

function IconRail({ onOpen, onAddHabit, onEditPastDays, pastDaysEditable }) {
  const openPage = (page) => () => onOpen(page)
  return (
    <nav className="icon-rail" aria-label="pages">
      <RailButton
        className="rail-add"
        title="add new habit"
        onClick={onAddHabit}
      >
        {/* a plus: two crossed strokes, drawn like every other glyph */}
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </RailButton>
      {/* Only offered when there is a past day worth editing — exactly
          the condition it carried at the foot of the list. */}
      {pastDaysEditable && (
        <RailButton
          className="rail-past"
          title="edit past days"
          onClick={onEditPastDays}
        >
          {/* a pencil */}
          <path d="M4 20l1-4L16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1z" />
        </RailButton>
      )}
      <RailButton
        className="rail-notes"
        title="view historical data"
        onClick={openPage('fieldnotes')}
      >
        {/* a graph: an axis with a line climbing across it */}
        <path d="M4 4v16h16" />
        <path d="M7 15l4-5 3 3 4-6" />
      </RailButton>
      <RailButton
        className="rail-map"
        title="map of N-Z-D"
        onClick={openPage('map')}
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
        onClick={openPage('abode')}
      >
        {/* open ground under sky: a ground line, a small dome on it */}
        <line x1="4" y1="17" x2="20" y2="17" />
        <path d="M9 17 a3 3 0 0 1 6 0" />
      </RailButton>
      <RailButton
        className="rail-community"
        title="local community"
        onClick={openPage('guestbook')}
      >
        {/* two beings: two small overlapping circles */}
        <circle cx="9" cy="12" r="4.5" />
        <circle cx="15" cy="12" r="4.5" />
      </RailButton>
      <RailButton
        className="rail-library"
        title="readers library"
        onClick={openPage('bookcase')}
      >
        {/* a standing book: the cover with its centre spine line */}
        <rect x="6.5" y="4.5" width="11" height="15" rx="1" />
        <line x1="12" y1="4.5" x2="12" y2="19.5" />
      </RailButton>
      <RailButton
        className="rail-market"
        title="local market"
        onClick={openPage('market')}
      >
        {/* a stall: a scalloped awning line over the counter line */}
        <path d="M4 9 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0" />
        <line x1="5" y1="16" x2="19" y2="16" />
      </RailButton>
    </nav>
  )
}

export default IconRail
