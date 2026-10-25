import { DISCOVERY_BOOKING_URL } from '@/lib/constants'

export default function DiscoveryBooking() {
  return (
    <div className="discovery-booking" data-discovery-booking>
      <p className="discovery-booking-title">Prefer to choose a time?</p>
      <p className="discovery-booking-intro">Book a Project Discovery Session to discuss your workplace needs, timing and next step. Choose 15 or 30 minutes on Microsoft Teams.</p>
      <a className="discovery-booking-link" href={DISCOVERY_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a Project Discovery Session</a>
      <p className="discovery-booking-note">Opens Joe Kelley’s Microsoft Bookings calendar in a new tab. Choose an available time and complete Microsoft’s confirmation to book your appointment.</p>
    </div>
  )
}
