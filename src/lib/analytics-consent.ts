'use client'

export type Consent = 'accepted' | 'declined'
export const STORAGE_KEY = 'yos_analytics_consent'
export const CONSENT_EVENT = 'yos-analytics-consent-changed'
let memoryConsent: Consent | null = null

export function getAnalyticsConsent(): Consent | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'accepted' || saved === 'declined') return saved
  } catch {
    // Use the choice made in this page when storage is unavailable.
  }
  return memoryConsent
}

export function setMemoryConsent(consent: Consent) { memoryConsent = consent }
