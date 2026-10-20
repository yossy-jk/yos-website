'use client'
import { useEffect } from 'react'
import { trackConversion } from '@/lib/analytics'

const SERVICES: Readonly<Record<string, string>> = {
  '/tenant-rep': 'Leasing',
  '/buyers-agency': 'Buying',
  '/office-fitout': 'FitOut',
  '/furniture': 'Furniture',
  '/cleaning': 'Cleaning',
  '/flourish': 'Flourish',
}

export default function ServiceChoiceTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (window.location.pathname !== '/') return
      const target = event.target instanceof Element ? event.target : null
      const link = target?.closest<HTMLAnchorElement>('a[href]')
      if (!link) return
      const location = link.matches('.home-service-card') ? 'home_service_card' : link.matches('.home-guide-service') ? 'home_service_guide' : undefined
      if (!location) return
      let url: URL
      try { url = new URL(link.href) } catch { return }
      if (url.origin !== window.location.origin || url.username || url.password) return
      const service = SERVICES[url.pathname]
      if (!service) return
      // A service choice expresses intent; it is not a lead or a completed visit.
      // Only fixed service/location labels are sent, never the link query or text.
      trackConversion('service_select', { service, link_location: location })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
