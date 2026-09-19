const steps = [
  {
    num: '01',
    title: 'Upload',
    text: 'A photo or PDF of the notice. Handwritten, scanned, or typed — all readable.',
  },
  {
    num: '02',
    title: 'Understand',
    text: 'Each clause is matched against the actual Indian statute it comes from, not a generic dictionary.',
  },
  {
    num: '03',
    title: 'Act',
    text: 'A clear timeline of what to do, by when, and whether you need a lawyer at all.',
  },
]

export default function Steps() {
  return (
    <section className="steps" id="how">
      <div className="wrap">
        <div className="steps-head">
          <h2>From dense notice to clear next step</h2>
          <p>Three parts, working on the same document — no back and forth between tools.</p>
        </div>
        <div className="step-row">
          {steps.map((step) => (
            <div className="step" key={step.num}>
              <div className="num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
