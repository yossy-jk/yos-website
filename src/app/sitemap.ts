import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { getAllCaseStudies } from '@/lib/case-studies'

const BASE = 'https://yourofficespace.au'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const posts = getAllPosts()
  const caseStudies = getAllCaseStudies()

  return [
    { url: BASE,                                         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tenant-rep`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/buyers-agency`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/furniture`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/cleaning`,                           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/lease-review`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,                              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,                            lastModified: now, changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/leaseintel`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/resources`,                          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/resources/lease-review`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/fitout-estimator`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/lease-comparison`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/stamp-duty-calculator`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/land-tax-calculator`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/rental-yield-calculator`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/cap-rate-calculator`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/purchase-checklist`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/furniture-quote`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE}/blog`,                               lastModified: now, changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${BASE}/case-studies`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Dynamic blog posts
    ...posts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    // Dynamic case studies
    ...caseStudies.map(cs => ({
      url: `${BASE}/case-studies/${cs.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
