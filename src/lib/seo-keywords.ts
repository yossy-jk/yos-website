// YOS SEO & AEO Keyword Intelligence
// Research basis: Google Keyword Planner AU data (April 2026), Brave Search, market analysis
// Difficulty: 1-100 (lower = easier to rank). Volume: AU monthly searches estimated.
// Priority: immediate (rank quickly), medium (3-6mo), long (6-12mo+)

export type Keyword = {
  id: string
  keyword: string
  division: 'tenant-rep' | 'cleaning' | 'furniture' | 'buyers-agency' | 'leaseintel' | 'brand'
  monthlyVolume: number        // AU estimated monthly searches
  difficulty: number           // 1-100 (lower = easier)
  intent: 'commercial' | 'informational' | 'navigational' | 'transactional'
  priority: 'immediate' | 'medium' | 'long'
  currentRank: number | null   // null = not tracked yet / not ranking
  targetPage: string           // which page on site should rank
  contentGap: string | null    // blog/page to create if we're not ranking
  aeoFit: boolean              // suitable for AI answer engine (ChatGPT, Perplexity, Gemini)
  notes: string
}

export const KEYWORDS: Keyword[] = [
  // ── TENANT REP ─────────────────────────────────────────────────────────────
  {
    id: 'tr-01',
    keyword: 'tenant representation Newcastle',
    division: 'tenant-rep',
    monthlyVolume: 90,
    difficulty: 22,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/tenant-rep',
    contentGap: null,
    aeoFit: true,
    notes: 'Low competition, high intent. We should own this. Priority 1.'
  },
  {
    id: 'tr-02',
    keyword: 'commercial tenant representative NSW',
    division: 'tenant-rep',
    monthlyVolume: 140,
    difficulty: 28,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/tenant-rep',
    contentGap: null,
    aeoFit: true,
    notes: 'Broad NSW intent. Captures Sydney and regional businesses.'
  },
  {
    id: 'tr-03',
    keyword: 'commercial lease negotiation Newcastle',
    division: 'tenant-rep',
    monthlyVolume: 110,
    difficulty: 25,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/tenant-rep',
    contentGap: 'blog: how-to-negotiate-rent-free-period-commercial-lease',
    aeoFit: true,
    notes: 'High buying intent. Someone searching this is ready to engage.'
  },
  {
    id: 'tr-04',
    keyword: 'what is make good in a commercial lease',
    division: 'tenant-rep',
    monthlyVolume: 320,
    difficulty: 35,
    intent: 'informational',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/blog/what-is-make-good',
    contentGap: null,
    aeoFit: true,
    notes: 'High volume informational. Blog post already exists. Strong AEO candidate — AI tools often answer this.'
  },
  {
    id: 'tr-05',
    keyword: 'commercial lease review Newcastle',
    division: 'tenant-rep',
    monthlyVolume: 80,
    difficulty: 20,
    intent: 'transactional',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/leaseintel',
    contentGap: null,
    aeoFit: true,
    notes: 'Direct service intent. LeaseIntel page is the target.'
  },
  {
    id: 'tr-06',
    keyword: 'how to negotiate a commercial lease Australia',
    division: 'tenant-rep',
    monthlyVolume: 480,
    difficulty: 42,
    intent: 'informational',
    priority: 'medium',
    currentRank: null,
    targetPage: '/blog/commercial-lease-negotiation-tips-australia',
    contentGap: null,
    aeoFit: true,
    notes: 'High volume. Blog exists. Strong AEO candidate — frequently appears in AI summaries.'
  },
  {
    id: 'tr-07',
    keyword: 'tenant rights commercial lease NSW',
    division: 'tenant-rep',
    monthlyVolume: 390,
    difficulty: 38,
    intent: 'informational',
    priority: 'medium',
    currentRank: null,
    targetPage: '/blog/commercial-tenant-rights-nsw',
    contentGap: null,
    aeoFit: true,
    notes: 'High AEO fit — AI assistants regularly answer tenant rights questions.'
  },
  {
    id: 'tr-08',
    keyword: 'commercial lease expiry 12 months what to do',
    division: 'tenant-rep',
    monthlyVolume: 110,
    difficulty: 18,
    intent: 'informational',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/blog/12-months-lease-strategy',
    contentGap: null,
    aeoFit: true,
    notes: 'New blog just published. Low difficulty, high intent. Should rank fast.'
  },

  // ── CLEANING ────────────────────────────────────────────────────────────────
  {
    id: 'cl-01',
    keyword: 'commercial cleaning Newcastle',
    division: 'cleaning',
    monthlyVolume: 590,
    difficulty: 45,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/cleaning',
    contentGap: null,
    aeoFit: false,
    notes: 'Core service keyword. AU national volume for "commercial cleaning" is 5,400/mo. Newcastle slice ~590. CPC up to $40. Must rank.'
  },
  {
    id: 'cl-02',
    keyword: 'office cleaning Newcastle',
    division: 'cleaning',
    monthlyVolume: 320,
    difficulty: 38,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/cleaning',
    contentGap: null,
    aeoFit: false,
    notes: 'High local intent. Slightly lower competition than commercial cleaning.'
  },
  {
    id: 'cl-03',
    keyword: 'medical cleaning Newcastle',
    division: 'cleaning',
    monthlyVolume: 90,
    difficulty: 22,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/cleaning',
    contentGap: 'blog: medical-practice-cleaning-standards-newcastle',
    aeoFit: true,
    notes: 'Niche but high value. Healthcare cleaning contracts are $2k+/month. Low competition.'
  },
  {
    id: 'cl-04',
    keyword: 'commercial cleaning contract Hunter Valley',
    division: 'cleaning',
    monthlyVolume: 70,
    difficulty: 18,
    intent: 'transactional',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/cleaning',
    contentGap: null,
    aeoFit: false,
    notes: 'Very low competition. Pure commercial intent. Easy win.'
  },
  {
    id: 'cl-05',
    keyword: 'what does a good commercial cleaning contract include',
    division: 'cleaning',
    monthlyVolume: 210,
    difficulty: 28,
    intent: 'informational',
    priority: 'medium',
    currentRank: null,
    targetPage: '/blog/what-good-commercial-cleaning-looks-like',
    contentGap: null,
    aeoFit: true,
    notes: 'AEO candidate. Business owners ask this to AI tools. Blog exists.'
  },

  // ── FURNITURE & FITOUT ──────────────────────────────────────────────────────
  {
    id: 'fu-01',
    keyword: 'office fitout Newcastle',
    division: 'furniture',
    monthlyVolume: 260,
    difficulty: 35,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/furniture',
    contentGap: null,
    aeoFit: false,
    notes: 'Core service keyword. Direct buying intent.'
  },
  {
    id: 'fu-02',
    keyword: 'office furniture Newcastle',
    division: 'furniture',
    monthlyVolume: 480,
    difficulty: 42,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/furniture',
    contentGap: null,
    aeoFit: false,
    notes: 'High volume. Competitive but achievable with domain authority growth.'
  },
  {
    id: 'fu-03',
    keyword: 'how much does an office fitout cost Australia',
    division: 'furniture',
    monthlyVolume: 720,
    difficulty: 48,
    intent: 'informational',
    priority: 'medium',
    currentRank: null,
    targetPage: '/blog/office-fitout-cost-guide-australia-2026',
    contentGap: null,
    aeoFit: true,
    notes: 'Very high volume. AEO gold — AI assistants regularly cite cost guides. Blog exists.'
  },
  {
    id: 'fu-04',
    keyword: 'sit stand desk Newcastle',
    division: 'furniture',
    monthlyVolume: 140,
    difficulty: 28,
    intent: 'transactional',
    priority: 'medium',
    currentRank: null,
    targetPage: '/furniture',
    contentGap: 'blog: ergonomic-office-setup-newcastle-guide',
    aeoFit: false,
    notes: 'Product-level keyword. Shopify store is better target long-term.'
  },

  // ── BUYERS AGENCY ───────────────────────────────────────────────────────────
  {
    id: 'ba-01',
    keyword: 'commercial buyers agent Newcastle',
    division: 'buyers-agency',
    monthlyVolume: 110,
    difficulty: 22,
    intent: 'commercial',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/buyers-agency',
    contentGap: null,
    aeoFit: true,
    notes: 'Emerging category in Newcastle. Very low competition. First mover advantage available.'
  },
  {
    id: 'ba-02',
    keyword: 'how to buy commercial property Australia',
    division: 'buyers-agency',
    monthlyVolume: 880,
    difficulty: 52,
    intent: 'informational',
    priority: 'medium',
    currentRank: null,
    targetPage: '/blog/how-to-buy-commercial-property-australia',
    contentGap: null,
    aeoFit: true,
    notes: 'High national volume. AEO very strong — AI frequently answers this. Blog exists.'
  },
  {
    id: 'ba-03',
    keyword: 'buying vs leasing commercial property Newcastle',
    division: 'buyers-agency',
    monthlyVolume: 90,
    difficulty: 20,
    intent: 'informational',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/blog/buying-vs-leasing-commercial-newcastle',
    contentGap: null,
    aeoFit: true,
    notes: 'Low difficulty, decision-stage intent. Blog exists. Should rank quickly.'
  },

  // ── LEASEINTEL ──────────────────────────────────────────────────────────────
  {
    id: 'li-01',
    keyword: 'commercial lease risk checker',
    division: 'leaseintel',
    monthlyVolume: 70,
    difficulty: 15,
    intent: 'transactional',
    priority: 'immediate',
    currentRank: null,
    targetPage: '/leaseintel',
    contentGap: null,
    aeoFit: true,
    notes: 'Very low competition. We may be the only tool ranking for this nationally.'
  },
  {
    id: 'li-02',
    keyword: 'lease review service Australia',
    division: 'leaseintel',
    monthlyVolume: 210,
    difficulty: 30,
    intent: 'transactional',
    priority: 'medium',
    currentRank: null,
    targetPage: '/leaseintel',
    contentGap: null,
    aeoFit: true,
    notes: 'National scope. Strong commercial intent. Medium competition.'
  },
]

export function getKeywordsByDivision(division: Keyword['division']) {
  return KEYWORDS.filter(k => k.division === division)
}

export function getKeywordsByPriority(priority: Keyword['priority']) {
  return KEYWORDS.filter(k => k.priority === priority)
}

export function getAEOKeywords() {
  return KEYWORDS.filter(k => k.aeoFit)
}

export function getContentGaps() {
  return KEYWORDS.filter(k => k.contentGap !== null)
}

export type SEOSnapshot = {
  date: string
  totalKeywords: number
  ranking: number      // keywords with a known rank
  immediate: number
  contentGaps: number
  aeoTargets: number
  divisionBreakdown: Record<string, number>
}

export function getSEOSnapshot(): SEOSnapshot {
  const ranking = KEYWORDS.filter(k => k.currentRank !== null && k.currentRank <= 100).length
  const divisionBreakdown: Record<string, number> = {}
  KEYWORDS.forEach(k => {
    divisionBreakdown[k.division] = (divisionBreakdown[k.division] || 0) + 1
  })
  return {
    date: new Date().toISOString(),
    totalKeywords: KEYWORDS.length,
    ranking,
    immediate: getKeywordsByPriority('immediate').length,
    contentGaps: getContentGaps().length,
    aeoTargets: getAEOKeywords().length,
    divisionBreakdown,
  }
}
