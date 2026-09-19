import { IconStatute, IconClock, IconShieldCheck, IconGlobe, IconLifeBuoy, IconWallet } from './icons.jsx'

const features = [
  {
    icon: <IconStatute />,
    title: 'Statute-grounded meaning',
    text: 'Every term is explained against the actual Act and Section it comes from — not a generic dictionary definition.',
  },
  {
    icon: <IconClock />,
    title: 'Action timeline',
    text: 'What deadline applies, what happens if you miss it, and what your next concrete step is.',
  },
  {
    icon: <IconShieldCheck />,
    title: 'Confidence indicator',
    text: "When a clause is genuinely ambiguous, we say so — and flag when a lawyer's read is worth getting.",
  },
  {
    icon: <IconGlobe />,
    title: 'Regional language support',
    text: 'Explanations in Hindi and other regional languages, alongside the original English text.',
  },
  {
    icon: <IconLifeBuoy />,
    title: 'Free legal aid routing',
    text: "Serious cases are pointed to NALSA's free legal aid scheme, with what to bring and who to contact.",
  },
  {
    icon: <IconWallet />,
    title: 'Cost estimate',
    text: 'If a lawyer is genuinely needed, an honest sense of what that typically costs — before you commit to anything.',
  },
]

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="wrap">
        <div className="features-head">
          <h2>Built around what people get stuck on</h2>
          <p>Not a glossary. A working explanation of your specific document.</p>
        </div>
        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
