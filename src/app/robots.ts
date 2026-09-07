import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/buyers-agency',
          '/resources/lease-vs-buy',
          '/resources/stamp-duty-calculator',
          '/resources/rental-yield-calculator',
          '/resources/cap-rate-calculator',
          '/resources/land-tax-calculator',
          '/resources/purchase-checklist',
        ],
      },
    ],
    sitemap: 'https://www.yourofficespace.au/sitemap.xml',
  }
}
