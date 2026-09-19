import { useState, useRef } from 'react'

const API_BASE = 'http://localhost:8000'

export default function UploadTool() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  const stages = ['Reading the document...', 'Matching against Indian law...', 'Writing the explanation...']

  const setNewFile = (f) => {
    if (!f) return
    setFile(f)
    setResult(null)
    setError(null)
    if (f.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(f))
    } else {
      setPreviewUrl(null)
    }
  }

  const handleFileChange = (e) => setNewFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    setNewFile(f)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => setDragActive(false)

  const clearFile = () => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setLoadingStage(0)
    setError(null)
    setResult(null)

    const stageTimer = setInterval(() => {
      setLoadingStage((s) => (s < stages.length - 1 ? s + 1 : s))
    }, 1400)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE}/api/explain`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error(`Server responded with ${response.status}`)

      const data = await response.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch (err) {
      setError('Could not reach the server. Make sure the backend is running on localhost:8000.')
    } finally {
      clearInterval(stageTimer)
      setLoading(false)
    }
  }

  return (
    <section className="upload-tool" id="upload">
      <div className="wrap">
        <h2>Try it — upload a notice</h2>
        <p className="upload-sub">Runs against your local backend. Upload a photo or scan of any notice.</p>

        {!file ? (
          <label
            htmlFor="notice-file"
            className={`dropzone ${dragActive ? 'dropzone-active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="notice-file"
              className="upload-input"
            />
            <div className="dropzone-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 16V4M12 4L7 9M12 4l5 5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="dropzone-text">
              <strong>Drop a notice here</strong>
              <span>or click to browse — photo, scan or screenshot</span>
            </div>
          </label>
        ) : (
          <div className="file-card">
            {previewUrl ? (
              <img src={previewUrl} alt="Notice preview" className="file-thumb" />
            ) : (
              <div className="file-thumb file-thumb-generic">Doc</div>
            )}
            <div className="file-meta">
              <strong>{file.name}</strong>
              <span>{(file.size / 1024).toFixed(0)} KB</span>
            </div>
            <button className="file-remove" onClick={clearFile} aria-label="Remove file">✕</button>
          </div>
        )}

        <div className="upload-actions">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {loading ? 'Analyzing...' : 'Explain this notice'}
          </button>
          {file && !loading && (
            <button className="btn-ghost" onClick={clearFile}>Choose a different file</button>
          )}
        </div>

        {loading && (
          <div className="loading-panel">
            <div className="loading-bar"><div className="loading-bar-fill"></div></div>
            <p className="loading-stage">{stages[loadingStage]}</p>
          </div>
        )}

        {error && <div className="upload-error">{error}</div>}

        {result && (
          <div className="upload-result">
            <div className="result-block">
              <h3>Explanation</h3>
              <p className="result-explanation">{result.explanation}</p>
            </div>

            {result.relevant_statutes && result.relevant_statutes.length > 0 && (
              <div className="result-block">
                <h3>Relevant law</h3>
                <div className="statute-list">
                  {result.relevant_statutes.map((s) => (
                    <div className="statute-chip" key={s.id}>
                      <strong>{s.act} — {s.section}</strong>
                      <span>{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <details className="result-raw">
              <summary>Extracted text (OCR)</summary>
              <p>{result.extracted_text}</p>
            </details>
          </div>
        )}
      </div>
    </section>
  )
}
