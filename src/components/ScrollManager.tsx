'use client'

import { useEffect } from 'react'

function scrollToHash() {
  const hash = window.location.hash
  if (!hash) return false
  let id: string
  try { id = decodeURIComponent(hash.slice(1)) } catch { return false }
  const target = document.getElementById(id) ?? document.querySelector(`[name="${CSS.escape(id)}"]`)
  if (!target) return false
  target.scrollIntoView({ block: 'start' })
  if (target instanceof HTMLElement && target.hasAttribute('tabindex')) target.focus({ preventScroll: true })
  return true
}

/** Wait for the destination DOM, without overriding browser back/forward restoration. */
export default function ScrollManager() {
  useEffect(() => {
    let frame = 0
    const cancel = () => window.cancelAnimationFrame(frame)
    const onInternalLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return
      const next = new URL(anchor.href, window.location.href)
      if (next.origin !== window.location.origin) return
      const previousPath = window.location.pathname
      const previousMain = document.querySelector('main')
      cancel()
      const deadline = performance.now() + 10000
      const waitForDestination = () => {
        if (performance.now() > deadline) return
        const locationMatches = window.location.pathname === next.pathname && window.location.search === next.search && window.location.hash === next.hash
        const destinationMounted = previousPath === next.pathname || !previousMain?.isConnected
        if (locationMatches && destinationMounted) {
          frame = window.requestAnimationFrame(() => {
            if (next.hash) {
              if (!scrollToHash()) frame = window.requestAnimationFrame(waitForDestination)
            } else if (previousPath !== next.pathname) {
              window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
            }
          })
        } else frame = window.requestAnimationFrame(waitForDestination)
      }
      frame = window.requestAnimationFrame(waitForDestination)
    }
    const onHashChange = () => { cancel(); frame = window.requestAnimationFrame(scrollToHash) }
    const onHistory = () => cancel()
    // Capture before Next's Link handler prevents the native click.
    document.addEventListener('click', onInternalLink, true)
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHistory)
    if (window.location.hash) frame = window.requestAnimationFrame(scrollToHash)
    return () => {
      cancel()
      document.removeEventListener('click', onInternalLink, true)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHistory)
    }
  }, [])
  return null
}
