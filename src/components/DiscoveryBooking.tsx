import { DISCOVERY_BOOKING_URL } from '@/lib/constants'

export default function DiscoveryBooking() {
  return (
    <div className="my-6 rounded-lg border border-teal/30 bg-white p-5 text-near-black" data-discovery-booking>
      <p className="font-bold text-lg mb-2">Prefer to choose a time?</p>
      <p className="text-sm mb-4">Book a Project Discovery Session to discuss your workplace needs, timing and next step. Choose 15 or 30 minutes on Microsoft Teams.</p>
      <a className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-action-teal px-5 py-3 font-bold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal" href={DISCOVERY_BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a Project Discovery Session</a>
      <p className="text-sm mt-3">Opens the YOS calendar on HubSpot in a new tab. Your appointment is booked only after you complete the calendar confirmation.</p>
    </div>
  )
}
