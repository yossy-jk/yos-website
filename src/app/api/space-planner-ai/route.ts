import { NextResponse } from 'next/server'
import type { RoomType } from '@/lib/space-planner/store'

interface AILayoutRequest {
  prompt: string
  canvasWidthM: number
  canvasDepthM: number
}

interface AIRoomResult {
  type: RoomType
  label: string
  xM: number
  yM: number
  widthM: number
  depthM: number
}

interface AIItemResult {
  productId: string
  xM: number
  yM: number
  rotation?: number
}

interface AILayoutResponse {
  success: boolean
  rooms: AIRoomResult[]
  items: AIItemResult[]
  description?: string
  error?: string
}

const SYSTEM_PROMPT = `You are a space planning assistant for an Australian commercial office furniture company.
Given a client's brief, you generate a JSON floor plan layout.

ROOM DIMENSION RULES:
- Private office (1 person): 3×3m minimum
- Small meeting room (3-4 people): 3×3m
- Large meeting room (8-10 people): 6×3m
- Boardroom (10-14 people): 8×4m to 10×4m
- Open plan (per person): allow 6-8 sqm per workstation
- Reception: 5×4m minimum
- Breakout area: 4×3m minimum

FURNITURE RULES (pixels_per_metre = 60, items specified in metres for x/y position):
- Always pair chairs with desks
- Meeting tables need chairs on all sides
- Leave 900mm minimum circulation paths between furniture
- Position furniture 300mm from walls

AVAILABLE PRODUCTS (use exact productId values):
- ws1800: Workstation 1800mm (1.8×0.75m desk)
- ws1500: Workstation 1500mm (1.5×0.75m desk)
- desk1600: Height Adjust Desk 1600 (1.6×0.8m)
- desk1800: Height Adjust Desk 1800 (1.8×0.8m)
- chair-task: Task Chair (0.6×0.6m)
- chair-executive: Executive Chair (0.7×0.7m)
- chair-meeting: Meeting Chair (0.55×0.55m)
- chair-visitor: Visitor Chair (0.55×0.55m)
- chair-lounge: Lounge Chair (0.75×0.75m)
- mtable3600: Meeting Table 3600 (3.6×1.2m)
- mtable2400: Meeting Table 2400 (2.4×1.0m)
- mtable1800: Meeting Table 1800 (1.8×0.9m)
- round-table: Round Table 1200 (1.2×1.2m)
- lounge-2seat: Lounge Sofa 2-Seat (1.5×0.8m)
- lounge-3seat: Lounge Sofa 3-Seat (2.1×0.8m)
- coffee-table: Coffee Table (1.0×0.6m)
- storage2d: Lateral Filing (0.9×0.5m)
- storage3d: Mobile Pedestal (0.4×0.5m)
- storage-tall: Tall Storage Cabinet (0.9×0.45m)
- reception-desk: Reception Desk (1.8×0.75m)

OUTPUT FORMAT: Return ONLY valid JSON, no markdown, no explanation:
{
  "rooms": [{"type": "...", "label": "...", "xM": 0, "yM": 0, "widthM": 6, "depthM": 4}],
  "items": [{"productId": "ws1800", "xM": 0.5, "yM": 0.5, "rotation": 0}],
  "description": "brief description of the layout"
}

Pack rooms efficiently. Start rooms at xM=0, yM=0. Place subsequent rooms to the right or below. Items are absolute canvas positions (not relative to rooms).`

async function callLiteLLM(model: string, prompt: string, canvasWidthM: number, canvasDepthM: number): Promise<string> {
  const userMessage = `Client brief: ${prompt}\n\nCanvas size: ${canvasWidthM}×${canvasDepthM}m floor plate.`

  const res = await fetch('http://100.80.229.101:4000/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yos-litellm-2026',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`LiteLLM ${model} error ${res.status}: ${errText.substring(0, 200)}`)
  }

  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
  const content = data.choices?.[0]?.message?.content ?? ''
  if (!content) throw new Error(`Empty response from ${model}`)
  return content
}

function parseAIResponse(content: string): { rooms: AIRoomResult[]; items: AIItemResult[]; description?: string } {
  // Strip markdown code fences if present
  let json = content.trim()
  if (json.startsWith('```')) {
    json = json.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim()
  }

  const parsed = JSON.parse(json) as {
    rooms?: AIRoomResult[]
    items?: AIItemResult[]
    description?: string
  }

  if (!Array.isArray(parsed.rooms)) throw new Error('No rooms array in AI response')
  if (!Array.isArray(parsed.items)) throw new Error('No items array in AI response')

  return {
    rooms: parsed.rooms,
    items: parsed.items,
    description: parsed.description,
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as AILayoutRequest
    const { prompt, canvasWidthM = 20, canvasDepthM = 15 } = body

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json({ success: false, rooms: [], items: [], error: 'Please describe your space.' }, { status: 400 })
    }

    let content: string

    // Try local-worker first, fall back to minimax
    try {
      content = await callLiteLLM('local-worker', prompt, canvasWidthM, canvasDepthM)
    } catch (err) {
      console.warn('local-worker failed, trying minimax:', err instanceof Error ? err.message : String(err))
      content = await callLiteLLM('minimax', prompt, canvasWidthM, canvasDepthM)
    }

    const parsed = parseAIResponse(content)

    const response: AILayoutResponse = {
      success: true,
      rooms: parsed.rooms,
      items: parsed.items,
      description: parsed.description,
    }

    return NextResponse.json(response)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('space-planner-ai error:', message)
    return NextResponse.json({ success: false, rooms: [], items: [], error: message }, { status: 500 })
  }
}
