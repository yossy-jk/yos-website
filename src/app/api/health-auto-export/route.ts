/**
 * POST /api/health-auto-export
 * Receives ZIP exports from Health Auto Export iOS app.
 * Automation: set in app → Automation → Webhook → daily at 6am AEST.
 *
 * Payload: multipart/form-data with fields:
 *   - startDate, endDate, healthTypes (comma-separated)
 *   - file: the ZIP export
 *
 * Flow: unzip → parse CSVs → store in Redis as yos:health:latest
 * Dashboard health tab reads from yos:health:daily:{YYYY-MM-DD}
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { execSync } from 'child_process'
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

async function redisSet(key: string, value: string, exSeconds?: number): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  const url = exSeconds
    ? `${UPSTASH_URL}/set/${encodeURIComponent(key)}?ex=${exSeconds}`
    : `${UPSTASH_URL}/set/${encodeURIComponent(key)}`
  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  })
}

async function redisSetJson(key: string, value: unknown, exSeconds?: number): Promise<void> {
  await redisSet(key, JSON.stringify(value), exSeconds)
}

// Parse a health CSV row and return non-empty values
function parseHealthCsv(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parse (quoted fields with commas handled)
    const values: string[] = []
    let inQuote = false, current = ''
    for (const ch of lines[i]) {
      if (ch === '"') { inQuote = !inQuote; continue }
      if (ch === ',' && !inQuote) { values.push(current.trim()); current = ''; continue }
      current += ch
    }
    values.push(current.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { if (values[idx] !== undefined) row[h] = values[idx] })
    // Use first column as date key
    if (values[0]) rows.push(row)
  }
  return rows
}

// Aggregate CSV into daily summaries
function aggregateCsv(rows: Record<string, string>[], dateCol: string, metrics: string[]) {
  const daily: Record<string, Record<string, number[]>> = {}
  for (const row of rows) {
    const dt = (row[dateCol] || '').slice(0, 10)
    if (!dt || !/\d{4}-\d{2}-\d{2}/.test(dt)) continue
    if (!daily[dt]) daily[dt] = {}
    for (const m of metrics) {
      const val = row[m]
      if (val === undefined || val === '') continue
      const n = parseFloat(val)
      if (!isNaN(n)) {
        if (!daily[dt][m]) daily[dt][m] = []
        daily[dt][m].push(n)
      }
    }
  }
  // Average each metric per day
  const result: Record<string, Record<string, number>> = {}
  for (const [dt, metrics_data] of Object.entries(daily)) {
    result[dt] = {}
    for (const [m, vals] of Object.entries(metrics_data)) {
      result[dt][m] = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
    }
  }
  return result
}

// Key Apple Health CSV column names
const METRIC_COLS = [
  'Weight (kg)', 'Blood Glucose (mmol/L)', 'Resting Heart Rate (bpm)', 'Heart Rate [Avg] (bpm)',
  'Heart Rate [Min] (bpm)', 'Heart Rate [Max] (bpm)', 'Heart Rate Variability (ms)',
  'Sleep Analysis [Total] (hr)', 'Sleep Analysis [Asleep] (hr)', 'Sleep Analysis [Deep] (hr)',
  'Sleep Analysis [REM] (hr)', 'Sleep Analysis [In Bed] (hr)',
  'Step Count (steps)', 'Walking + Running Distance (km)', 'Apple Exercise Time (min)',
  'Blood Pressure [Systolic] (mmHg)', 'Blood Pressure [Diastolic] (mmHg)',
  'Blood Oxygen Saturation (%)', 'VO2 Max (ml/(kg·min))', 'Active Energy (kJ)',
  'Body Fat Percentage (%)', 'Waist Circumference (cm)',
  'Apple Sleeping Wrist Temperature (ºC)', 'Respiratory Rate (count/min)',
]

export async function POST(req: NextRequest) {
  // Optional auth — for now allow webhook calls (IP restriction recommended in production)
  // const auth = await requireAuth()
  // if (!auth.ok) return auth.response

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const startDate = formData.get('startDate') as string || ''
    const endDate = formData.get('endDate') as string || ''
    const healthTypes = formData.get('healthTypes') as string || ''

    if (!file) {
      return NextResponse.json({ error: 'No file attached' }, { status: 400 })
    }

    console.log(`Health auto export received: ${file.name}, ${startDate} to ${endDate}, types: ${healthTypes}`)

    const tmpDir = join(tmpdir(), `health-export-${Date.now()}`)
    mkdirSync(tmpDir, { recursive: true })

    // Write ZIP to disk
    const zipPath = join(tmpDir, 'export.zip')
    const zipBuffer = Buffer.from(await file.arrayBuffer())
    writeFileSync(zipPath, zipBuffer)

    // Unzip
    try {
      execSync(`unzip -o "${zipPath}" -d "${tmpDir}"`, { stdio: 'pipe' })
    } catch (e) {
      // Try python unzip as fallback
      execSync(`python3 -c "import zipfile; zipfile.ZipFile('${zipPath}').extractall('${tmpDir}')"`, { stdio: 'pipe' })
    }

    // Find all CSV files
    const { globSync } = await import('glob')
    const csvFiles = globSync(`${tmpDir}/**/*.csv`)

    const allDaily: Record<string, Record<string, number>> = {}

    for (const csvPath of csvFiles) {
      const fname = csvPath.split('/').pop() || ''
      let dateCol = 'Date/Time'
      let metrics = METRIC_COLS

      if (fname.includes('Workouts')) {
        dateCol = 'Workout Route ID' // different format
        metrics = ['Duration (s)', 'Distance (m)', 'Elevation Gain (m)', 'Average Heart Rate (bpm)', 'Calories (kJ)', 'Average Speed (m/s)']
      } else if (fname.includes('HeartRate')) {
        dateCol = 'Date/Time'
        metrics = ['Min Heart Rate (bpm)', 'Max Heart Rate (bpm)', 'Average Heart Rate (bpm)']
      } else if (fname.includes('ECG')) {
        dateCol = 'Date/Time'
        metrics = ['Average Heart Rate (bpm)']
      }

      try {
        const content = readFileSync(csvPath, 'utf-8')
        const rows = parseHealthCsv(content)
        const aggregated = aggregateCsv(rows, dateCol, metrics)

        // Merge into allDaily
        for (const [dt, vals] of Object.entries(aggregated)) {
          if (!allDaily[dt]) allDaily[dt] = {}
          for (const [k, v] of Object.entries(vals)) {
            allDaily[dt][k] = v
          }
        }
      } catch (e) {
        console.warn(`Failed to parse ${csvPath}:`, e)
      }
    }

    // Clean up
    rmSync(tmpDir, { recursive: true, force: true })

    // Store each day in Redis (keep 90 days)
    const now = new Date()
    let daysStored = 0

    for (const [dt, metrics] of Object.entries(allDaily)) {
      const key = `yos:health:daily:${dt}`
      await redisSetJson(key, { date: dt, ...metrics }, 60 * 60 * 24 * 90)
      daysStored++
    }

    // Store latest summary (24h expiry, refreshed each time)
    const latest = Object.keys(allDaily).sort().pop()
    await redisSetJson('yos:health:latest', {
      lastUpdated: now.toISOString(),
      dateRange: { start: startDate, end: endDate },
      healthTypes,
      daysStored,
      metrics: latest ? allDaily[latest] : {},
      allDays: allDaily,
    }, 60 * 60 * 24 * 3) // 3 day expiry on full snapshot

    console.log(`Stored ${daysStored} days of health data`)

    return NextResponse.json({
      ok: true,
      message: `Processed ${daysStored} days of health data`,
      lastUpdated: now.toISOString(),
      dateRange: { start: startDate, end: endDate },
    })
  } catch (e) {
    console.error('Health auto export error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

// GET: returns latest health summary (for dashboard health tab)
export async function GET() {
  // const auth = await requireAuth()
  // if (!auth.ok) return auth.response

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `${UPSTASH_URL}/get/${encodeURIComponent('yos:health:latest')}`,
      { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }, cache: 'no-store' }
    )
    if (!res.ok) throw new Error(`Redis error ${res.status}`)
    const d = await res.json() as { result?: string | null }
    if (!d.result) {
      return NextResponse.json({ error: 'No health data yet — configure the Health Auto Export app webhook first' })
    }
    const parsed = JSON.parse(d.result)
    return NextResponse.json(parsed)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}