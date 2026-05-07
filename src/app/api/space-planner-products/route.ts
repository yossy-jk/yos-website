import { NextResponse } from 'next/server'
import { EOF_PRODUCTS } from '@/lib/space-planner/store'

interface ShopifyProduct {
  id: number
  title: string
  product_type: string
  tags: string
  images: Array<{ src: string }>
  variants: Array<{ option1?: string; option2?: string; title?: string }>
}

export interface PlannerProduct {
  id: string
  plannerProductId: string
  name: string
  type: string
  category: string
  imageUrl?: string
  widthCm: number
  depthCm: number
  tags: string[]
}

// Map Shopify product_type to planner category
const CATEGORY_MAP: Record<string, string> = {
  'Workstation': 'Desks',
  'Height-Adjustable Workstation': 'Desks',
  'Corner Workstation': 'Desks',
  'Height-Adjustable Desk': 'Desks',
  'Desk Frame': 'Desks',
  'Desk': 'Desks',
  'Executive Chair': 'Seating',
  'Task Chair': 'Seating',
  'Mesh Chair': 'Seating',
  'Training Chair': 'Seating',
  'Lounge Chair': 'Breakout',
  'Tub Chair': 'Breakout',
  'Hospitality Chair': 'Breakout',
  'Meeting Table': 'Meeting',
  'Table Component': 'Meeting',
  'Storage Unit': 'Storage',
  'Storage Cabinet': 'Storage',
  'Cupboard': 'Storage',
  'Mobile Pedestal': 'Storage',
  'Locker Accessory': 'Storage',
  'Bar Stool': 'Breakout',
  'Counter Stool': 'Breakout',
  'Coffee Table': 'Breakout',
  'High Bar Table': 'Breakout',
  'Ottoman': 'Breakout',
  'Bench Seat': 'Breakout',
}

const DEFAULT_DIMS_BY_CATEGORY: Record<string, { width: number; depth: number }> = {
  Desks: { width: 180, depth: 75 },
  Seating: { width: 60, depth: 60 },
  Breakout: { width: 75, depth: 75 },
  Meeting: { width: 240, depth: 100 },
  Storage: { width: 90, depth: 50 },
  Screens: { width: 120, depth: 5 },
}

const DEFAULT_DIMS_BY_TYPE: Record<string, { width: number; depth: number }> = {
  'Corner Workstation': { width: 160, depth: 160 },
  'Lounge Chair': { width: 75, depth: 75 },
  'Tub Chair': { width: 75, depth: 75 },
  'Coffee Table': { width: 100, depth: 60 },
}

function parseTitleDims(title: string): { width: number; depth: number } | null {
  // Try to extract a dimension like 1800, 1600, 1500, 1200 etc.
  const match = title.match(/\b(1200|1400|1500|1600|1800|2000|2100|2400|3000|3600)\b/)
  if (match) {
    const w = parseInt(match[1]) / 10  // mm -> cm
    return { width: w, depth: w > 200 ? 100 : 75 }
  }
  return null
}

async function getShopifyToken(): Promise<string | null> {
  const clientId = process.env.SHOPIFY_YOS_CLIENT_ID ?? '38cd5992431a0a911d208079db22290a'
  const clientSecret = process.env.SHOPIFY_YOS_CLIENT_SECRET
  if (!clientSecret) return null
  try {
    const res = await fetch('https://yos-furniture.myshopify.com/admin/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    })
    if (!res.ok) return null
    const data = await res.json() as { access_token?: string }
    return data.access_token ?? null
  } catch {
    return null
  }
}

export async function GET() {
  // Fallback: EOF static products
  const fallbackProducts: PlannerProduct[] = EOF_PRODUCTS.map((p) => ({
    id: p.id,
    plannerProductId: p.id,
    name: p.name,
    type: p.category,
    category: p.category,
    imageUrl: undefined,
    widthCm: p.width,
    depthCm: p.depth,
    tags: [],
  }))

  try {
    const token = await getShopifyToken()
    if (!token) {
      return NextResponse.json({ products: fallbackProducts })
    }

    const res = await fetch(
      'https://yos-furniture.myshopify.com/admin/api/2025-10/products.json?limit=250&fields=id,title,product_type,tags,images,variants',
      {
        headers: { 'X-Shopify-Access-Token': token },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ products: fallbackProducts })
    }

    const data = await res.json() as { products?: ShopifyProduct[] }
    const shopifyProducts = data.products ?? []

    if (shopifyProducts.length === 0) {
      return NextResponse.json({ products: fallbackProducts })
    }

    const products: PlannerProduct[] = shopifyProducts
      .map((p) => {
        const category = CATEGORY_MAP[p.product_type]
        if (!category) return null

        const imageUrl = p.images?.[0]?.src

        // Try to get dims from title
        let dims = parseTitleDims(p.title)

        // Try type-specific defaults
        if (!dims && DEFAULT_DIMS_BY_TYPE[p.product_type]) {
          dims = DEFAULT_DIMS_BY_TYPE[p.product_type]
        }

        // Fall back to category defaults
        if (!dims) {
          dims = DEFAULT_DIMS_BY_CATEGORY[category] ?? { width: 60, depth: 60 }
        }

        // Try to find matching EOF product for plannerProductId
        const eofMatch = EOF_PRODUCTS.find((ep) =>
          ep.name.toLowerCase().includes(p.title.toLowerCase().substring(0, 10)) ||
          p.title.toLowerCase().includes(ep.name.toLowerCase().substring(0, 10))
        )

        const tags = p.tags ? p.tags.split(',').map((t) => t.trim()).filter(Boolean) : []

        const product: PlannerProduct = {
          id: String(p.id),
          plannerProductId: eofMatch?.id ?? String(p.id),
          name: p.title,
          type: p.product_type,
          category,
          imageUrl,
          widthCm: dims.width,
          depthCm: dims.depth,
          tags,
        }
        return product
      })
      .filter((p): p is PlannerProduct => p !== null)

    return NextResponse.json({ products })
  } catch (err) {
    console.error('space-planner-products error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ products: fallbackProducts })
  }
}
