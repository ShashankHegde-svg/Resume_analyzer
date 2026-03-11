import { useState, useRef } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function UploadScreen({ onResult }) {
  const [pasteMode, setPasteMode] = useState(false)
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') { setFile(f); setError('') }
    else setError('Only PDF files are accepted.')
  }

  const handleFileInput = (e) => {
    const f = e.target.files[0]
    if (f) { setFile(f); setError('') }
  }

  const analyze = async () => {
    setError('')
    setLoading(true)
    try {
      let res
      if (pasteMode) {
        res = await axios.post(`${API}/analyze/text`, {
          resume_text: resumeText,
          job_description: jdText
        })
      } else {
        const form = new FormData()
        form.append('resume', file)
        form.append('job_description', jdText)
        res = await axios.post(`${API}/analyze/upload`, form)
      }
      onResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const loadDemo = async (persona) => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API}/demo/${persona}`)
      onResult(res.data)
    } catch {
      setError('Could not load demo. Is the backend running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  const canAnalyze = pasteMode
    ? resumeText.trim() && jdText.trim()
    : file && jdText.trim()

  if (loading) return (
    <div className="loading-screen">
      <div className="orbit" />
      <p>Analyzing your skills...</p>
    </div>
  )

  return (
    <div className="upload-screen">
      <div className="hero">
        <div className="logo-badge">
          <div className="logo-dot" />
          CareerLens AI — Powered by Skill Intelligence
        </div>
        <h1>
          Don't just find<br />
          <span className="gradient-text">the gap. Bridge it.</span>
        </h1>
        <p>Upload your resume and paste a job description. Get your match score and a personalized 30-day learning roadmap.</p>
      </div>

      <div className="input-panel">
        {/* Resume Card */}
        <div className="glass-card">
          <div className="card-label"><span>📄</span> Your Resume</div>

          {!pasteMode ? (
            <>
              <div
                className={`drop-zone ${dragging ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <div className="drop-icon">{file ? '✅' : '🚀'}</div>
                {file
                  ? <p className="file-name">{file.name}</p>
                  : <>
                      <p>Drag & drop your PDF here</p>
                      <p style={{ fontSize: 12, marginTop: 4 }}>or click to browse</p>
                    </>
                }
                <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileInput} />
              </div>
              <button className="toggle-btn" onClick={() => setPasteMode(true)}>
                Paste text instead →
              </button>
            </>
          ) : (
            <>
              <textarea
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                style={{ minHeight: 180 }}
              />
              <button className="toggle-btn" onClick={() => setPasteMode(false)}>
                ← Upload PDF instead
              </button>
            </>
          )}
        </div>

        {/* JD Card */}
        <div className="glass-card">
          <div className="card-label"><span>🎯</span> Job Description</div>
          <textarea
            placeholder="Paste the full job description here — required skills, responsibilities, etc..."
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            style={{ minHeight: 230 }}
          />
        </div>
      </div>

      {error && (
        <div style={{ color: '#f87171', fontSize: 14, textAlign: 'center', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', padding: '10px 20px', borderRadius: 10 }}>
          ⚠️ {error}
        </div>
      )}

      <div className="actions">
        <button className="analyze-btn" onClick={analyze} disabled={!canAnalyze}>
          ✦ Analyze My Resume
        </button>

        <div className="demo-row">
          <span className="demo-label">Try a demo:</span>
          <button className="demo-btn" onClick={() => loadDemo('fresher')}>👨‍🎓 Fresher</button>
          <button className="demo-btn" onClick={() => loadDemo('midlevel')}>👨‍💻 Mid-Level</button>
          <button className="demo-btn" onClick={() => loadDemo('switcher')}>🔄 Career Switcher</button>
        </div>
      </div>
    </div>
  )
}