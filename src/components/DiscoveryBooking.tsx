'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { DISCOVERY_BOOKING_URL } from '@/lib/constants'

const EMBED_URL = 'https://bookings.cloud.microsoft/owa/calendar/YourOfficeSpaceDiscovery2@NETORG18778963.onmicrosoft.com/bookings/?ismsaljsauthenabled'

export default function DiscoveryBooking() {
  const [open, setOpen] = useState(false)
  const modal = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLAnchorElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return
    const dialog = modal.current
    const opener = trigger.current
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      opener?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <div className="discovery-booking" data-discovery-booking>
      <p className="discovery-booking-title">Prefer to choose a time?</p>
      <p className="discovery-booking-intro">Book a 15-minute initial discovery meeting on Microsoft Teams to discuss your workplace needs, timing and next step.</p>
      <a ref={trigger} className="discovery-booking-link" href={DISCOVERY_BOOKING_URL} target="_blank" rel="noopener noreferrer" aria-haspopup="dialog" onClick={event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        setOpen(true)
      }}>Book a Project Discovery Session</a>
      <p className="discovery-booking-note">Choose an available time in Joe Kelley’s Microsoft Bookings calendar and complete Microsoft’s confirmation to book your appointment.</p>
      {open && (
        <dialog ref={modal} className="discovery-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event => { event.preventDefault(); setOpen(false) }} onClose={() => setOpen(false)}>
          <div className="discovery-dialog-header">
            <div>
              <h2 id={titleId}>Let’s talk about your workplace</h2>
              <p id={descriptionId}>15 minutes with Joe Kelley, on Microsoft Teams. Choose your time zone, an available time and confirm your booking below.</p>
            </div>
            <button type="button" className="discovery-dialog-close" onClick={() => setOpen(false)} autoFocus aria-label="Close booking calendar">Close</button>
          </div>
          <iframe src={EMBED_URL} title="Book a 15-minute discovery meeting with Joe Kelley" className="discovery-dialog-calendar" />
          <p className="discovery-dialog-fallback">Calendar not loading? <a href={DISCOVERY_BOOKING_URL} target="_blank" rel="noopener noreferrer">Open Joe’s calendar in a new tab</a>. Your appointment is booked only after Microsoft confirms it.</p>
        </dialog>
      )}
    </div>
  )
}
