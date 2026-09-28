// Site-wide constants for Your Office Space website

export const SITE_NAME = 'Your Office Space'
export const SITE_URL = 'https://www.yourofficespace.au'

export const CONTACT = {
  email: 'hello@yourofficespace.au',
  phone: '0434 655 511',
  location: 'Newcastle, NSW',
}

export const HUBSPOT = {
  bookingUrl: 'https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354'
}

// Top-level nav — Services is a dropdown
export const NAV_LINKS = [
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export const SERVICE_LINKS = [
  { label: 'Tenant Representation', href: '/tenant-rep', tagline: 'Your lease. Your terms.' },
  { label: 'Commercial Fit Out & Project Management', href: '/office-fitout', tagline: 'From brief to delivered workspace.' },
  { label: 'Office & Commercial Furniture', href: '/furniture', tagline: 'Furniture selected, supplied and installed.' },
  { label: 'Commercial Cleaning', href: '/cleaning', tagline: 'Shows up. Every time.' },
]
