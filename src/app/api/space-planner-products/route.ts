import { NextResponse } from 'next/server'

const CATEGORY_MAP: Record<string, string> = {
  'Seating': 'Seating',
  'Chairs': 'Seating',
  'Task Chairs': 'Seating',
  'Executive Chairs': 'Seating',
  'Meeting Chairs': 'Seating',
  'Desks': 'Desks',
  'Height Adjustable Desks': 'Desks',
  'Workstations': 'Desks',
  'Storage': 'Storage',
  'Filing': 'Storage',
  'Pedestals': 'Storage',
  'Meeting': 'Meeting',
  'Meeting Tables': 'Meeting',
  'Boardroom': 'Meeting',
  'Breakout': 'Breakout',
  'Lounge': 'Breakout',
  'Sofas': 'Breakout',
  'Screens': 'Screens',
  'Acoustic Screens': 'Screens',
  'Privacy Screens': 'Screens',
}

export async function GET() {
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN
  const domain = process.env.SHOPIFY_STORE_DOMAIN

  if (!token || !domain) {
    return NextResponse.json({ products: [] })
  }

  const query = `{
    products(first: 100) {
      edges {
        node {
          id
          title
          productType
          tags
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
        }
      }
    }
  }`

  try {
    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 300 }, // cache 5 minutes
    })

    const data = await res.json()
    const edges: Array<{ node: { id: string; title: string; productType: string; tags: string[]; images: { edges: Array<{ node: { url: string } }> } } }> = data?.data?.products?.edges ?? []

    const dims: Record<string, { width: number; depth: number }> = {
      'Seating': { width: 60, depth: 60 },
      'Desks': { width: 160, depth: 80 },
      'Storage': { width: 45, depth: 50 },
      'Meeting': { width: 200, depth: 100 },
      'Breakout': { width: 80, depth: 80 },
      'Screens': { width: 120, depth: 5 },
    }

    const products = edges.map((edge, i) => {
      const node = edge.node
      const imageUrl = node.images?.edges?.[0]?.node?.url ?? ''
      const category =
        CATEGORY_MAP[node.productType] ??
        node.tags.map((t: string) => CATEGORY_MAP[t]).find(Boolean) ??
        'Other'
      const d = dims[category] ?? { width: 60, depth: 60 }
      return {
        id: String(i + 1),
        name: node.title,
        category,
        price: 0,
        image: imageUrl,
        width: d.width,
        depth: d.depth,
      }
    }).filter((p) => p.category !== 'Other')

    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}
