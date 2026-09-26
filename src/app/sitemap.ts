import { MetadataRoute } from 'next'
import { getPublicPosts } from '@/lib/blog'

const BASE = 'https://www.yourofficespace.au'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const posts = getPublicPosts()

  return [
    { url: BASE,                                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tenant-rep`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/furniture`,                           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/cleaning`,                            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/lease-review`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,                             lastModified: now, changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/leaseintel`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/market-snapshot`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/newcastle-commercial-property`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/resources`,                           lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/resources/lease-review`,              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/fitout-estimator`,          lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/resources/lease-comparison`,          lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/resources/office-size-calculator`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/resources/workspace-builder`,          lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/resources/furniture-quote`,            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/resources/relocate-quiz`,              lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE}/resources/health-check`,               lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/blog`,                                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/tools/space-planner`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/office-fitout`,                       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    // Dynamic blog posts
    ...posts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]
}
