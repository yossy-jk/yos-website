import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const root = new URL('../', import.meta.url)
const sourceRoot = new URL('../src/', import.meta.url)
const appRoot = new URL('../src/app/', import.meta.url)
const blogRoot = new URL('../src/content/blog/', import.meta.url)

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(entryPath))
    else files.push(entryPath)
  }

  return files
}

async function internalHrefTargets() {
  const files = (await walk(sourceRoot.pathname)).filter(file => /\.(?:ts|tsx)$/.test(file))
  const targets = new Set()
  const hrefPattern = /\bhref\s*[:=]\s*['"](\/[^'"]*)['"]/g

  for (const file of files) {
    const source = await readFile(file, 'utf8')
    for (const match of source.matchAll(hrefPattern)) {
      targets.add(match[1].split(/[?#]/, 1)[0] || '/')
    }
  }

  return [...targets].sort()
}

async function routeExists(target) {
  // Public assets, including video downloads, are valid internal link targets.
  try {
    if ((await stat(new URL(`../public${target}`, import.meta.url))).isFile()) return true
  } catch {
    // Continue to application and content-backed route checks.
  }
  const pagePath = target === '/'
    ? new URL('page.tsx', appRoot)
    : new URL(`.${target}/page.tsx`, appRoot)

  try {
    return (await stat(pagePath)).isFile()
  } catch {
    // Dynamic blog routes are backed by content records rather than a static page path.
  }

  if (target.startsWith('/catalogues/')) {
    const catalogueSource = await readFile(new URL('../src/lib/catalogues.ts', import.meta.url), 'utf8')
    const ids = [...catalogueSource.matchAll(/id:\s*"([a-z]+)"/g)].map(match => match[1])
    return ids.some(id => target === `/catalogues/${id}`)
  }

  if (target.startsWith('/case-studies/')) {
    const slug = target.slice('/case-studies/'.length)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return false
    try {
      const study = JSON.parse(await readFile(new URL(`../src/content/case-studies/${slug}.json`, import.meta.url), 'utf8'))
      return study.slug === slug && study.published === true
    } catch { return false }
  }

  if (target.startsWith('/blog/') || target.startsWith('/videos/')) {
    const videoRoute = target.startsWith('/videos/')
    const slug = target.slice(videoRoute ? '/videos/'.length : '/blog/'.length)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return false
    const posts = (await readdir(blogRoot)).filter(file => file.endsWith('.json'))
    for (const post of posts) {
      const content = JSON.parse(await readFile(new URL(post, blogRoot), 'utf8'))
      if (!videoRoute && content.slug === slug) return true
      if (videoRoute && content.video?.watchSlug === slug) {
        const watchPage = new URL('videos/[slug]/page.tsx', appRoot)
        return (await stat(watchPage)).isFile()
      }
    }
  }

  return false
}

test('literal internal link targets resolve to application routes', async () => {
  const targets = await internalHrefTargets()
  const missing = []

  for (const target of targets) {
    if (!await routeExists(target)) missing.push(target)
  }

  assert.ok(targets.length > 0, `No internal link targets found below ${root.pathname}`)
  assert.deepEqual(missing, [], `Missing application routes: ${missing.join(', ')}`)
})

test('video route validation rejects unknown and malformed content paths', async () => {
  assert.equal(await routeExists('/videos/not-a-published-video'), false)
  assert.equal(await routeExists('/videos/../private'), false)
  assert.equal(await routeExists('/videos/office-fitout-project-management'), true)
})
