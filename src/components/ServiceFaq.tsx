type FaqItem = {
  question: string
  answer: string
}

type ServiceFaqProps = {
  heading?: string
  items: readonly FaqItem[]
}

export default function ServiceFaq({
  heading = 'Questions businesses ask before getting started.',
  items,
}: ServiceFaqProps) {
  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="service-faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          }),
        }}
      />
      <div className="yos-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dark-teal">Frequently asked questions</p>
          <h2 id="service-faq-heading" className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-near-black">
            {heading}
          </h2>
        </div>
        <div className="divide-y divide-black/10 border-y border-black/10">
          {items.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold text-near-black">
                {item.question}
                <span className="text-2xl font-normal text-dark-teal transition-transform group-open:rotate-45 motion-reduce:transform-none" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-2xl pb-2 pt-4 leading-relaxed text-charcoal">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
