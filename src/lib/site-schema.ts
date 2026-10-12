export const SITE_URL = 'https://www.yourofficespace.au'
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const LOGO_URL = `${SITE_URL}/brand/yos-logo-black.png`

export const SERVICE_TYPES = [
  'Tenant Representation and Commercial Leasing',
  'Commercial Property Buying',
  'Commercial FitOut',
  'Office and Commercial Furniture',
  'Commercial Cleaning',
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
  address: { '@type': 'PostalAddress', addressLocality: 'Newcastle', addressRegion: 'NSW', addressCountry: 'AU' },
  knowsAbout: SERVICE_TYPES,
  sameAs: ['https://www.linkedin.com/company/your-office-space'],
} as const
