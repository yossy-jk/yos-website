import { CATALOGUES } from '@/lib/catalogues'
import { TENANT_OFFER } from '@/lib/tenant-offer'
import { blogSitemapEntries, safeContentDate } from '@/lib/sitemap-content'
import { MetadataRoute } from 'next'
import { SEARCH_EXCLUDED_BLOG_SLUGS } from '@/lib/search-policy'
import { getAllPublicPostsAsync } from '@/lib/blog'
import { getAllCaseStudies } from '@/lib/case-studies'

const BASE = 'https://www.yourofficespace.au'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublicPostsAsync()
  const caseStudies = getAllCaseStudies()

  const tenantRoutes = TENANT_OFFER.approvedForPublication ? ['/tenant-rep/packages', '/tenant-rep/guarantee', '/lease-health-check', '/tools/lease-cost-calculator', '/tools/time-cost-calculator', '/tools/critical-dates', '/lease-checklist', '/refer', '/insights/lease-costs'].map(route => ({url: `${BASE}${route}`,changeFrequency:'monthly' as const,priority:0.7})) : []
  return [
    ...tenantRoutes,
    ...CATALOGUES.map(item => ({ url: `${BASE}/catalogues/${item.id}`, changeFrequency: 'yearly' as const, priority: 0.6, lastModified: '2026-10-19' })),
    { url: BASE,                                          changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/buyers-agency`, lastModified: '2026-10-19', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/cleaning/work-with-us`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/cleaning/work-with-us/cleaning`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/tenant-rep`, lastModified: '2026-10-19',                          changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tenant-rep/newcastle`, lastModified: '2026-10-19',                changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/office-fitout`, lastModified: '2026-10-19',                       changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/commercial-construction`, lastModified: '2026-10-19', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/furniture`, lastModified: '2026-10-19',                           changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/cleaning`,                            changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: '2026-10-19',                               changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,                             changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/privacy`,                             changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,                               changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/market-snapshot`, lastModified: '2026-10-19',                     changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/newcastle-commercial-property`,       changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/not-for-profit-lease-support`,        changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/resources`, lastModified: '2026-10-19',                           changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/resources/lease-review`,              changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/fitout-estimator`,          changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/resources/lease-comparison`,          changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/resources/office-size-calculator`,    changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/resources/workspace-builder`,         changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/resources/furniture-quote`,           changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/resources/relocate-quiz`,             changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE}/resources/health-check`,              changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/blog`,                                changeFrequency: 'weekly',  priority: 0.8 },
    ...(caseStudies.length > 0 ? [{ url: `${BASE}/case-studies`, changeFrequency: 'monthly' as const, priority: 0.75 }] : []),
    { url: `${BASE}/tools/space-planner`,                 changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/flourish`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/flourish/office-plant-hire-newcastle`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/flourish/office-electrical-test-and-tag`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/flourish/office-fire-compliance`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/flourish/office-first-aid-compliance`, changeFrequency: 'monthly', priority: 0.8 },
    // Dynamic blog posts
    ...blogSitemapEntries(posts, BASE, SEARCH_EXCLUDED_BLOG_SLUGS),
    ...caseStudies.map(caseStudy => ({
      url: `${BASE}/case-studies/${caseStudy.slug}`,
      ...(safeContentDate(caseStudy.date) ? { lastModified: safeContentDate(caseStudy.date) } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ]
}
