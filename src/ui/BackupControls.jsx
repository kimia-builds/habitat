// Export / import backup buttons (spec §8: manual backup insurance).
// Export downloads the whole data envelope as a JSON file; import asks
// App to handle the file's text (App owns the overwrite warning —
// plan.md T1.3: warn via storage's hasData() before replacing).
//
// Since T6.4a a quiet line sits beside the buttons saying how old the
// backup is. It is the whole point of the feature: browser storage can
// be evicted, so an exported file is the only real safety net, and an
// unseen age is no safety net at all. It states a fact and stops there
// — no colour change, no urgency, no counting up of neglect.

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
      <button className="pill-button" onClick={onExport}>
        export backup
      </button>
      <button className="pill-button" onClick={() => fileInput.current.click()}>
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
      <span className="backup-age">
        {backupAgeLabel(lastExportedOn, todayKey)}
      </span>
      {message && <p role="status">{message}</p>}
    </div>
  )
}

export default BackupControls
