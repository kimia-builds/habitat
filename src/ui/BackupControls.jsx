// Export / import backup buttons (spec §8: manual backup insurance).
// Export downloads the whole data envelope as a JSON file; import asks
// App to handle the file's text (App owns the overwrite warning —
// plan.md T1.3: warn via storage's hasData() before replacing).
//
// Since T6.4a the age of the last backup is told too. It is the whole
// point of the feature: browser storage can be evicted, so an exported
// file is the only real safety net, and an unseen age is no safety net
// at all. It states a fact and stops there — no colour change, no
// urgency, no counting up of neglect.
//
// Kimia's call 2026-08-12: it stopped being a line of text BESIDE the
// button and became the button's own hover label, so the foot of the
// home screen is three clean buttons and nothing else. The fact is not
// gone — it is exactly where every other explanation in Habitat lives.

import { useRef, useState } from 'react'

import { backupAgeLabel } from '../game/backup.js'

function BackupControls({ onExport, onImport, lastExportedOn, todayKey }) {
  const fileInput = useRef(null)
  const [message, setMessage] = useState('')

  async function handleFile(event) {
    const file = event.target.files[0]
    event.target.value = '' // so picking the same file again still fires
    if (!file) return
    try {
      const outcome = await onImport(await file.text())
      setMessage(outcome)
    } catch (problem) {
      setMessage(problem.message)
    }
  }

  return (
    <div className="backup-controls">
      <button
        className="pebble"
        onClick={onExport}
        title={backupAgeLabel(lastExportedOn, todayKey)}
      >
        export backup
      </button>
      <button className="pebble" onClick={() => fileInput.current.click()}>
        import backup
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={handleFile}
        aria-label="backup file"
      />
      {message && <p role="status">{message}</p>}
    </div>
  )
}

export default BackupControls
