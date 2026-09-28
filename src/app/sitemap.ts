import { MetadataRoute } from 'next'
import { getPublicPosts } from '@/lib/blog'
import { getAllCaseStudies } from '@/lib/case-studies'

const BASE = 'https://www.yourofficespace.au'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublicPosts()
  const caseStudies = getAllCaseStudies()

  return [
    { url: BASE,                                          changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tenant-rep`,                          changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/tenant-rep/newcastle`,                changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/office-fitout`,                       changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/furniture`,                           changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/cleaning`,                            changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/lease-review`,                        changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,                               changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,                             changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/privacy`,                             changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,                               changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/leaseintel`,                          changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/market-snapshot`,                     changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/newcastle-commercial-property`,       changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/not-for-profit-lease-support`,        changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/resources`,                           changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/resources/lease-review`,              changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/fitout-estimator`,          changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/resources/lease-comparison`,          changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/resources/office-size-calculator`,    changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/resources/workspace-builder`,         changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/resources/furniture-quote`,           changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/resources/relocate-quiz`,             changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE}/resources/health-check`,              changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/blog`,                                changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/case-studies`,                        changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/tools/space-planner`,                 changeFrequency: 'monthly', priority: 0.65 },
    // Dynamic blog posts
    ...posts.map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...caseStudies.map(caseStudy => ({
      url: `${BASE}/case-studies/${caseStudy.slug}`,
      lastModified: new Date(caseStudy.date).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ]
}
