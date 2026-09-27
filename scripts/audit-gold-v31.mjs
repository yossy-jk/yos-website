import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baseUrl = (process.env.AUDIT_BASE_URL || 'https://www.yourofficespace.au').replace(/\/$/, '')
const publicBaseUrl = 'https://www.yourofficespace.au'
const reportName = process.env.AUDIT_REPORT_NAME || (baseUrl === publicBaseUrl ? 'gold-v31-live-audit' : 'gold-v31-candidate-audit')
const outDir = path.join(root, 'audit')
const bannedLanguage = [
  'certainly', 'great question', 'delve', 'deep dive', 'holistic', 'seamlessly',
  'transformative', 'robust', 'scalable', 'game-changer', 'passionate about',
  "in today's fast-paced world", 'solutions', 'synergies',
  'ecosystem', 'paradigm', 'best-in-class', 'world-class', 'innovative',
  'cutting-edge', 'exciting journey', 'thrilled to announce', 'delighted to share',
  'touch base', 'circle back', 'bandwidth', 'move the needle', 'low-hanging fruit',
  'unlock', 'elevate', 'empower',
]

function textOf(html, tag) {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match?.[1]?.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim() || ''
}

function meta(html, name, property = false) {
  const key = property ? 'property' : 'name'
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`<meta\\b[^>]*${key}=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*${key}=["']${escaped}["'][^>]*>`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1].trim()
  }
  return ''
}

function linkRel(html, rel) {
  const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`<link\\b[^>]*rel=["']${escaped}["'][^>]*href=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<link\\b[^>]*href=["']([^"']*)["'][^>]*rel=["']${escaped}["'][^>]*>`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1].trim()
  }
  return ''
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'YOS-Gold-v3.1-audit/1.0' } })
  return { response, body: await response.text() }
}

const sitemap = await fetchText(`${baseUrl}/sitemap.xml`)
if (!sitemap.response.ok) throw new Error(`Sitemap fetch failed: ${sitemap.response.status}`)
const urls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => {
  const listed = match[1].trim()
  return baseUrl === publicBaseUrl ? listed : listed.replace(publicBaseUrl, baseUrl)
})

const pages = []
for (const url of urls) {
  try {
    const { response, body } = await fetchText(url)
    const visible = body
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
    const title = textOf(body, 'title')
    const description = meta(body, 'description')
    const canonical = linkRel(body, 'canonical')
    const h1Count = count(body, /<h1\b/gi)
    const mainCount = count(body, /<main\b/gi)
    const jsonLdCount = count(body, /<script\b[^>]*type=["']application\/ld\+json["']/gi)
    const languageFlags = bannedLanguage.filter(term => new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(visible))
    if (/\bleverag(?:e|es|ed|ing)\s+(?:the|your|our|this|that|data|technology|insight|relationship|network|platform|tool)\b/i.test(visible)) {
      languageFlags.push('leverage used as a verb')
    }
    const checks = {
      status: response.status === 200,
      title: title.length >= 20 && title.length <= 65,
      description: description.length >= 70 && description.length <= 170,
      canonical: canonical === url || canonical === url.replace(baseUrl, publicBaseUrl) || (url === `${baseUrl}/` && [baseUrl, publicBaseUrl].includes(canonical)),
      openGraph: Boolean(meta(body, 'og:title', true) && meta(body, 'og:description', true) && meta(body, 'og:image', true)),
      twitter: Boolean(meta(body, 'twitter:card')),
      singleH1: h1Count === 1,
      mainLandmark: mainCount === 1,
      structuredData: jsonLdCount > 0,
      plainLanguage: languageFlags.length === 0,
      noPublicBuyersAgency: !visible.includes('buyers agency') && !visible.includes('buyers advocacy'),
    }
    const passed = Object.values(checks).filter(Boolean).length
    pages.push({
      url,
      status: response.status,
      title,
      titleLength: title.length,
      descriptionLength: description.length,
      canonical,
      h1Count,
      mainCount,
      jsonLdCount,
      languageFlags,
      checks,
      score: Math.round((passed / Object.keys(checks).length) * 100),
    })
  } catch (error) {
    pages.push({ url, status: 0, error: String(error), checks: {}, score: 0 })
  }
}

const sourceFiles = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.(css|ts|tsx|js|mjs)$/.test(entry.name)) sourceFiles.push(full)
  }
}
walk(path.join(root, 'src'))
const sourceRules = {
  legacyTypography: /Fraunces|Inter|font-fraunces|font-inter/g,
  gradient: /linear-gradient|radial-gradient|conic-gradient/g,
  shadow: /box-shadow|drop-shadow|shadow-(?!none)/g,
  oversizedRadius: /rounded-(?:md|lg|xl|2xl|3xl|full)|border-radius:\s*(?:0\.[5-9]|[1-9])rem|border-radius:\s*(?:[5-9]|[1-9][0-9]+)px/g,
  hoverLift: /translateY\s*\(\s*-|hover:-translate-y/g,
  italic: /font-style:\s*italic|\bitalic\b/g,
}
const sourceFindings = []
for (const file of sourceFiles) {
  const contents = fs.readFileSync(file, 'utf8')
  for (const [rule, pattern] of Object.entries(sourceRules)) {
    pattern.lastIndex = 0
    const matches = contents.match(pattern)
    if (matches?.length) sourceFindings.push({ file: path.relative(root, file), rule, count: matches.length })
  }
}

const report = {
  standard: 'YOS Brand & Design Gold Standard v3.1',
  generatedAt: new Date().toISOString(),
  sitemap: `${baseUrl}/sitemap.xml`,
  pageCount: pages.length,
  passingPages: pages.filter(page => page.score === 100).length,
  averageScore: Math.round(pages.reduce((sum, page) => sum + page.score, 0) / Math.max(pages.length, 1)),
  pages,
  sourceFindings,
}

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, `${reportName}.json`), `${JSON.stringify(report, null, 2)}\n`)

const md = [
  '# YOS Website Gold Standard v3.1 Audit',
  '',
  `Generated: ${report.generatedAt}`,
  `Live pages audited: ${report.pageCount}`,
  `Pages passing every automated check: ${report.passingPages}`,
  `Average automated score: ${report.averageScore}%`,
  '',
  '> Automated checks are evidence, not final editorial approval. Truth, permission, photography and message quality still require human review.',
  '',
  '## Page register',
  '',
  '| Score | Status | Page | Failed checks |',
  '|---:|---:|---|---|',
  ...pages.map(page => {
    const failed = Object.entries(page.checks || {}).filter(([, ok]) => !ok).map(([name]) => name).join(', ') || 'None'
    return `| ${page.score}% | ${page.status} | ${page.url.replace(baseUrl, '') || '/'} | ${failed} |`
  }),
  '',
  '## Source-system findings',
  '',
  '| Rule | File | Count |',
  '|---|---|---:|',
  ...sourceFindings.map(item => `| ${item.rule} | \`${item.file}\` | ${item.count} |`),
  '',
].join('\n')
fs.writeFileSync(path.join(outDir, `${reportName}.md`), md)

console.log(JSON.stringify({ pageCount: report.pageCount, passingPages: report.passingPages, averageScore: report.averageScore, sourceFindings: sourceFindings.length }))
