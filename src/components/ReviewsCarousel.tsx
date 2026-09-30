'use client'

import { useEffect, useState } from 'react'

type Review = { quote: string; name: string; organisation: string }

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || reviews.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive(index => (index + 1) % reviews.length), 7000)
    return () => window.clearInterval(timer)
  }, [paused, reviews.length])

  const review = reviews[active]
  return (
    <div className="mx-auto mt-12 max-w-4xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <figure className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm sm:p-12">
        <div className="flex items-center justify-between gap-5">
          <span className="rounded-full bg-warm-grey px-4 py-2 text-sm font-bold text-near-black">Google review</span>
          <span className="text-sm text-charcoal">{active + 1} of {reviews.length}</span>
        </div>
        <blockquote className="mt-8 text-2xl font-semibold leading-relaxed text-near-black sm:text-3xl">“{review.quote}”</blockquote>
        <figcaption className="mt-8 border-t border-black/10 pt-6"><strong className="block text-lg text-near-black">{review.name}</strong><span className="mt-1 block text-charcoal">{review.organisation}</span></figcaption>
      </figure>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button type="button" onClick={() => setActive(index => (index - 1 + reviews.length) % reviews.length)} className="min-h-12 min-w-12 justify-center rounded-full border border-near-black text-xl text-near-black hover:bg-near-black hover:text-white" aria-label="Previous review">←</button>
        {reviews.map((item, index) => <button key={item.name} type="button" onClick={() => setActive(index)} className="min-h-11 min-w-11 justify-center rounded-full bg-transparent p-0" aria-label={`Show review from ${item.name}`} aria-pressed={active === index}><span className={`h-3 w-3 rounded-full ${active === index ? 'bg-action-teal' : 'bg-black/20'}`} /></button>)}
        <button type="button" onClick={() => setActive(index => (index + 1) % reviews.length)} className="min-h-12 min-w-12 justify-center rounded-full border border-near-black text-xl text-near-black hover:bg-near-black hover:text-white" aria-label="Next review">→</button>
      </div>
    </div>
  )
}
