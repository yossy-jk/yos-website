import Link from 'next/link'
import { SITE_URL } from '@/lib/site-schema'
export default function ContentBreadcrumbs({ section, sectionPath, title, path }: { section?: string; sectionPath?: string; title: string; path: string }) {
  const items = [{ name: 'Home', path: '/' }, ...(section && sectionPath ? [{ name: section, path: sectionPath }] : []), { name: title, path }]
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: new URL(item.path, SITE_URL).href })),
    }).replace(/</g, '\\u003c') }} />
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/80">
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => <li key={item.path} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">/</span>}
          {index < items.length - 1 ? <Link className="underline underline-offset-4" href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
        </li>)}
      </ol>
    </nav>
  </>
}
