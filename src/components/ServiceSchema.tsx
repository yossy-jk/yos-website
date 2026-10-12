import { ORGANIZATION_SCHEMA, ORGANIZATION_ID, SITE_URL } from '@/lib/site-schema'
export default function ServiceSchema({ name, path, description, area }: { name: string; path: string; description: string; area: 'NSW' | 'Australia' }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org', '@graph': [ORGANIZATION_SCHEMA, {
      '@type': 'Service', '@id': `${SITE_URL}${path}#service`, name, description,
      url: `${SITE_URL}${path}`, provider: { '@id': ORGANIZATION_ID },
      areaServed: { '@type': area === 'NSW' ? 'State' : 'Country', name: area === 'NSW' ? 'New South Wales' : 'Australia' },
    }],
  }) }} />
}
