import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const globalsSource = await readFile(new URL('../src/app/globals.css', import.meta.url), 'utf8')
const footerSource = await readFile(new URL('../src/components/Footer.tsx', import.meta.url), 'utf8')
const fitoutEstimatorSource = await readFile(new URL('../src/app/resources/fitout-estimator/page.tsx', import.meta.url), 'utf8')
const homeSource = await readFile(new URL('../src/app/page.tsx', import.meta.url), 'utf8')
const tenantRepSource = await readFile(new URL('../src/app/tenant-rep/page.tsx', import.meta.url), 'utf8')
const cleaningSource = await readFile(new URL('../src/app/cleaning/page.tsx', import.meta.url), 'utf8')
const welcomeModalSource = await readFile(new URL('../src/components/WelcomeModal.tsx', import.meta.url), 'utf8')

function relativeLuminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => parseInt(value, 16) / 255)
  const [red, green, blue] = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ))
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first)
  const secondLuminance = relativeLuminance(second)
  return (Math.max(firstLuminance, secondLuminance) + 0.05)
    / (Math.min(firstLuminance, secondLuminance) + 0.05)
}

test('white text on YOS action teal meets WCAG AA in default and hover states', () => {
  assert.ok(contrastRatio('00796f', 'ffffff') >= 4.5)
  assert.ok(contrastRatio('006d63', 'ffffff') >= 4.5)
  assert.match(globalsSource, /--color-action-teal: rgb\(0 121 111\)/)
  assert.match(globalsSource, /--color-action-teal-hover: rgb\(0 109 99\)/)
  assert.match(globalsSource, /\.bg-teal\.text-white\s*\{[\s\S]*var\(--color-action-teal\)/)
})

test('shared footer muted copy stays above the audited dark-surface threshold', () => {
  assert.doesNotMatch(footerSource, /text-white\/(?:30|35|40)/)
  assert.doesNotMatch(footerSource, /text-teal\/70/)
})

test('brand accents and supporting copy switch to accessible colours on light surfaces', () => {
  assert.ok(contrastRatio('00796f', 'f5f5f5') >= 4.5)
  assert.ok(contrastRatio('666666', 'f5f5f5') >= 4.5)
  assert.match(globalsSource, /\.bg-warm-grey \.text-teal[\s\S]*var\(--color-action-teal\)/)
  assert.match(globalsSource, /\.bg-warm-grey \.text-mid-grey[\s\S]*var\(--color-readable-grey\)/)
  assert.match(globalsSource, /\.bg-near-black \.text-teal[\s\S]*var\(--color-teal\)/)
  assert.match(globalsSource, /\.text-white\\\/20:not\(:disabled\)[\s\S]*0\.55/)
})

test('full-width teal panels use the accessible action surface and opaque white copy', () => {
  assert.match(homeSource, /section className="bg-teal text-white"/)
  assert.doesNotMatch(homeSource, /<section className="bg-teal text-white"[\s\S]{0,1600}text-white\/80/)
  assert.match(homeSource, /lease-review#full-report" variant="secondary"/)
  assert.match(tenantRepSource, /section className="bg-teal text-white"/)
  assert.match(tenantRepSource, /<p className="text-white font-light leading-snug"/)
  assert.match(cleaningSource, /section className="bg-teal text-white"/)
  assert.match(cleaningSource, /rgba\(255,255,255,0\.55\)/)
  assert.match(welcomeModalSource, /color: '#9B9B9B'/)
})

test('fitout estimator audited intro and project captions use accessible contrast', () => {
  assert.match(fitoutEstimatorSource, /text-white\/55[\s\S]{0,180}Real market rates/)
  assert.doesNotMatch(fitoutEstimatorSource, /rgba\(255,255,255,0\.(?:4|45)\)/)
})
