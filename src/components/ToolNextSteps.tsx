import Button from '@/components/Button'

export default function ToolNextSteps({ title, description, primary, secondary }: {
  title: string
  description: string
  primary: { href: string; label: string }
  secondary: { href: string; label: string }
}) {
  return <section id="tool-next-steps" aria-labelledby="tool-next-steps-heading" className="bg-near-black" style={{ padding: 'clamp(3rem,7vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <p className="text-teal font-semibold uppercase" style={{ fontSize: '.75rem', letterSpacing: '.18em', marginBottom: 16 }}>Your next step</p>
      <h2 id="tool-next-steps-heading" className="text-white leading-tight" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: 24 }}>{title}</h2>
      <p className="text-white/85 leading-relaxed" style={{ maxWidth: 750, marginBottom: 28 }}>{description}</p>
      <div className="flex flex-col sm:flex-row" style={{ gap: 16 }}>
        <Button href={primary.href} variant="primary">{primary.label}</Button>
        <Button href={secondary.href} variant="outline-light">{secondary.label}</Button>
      </div>
    </div>
  </section>
}
