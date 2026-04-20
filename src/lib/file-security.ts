/**
 * LeaseIntel™ File Security
 *
 * Two-layer protection for uploaded lease documents:
 *   1. VirusTotal hash scan — checks SHA-256 against 70+ AV engines
 *   2. AES-256-GCM encryption — encrypts file before transmission
 *
 * Both run client-side using the Web Crypto API (built into all modern browsers).
 * No third-party library required.
 */

/* ─── SHA-256 hash ───────────────────────────────────────── */

export async function sha256Hex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/* ─── VirusTotal hash lookup ─────────────────────────────── */

export type ScanResult =
  | { status: 'clean'; engines: number; hash: string }
  | { status: 'malicious'; detections: number; engines: number; hash: string; permalink: string }
  | { status: 'unknown'; hash: string }   // Hash not in VT database — file is new, proceed
  | { status: 'error'; reason: string }   // API unreachable — fail open (don't block upload)

export async function virusTotalScan(file: File): Promise<ScanResult> {
  const apiKey = process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY
  if (!apiKey) return { status: 'error', reason: 'VT API key not configured' }

  let hash: string
  try {
    hash = await sha256Hex(file)
  } catch {
    return { status: 'error', reason: 'Could not hash file' }
  }

  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
      headers: { 'x-apikey': apiKey },
    })

    // 404 = hash not in VT database = file has never been seen = unknown (not necessarily clean)
    if (res.status === 404) return { status: 'unknown', hash }

    if (!res.ok) return { status: 'error', reason: `VT API returned ${res.status}` }

    const data = await res.json()
    const stats = data?.data?.attributes?.last_analysis_stats as Record<string, number> | undefined
    const permalink = data?.data?.links?.self as string | undefined

    if (!stats) return { status: 'error', reason: 'Unexpected VT response shape' }

    const malicious = (stats.malicious ?? 0) + (stats.suspicious ?? 0)
    const total = Object.values(stats).reduce((a, b) => a + b, 0)

    if (malicious > 0) {
      return { status: 'malicious', detections: malicious, engines: total, hash, permalink: permalink ?? '' }
    }

    return { status: 'clean', engines: total, hash }

  } catch {
    // Network error, CORS issue, rate limit — fail open so legit users aren't blocked
    return { status: 'error', reason: 'VT API unreachable' }
  }
}

/* ─── AES-256-GCM encryption ─────────────────────────────── */

/**
 * Derives a 256-bit AES-GCM key from a passphrase using PBKDF2.
 * Salt is fixed per deployment (stored in env). IV is random per file.
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 250_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )
}

export interface EncryptedFile {
  blob: Blob
  filename: string   // original filename + .enc extension
  ivHex: string      // 12-byte IV as hex — needed to decrypt
  saltHex: string    // 16-byte salt as hex — needed to decrypt
}

/**
 * Encrypts a File using AES-256-GCM.
 * Returns an encrypted Blob, the IV, and the salt.
 * The encrypted file is useless without the passphrase, IV, and salt.
 */
export async function encryptFile(file: File): Promise<EncryptedFile> {
  const passphrase = process.env.NEXT_PUBLIC_LEASE_ENCRYPT_KEY
  if (!passphrase) throw new Error('Encryption key not configured')

  // Random 16-byte salt and 12-byte IV — both unique per file
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv   = crypto.getRandomValues(new Uint8Array(12))

  const key = await deriveKey(passphrase, new Uint8Array(salt.buffer))
  const plaintext = await file.arrayBuffer()

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  )

  // Prepend a 4-byte magic header so we know this is a YOS encrypted file
  const magic = new TextEncoder().encode('YOSL')
  const combined = new Uint8Array(magic.byteLength + ciphertext.byteLength)
  combined.set(magic, 0)
  combined.set(new Uint8Array(ciphertext), magic.byteLength)

  const toHex = (arr: Uint8Array) => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')

  return {
    blob: new Blob([combined], { type: 'application/octet-stream' }),
    filename: `${file.name}.enc`,
    ivHex: toHex(iv),
    saltHex: toHex(salt),
  }
}
