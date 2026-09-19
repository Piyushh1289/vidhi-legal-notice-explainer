import { IconShieldSearch, IconDocumentText } from './icons.jsx'

export default function Modules() {
  return (
    <section className="modules" id="modules">
      <div className="wrap">
        <p className="kicker">Two tools, one place</p>
        <h2>Check if a notice is real, or understand it in full — start with whichever you need.</h2>
        <div className="module-grid">
          <div className="module-card">
            <div className="module-icon"><IconShieldSearch /></div>
            <h3>Authenticity Checker</h3>
            <p>Verify a notice against known formats, reference-number patterns and common scam templates before you react to it.</p>
            <div className="who">For anyone who first needs to know: is this even real?</div>
          </div>
          <div className="module-card">
            <div className="module-icon"><IconDocumentText /></div>
            <h3>Full Notice Explainer</h3>
            <p>A section-by-section breakdown of what the notice claims, which law it cites, and what your options are.</p>
            <div className="who">For anyone who needs to actually respond to it.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
