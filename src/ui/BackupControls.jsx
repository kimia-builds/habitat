// Export / import backup buttons (spec §8: manual backup insurance).
// Export downloads the whole data envelope as a JSON file; import asks
// App to handle the file's text (App owns the overwrite warning —
// plan.md T1.3: warn via storage's hasData() before replacing).

import { useRef, useState } from 'react'

function BackupControls({ onExport, onImport }) {
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
      <button onClick={onExport}>export backup</button>
      <button onClick={() => fileInput.current.click()}>import backup</button>
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
