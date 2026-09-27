import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const failures = []
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8')
const requireText = (file, text, label = text) => {
  if (!read(file).includes(text)) failures.push(`${file}: missing ${label}`)
}
const forbid = (file, pattern, label = String(pattern)) => {
  if (pattern.test(read(file))) failures.push(`${file}: contains forbidden ${label}`)
}

for (const token of ['#01A7A3', '#1A1A1A', '#0A3B38', '#0C7A70', '#FFFFFF', '#FAFAF8', '#F5F5F5', '#E8F4F2', '#333333', '#5A6B68', '#E5E5E5', '#C62828']) {
  requireText('src/app/globals.css', token, `Gold v3.1 colour ${token}`)
}

requireText('src/app/layout.tsx', 'Montserrat', 'canonical Montserrat import')
requireText('src/app/layout.tsx', 'weight: ["400", "600", "700"]', 'canonical Montserrat weights')
requireText('src/app/globals.css', 'var(--font-montserrat)', 'canonical font variable')
forbid('src/app/layout.tsx', /Fraunces|\bInter\b/, 'superseded typography')
forbid('src/app/globals.css', /font-(?:fraunces|inter)|Fraunces|\bInter\b/, 'superseded typography')

for (const service of ['Tenant Representation', 'Commercial Fit Out & Project Management', 'Office & Commercial Furniture']) {
  requireText('src/lib/constants.ts', service, `core service ${service}`)
  requireText('src/app/page.tsx', service, `homepage core service ${service}`)
}
requireText('src/app/page.tsx', 'Three core services.', 'three-service hierarchy')
requireText('src/app/page.tsx', 'Once you&apos;re in', 'supplementary cleaning placement')
requireText('src/app/page.tsx', 'Commercial cleaning for Newcastle and the Hunter', 'local cleaning scope')
forbid('src/app/page.tsx', /Four services\./, 'four equal services framing')

const globalCssBeforeEnforcement = read('src/app/globals.css').split('/* ─── Gold Standard v3.1 runtime enforcement')[0]
for (const [file, contents] of [
  ['src/app/globals.css', globalCssBeforeEnforcement],
  ['src/app/page.tsx', read('src/app/page.tsx')],
]) {
  if (/(?:linear|radial|conic)-gradient/.test(contents)) failures.push(`${file}: contains forbidden decorative gradient`)
  if (/box-shadow|hover:shadow|drop-shadow/.test(contents)) failures.push(`${file}: contains forbidden decorative shadow`)
  if (/font-style:\s*italic|\bitalic\b/.test(contents)) failures.push(`${file}: contains forbidden italic styling`)
}

forbid('src/app/page.tsx', /best-in-class|world-class|cutting-edge|game-changer|move the needle|unlock|elevate|empower/i, 'auto-flagged marketing language')
forbid('src/app/page.tsx', /100\+|12\+ years|over a decade|fee guarantee|three times the fee/i, 'unverified numerical claim')

const publicDiscovery = [
  'src/app/layout.tsx', 'src/app/page.tsx', 'src/components/Nav.tsx', 'src/components/Footer.tsx',
  'src/components/Search.tsx', 'src/app/sitemap.ts', 'src/app/about/page.tsx', 'src/app/contact/page.tsx',
]
for (const file of publicDiscovery) {
  forbid(file, /\/buyers-agency|buyers agency|buyers advocacy/i, 'public Buyers Agency promotion')
}
requireText('src/app/buyers-agency/page.tsx', 'robots: { index: false, follow: false }', 'referral-only noindex')
requireText('src/app/robots.ts', "'/buyers-agency'", 'crawler exclusion')

if (failures.length) {
  console.error('YOS Gold Standard v3.1 check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('YOS Gold Standard v3.1 foundational check passed.')
console.log('- Canonical palette and Montserrat typography are wired globally.')
console.log('- Three equal core services and supplementary local cleaning are enforced.')
console.log('- Homepage gradients, effects, hype and unverified claims are blocked.')
console.log('- Buyers Agency remains outside public discovery surfaces.')
