import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const JSONH = { 'Content-Type': 'application/json' }
const SAMPLE = 'LEGAL NOTICE. Under instructions from our client, we serve upon you this notice under Section 138 of the Negotiable Instruments Act, 1881. Your cheque no. 010412 dated 27-07-2013 for Rs. 50,000/- drawn on Central Bank of India was returned unpaid by the bank for insufficient funds. You are called upon to pay the said amount within 15 days of receipt of this notice, failing which our client shall initiate criminal proceedings against you.'
const VERDICT = { no_red_flags: ['No red flags', 'var(--green)'], minor_concerns: ['Minor concerns', 'var(--amber)'], suspicious: ['Suspicious', 'var(--red)'] }
const STAGES = ['Reading the document…', 'Matching it against Indian law…', 'Writing the explanation…']

const post = (path, opts) =>
  fetch(API + path, { method: 'POST', ...opts }).then((r) => {
    if (!r.ok) throw new Error(r.status)
    return r.json()
  })

export default function Lab({ sample }) {
  const [file, setFile] = useState(null)
  const [prev, setPrev] = useState(null)
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState(0)
  const [err, setErr] = useState('')
  const [res, setRes] = useState(null)
  const [fraud, setFraud] = useState(null)

  const pick = (f) => {
    if (!f) return
    setFile(f); setRes(null); setFraud(null); setErr('')
    setPrev(f.type.startsWith('image/') ? URL.createObjectURL(f) : null)
  }
  const clear = () => { setFile(null); setPrev(null); setRes(null); setFraud(null); setErr('') }

  const go = async (req, srcText) => {
    setBusy(true); setErr(''); setRes(null); setFraud(null); setStage(0)
    const t = setInterval(() => setStage((s) => Math.min(s + 1, 2)), 1500)
    try {
      const d = await req()
      if (d.error) { setErr(d.error); return }
      setRes(d)
      try {
        setFraud(await post('/api/fraud-check', { headers: JSONH, body: JSON.stringify({ text: d.extracted_text || srcText || '' }) }))
      } catch { /* authenticity check is optional */ }
    } catch {
      setErr('Could not reach the server. Check that the backend is running, then try again.')
    } finally {
      clearInterval(t); setBusy(false)
    }
  }

  const runFile = () => go(() => { const f = new FormData(); f.append('file', file); return post('/api/explain', { body: f }) })
  const runSample = () => go(() => post('/api/explain/text', { headers: JSONH, body: JSON.stringify({ text: SAMPLE }) }), SAMPLE)

  useEffect(() => { if (sample > 0) runSample() }, [sample])

  const v = fraud && VERDICT[fraud.verdict]
  const c = res && res.cost_estimate
  return (
    <section id="lab"><div className="wrap">
      <span className="eyebrow rv">✦ NOTICE EXPLAINER</span>
      <h2 className="rv">Explain your <em>notice</em></h2>
      <p className="lead rv">Upload a photo or scan, or try the sample. You get a plain-language explanation based on the actual law, plus an authenticity check.</p>
      <div className="stats rv">
        <div><small>STATUTES MATCHED</small><b style={{ color: '#4f46e5' }}>{res ? res.relevant_statutes.length : '—'}</b></div>
        <div><small>AUTHENTICITY</small><b style={{ color: v ? v[1] : 'var(--mu)' }}>{v ? v[0] : '—'}</b></div>
        <div><small>LAWYER COST</small><b style={{ color: 'var(--amber)' }}>{c && c.range ? c.range : '—'}</b></div>
      </div>
      <div className="lab rv">
        <div className="panel" aria-live="polite">
          <h4>👁 Plain-Language Result</h4>
          {busy && <div className="ld"><div className="bar"><i /></div>{STAGES[stage]}</div>}
          {err && <p className="err">{err}</p>}
          {!res && !busy && !err && <p className="empty">Your explanation will appear here. Upload a notice or try the sample.</p>}
          {res && (
            <div className="res">
              <div className="plain">{res.explanation.replace(/\*\*/g, '')}</div>
              {res.legal_aid && (
                <div className="aid"><b>Can’t afford a lawyer?</b><br />{res.legal_aid.note}<br />
                  <a href="tel:15100">{res.legal_aid.helpline}</a> <small>{res.legal_aid.helpline_note}</small></div>
              )}
              {c && <p className="cost">{c.range ? <>Rough lawyer cost: <b>{c.range}</b>, {c.note} {c.disclaimer}</> : c.note}</p>}
              {fraud && fraud.flags.length > 0 && (<><h5>Authenticity flags</h5><ul className="flags">{fraud.flags.map((f) => <li key={f}>{f}</li>)}</ul></>)}
              <h5>Relevant law</h5>
              {res.relevant_statutes.map((s) => <div className="st" key={s.id}><b>{s.act}, {s.section}</b><span>{s.title}</span></div>)}
              {res.extracted_text && <details><summary>Extracted text (OCR)</summary><p>{res.extracted_text}</p></details>}
              <p className="note">This explains what a notice says. It is not legal advice.</p>
            </div>
          )}
        </div>
        <div className="panel">
          <h4>⚙ Your Notice</h4>
          {!file ? (
            <label className={'drop' + (drag ? ' on' : '')} onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]) }}>
              <input type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files[0])} />
              <b>Drop a notice here</b><span>or click to choose a photo, scan or screenshot</span>
            </label>
          ) : (
            <div className="fc">{prev && <img src={prev} alt="Notice preview" />}<div><b>{file.name}</b>{Math.round(file.size / 1024)} KB</div><button onClick={clear} aria-label="Remove file">✕</button></div>
          )}
          <div className="acts">
            <button className="btn p" disabled={!file || busy} onClick={runFile}>{busy ? 'Analyzing…' : 'Explain this notice'}</button>
            <button className="btn" disabled={busy} onClick={runSample}>Try sample notice</button>
          </div>
          <p className="note">Your notice is read by our server and sent to Google’s Gemini API to write the explanation.</p>
        </div>
      </div>
    </div></section>
  )
}
