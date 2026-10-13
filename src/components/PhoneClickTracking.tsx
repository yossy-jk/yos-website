'use client'
import { useEffect } from 'react'
import { trackConversion } from '@/lib/analytics'

export default function PhoneClickTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const link = target?.closest<HTMLAnchorElement>('a[href^="tel:"]')
      if (!link) return
      const location = link.closest('header, .yos-navigation, #mobile-navigation-menu') ? 'header' : link.closest('footer') ? 'footer' : link.closest('main') ? 'content' : 'other'
      // A dialler click expresses intent; it does not establish a completed call.
      trackConversion('phone_click', { contact_method: 'phone', link_location: location })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
