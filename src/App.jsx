import { useEffect, useRef, useState } from 'react'
import Lab from './Lab.jsx'

const FEATURES = [
  ['📄', 'Plain-language breakdown', 'Each clause explained in simple words, grounded in the Indian statute it comes from.', 'rgba(79,140,255,.14)'],
  ['🛡', 'Authenticity check', 'Flags scam signs: pressure language, missing case numbers, personal UPI payment demands.', 'rgba(251,191,36,.16)'],
  ['☎', 'Free legal aid', 'Serious cases show NALSA’s free helpline, 15100, so cost is never a barrier to getting help.', 'rgba(52,211,153,.16)'],
  ['₹', 'Lawyer cost estimate', 'A rough fee range for your case type, so you know what to expect before you call.', 'rgba(155,114,255,.16)'],
]
const BASICS = [
  ['01', 'Who sent it?', 'Sender, advocate or authority, and their standing to claim.', 'Check the sender’s address and details.', 'rgba(79,140,255,.18)', '#2563eb', '#2563eb'],
  ['02', 'What is claimed?', 'The exact amount, act or demand along with the law cited.', 'A demand should state the facts and the section clearly.', 'rgba(56,189,248,.18)', '#0284c7', '#38bdf8'],
  ['03', 'By when?', 'The reply window is stated in the notice, often 15 to 30 days from receipt.', 'Missing the deadline can weaken your position.', 'rgba(251,191,36,.18)', '#d97706', '#d97706'],
  ['04', 'What can I do?', 'Reply, negotiate, comply or contest, with proof ready.', 'Never ignore a notice. Keep a written reply.', 'rgba(52,211,153,.18)', '#059669', '#059669'],
]

function useNetwork(ref) {
  useEffect(() => {
    const cv = ref.current, x = cv.getContext('2d')
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let W, H, P = [], raf
    const m = { x: -999, y: -999 }
    const rs = () => {
      W = cv.width = innerWidth; H = cv.height = innerHeight
      P = Array.from({ length: Math.min(90, (W / 14) | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }))
    }
    const mv = (e) => { m.x = e.clientX; m.y = e.clientY }
    const draw = () => {
      x.clearRect(0, 0, W, H)
      for (const p of P) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        const dx = p.x - m.x, dy = p.y - m.y, r = Math.hypot(dx, dy)
        if (r < 120) { p.x += dx / r * 1.2; p.y += dy / r * 1.2 }
        x.fillStyle = 'rgba(99,102,241,.55)'; x.beginPath(); x.arc(p.x, p.y, 1.8, 0, 7); x.fill()
      }
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j], q = Math.hypot(a.x - b.x, a.y - b.y)
        if (q < 140) { x.strokeStyle = `rgba(99,102,241,${.25 * (1 - q / 140)})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke() }
      }
      raf = requestAnimationFrame(draw)
    }
    rs(); addEventListener('resize', rs); addEventListener('mousemove', mv); draw()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); removeEventListener('mousemove', mv) }
  }, [ref])
}

export default function App() {
  const bg = useRef(null)
  const [sample, setSample] = useState(0)
  const [prog, setProg] = useState(0)
  useNetwork(bg)

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('v'); io.unobserve(e.target) } }), { threshold: .12 })
    document.querySelectorAll('.rv').forEach((e, i) => { e.style.transitionDelay = (i % 4) * 90 + 'ms'; io.observe(e) })
    const sc = () => setProg(scrollY / Math.max(1, document.body.scrollHeight - innerHeight))
    addEventListener('scroll', sc)
    return () => { io.disconnect(); removeEventListener('scroll', sc) }
  }, [])

  const toLab = () => { location.hash = '#lab' }
  return (
    <>
      <canvas id="bg" ref={bg} />
      <div className="cube" style={{ width: 90, height: 90, left: '6%', top: '22%' }} />
      <div className="cube" style={{ width: 140, height: 140, right: '5%', top: '48%', animationDelay: '-5s' }} />
      <div className="cube" style={{ width: 70, height: 70, left: '44%', top: '78%', animationDelay: '-9s' }} />

      <nav>
        <a className="logo" href="#top">Vidhi<b>.</b> <b>Legal</b></a>
        <a href="#top">⌂ Hub</a><a href="#lab">◉ Explainer</a><a href="#basics">▤ Legal Basics</a><a href="#features">✦ Features</a><a href="#help">☎ Get Help</a>
        <span className="sp" />
        <button className="btn p" onClick={toLab}>Upload a notice</button>
      </nav>

      <main id="top">
        <div className="wrap">
          <div className="hero">
            <div className="badge rv"><i className="dot" /> AI LEGAL NOTICE EXPLAINER <span style={{ opacity: .4 }}>•</span> Simple language, in seconds ⚖️</div>
            <h1 className="rv">Understand Any<br />Legal <span className="grad">{'Notice'.split('').map((c, i) => <span key={i} style={{ animationDelay: -i * .4 + 's' }}>{c}</span>)}</span></h1>
            <p className="sub rv">Upload a legal notice and get a plain-language breakdown grounded in Indian law, an authenticity check, and your next steps. No jargon, no panic.</p>
            <div className="chips rv"><code>✦ OCR</code><code>Statute-grounded</code><code>Authenticity check</code><code>NALSA helpline 15100</code></div>
            <div className="cta rv">
              <button className="btn p" onClick={toLab}>Explain My Notice →</button>
              <button className="btn" onClick={() => { setSample((s) => s + 1); toLab() }}>Try Sample Notice <span className="tag">Free</span></button>
            </div>
          </div>
          <div className="grid4 rv" id="features">
            {FEATURES.map(([ic, t, p, bgc]) => (
              <div className="card" key={t}><div className="ic" style={{ background: bgc }}>{ic}</div><h3>{t}</h3><p>{p}</p></div>
            ))}
          </div>
        </div>

        <Lab sample={sample} />

        <section id="basics"><div className="wrap center">
          <span className="eyebrow rv">LEGAL BASICS</span>
          <h2 className="rv">Master the <em>Core Essentials</em></h2>
          <p className="lead rv">Four things to check on every notice before you reply.</p>
          <div className="num">
            {BASICS.map(([n, t, p, k, bgc, col, bd]) => (
              <div className="card rv" key={n}><span className="n" style={{ background: bgc, color: col }}>{n}</span><h3>{t}</h3><p>{p}</p>
                <div className="key" style={{ borderColor: bd, color: col }}><b>Key note:</b> {k}</div></div>
            ))}
          </div>
          <div className="banner rv" id="help">
            <div><b>Can’t afford a lawyer?</b><p>NALSA, the National Legal Services Authority, offers free legal aid. Call the toll-free helpline, 24x7.</p></div>
            <a className="btn p" href="tel:15100">Call 15100</a>
          </div>
        </div></section>
      </main>
      <footer>© 2026 Vidhi. Educational information only, not a substitute for professional legal advice.</footer>

      <button id="up" className={prog > 0 && scrollY > 400 ? 's' : ''} onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="none" stroke="rgba(15,23,42,.12)" strokeWidth="3" /><circle cx="24" cy="24" r="21" fill="none" stroke="#4f8cff" strokeWidth="3" strokeDasharray="132" strokeDashoffset={132 * (1 - prog)} strokeLinecap="round" /></svg>↑
      </button>
    </>
  )
}
