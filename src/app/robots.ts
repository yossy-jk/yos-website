import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/tools/'],
      },
    ],
    sitemap: 'https://yourofficespace.au/sitemap.xml',
  }
}
