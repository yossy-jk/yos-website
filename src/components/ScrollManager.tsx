'use client'

import { useEffect } from 'react'

function scrollToHash() {
  const hash = window.location.hash
  if (!hash) return false

  const id = decodeURIComponent(hash.slice(1))
  const target = document.getElementById(id) ?? document.querySelector(`[name="${CSS.escape(id)}"]`)
  if (!target) return false

  target.scrollIntoView({ block: 'start' })
  return true
}

/**
 * Gives link-driven route changes a deterministic top position while leaving
 * browser back/forward restoration intact. Real hash destinations always win.
 */
export default function ScrollManager() {
  useEffect(() => {
    const scrollAfterNavigation = () => window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!scrollToHash()) window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      })
    })

    const onInternalLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank' || anchor.download) return
      const next = new URL(anchor.href, window.location.href)
      if (next.origin !== window.location.origin || next.pathname === window.location.pathname) return
      scrollAfterNavigation()
    }

    const onHashChange = () => window.requestAnimationFrame(scrollToHash)
    document.addEventListener('click', onInternalLink)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      document.removeEventListener('click', onInternalLink)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  return null
}
