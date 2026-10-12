import Link from 'next/link'
export default function ToolGuide({ purpose, inputs, result, next, href }: { purpose: string; inputs: string; result: string; next: string; href: string }) {
  return <section className="bg-white px-6 py-12 md:py-16" aria-labelledby="tool-guide-heading">
    <div className="mx-auto max-w-4xl">
      <h2 id="tool-guide-heading" className="text-2xl font-bold text-near-black">How to use this planning tool</h2>
      <p className="mt-4 leading-relaxed text-charcoal">{purpose}</p>
      <dl className="mt-6 grid gap-6 md:grid-cols-2">
        <div><dt className="font-bold text-near-black">What to have ready</dt><dd className="mt-2 leading-relaxed text-charcoal">{inputs}</dd></div>
        <div><dt className="font-bold text-near-black">What the result tells you</dt><dd className="mt-2 leading-relaxed text-charcoal">{result}</dd></div>
      </dl>
      <p className="mt-6 leading-relaxed text-charcoal">This is an initial planning aid. Results depend on the inputs and assumptions shown and are not a final quote, lease assessment or professional recommendation. Some tools request contact details to unlock results or a report.</p>
      <Link className="mt-5 inline-block font-semibold text-action-teal underline underline-offset-4" href={href}>{next}</Link>
    </div>
  </section>
}
