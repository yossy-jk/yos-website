# YOS Dashboard — Developer Guide

## Overview

The dashboard is a single-page Next.js client component at `src/app/dashboard/page.tsx`.
Protected by cookie-session auth via `src/proxy.ts` + `src/lib/auth.ts`.

## Adding a new tab

### Step 1 — Add the tab to the tab bar (page.tsx ~line 503)

```tsx
{ key: 'mytab' as const, label: 'My Tab', badge: false },
```

Also extend the `activeTab` state type:
```tsx
const [activeTab, setActiveTab] = useState<'dashboard' | ... | 'mytab'>('dashboard')
```

### Step 2 — Add the tab content (page.tsx, after the last tab block)

```tsx
{activeTab === 'mytab' && (
  <MyTabComponent data={myData} />
)}
```

### Step 3 — Add a data API route

Create `src/app/api/mytab-data/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  // fetch your data here
  return NextResponse.json({ data: [] })
}
```

### Step 4 — Fetch data in the dashboard

Add a `useEffect` to fetch from your new API route:

```tsx
const [myData, setMyData] = useState(null)

useEffect(() => {
  fetch('/api/mytab-data')
    .then(r => r.json())
    .then(d => setMyData(d.data))
}, [])
```

## Auth

All protected API routes must call `requireAuth()` at the top of the handler:

```ts
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  // ...
}
```

The session cookie is sent automatically by the browser. No token passing required.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `DASHBOARD_PASSWORD` | Joe's login password |
| `DASHBOARD_PASSWORD2` | Sarah's login password |
| `DASHBOARD_USER` | Joe's username (default: `joe`) |
| `DASHBOARD_USER2` | Sarah's username (default: `sarah`) |
| `AUTH_COOKIE_SECRET` | 64-char hex, signs session cookies — rotate to invalidate all sessions |
| `DASHBOARD_USERS` | JSON override: `{"joe":"pass1","sarah":"pass2"}` — takes precedence |

## Deployment

Push to `main` → Vercel auto-deploys. Env vars set in Vercel dashboard under Settings → Environment Variables.

## Known tabs

| Tab key | Label | Data source |
|---------|-------|-------------|
| `dashboard` | Dashboard | `/api/dashboard-data` (HubSpot + Xero + Outlook) |
| `queue` | Approvals | `/api/queue/list` (Upstash Redis) |
| `eos` | Traction | `/api/eos/data` (Upstash Redis) |
| `seo` | SEO & AEO | `/api/seo/rankings` (Google Search Console) |
| `usage` | Usage & Cost | `/api/usage` (Langfuse) |
| `memory` | Memory | `/api/memory` (Upstash Redis) |
| `archive` | History | local |
| `compliance` | ISO/QMS | `/api/compliance-data` (local files) |
| `operations` | Operations | `/api/operations-data` (local automation files) — COMING SOON |
| `outreach` | Outreach | `/api/outreach-data` (local SQLite) — COMING SOON |
