'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import GoogleAnalytics from '@/components/GoogleAnalytics'

type Consent = 'accepted' | 'declined'

const STORAGE_KEY = 'yos_analytics_consent'
const HUBSPOT_PORTAL_ID = '442709765'
const CONSENT_EVENT = 'yos-analytics-consent-changed'
let memoryConsent: Consent | null = null

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)
  return () => {
    window.removeEventListener(CONSENT_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

function getConsentSnapshot(): Consent | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'accepted' || saved === 'declined') return saved
  } catch {
    // Fall through to the in-memory choice.
  }
  return memoryConsent
}

function clearAnalyticsCookies() {
  const knownNames = ['_ga', '_gid', '_gat', 'hubspotutk', '__hstc', '__hssc', '__hssrc']
  const currentNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .filter((name) => name.startsWith('_ga_') || name.startsWith('__hs'))

  for (const name of new Set([...knownNames, ...currentNames])) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.yourofficespace.au; SameSite=Lax`
  }
}

function OptionalAnalytics() {
  return (
    <>
      <GoogleAnalytics />
      <Script
        id="hs-script-loader"
        src={`https://js-ap1.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
        strategy="lazyOnload"
      />
    </>
  )
}

export default function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => null)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  function saveConsent(next: Consent) {
    const withdrawing = consent === 'accepted' && next === 'declined'
    memoryConsent = next
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Keep the in-memory choice for this page when storage is unavailable.
    }
    if (next === 'declined') clearAnalyticsCookies()
    window.dispatchEvent(new Event(CONSENT_EVENT))
    setPreferencesOpen(false)
    if (withdrawing) window.location.reload()
  }

  const showPanel = consent === null || preferencesOpen

  return (
    <>
      {consent === 'accepted' && <OptionalAnalytics />}

      {showPanel ? (
        <section
          role="region"
          aria-label="Privacy choices"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto rounded-xl bg-near-black text-white shadow-2xl"
          style={{ maxWidth: '46rem', border: '1px solid rgba(255,255,255,0.16)', padding: 'clamp(1.25rem,4vw,2rem)' }}
        >
          <h2 className="font-bold mb-2" style={{ fontSize: '1.1rem' }}>Your privacy choices</h2>
          <p className="text-white/65 font-light mb-5" style={{ fontSize: '0.86rem', lineHeight: 1.7 }}>
            We use essential storage for security and site functions. With your permission, Google Analytics and HubSpot analytics help us understand site usage. Optional analytics is off unless you accept it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              type="button"
              onClick={() => saveConsent('accepted')}
              className="bg-teal text-white font-bold rounded-lg hover:bg-dark-teal transition-colors"
              style={{ padding: '0.8rem 1.1rem', fontSize: '0.82rem' }}
            >
              Accept analytics
            </button>
            <button
              type="button"
              onClick={() => saveConsent('declined')}
              className="border border-white/25 text-white font-semibold rounded-lg hover:border-white/50 transition-colors"
              style={{ padding: '0.8rem 1.1rem', fontSize: '0.82rem' }}
            >
              Essential only
            </button>
            <Link href="/privacy" className="text-teal hover:underline sm:ml-auto" style={{ fontSize: '0.8rem' }}>
              Read our privacy policy
            </Link>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setPreferencesOpen(true)}
          className="fixed bottom-4 left-4 z-[90] rounded-full bg-near-black text-white/75 shadow-lg hover:text-white"
          style={{ border: '1px solid rgba(255,255,255,0.16)', padding: '0.55rem 0.8rem', fontSize: '0.72rem' }}
        >
          Privacy choices
        </button>
      )}
    </>
  )
}
