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
import { useText } from './language.jsx'

function DateDisplay({ now, cutoffHour }) {
  const { t, language } = useText()
  return (
    <div className="date-display-block">
      <p className="date-display">{calendarDateLine(now, language)}</p>
      {beforeCutoff(now, cutoffHour) && (
        <p className="date-cutoff-note">
          {t('date.cutoffNote', {
            time: formatHourAmPm(cutoffHour, language),
          })}
        </p>
      )}
    </div>
  )
}

export default DateDisplay
