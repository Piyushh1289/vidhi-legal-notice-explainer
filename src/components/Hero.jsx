import Reveal from './Reveal.jsx'

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <Reveal>
          <h1>Every legal notice, explained in words you actually use.</h1>
          <p className="lede">
            Upload any notice or legal document. Get a plain-language breakdown
            grounded in Indian law — what it means, whether it's genuine, and
            what you need to do next.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#upload">Upload your notice</a>
            <a className="btn-ghost" href="#modules">See how it works</a>
          </div>
          <p className="hero-note">Free to check authenticity. No account needed for a first read.</p>
        </Reveal>

        <Reveal delay={150}>
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="browser-url">vidhi.app/explain</div>
            </div>
            <div className="browser-body">
              <div className="doc-raw">
                "...take notice that unless the aforesaid amount is remitted within
                a period of <span className="tag">fifteen days</span> from the
                receipt hereof, our client shall be constrained to initiate
                proceedings under Section 138 of the Negotiable Instruments Act,
                1881, without further reference to you..."
              </div>

              <div className="arrow-down">
                <span className="line"></span>
                <span>explained</span>
                <span className="line"></span>
              </div>

              <div className="doc-clear">
                <div className="label">What this means</div>
                <ul>
                  <li><span className="dot"></span> This is about a bounced cheque — the sender can take you to court if unpaid.</li>
                  <li><span className="dot"></span> You're being asked to pay the cheque amount, not fined separately.</li>
                  <li><span className="dot"></span> Ignoring this can lead to a criminal case under Section 138.</li>
                </ul>
                <div className="deadline">Respond by: 15 days from when you received this notice</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
