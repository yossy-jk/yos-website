import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * @param {string} filename
 * @param {number} expiresAt
 * @param {string} secret
 */
export function createDownloadToken(filename, expiresAt, secret) {
  if (!filename || !Number.isInteger(expiresAt) || !secret) throw new Error('Invalid download-token input')
  const payload = Buffer.from(`${filename}:${expiresAt}`).toString('base64url')
  const signature = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

/**
 * @param {string} raw
 * @param {string} filename
 * @param {string | undefined} secret
 * @param {number} [now]
 */
export function validateDownloadToken(raw, filename, secret, now = Math.floor(Date.now() / 1000)) {
  if (!raw || !filename || !secret) return false
  try {
    const tokenParts = raw.split('.')
    if (tokenParts.length !== 2) return false
    const [payload, suppliedSignature] = tokenParts
    const decoded = Buffer.from(payload, 'base64url').toString('utf8')
    const parts = decoded.split(':')
    if (parts.length !== 2 || parts[0] !== filename) return false
    const expiresAt = Number.parseInt(parts[1], 10)
    if (!Number.isInteger(expiresAt) || now > expiresAt) return false
    const expected = createHmac('sha256', secret).update(payload).digest()
    const supplied = Buffer.from(suppliedSignature, 'base64url')
    return supplied.length === expected.length && timingSafeEqual(supplied, expected)
  } catch {
    return false
  }
}
