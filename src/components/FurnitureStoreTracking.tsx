'use client'
import { useEffect } from 'react'
import { trackConversion } from '@/lib/analytics'
import { FURNITURE_STORE_URL } from '@/lib/constants'

export function isFurnitureStoreLink(href: string): boolean {
  try {
    const url = new URL(href)
    return url.origin === FURNITURE_STORE_URL && !url.username && !url.password
  } catch { return false }
}

export default function FurnitureStoreTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const link = target?.closest<HTMLAnchorElement>('a[href]')
      if (!link || !isFurnitureStoreLink(link.href)) return
      const location = link.closest('header, .yos-navigation, #mobile-navigation-menu') ? 'header' : link.closest('footer') ? 'footer' : link.closest('main') ? 'content' : 'other'
      // A store click is shopping intent, not an enquiry, purchase or completed visit.
      // Do not include the destination path, query string or visitor contact data.
      trackConversion('furniture_store_click', { service: 'Furniture', destination_site: 'your_office_furniture', link_location: location })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
