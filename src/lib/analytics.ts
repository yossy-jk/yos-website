'use client'

type ConversionParameters = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    _hsq?: unknown[][]
  }
}

/**
 * Records a consent-aware conversion in the analytics tools already loaded on
 * the page. If optional analytics has not been accepted, this is a no-op.
 */
export function trackConversion(eventName: string, parameters: ConversionParameters = {}) {
  if (typeof window === 'undefined') return

  window.gtag?.('event', eventName, parameters)
  window._hsq?.push([
    'trackCustomBehavioralEvent',
    {
      name: `pe${eventName}`,
      properties: parameters,
    },
  ])
}

