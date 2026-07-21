// The date display (T4.5): the REAL calendar date in large letterspaced
// type at the top of the home screen (Kimia's call 2026-07-20; spec §5b
// "The date display", design-notes §12b). It is ceremony, not
// information — display-only, nothing clickable. The letterspacing is
// CSS's job; the text itself holds plain single spaces, so screen
// readers read it naturally.
//
// The quiet note underneath appears only between midnight and the day
// cutoff: the one moment the calendar date and the habit list beneath
// it disagree (the list is still yesterday's). It is the app being
// honest about that, and its words are built from cutoffHour, so they
// always track the configured cutoff. All maths lives in days.js —
// this component only renders.

import { beforeCutoff, calendarDateLine, formatHourAmPm } from '../game/days.js'

function DateDisplay({ now, cutoffHour }) {
  return (
    <div className="date-display-block">
      <p className="date-display">{calendarDateLine(now)}</p>
      {beforeCutoff(now, cutoffHour) && (
        <p className="date-cutoff-note">
          your habits will switch to a new day at {formatHourAmPm(cutoffHour)}
        </p>
      )}
    </div>
  )
}

export default DateDisplay
