import { MetadataRoute } from 'next'

const BASE = 'https://yourofficespace.au'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  return [
    { url: BASE,                                     lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tenant-rep`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/buyers-agency`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/furniture`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/cleaning`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/lease-review`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,                        lastModified: now, changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/resources`,                      lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/resources/lease-review`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/fitout-estimator`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/lease-comparison`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/resources/stamp-duty-calculator`,lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/land-tax-calculator`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/rental-yield-calculator`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/resources/cap-rate-calculator`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/purchase-checklist`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE}/resources/furniture-quote`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE}/leaseintel`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/blog`,                           lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/case-studies`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
