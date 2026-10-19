'use client'
import { getAnalyticsConsent } from './analytics-consent'

type ConversionParameters = Record<string, string | number | boolean | undefined>
type PendingEvent = { name: string; parameters: ConversionParameters }
let pendingEvents: PendingEvent[] = []

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    _hsq?: unknown[][]
  }
}

export function publicAnalyticsPath(path: string): string | undefined {
  const cleanPath = path.split(/[?#]/)[0] || '/'
  if (/^\/(?:api|dashboard)(?:\/|$)/.test(cleanPath) || /^\/tenant-rep\/(?:brief|payment)(?:\/|$)/.test(cleanPath)) return undefined
  return cleanPath
}

function productionMeasurementOrigin() {
  return typeof window !== 'undefined' && ['https://www.yourofficespace.au', 'https://yourofficespace.au'].includes(window.location.origin)
}

export function discardQueuedConversions() { pendingEvents = [] }

export function flushQueuedConversions() {
  if (!productionMeasurementOrigin() || getAnalyticsConsent() !== 'accepted') { discardQueuedConversions(); return }
  if (!window.gtag) return
  const events = pendingEvents
  pendingEvents = []
  for (const event of events) window.gtag('event', event.name, event.parameters)
}

/** Optional conversion measurement; never includes form contact details. */
export function trackConversion(eventName: string, parameters: ConversionParameters = {}) {
  if (!productionMeasurementOrigin() || getAnalyticsConsent() !== 'accepted') return
  const pagePath = publicAnalyticsPath(window.location.pathname)
  if (!pagePath) return
  const eventParameters = { ...parameters, page_path: pagePath, page_location: `${window.location.origin}${pagePath}` }
  if (window.gtag) {
    flushQueuedConversions()
    window.gtag('event', eventName, eventParameters)
  } else if (process.env.NEXT_PUBLIC_GA_ID) {
    // Consent can be granted just before a user clicks; retain events until GA init.
    pendingEvents = [...pendingEvents.slice(-19), { name: eventName, parameters: eventParameters }]
  }
  window._hsq?.push(['trackCustomBehavioralEvent', { name: `pe${eventName}`, properties: eventParameters }])
}
