'use client'
import { useCallback, useEffect, useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (opts: Record<string, unknown>) => void
      }
    }
  }
}

interface HubSpotFormProps {
  formId?: string
  targetId: string
  className?: string
}

// Default form: Web Page - Contact Form (e3e49521-0831-49ba-8929-610c7cc7f282)
export default function HubSpotForm({
  formId = 'e3e49521-0831-49ba-8929-610c7cc7f282',
  targetId,
  className = ''
}: HubSpotFormProps) {
  const created = useRef(false)
  const createForm = useCallback(() => {
    if (!window.hbspt || created.current) return
    window.hbspt.forms.create({
      portalId: '442709765',
      formId,
      target: `#${targetId}`,
      cssClass: 'hs-form-yos',
      submitButtonClass: 'hs-submit-btn',
    })
    created.current = true
  }, [formId, targetId])

  useEffect(() => {
    createForm()
  }, [createForm])

  return (
    <>
      <Script
        id="hs-forms-loader"
        src="https://js.hsforms.net/forms/embed/v2.js"
        strategy="afterInteractive"
        onReady={createForm}
      />
      <div id={targetId} className={className} />
    </>
  )
}
