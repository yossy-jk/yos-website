'use client'
import { useEffect } from 'react'

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
  useEffect(() => {
    const portalId = '442709765'

    function createForm() {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId,
          formId,
          target: `#${targetId}`,
          cssClass: 'hs-form-yos',
          submitButtonClass: 'hs-submit-btn',
          onFormSubmit: () => {
            // Form submitted — HubSpot handles confirmation
          }
        })
      }
    }

    if (window.hbspt) {
      createForm()
    } else {
      // Wait for HubSpot script to load
      const script = document.getElementById('hs-script-loader')
      if (script) {
        script.addEventListener('load', createForm)
        return () => script.removeEventListener('load', createForm)
      } else {
        // Fallback: poll briefly
        const interval = setInterval(() => {
          if (window.hbspt) {
            createForm()
            clearInterval(interval)
          }
        }, 300)
        return () => clearInterval(interval)
      }
    }
  }, [formId, targetId])

  return <div id={targetId} className={className} />
}
