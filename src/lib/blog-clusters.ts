export const BLOG_CLUSTERS = [
  {
    id: 'office-fitout-newcastle', label: 'Commercial & office FitOut Newcastle', shortLabel: 'Office FitOut',
    searchTerms: ['Commercial Fitout Newcastle', 'Office Fitout Newcastle'],
    description: 'Connect the workplace brief, shell condition, design, budget, programme and handover before committing to your Newcastle premises.',
    serviceHref: '/office-fitout', serviceLabel: 'Explore commercial and office FitOut support',
    slugs: ['office-fitout-newcastle-planning-checklist', 'commercial-fitout-cost-newcastle-2026', 'office-fitout-timeline-newcastle', 'office-fitout-handover-checklist', 'office-fitout-guide-australia-2026', 'office-fitout-cost-guide-australia-2026', 'office-space-per-person-australia'],
  },
  {
    id: 'office-furniture-newcastle', label: 'Office furniture Newcastle', shortLabel: 'Office furniture',
    searchTerms: ['Office Furniture Newcastle'],
    description: 'Work from a measured furniture brief to product selection, comparable installed quotes and a practical delivery plan.',
    serviceHref: '/furniture', serviceLabel: 'Explore office furniture supply and installation',
    slugs: ['office-furniture-newcastle', 'office-desks-newcastle', 'office-chairs-newcastle', 'office-furniture-budget-newcastle', 'compare-office-furniture-quotes-installed-cost', 'office-furniture-installation-checklist-newcastle', 'boardroom-office-furniture-newcastle', 'height-adjustable-desks-newcastle', 'standard-modified-custom-office-furniture-newcastle', 'office-furniture-reuse-audit-newcastle', 'adaptable-office-furniture-growth-relocation', 'flexible-office-layout-hybrid-teams-newcastle', 'buy-office-furniture-before-lease-expiry', 'commercial-furniture-supplier-guide-australia'],
  },
  {
    id: 'commercial-cleaning-newcastle', label: 'Commercial cleaning Newcastle', shortLabel: 'Commercial cleaning',
    searchTerms: ['Commercial cleaning Newcastle'],
    description: 'Define the cleaning scope, compare whole-service costs, review quality and plan a provider changeover. YOS cleaning covers Newcastle CBD and Lake Macquarie.',
    serviceHref: '/cleaning', serviceLabel: 'Explore commercial cleaning and request a scope review',
    slugs: ['commercial-cleaning-newcastle-what-to-expect', 'commercial-cleaning-cost-newcastle', 'switch-commercial-cleaning-company-newcastle', 'what-good-commercial-cleaning-looks-like', 'commercial-cleaning-scope-busier-office'],
  },
  {
    id: 'office-construction-newcastle', label: 'Office construction Newcastle', shortLabel: 'Office construction',
    searchTerms: ['Office Construction Newcastle'],
    description: 'Clarify appointments, compare construction scope and organise client decisions. YOS provides client-side project management; appointed contractors perform the construction work.',
    serviceHref: '/commercial-construction', serviceLabel: 'Explore client-side construction project management',
    slugs: ['commercial-construction-project-manager-vs-builder-newcastle', 'compare-office-construction-quotes-newcastle', 'residential-vs-commercial-construction-nsw'],
  },
] as const

export type BlogCluster = typeof BLOG_CLUSTERS[number]
export type BlogClusterId = BlogCluster['id']

export function getBlogCluster(slug: string): BlogCluster | undefined {
  return BLOG_CLUSTERS.find(cluster => (cluster.slugs as readonly string[]).includes(slug))
}
