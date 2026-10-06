'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './ReviewsCarousel.module.css'

type Review = { quote: string; name: string; organisation: string; logo?: string | null; logoBackground?: 'dark'; source?: string }

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || reviews.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive(index => (index + 1) % reviews.length), 7000)
    return () => window.clearInterval(timer)
  }, [paused, reviews.length])

  const review = reviews[active]
  if (!review) return null
  return (
    <div className="mx-auto mt-12 max-w-4xl" style={{ width: '100%', maxWidth: '896px', margin: '40px auto 0' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <figure className="rounded-3xl border border-black/5 bg-white shadow-sm" style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
        <div className="flex items-center justify-between gap-5">
          <span className="rounded-full bg-warm-grey px-4 py-2 text-sm font-bold text-near-black">Google review</span>
          <span className="text-sm text-charcoal">{active + 1} of {reviews.length}</span>
        </div>
        <blockquote className="mt-8 font-semibold text-near-black" style={{ fontSize: 'clamp(20px, 3vw, 30px)', lineHeight: 1.5, overflowWrap: 'break-word' }}>“{review.quote}”</blockquote>
        <figcaption className="mt-8 flex items-center justify-between gap-5 border-t border-black/10 pt-6" style={{ flexWrap: 'wrap' }}>
          <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}><strong className="block text-lg text-near-black">{review.name}</strong><span className="mt-1 block text-charcoal">{review.organisation}</span></span>
          {review.logo && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '168px', maxWidth: '100%', minHeight: '72px', padding: '12px', borderRadius: '12px', background: review.logoBackground === 'dark' ? '#1a1a1a' : '#ffffff' }}><Image src={review.logo} alt={`${review.organisation} logo`} width={150} height={54} style={{ width: '144px', maxWidth: '100%', height: 'auto', maxHeight: '48px', objectFit: 'contain' }} /></span>}
        </figcaption>
      </figure>
      <div className={styles.controls}>
        <button type="button" onClick={() => setActive(index => (index - 1 + reviews.length) % reviews.length)} className="min-h-12 min-w-12 justify-center rounded-full border border-near-black text-xl text-near-black hover:bg-near-black hover:text-white" aria-label="Previous review">←</button>
        <span className="text-sm text-charcoal" aria-live="polite">{active + 1} / {reviews.length}</span>
        <button type="button" onClick={() => setActive(index => (index + 1) % reviews.length)} className="min-h-12 min-w-12 justify-center rounded-full border border-near-black text-xl text-near-black hover:bg-near-black hover:text-white" aria-label="Next review">→</button>
      </div>
      <div className={styles.dots} aria-label="Choose a review">
        {reviews.map((item, index) => <button key={item.name} type="button" onClick={() => setActive(index)} className={styles.dotButton} aria-label={`Show review from ${item.name}`} aria-pressed={active === index}><span className={styles.dot} style={{ background: active === index ? '#007f73' : '#767676' }} /></button>)}
      </div>
    </div>
  )
}
