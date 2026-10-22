'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getAnalyticsConsent } from '@/lib/analytics-consent'

const CONTAINER_ID = 'GTM-TQQ9MD23'

/** Basic consent mode: no container request before an accepted analytics choice. */
export default function HomepageTagManager() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname !== '/' || getAnalyticsConsent() !== 'accepted') return
    if (!['https://www.yourofficespace.au', 'https://yourofficespace.au'].includes(window.location.origin)) return
    if (document.getElementById('yos-homepage-gtm')) return
    const layer = window as Window & { dataLayer?: unknown[] }
    layer.dataLayer = layer.dataLayer || []
    layer.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    const script = document.createElement('script')
    script.id = 'yos-homepage-gtm'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${CONTAINER_ID}`
    document.head.prepend(script)
  }, [pathname])
  return null
}
