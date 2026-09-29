'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const isHistoryTraversal = useRef(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const onPopState = () => { isHistoryTraversal.current = true }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (isHistoryTraversal.current) {
      isHistoryTraversal.current = false
      return
    }

    window.requestAnimationFrame(() => {
      if (!scrollToHash()) window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }, [pathname])

  useEffect(() => {
    const onHashChange = () => window.requestAnimationFrame(scrollToHash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return null
}
