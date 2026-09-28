import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = process.cwd()
const failures = []

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function requireText(relativePath, expected, label = expected) {
  if (!read(relativePath).includes(expected)) failures.push(`${relativePath}: missing ${label}`)
}

function forbidText(relativePath, forbidden, label = forbidden) {
  if (read(relativePath).includes(forbidden)) failures.push(`${relativePath}: contains forbidden ${label}`)
}

function forbidPattern(relativePath, pattern, label = String(pattern)) {
  if (pattern.test(read(relativePath))) failures.push(`${relativePath}: contains forbidden ${label}`)
}

const approvedServices = [
  'Tenant Representation',
  'Commercial Fit Out & Project Management',
  'Office & Commercial Furniture',
  'Commercial Cleaning',
]

const capabilityStatementPath = path.join(root, 'public/YOS-Capability-Statement.pdf')
const capabilityStatementHash = createHash('sha256')
  .update(fs.readFileSync(capabilityStatementPath))
  .digest('hex')
const approvedCapabilityStatementHash = '30c10bc67f61bd2b1fe3e8ddc986bcc5a8bed4060c3051355c393e7793fd6898'
if (capabilityStatementHash !== approvedCapabilityStatementHash) {
  failures.push('public/YOS-Capability-Statement.pdf: does not match the approved Brand v1.1 capability statement')
}

for (const token of ['#00B5A5', '#1A1A1A', '#00796D', '#E0F5F3', '#F5F5F5', '#6B6B6B', '#333333']) {
  requireText('src/app/globals.css', token, `approved colour token ${token}`)
}

requireText('src/app/layout.tsx', 'Montserrat', 'Montserrat font')
requireText('src/app/globals.css', 'var(--font-montserrat)', 'Montserrat variable')
forbidText('src/app/layout.tsx', 'Fraunces', 'superseded Fraunces font')
forbidText('src/app/layout.tsx', 'Inter', 'superseded Inter font')
requireText('src/app/page.tsx', 'One team. Clear direction. No guesswork.', 'primary tagline')
requireText('src/app/page.tsx', 'One accountable partner', 'one accountable partner message')
requireText('src/app/page.tsx', 'Book a Clarity Call', 'primary call to action')
requireText('src/app/page.tsx', 'Three core services.', 'three-core-service hierarchy')
requireText('src/app/page.tsx', 'Once you&apos;re in', 'supplementary cleaning hierarchy')
requireText('src/components/BookingCTA.tsx', 'identify the clearest next step', 'approved evidence-safe Clarity Call format')

for (const service of approvedServices) {
  requireText('src/lib/constants.ts', service, `approved service ${service}`)
  requireText('src/app/page.tsx', service, `homepage service ${service}`)
}

const publicDiscoverySurfaces = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/components/Nav.tsx',
  'src/components/Footer.tsx',
  'src/components/Search.tsx',
  'src/app/sitemap.ts',
  'src/app/not-found.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/cleaning/page.tsx',
  'src/app/market-snapshot/page.tsx',
  'src/app/newcastle-commercial-property/page.tsx',
  'src/app/blog/[slug]/page.tsx',
  'src/app/resources/lease-vs-buy/page.tsx',
  'src/app/resources/land-tax-calculator/page.tsx',
  'src/app/privacy/page.tsx',
  'src/lib/seo-keywords.ts',
]

for (const relativePath of publicDiscoverySurfaces) {
  forbidText(relativePath, '/buyers-agency', 'public Buyers Agency link')
  forbidPattern(relativePath, /buyers agency|buyers advocacy/i, 'public Buyers Agency promotion')
  forbidPattern(relativePath, /no pitch|one business day/i, 'retired promise or sales-language phrase')
}

requireText('src/app/buyers-agency/page.tsx', 'robots: { index: false, follow: false }', 'referral-only noindex rule')
requireText('src/app/buyers-agency/page.tsx', 'This capability is not part of the current public service offer.', 'referral-only capability notice')
requireText('src/app/robots.ts', "'/buyers-agency'", 'Buyers Agency crawler exclusion')
requireText('src/lib/blog.ts', "post.division !== 'buyers-agency'", 'public article filter')
forbidPattern('src/app/buyers-agency/page.tsx', /60%\+|12\+|100%|three times|fee guarantee|best commercial deals/i, 'unverified referral-page claim')

const publicClaimPattern = /more than half|over 50%|74%|\b3x\b|three times (?:the|our|that) fee|fee guarantee|100\+|12\+ years/i
const blogDirectory = path.join(root, 'src/content/blog')
for (const entry of fs.readdirSync(blogDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.json')) continue
  const relativePath = `src/content/blog/${entry.name}`
  const post = JSON.parse(read(relativePath))
  if (post.division === 'buyers-agency') continue
  const publicCopy = [post.title, post.excerpt, post.metaDescription, post.content, post.body]
    .filter(Boolean)
    .join('\n')
  if (publicClaimPattern.test(publicCopy)) failures.push(`${relativePath}: contains an unverified public claim`)
}

for (const phrase of [
  'Get a professional lease review in 24 hours',
  'Three services',
  'over half of commercial property',
  'Over 74% of commercial property',
  '$180,000 make-good bill',
  '<FeeGuarantee />',
  '<AgentNetworkBanner />',
  '<WelcomeModal />',
]) {
  forbidText('src/app/page.tsx', phrase, `homepage phrase/component ${phrase}`)
}

forbidText('src/app/tenant-rep/page.tsx', '<AgentNetworkBanner />', 'unverified market statistic banner')
forbidPattern('src/app/about/page.tsx', /100\+|12\+ years|over a decade|buyers agency|buyers advocacy/i, 'unverified About-page claim')

try {
  const matches = execFileSync(
    'git',
    ['grep', '-n', '-I', '-E', '#01A7A3|#01a7a3|#0A3B38|#0a3b38|#0C7A70|#0c7a70|#E8F4F2|#e8f4f2|#FAFAF8|#fafaf8|#5A6B68|#5a6b68|Fraunces|font-inter', '--', 'src', ':(exclude)src/**/*.bak*'],
    { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  )
  if (matches.trim()) failures.push(`application source contains legacy brand tokens:\n${matches.trim()}`)
} catch (error) {
  if (error?.status !== 1) throw error
}

try {
  const matches = execFileSync(
    'git',
    [
      'grep', '-n', '-I', '-E',
      '—|no pitch|one business day',
      '--',
      'src/app/**/*.ts', 'src/app/**/*.tsx',
      'src/components/**/*.ts', 'src/components/**/*.tsx',
      'src/content/blog/*.json',
    ],
    { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  )
  const publicMatches = matches
    .split('\n')
    .filter(Boolean)
    .filter(line => !line.startsWith('src/app/api/'))
    .filter(line => !line.startsWith('src/app/dashboard/'))
  if (publicMatches.length) failures.push(`public website copy contains retired language:\n${publicMatches.join('\n')}`)
} catch (error) {
  if (error?.status !== 1) throw error
}

if (failures.length > 0) {
  console.error('Brand & Design System v3.1 check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Brand & Design System v3.1 check passed.')
console.log('- Approved palette and typography are wired globally.')
console.log('- Homepage positions three core services and supplementary cleaning correctly.')
console.log('- Buyers Agency remains referral-only and is not publicly promoted.')
console.log('- Legacy brand tokens are absent from application source.')
console.log('- Public copy is free of em dashes, no-pitch language and one-business-day promises.')
console.log('- The public capability statement matches the approved Brand v1.1 asset.')
