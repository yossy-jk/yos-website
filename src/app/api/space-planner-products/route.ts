import { NextResponse } from 'next/server'
import { EOF_PRODUCTS } from '@/lib/space-planner/store'

// Map Shopify product_type to Space Planner categories
const CATEGORY_MAP: Record<string, string> = {
  'Task Chair': 'Seating',
  'Mesh Chair': 'Seating',
  'Executive Chair': 'Seating',
  'Training Chair': 'Seating',
  'Tub Chair': 'Seating',
  'Lounge Chair': 'Breakout',
  'Hospitality Chair': 'Seating',
  'Bar Stool': 'Seating',
  'Counter Stool': 'Seating',
  'Workstation': 'Desks',
  'Corner Workstation': 'Desks',
  'Height-Adjustable Desk': 'Desks',
  'Desk Frame': 'Desks',
  'Desk Component': 'Desks',
  'Meeting Table': 'Meeting',
  'High Bar Table': 'Meeting',
  'Storage Unit': 'Storage',
  'Storage Cabinet': 'Storage',
  'Mobile Pedestal': 'Storage',
  'Cupboard': 'Storage',
  'Ottoman': 'Breakout',
  'Coffee Table': 'Breakout',
  'Desk Screen': 'Screens',
  'Cable Management': 'skip',
  'Chair Component': 'skip',
  'Table Component': 'skip',
  'Locker Accessory': 'skip',
  'Bench Seat': 'skip',
}

const DEFAULT_DIMS: Record<string, { width: number; depth: number }> = {
  'Seating': { width: 60, depth: 60 },
  'Desks': { width: 160, depth: 80 },
  'Storage': { width: 45, depth: 50 },
  'Meeting': { width: 240, depth: 100 },
  'Breakout': { width: 80, depth: 80 },
  'Screens': { width: 120, depth: 5 },
}

function parseDims(variantOption: string): { width: number; depth: number } | null {
  const wMatch = variantOption.match(/(\d+)mm\s*W/i)
  const dMatch = variantOption.match(/(\d+)mm\s*D/i)
  if (wMatch && dMatch) {
    return { width: Math.round(parseInt(wMatch[1]) / 10), depth: Math.round(parseInt(dMatch[1]) / 10) }
  }
  return null
}

function parseTitleDims(title: string): { width: number; depth: number } | null {
  const match = title.match(/\b(1200|1400|1500|1600|1800|2000|2100|2400|3000|3600)\b/)
  if (match) {
    const w = parseInt(match[1]) / 10
    return { width: w, depth: w > 120 ? 80 : 60 }
  }
  return null
}

async function getAdminToken(): Promise<string | null> {
  const clientId = process.env.SHOPIFY_CLIENT_ID
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  if (!clientId || !clientSecret || !domain) return null
  try {
    const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    })
    const data = await res.json() as { access_token?: string }
    return data.access_token ?? null
  } catch {
    return null
  }
}

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = await getAdminToken()

  // Always return EOF_PRODUCTS as base — Shopify supplements if available
  const eofProducts = EOF_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: 0,
    image: '',
    width: p.width,
    depth: p.depth,
  }))

  if (!token || !domain) {
    return NextResponse.json({ products: eofProducts })
  }

  try {
    const res = await fetch(
      `https://${domain}/admin/api/2025-10/products.json?limit=250&fields=id,title,product_type,tags,images,variants`,
      { headers: { 'X-Shopify-Access-Token': token }, next: { revalidate: 300 } }
    )

    const data = await res.json() as { products?: Array<{
      id: number; title: string; product_type: string; tags: string;
      images: Array<{ src: string }>; variants: Array<{ option1?: string; option2?: string }>
    }> }

    const shopifyProducts = data?.products ?? []

    if (shopifyProducts.length === 0) {
      return NextResponse.json({ products: eofProducts })
    }

    const products = shopifyProducts
      .map((p, i) => {
        const category = CATEGORY_MAP[p.product_type]
        if (!category || category === 'skip') return null
        const imageUrl = p.images?.[0]?.src ?? ''
        let dims: { width: number; depth: number } | null = null
        for (const v of p.variants) {
          const opt = `${v.option1 ?? ''} ${v.option2 ?? ''}`
          dims = parseDims(opt)
          if (dims) break
        }
        if (!dims) dims = parseTitleDims(p.title)
        if (!dims) dims = DEFAULT_DIMS[category] ?? { width: 60, depth: 60 }
        return { id: String(i + 1), shopifyId: String(p.id), name: p.title, category, price: 0, image: imageUrl, width: dims.width, depth: dims.depth }
      })
      .filter(Boolean)

    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: eofProducts })
  }
}
