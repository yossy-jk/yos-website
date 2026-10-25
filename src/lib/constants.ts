// Site-wide constants for Your Office Space website

export const SITE_NAME = 'Your Office Space'
export const SITE_URL = 'https://www.yourofficespace.au'
export const FURNITURE_STORE_URL = 'https://www.yourofficefurniture.com.au'

export const CONTACT = {
  email: 'hello@yourofficespace.au',
  phone: '(02) 4092 0733',
  location: 'Newcastle, NSW',
}

export const ENQUIRY = {
  contactUrl: '/contact#contact-enquiry',
}

// Direct 15-minute initial discovery booking; enquiry email delivery stays independent.
export const DISCOVERY_BOOKING_URL = 'https://bookings.cloud.microsoft/bookwithme/user/22b335abe25a42329fe8b249c3313606%40yourofficespace.au/meetingtype/xgiD8hPbTUmAq_UVWu_5Zg2?anonymous&ismsaljsauthenabled'

// Top-level nav — Services is a dropdown
export const NAV_LINKS = [
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const SERVICE_LINKS = [
  { label: 'Tenant Representation', href: '/tenant-rep', tagline: 'Your lease. Your terms.' },
  { label: 'Commercial Buyers Agent', href: '/buyers-agency', tagline: 'Structure Ready. Finance Ready. Ready to move.' },
  { label: 'Commercial FitOut & Project Management', href: '/office-fitout', tagline: 'From brief to delivered workspace.' },
  { label: 'Office & Commercial Furniture', href: '/furniture', tagline: 'Furniture selected, supplied and installed.' },
  { label: 'Commercial Cleaning', href: '/cleaning', tagline: 'Shows up. Every time.' },
]
