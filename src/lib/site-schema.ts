export const SITE_URL = 'https://www.yourofficespace.au'
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const LOGO_URL = `${SITE_URL}/brand/yos-logo-black.png`

export const SERVICE_TYPES = [
  'Tenant Representation and Commercial Leasing',
  'Commercial Property Buying',
  'Commercial FitOut',
  'Client-side Commercial Construction Project Management',
  'Office and Commercial Furniture',
  'Commercial Cleaning',
  'Office Plant Hire',
  'Office Electrical Test and Tag Coordination',
  'Office Fire Compliance Coordination',
  'Office First Aid Compliance Coordination',
] as const

export const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Your Office Space',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: LOGO_URL },
  telephone: '+61240920733',
  email: 'hello@yourofficespace.au',
  description: 'Newcastle-based workplace support: tenant representation and commercial buying in NSW, FitOut and furniture Australia-wide, and cleaning in Newcastle CBD and Lake Macquarie.',
  address: { '@type': 'PostalAddress', streetAddress: '2 Portside Crescent', addressLocality: 'Maryville', addressRegion: 'NSW', postalCode: '2293', addressCountry: 'AU' },
  knowsAbout: SERVICE_TYPES,
  brand: { '@type': 'Brand', name: 'Your Office Furniture', url: 'https://www.yourofficefurniture.com.au' },
  sameAs: ['https://www.linkedin.com/company/yourofficespace'],
} as const
