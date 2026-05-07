'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  usePlannerStore,
  getCategoryColor,
  ROOM_TYPE_DEFAULTS,
  ROOM_TYPE_COLORS,
  EOF_PRODUCTS,
  type RoomType,
} from '@/lib/space-planner/store'
import ProductSidebar from '@/components/space-planner/ProductSidebar'
import {
  Undo2,
  Redo2,
  Copy,
  RotateCw,
  Trash2,
  Download,
  Grid,
  ArrowLeft,
  ChevronRight,
  Plus,
  Sparkles,
  X,
} from 'lucide-react'
import Link from 'next/link'
import Konva from 'konva'

const PlannerCanvas = dynamic(() => import('@/components/space-planner/PlannerCanvas'), { ssr: false })

// ─── Gate Screen ─────────────────────────────────────────────────────────────

function GateScreen({ onComplete }: { onComplete: (firstName: string, email: string) => void }) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !email.trim()) { setError('Both fields are required.'); return }
    if (!email.includes('@')) { setError('Enter a valid email.'); return }
    setLoading(true)
    sessionStorage.setItem('yos_planner_user', JSON.stringify({ firstName, email }))
    try {
      await fetch('/api/space-planner-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, source: 'space-planner-gate' }),
      })
    } catch { /* non-fatal */ }
    setLoading(false)
    onComplete(firstName, email)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: 40, height: 4, background: '#00B5A5', borderRadius: 2, marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.03em', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Plan your space.<br />We&apos;ll handle the rest.
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.6 }}>
            Drop your name and email — just in case we lose connection while you&apos;re building.
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
            style={{ background: '#1E1E1E', border: '1px solid #333', borderRadius: 8, padding: '0.85rem 1rem', color: '#F7F6F4', fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', outline: 'none' }} autoFocus />
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ background: '#1E1E1E', border: '1px solid #333', borderRadius: 8, padding: '0.85rem 1rem', color: '#F7F6F4', fontSize: '0.95rem', fontFamily: 'Montserrat, sans-serif', outline: 'none' }} />
          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: '#00B5A5', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '0.9rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Starting...' : <>Start Planning <ChevronRight size={16} /></>}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#4B4B4B', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
          No spam. We&apos;ll only contact you if you ask us to.
        </p>
      </div>
    </div>
  )
}

// ─── Room type definitions ────────────────────────────────────────────────────

interface RoomTypeCard {
  id: RoomType
  label: string
  desc: string
  capacity?: string
}

const ROOM_TYPE_CARDS: RoomTypeCard[] = [
  { id: 'open-plan', label: 'Open Plan Office', desc: '10×8m default' },
  { id: 'private-office', label: 'Private Office', desc: '3×3m · 1 person' },
  { id: 'small-meeting', label: 'Small Meeting', desc: '3×3m · 3-4 people' },
  { id: 'large-meeting', label: 'Large Meeting', desc: '6×3m · 8-10 people' },
  { id: 'boardroom', label: 'Boardroom', desc: '8×4m · sizes vary' },
  { id: 'reception', label: 'Reception', desc: '5×4m default' },
  { id: 'breakout', label: 'Breakout Area', desc: '4×3m default' },
  { id: 'custom', label: 'Custom Room', desc: 'Set your own size' },
]

// Mini canvas preview for Step 1
function RoomPreviewCanvas({ rooms }: { rooms: Array<{ id: string; type: RoomType; label: string; xM: number; yM: number; widthM: number; depthM: number }> }) {
  const canvasWidthM = 20
  const canvasDepthM = 15
  const scale = 18 // px per metre (small preview)

  return (
    <div style={{
      width: canvasWidthM * scale,
      height: canvasDepthM * scale,
      background: '#F5F4F2',
      border: '2px solid #2A2A2A',
      position: 'relative',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Grid */}
      {Array.from({ length: canvasWidthM + 1 }, (_, i) => (
        <div key={`vg${i}`} style={{ position: 'absolute', left: i * scale, top: 0, bottom: 0, width: 1, background: '#E0DDD8' }} />
      ))}
      {Array.from({ length: canvasDepthM + 1 }, (_, i) => (
        <div key={`hg${i}`} style={{ position: 'absolute', top: i * scale, left: 0, right: 0, height: 1, background: '#E0DDD8' }} />
      ))}
      {/* Rooms */}
      {rooms.map((room) => (
        <div key={room.id} style={{
          position: 'absolute',
          left: room.xM * scale,
          top: room.yM * scale,
          width: room.widthM * scale,
          height: room.depthM * scale,
          background: ROOM_TYPE_COLORS[room.type] ?? '#F5F4F2',
          border: '1.5px solid #2A2A2A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: '2px 3px',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: '#4B4B4B', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
            {room.label}
          </span>
          <span style={{ fontSize: 6, color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.2 }}>
            {room.widthM}×{room.depthM}m
          </span>
        </div>
      ))}
      {rooms.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif' }}>Floor plate</span>
        </div>
      )}
    </div>
  )
}

// ─── Step 1: Room Builder ─────────────────────────────────────────────────────

function Step1Room({ onNext }: { onNext: () => void }) {
  const { rooms, addRoom, removeRoom, clearRooms, setStep } = usePlannerStore()
  const [showCustomModal, setShowCustomModal] = useState<RoomType | null>(null)
  const [customWidth, setCustomWidth] = useState(5)
  const [customDepth, setCustomDepth] = useState(5)

  const handleRoomTypeClick = (type: RoomType) => {
    if (type === 'boardroom' || type === 'custom') {
      const def = ROOM_TYPE_DEFAULTS[type]
      setCustomWidth(def.widthM)
      setCustomDepth(def.depthM)
      setShowCustomModal(type)
      return
    }
    const def = ROOM_TYPE_DEFAULTS[type]
    addRoom(type, def.widthM, def.depthM, def.label)
  }

  const handleCustomAdd = () => {
    if (!showCustomModal) return
    const def = ROOM_TYPE_DEFAULTS[showCustomModal]
    addRoom(showCustomModal, customWidth, customDepth, def.label)
    setShowCustomModal(null)
  }

  const totalArea = rooms.reduce((sum, r) => sum + r.widthM * r.depthM, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #2A2A2A', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/furniture" style={{ color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif' }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <span style={{ color: '#00B5A5', fontWeight: 700, fontSize: '1rem', fontFamily: 'Montserrat, sans-serif' }}>Space Planner</span>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
          {['Build Rooms', 'Add Furniture', 'Get Quote'].map((label, i) => (
            <React.Fragment key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 0 ? '#00B5A5' : '#2A2A2A', color: i === 0 ? '#FFF' : '#6B6B6B', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '0.78rem', color: i === 0 ? '#F7F6F4' : '#6B6B6B', fontFamily: 'Montserrat, sans-serif', fontWeight: i === 0 ? 700 : 400 }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 24, height: 1, background: '#2A2A2A' }} />}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left panel */}
        <div style={{ width: 300, borderRight: '1px solid #2A2A2A', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #2A2A2A' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.25rem' }}>
              Add a room
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>
              Click to add rooms to your floor plate.
            </p>
          </div>

          {/* Room type cards */}
          <div style={{ padding: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
            {ROOM_TYPE_CARDS.map((card) => {
              const count = rooms.filter((r) => r.type === card.id).length
              return (
                <button
                  key={card.id}
                  onClick={() => handleRoomTypeClick(card.id)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 10,
                    border: `1.5px solid #2A2A2A`,
                    background: '#1E1E1E',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.12s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00B5A5'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,181,165,0.06)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2A2A2A'; (e.currentTarget as HTMLButtonElement).style.background = '#1E1E1E'; }}
                >
                  {/* Color swatch */}
                  <div style={{ width: 20, height: 14, borderRadius: 3, background: ROOM_TYPE_COLORS[card.id], border: '1px solid rgba(0,0,0,0.15)', marginBottom: 6 }} />
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: 2, lineHeight: 1.3 }}>{card.label}</p>
                  <p style={{ fontSize: '0.63rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.3 }}>{card.desc}</p>
                  {count > 0 && (
                    <div style={{ position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: '50%', background: '#00B5A5', color: '#FFF', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif' }}>
                      {count}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Rooms added list */}
          {rooms.length > 0 && (
            <div style={{ borderTop: '1px solid #2A2A2A', padding: '0.75rem', maxHeight: 200, overflowY: 'auto' }}>
              <p style={{ fontSize: '0.72rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.5rem' }}>
                Rooms added ({rooms.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {rooms.map((room) => (
                  <div key={room.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.3rem 0.4rem', background: '#1E1E1E', borderRadius: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: ROOM_TYPE_COLORS[room.type], flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '0.72rem', color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.label}</span>
                    <span style={{ fontSize: '0.62rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', flexShrink: 0 }}>{room.widthM}×{room.depthM}m</span>
                    <button onClick={() => removeRoom(room.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 0, display: 'flex', alignItems: 'center' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              {totalArea > 0 && (
                <p style={{ fontSize: '0.68rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', marginTop: '0.5rem' }}>
                  Total: {totalArea.toFixed(0)}m²
                </p>
              )}
              <button onClick={clearRooms} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', fontSize: '0.68rem', padding: '0.25rem 0', marginTop: '0.25rem', textDecoration: 'underline' }}>
                Clear all rooms
              </button>
            </div>
          )}

          {/* Next button */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #2A2A2A' }}>
            <button
              onClick={onNext}
              disabled={rooms.length === 0}
              style={{
                width: '100%', background: rooms.length === 0 ? '#2A2A2A' : '#00B5A5',
                color: rooms.length === 0 ? '#4B4B4B' : '#FFF',
                border: 'none', borderRadius: 8, padding: '0.9rem',
                fontSize: '0.88rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
                cursor: rooms.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              Next: Add Furniture <ChevronRight size={15} />
            </button>
            {rooms.length === 0 && (
              <p style={{ fontSize: '0.68rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', textAlign: 'center', marginTop: '0.5rem' }}>
                Add at least one room to continue
              </p>
            )}
          </div>
        </div>

        {/* Right: preview canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>
              Floor plate preview — 20×15m canvas
            </p>
          </div>
          <RoomPreviewCanvas rooms={rooms} />
        </div>
      </div>

      {/* Boardroom / Custom modal */}
      {showCustomModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.5rem', maxWidth: 340, width: '100%' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.5rem' }}>
              {ROOM_TYPE_DEFAULTS[showCustomModal].label} — Set dimensions
            </h3>
            {showCustomModal === 'boardroom' && (
              <p style={{ fontSize: '0.75rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: '1rem', lineHeight: 1.5 }}>
                8×4m fits 10-12 people · 10×4m fits 14 people · 12×5m fits 20 people
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: 4 }}>Width (m)</label>
                <input type="number" min={2} max={30} step={0.5} value={customWidth} onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 2)}
                  style={{ width: '100%', background: '#2A2A2A', border: '1px solid #444', borderRadius: 6, padding: '0.5rem', color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: 4 }}>Depth (m)</label>
                <input type="number" min={2} max={20} step={0.5} value={customDepth} onChange={(e) => setCustomDepth(parseFloat(e.target.value) || 2)}
                  style={{ width: '100%', background: '#2A2A2A', border: '1px solid #444', borderRadius: 6, padding: '0.5rem', color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowCustomModal(null)} style={{ flex: 1, background: 'transparent', border: '1px solid #2A2A2A', borderRadius: 8, padding: '0.65rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', fontSize: '0.82rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCustomAdd} style={{ flex: 1, background: '#00B5A5', border: 'none', borderRadius: 8, padding: '0.65rem', color: '#FFF', fontFamily: 'Montserrat, sans-serif', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                <Plus size={13} style={{ display: 'inline', marginRight: 4 }} />Add Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AI Layout Panel ──────────────────────────────────────────────────────────

interface AILayoutPanelProps {
  onClose: () => void
  canvasWidthM: number
  canvasDepthM: number
}

function AILayoutPanel({ onClose, canvasWidthM, canvasDepthM }: AILayoutPanelProps) {
  const { addRoom, clearRooms, addItem, clearAll, rooms, items } = usePlannerStore()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 5) { setError('Describe your space first.'); return }
    if ((rooms.length > 0 || items.length > 0) && !confirm('This will replace your current layout. Continue?')) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/space-planner-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, canvasWidthM, canvasDepthM }),
      })
      const data = await res.json() as {
        success?: boolean
        rooms?: Array<{ type: string; label: string; xM: number; yM: number; widthM: number; depthM: number }>
        items?: Array<{ productId: string; xM: number; yM: number; rotation?: number }>
        description?: string
        error?: string
      }

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Generation failed. Try again.')
        return
      }

      // Clear existing and apply
      clearAll()
      clearRooms()

      // Add rooms
      for (const room of (data.rooms ?? [])) {
        const roomType = room.type as import('@/lib/space-planner/store').RoomType
        const { usePlannerStore: useStore } = await import('@/lib/space-planner/store')
        const state = useStore.getState()
        state.addRoom(roomType, room.widthM, room.depthM, room.label)
        // Override position after add
        const newRooms = useStore.getState().rooms
        const newRoom = newRooms[newRooms.length - 1]
        if (newRoom) {
          state.updateRoom(newRoom.id, { xM: room.xM, yM: room.yM })
        }
      }

      // Add items
      const PIXELS_PER_METRE = 60
      for (const item of (data.items ?? [])) {
        const product = EOF_PRODUCTS.find((p) => p.id === item.productId)
        if (!product) continue
        const PIXELS_PER_CM = 0.5
        addItem({
          productId: product.id,
          name: product.name,
          category: product.category,
          price: 0,
          x: item.xM * PIXELS_PER_METRE,
          y: item.yM * PIXELS_PER_METRE,
          width: product.width * PIXELS_PER_CM,
          height: product.depth * PIXELS_PER_CM,
          rotation: item.rotation ?? 0,
          color: getCategoryColor(product.category),
        })
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: '#1A1A1A', borderTop: '1px solid #2A2A2A',
      padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={15} color="#00B5A5" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif' }}>AI Layout Generator</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex', alignItems: 'center' }}>
          <X size={16} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your space... e.g. Private office for the MD, small meeting room for 4, open plan for 6 workstations"
            rows={2}
            style={{
              width: '100%', background: '#2A2A2A', border: '1px solid #333', borderRadius: 8,
              padding: '0.65rem 0.75rem', color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.82rem', resize: 'none', outline: 'none', boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ fontSize: '0.72rem', color: '#ef4444', fontFamily: 'Montserrat, sans-serif', marginTop: 4 }}>{error}</p>}
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            background: loading ? '#2A2A2A' : '#00B5A5', color: '#FFF', border: 'none', borderRadius: 8,
            padding: '0.65rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Generating...' : 'Generate Layout'}
        </button>
      </div>
    </div>
  )
}

// ─── Add Room Popover (in Step 2 toolbar) ─────────────────────────────────────

function AddRoomPopover({ onClose }: { onClose: () => void }) {
  const { addRoom } = usePlannerStore()
  const [showBoardroomForm, setShowBoardroomForm] = useState(false)
  const [bWidth, setBWidth] = useState(8)
  const [bDepth, setBDepth] = useState(4)

  const handleAdd = (type: RoomType) => {
    if (type === 'boardroom') {
      setShowBoardroomForm(true)
      return
    }
    if (type === 'custom') {
      setShowBoardroomForm(true)
      return
    }
    const def = ROOM_TYPE_DEFAULTS[type]
    addRoom(type, def.widthM, def.depthM, def.label)
    onClose()
  }

  const handleCustomAdd = () => {
    addRoom('boardroom', bWidth, bDepth, 'Boardroom')
    onClose()
  }

  if (showBoardroomForm) {
    return (
      <div style={{ padding: '0.75rem', minWidth: 220 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A1A1A', fontFamily: 'Montserrat, sans-serif', marginBottom: 8 }}>Set boardroom size</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
          <div>
            <label style={{ fontSize: '0.68rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', display: 'block', marginBottom: 3 }}>Width (m)</label>
            <input type="number" min={4} max={20} step={0.5} value={bWidth} onChange={(e) => setBWidth(parseFloat(e.target.value) || 4)}
              style={{ width: '100%', padding: '0.4rem', border: '1px solid #E5E5E5', borderRadius: 5, fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.68rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', display: 'block', marginBottom: 3 }}>Depth (m)</label>
            <input type="number" min={3} max={12} step={0.5} value={bDepth} onChange={(e) => setBDepth(parseFloat(e.target.value) || 3)}
              style={{ width: '100%', padding: '0.4rem', border: '1px solid #E5E5E5', borderRadius: 5, fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem', boxSizing: 'border-box' }} />
          </div>
        </div>
        <button onClick={handleCustomAdd} style={{ width: '100%', background: '#00B5A5', color: '#FFF', border: 'none', borderRadius: 6, padding: '0.5rem', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', cursor: 'pointer' }}>Add Boardroom</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '0.5rem', minWidth: 180 }}>
      {ROOM_TYPE_CARDS.slice(0, 6).map((card) => (
        <button
          key={card.id}
          onClick={() => handleAdd(card.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '0.4rem 0.5rem', borderRadius: 6, border: 'none',
            background: 'transparent', cursor: 'pointer', textAlign: 'left',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F4F2'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 2, background: ROOM_TYPE_COLORS[card.id], flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', color: '#1A1A1A', fontFamily: 'Montserrat, sans-serif' }}>{card.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function AreaStatsBar() {
  const { items, rooms, canvasWidthM, canvasDepthM } = usePlannerStore()

  const workstations = items.filter((i) => i.category === 'Desks').length
  const seats = items.filter((i) => i.category === 'Seating').length
  const totalRoomArea = rooms.reduce((s, r) => s + r.widthM * r.depthM, 0)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.5rem 1rem', background: '#1A1A1A', borderTop: '1px solid #2A2A2A', flexShrink: 0, flexWrap: 'wrap' }}>
      <StatPill label="Canvas" value={`${canvasWidthM}×${canvasDepthM}m`} />
      <StatPill label="Rooms" value={String(rooms.length)} />
      <StatPill label="Room area" value={`${totalRoomArea.toFixed(0)}m²`} />
      <StatPill label="Desks" value={String(workstations)} />
      <StatPill label="Seats" value={String(seats)} />
      <StatPill label="Items" value={String(items.length)} />
    </div>
  )
}

function StatPill({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
      <span style={{ fontSize: '0.7rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: warn ? '#ef4444' : '#F7F6F4', fontFamily: 'Montserrat, sans-serif' }}>{value}</span>
    </div>
  )
}

// ─── Step 2: Furnish ──────────────────────────────────────────────────────────

function Step2Furnish({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const {
    selectedId, snapToGrid, toggleSnap,
    undo, redo, history, historyIndex,
    duplicateItem, rotateItem, removeItem,
    addItem, items, canvasWidthM, canvasDepthM,
  } = usePlannerStore()

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage | null>(null)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [showAddRoomPopover, setShowAddRoomPopover] = useState(false)
  const addRoomBtnRef = useRef<HTMLButtonElement>(null)

  // Canvas resize observer
  useEffect(() => {
    const update = () => {
      if (canvasContainerRef.current) {
        setCanvasSize({
          width: canvasContainerRef.current.offsetWidth,
          height: canvasContainerRef.current.offsetHeight,
        })
      }
    }
    update()
    const observer = new ResizeObserver(update)
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current)
    return () => observer.disconnect()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      const isCtrl = e.ctrlKey || e.metaKey
      if (isCtrl && e.key === 'z') { e.preventDefault(); undo(); return }
      if (isCtrl && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redo(); return }
      if (!selectedId) return
      if (e.key === 'Delete' || e.key === 'Backspace') removeItem(selectedId)
      if (e.key === 'r' || e.key === 'R') rotateItem(selectedId)
      if (e.key === 'd' || e.key === 'D') duplicateItem(selectedId)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedId, undo, redo, removeItem, rotateItem, duplicateItem])

  // Export PNG
  const handleExport = useCallback(() => {
    if (!stageRef.current) return
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 })
    const link = document.createElement('a')
    link.download = 'my-office-plan.png'
    link.href = dataURL
    link.click()
  }, [])

  // Drop onto canvas
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    try {
      const data = JSON.parse(raw) as { productId: string; name: string; category: string; price: number; width: number; depth: number; color?: string }
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      addItem({
        productId: data.productId,
        name: data.name,
        category: data.category,
        price: data.price,
        x,
        y,
        width: data.width,
        height: data.depth,
        rotation: 0,
        color: data.color ?? getCategoryColor(data.category),
      })
    } catch { /* ignore */ }
  }, [addItem])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1A1A1A', overflow: 'hidden' }}>
      {/* Top bar */}
      <header style={{ background: '#1A1A1A', borderBottom: '1px solid #2A2A2A', height: 52, padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: '#333' }} />
          <span style={{ color: '#00B5A5', fontWeight: 700, fontSize: '1rem', fontFamily: 'Montserrat, sans-serif' }}>Space Planner</span>
          <span style={{ color: '#6B6B6B', fontSize: '0.7rem', fontFamily: 'Montserrat, sans-serif' }}>Step 2 of 3</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ToolBtn icon={<Undo2 size={14} />} label="Undo" onClick={undo} disabled={!canUndo} title="Ctrl+Z" />
          <ToolBtn icon={<Redo2 size={14} />} label="Redo" onClick={redo} disabled={!canRedo} title="Ctrl+Y" />
          <div style={{ width: 1, height: 28, background: '#333', margin: '0 4px' }} />
          <ToolBtn icon={<RotateCw size={14} />} label="Rotate" onClick={() => selectedId && rotateItem(selectedId)} disabled={!selectedId} title="R" />
          <ToolBtn icon={<Copy size={14} />} label="Duplicate" onClick={() => selectedId && duplicateItem(selectedId)} disabled={!selectedId} title="D" />
          <ToolBtn icon={<Trash2 size={14} />} label="Delete" onClick={() => selectedId && removeItem(selectedId)} disabled={!selectedId} danger title="Del" />
          <div style={{ width: 1, height: 28, background: '#333', margin: '0 4px' }} />
          <ToolBtn icon={<Grid size={14} />} label="Snap" onClick={toggleSnap} active={snapToGrid} />
          <ToolBtn icon={<Download size={14} />} label="Export" onClick={handleExport} />
          <div style={{ width: 1, height: 28, background: '#333', margin: '0 4px' }} />
          {/* Add Room button */}
          <div style={{ position: 'relative' }}>
            <button
              ref={addRoomBtnRef}
              onClick={() => setShowAddRoomPopover((v) => !v)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: 52, height: 40, borderRadius: 7, border: showAddRoomPopover ? '1px solid #00B5A5' : 'none',
                background: showAddRoomPopover ? 'rgba(0,181,165,0.1)' : 'transparent',
                color: showAddRoomPopover ? '#00B5A5' : '#9B9B9B',
                fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', fontWeight: 600, gap: 2, cursor: 'pointer',
              }}
            >
              <Plus size={14} />
              <span>Room</span>
            </button>
            {showAddRoomPopover && (
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 100, marginTop: 4,
              }}>
                <AddRoomPopover onClose={() => setShowAddRoomPopover(false)} />
              </div>
            )}
          </div>
          {/* AI Layout button */}
          <button
            onClick={() => setShowAIPanel((v) => !v)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 40, borderRadius: 7, border: showAIPanel ? '1px solid #00B5A5' : 'none',
              background: showAIPanel ? 'rgba(0,181,165,0.1)' : 'transparent',
              color: showAIPanel ? '#00B5A5' : '#9B9B9B',
              fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', fontWeight: 600, gap: 2, cursor: 'pointer',
            }}
          >
            <Sparkles size={14} />
            <span>AI</span>
          </button>
        </div>

        <button
          onClick={onNext}
          style={{ background: '#00B5A5', color: '#FFF', border: 'none', borderRadius: 8, padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
        >
          Submit for Quote <ChevronRight size={14} />
        </button>
      </header>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar */}
        <div style={{ width: 260, flexShrink: 0, overflow: 'hidden' }}>
          <ProductSidebar />
        </div>

        {/* Canvas */}
        <main ref={canvasContainerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <PlannerCanvas
            width={canvasSize.width}
            height={canvasSize.height}
            onDrop={handleDrop}
            stageRef={stageRef}
          />
          {showAIPanel && (
            <AILayoutPanel
              onClose={() => setShowAIPanel(false)}
              canvasWidthM={canvasWidthM}
              canvasDepthM={canvasDepthM}
            />
          )}
        </main>
      </div>

      {/* Bottom stats bar */}
      <AreaStatsBar />

      {/* Close popover on outside click */}
      {showAddRoomPopover && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setShowAddRoomPopover(false)}
        />
      )}
    </div>
  )
}

// ─── Tool Button ─────────────────────────────────────────────────────────────

function ToolBtn({
  icon, label, onClick, disabled, active, danger, title,
}: {
  icon: React.ReactNode; label: string; onClick: () => void;
  disabled?: boolean; active?: boolean; danger?: boolean; title?: string;
}) {
  return (
    <button
      title={title ?? label}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        width: 42, height: 40, borderRadius: 7, border: 'none', cursor: disabled ? 'default' : 'pointer',
        background: active ? '#00B5A5' : 'transparent',
        color: disabled ? '#3A3A3A' : danger ? '#ef4444' : active ? '#FFF' : '#9B9B9B',
        fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', fontWeight: 600, gap: 2,
        transition: 'background 0.12s, color 0.12s',
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) => { if (!disabled && !active) (e.currentTarget as HTMLButtonElement).style.color = '#F7F6F4' }}
      onMouseLeave={(e) => { if (!disabled && !active) (e.currentTarget as HTMLButtonElement).style.color = danger ? '#ef4444' : '#9B9B9B' }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// ─── Step 3: Quote form ───────────────────────────────────────────────────────

function Step3Quote({ onBack }: { onBack: () => void }) {
  const { items, rooms } = usePlannerStore()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', location: '', deliveryType: 'full-service' as 'delivery' | 'full-service', notes: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')

  // Pre-fill from gate
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('yos_planner_user')
      if (stored) {
        const { firstName, email } = JSON.parse(stored) as { firstName?: string; email?: string }
        setForm((f) => ({ ...f, firstName: firstName ?? '', email: email ?? '' }))
      }
    } catch { /* ignore */ }
  }, [])

  // Aggregate items by name
  const aggregated = items.reduce<Record<string, { name: string; qty: number; category: string }>>((acc, item) => {
    const key = item.name
    if (!acc[key]) acc[key] = { name: item.name, qty: 0, category: item.category }
    acc[key].qty++
    return acc
  }, {})
  const itemList = Object.values(aggregated)

  // Room summary
  const roomSummary = rooms.map((r) => `${r.label} (${r.widthM}×${r.depthM}m)`).join(', ')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.email) { setError('First name and email are required.'); return }
    if (!form.email.includes('@')) { setError('Enter a valid email.'); return }
    setLoading(true)
    setError('')
    try {
      // Use rooms summary if available, otherwise fallback
      const roomForQuote = rooms.length > 0
        ? { type: roomSummary, width: rooms.reduce((s, r) => s + r.widthM * r.depthM, 0), depth: 1 }
        : { type: 'multi-room', width: 0, depth: 0 }

      const res = await fetch('/api/space-planner-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemList, room: roomForQuote, contact: form }),
      })
      const data = await res.json() as { success?: boolean; reference?: string; error?: string }
      if (!res.ok || !data.success) { setError(data.error ?? 'Something went wrong. Try again.'); setLoading(false); return }
      setReference(data.reference ?? '')
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#00B5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.4rem' }}>✓</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.75rem' }}>Quote submitted</h2>
          <p style={{ color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.7, marginBottom: '0.5rem' }}>Joe&apos;s team will prepare your quote within 24 hours.</p>
          {reference && <p style={{ color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', marginBottom: '2rem' }}>Reference: <strong style={{ color: '#00B5A5' }}>{reference}</strong></p>}
          <Link href="/furniture" style={{ display: 'inline-block', background: '#00B5A5', color: '#FFF', borderRadius: 8, padding: '0.75rem 1.5rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>Back to Furniture</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex', padding: '2rem', gap: '2rem', justifyContent: 'center' }}>
      {/* Summary column */}
      <div style={{ width: 320, flexShrink: 0 }}>
        <div style={{ background: '#1E1E1E', borderRadius: 12, padding: '1.25rem', position: 'sticky', top: '2rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.75rem' }}>Your plan summary</h3>
          {rooms.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.72rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.4rem' }}>Rooms</p>
              {rooms.map((r) => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.75rem', color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif' }}>{r.label}</span>
                  <span style={{ fontSize: '0.72rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif' }}>{r.widthM}×{r.depthM}m</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ borderTop: rooms.length > 0 ? '1px solid #2A2A2A' : 'none', paddingTop: rooms.length > 0 ? '0.75rem' : 0 }}>
            {itemList.length === 0 && <p style={{ fontSize: '0.78rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>No items placed.</p>}
            {itemList.map((item) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.78rem', color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif' }}>{item.name}</span>
                <span style={{ fontSize: '0.78rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif' }}>×{item.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #2A2A2A', marginTop: '1rem', paddingTop: '1rem' }}>
            <p style={{ fontSize: '0.72rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>Pricing will be prepared and sent to you.</p>
          </div>
        </div>
      </div>

      {/* Form column */}
      <div style={{ maxWidth: 480, width: '100%' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif', marginBottom: '1.5rem', padding: 0 }}>
          <ArrowLeft size={14} /> Back to planner
        </button>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.5rem' }}>Get your quote</h2>
        <p style={{ color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', marginBottom: '1.5rem', fontSize: '0.88rem' }}>Fill in your details and we&apos;ll prepare a quote based on your plan.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <FormField label="First name *" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
            <FormField label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
          </div>
          <FormField label="Email *" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          <FormField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
          <FormField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <FormField label="Suburb / City *" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="e.g. Newcastle, Maitland, Lake Macquarie" />
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: 6 }}>Service Required</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(['delivery', 'full-service'] as const).map((type) => (
                <button key={type} type="button" onClick={() => setForm({ ...form, deliveryType: type })}
                  style={{ background: form.deliveryType === type ? 'rgba(0,181,165,0.12)' : '#1E1E1E', border: `2px solid ${form.deliveryType === type ? '#00B5A5' : '#2A2A2A'}`, borderRadius: 8, padding: '0.75rem', cursor: 'pointer', textAlign: 'left' }}>
                  <p style={{ color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 2px' }}>
                    {type === 'delivery' ? 'Delivery Only' : 'Full Service Installation'}
                  </p>
                  <p style={{ color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', fontSize: '0.72rem', margin: 0, lineHeight: 1.4 }}>
                    {type === 'delivery' ? 'Flat-packed, delivered to door' : 'Delivered, assembled & placed'}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: 4 }}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Anything else we should know..." rows={3}
              style={{ width: '100%', background: '#1E1E1E', border: '1px solid #333', borderRadius: 8, padding: '0.75rem', color: '#F7F6F4', fontSize: '0.88rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: '#00B5A5', color: '#FFF', border: 'none', borderRadius: 8, padding: '1rem', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Submitting...' : 'Submit for Quote'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Soft Email Capture Toast ────────────────────────────────────────────────

function SoftEmailCapture({ onCapture, onDismiss }: { onCapture: () => void; onDismiss: () => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!email.includes('@')) return
    setLoading(true)
    sessionStorage.setItem('yos_planner_user', JSON.stringify({ email }))
    sessionStorage.setItem('yos_soft_email_shown', '1')
    try {
      await fetch('/api/space-planner-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'space-planner-soft-capture' }),
      })
    } catch { /* non-fatal */ }
    setLoading(false)
    setSaved(true)
    setTimeout(onCapture, 1200)
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200, background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: 12, padding: '1.25rem 1.5rem', maxWidth: 340, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
      {saved ? (
        <p style={{ color: '#00B5A5', fontFamily: 'Montserrat, sans-serif', fontSize: '0.88rem', fontWeight: 600 }}>Saved. Your plan is safe.</p>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <p style={{ color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', fontSize: '0.88rem', fontWeight: 600, margin: 0 }}>Don&apos;t lose your work</p>
            <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B4B4B', fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', padding: '0 0 0 8px', lineHeight: 1 }}>×</button>
          </div>
          <p style={{ color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', fontSize: '0.78rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>Add your email so you don&apos;t lose this plan.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus
              style={{ flex: 1, background: '#2A2A2A', border: '1px solid #444', borderRadius: 6, padding: '0.6rem 0.75rem', color: '#F7F6F4', fontSize: '0.82rem', fontFamily: 'Montserrat, sans-serif', outline: 'none' }} />
            <button onClick={handleSave} disabled={loading || !email.includes('@')}
              style={{ background: '#00B5A5', color: '#FFF', border: 'none', borderRadius: 6, padding: '0.6rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap', opacity: loading || !email.includes('@') ? 0.6 : 1 }}>
              {loading ? '...' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Exit Intent Modal ────────────────────────────────────────────────────────

function ExitIntentModal({ onQuote, onDismiss, itemCount }: { onQuote: () => void; onDismiss: () => void; itemCount: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: 16, padding: '2rem', maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 16px 64px rgba(0,0,0,0.6)' }}>
        <div style={{ width: 40, height: 4, background: '#00B5A5', borderRadius: 2, margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.75rem' }}>Before you go</h2>
        <p style={{ color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          You&apos;ve got {itemCount} item{itemCount !== 1 ? 's' : ''} in your plan. Want us to put a quote together?
        </p>
        <button onClick={onQuote} style={{ display: 'block', width: '100%', background: '#00B5A5', color: '#FFF', border: 'none', borderRadius: 8, padding: '0.9rem', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', cursor: 'pointer', marginBottom: '0.75rem' }}>
          Yes, get my quote →
        </button>
        <button onClick={onDismiss} style={{ display: 'block', width: '100%', background: 'none', color: '#6B6B6B', border: '1px solid #2A2A2A', borderRadius: 8, padding: '0.75rem', fontSize: '0.88rem', fontFamily: 'Montserrat, sans-serif', cursor: 'pointer' }}>
          No thanks, leave the plan
        </button>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: 4 }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', background: '#1E1E1E', border: '1px solid #333', borderRadius: 8, padding: '0.75rem', color: '#F7F6F4', fontSize: '0.88rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        placeholder={placeholder} />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SpacePlannerPage() {
  const { step, setStep, items } = usePlannerStore()
  const [isMobile, setIsMobile] = useState(false)
  const [showSoftCapture, setShowSoftCapture] = useState(false)
  const [softCaptured, setSoftCaptured] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const exitIntentFired = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Soft email capture
  useEffect(() => {
    if (step !== 2 || items.length < 1 || softCaptured || showSoftCapture) return
    if (typeof window === 'undefined') return
    const alreadyShown = sessionStorage.getItem('yos_soft_email_shown')
    const alreadyCaptured = sessionStorage.getItem('yos_planner_user')
    if (alreadyShown || alreadyCaptured) return
    const timer = setTimeout(() => setShowSoftCapture(true), 1500)
    return () => clearTimeout(timer)
  }, [step, items.length, softCaptured, showSoftCapture])

  // Exit intent
  useEffect(() => {
    if (step !== 2 || items.length === 0) return
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentFired.current) {
        exitIntentFired.current = true
        setShowSoftCapture(false)
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [step, items.length])

  // beforeunload warning
  useEffect(() => {
    if (step !== 2 || items.length === 0) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [step, items.length])

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 340 }}>
          <div style={{ width: 48, height: 4, background: '#00B5A5', margin: '0 auto 1.5rem', borderRadius: 2 }} />
          <p style={{ color: '#F7F6F4', fontSize: '1.15rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', marginBottom: '0.75rem' }}>Open on your laptop</p>
          <p style={{ color: '#6B6B6B', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: 'Montserrat, sans-serif', marginBottom: '2rem' }}>
            Space Planner is a drag-and-drop tool. It needs a full screen to work properly — open this link on your desktop or laptop.
          </p>
          <div style={{ background: '#222', border: '1px solid #333', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#6B6B6B', fontSize: '0.7rem', marginBottom: '0.25rem', fontFamily: 'Montserrat, sans-serif' }}>Copy this link</p>
            <p style={{ color: '#00B5A5', fontSize: '0.8rem', wordBreak: 'break-all', fontFamily: 'Montserrat, sans-serif' }}>yourofficespace.au/tools/space-planner</p>
          </div>
          <Link href="/furniture" style={{ color: '#6B6B6B', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif', textDecoration: 'none' }}>Back to furniture</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {step === 1 && <Step1Room onNext={() => setStep(2)} />}
      {step === 2 && <Step2Furnish onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <Step3Quote onBack={() => setStep(2)} />}

      {showSoftCapture && !softCaptured && step === 2 && (
        <SoftEmailCapture
          onCapture={() => { setSoftCaptured(true); setShowSoftCapture(false) }}
          onDismiss={() => { setShowSoftCapture(false); sessionStorage.setItem('yos_soft_email_shown', '1') }}
        />
      )}

      {showExitIntent && step === 2 && items.length > 0 && (
        <ExitIntentModal
          onQuote={() => { setShowExitIntent(false); setStep(3) }}
          onDismiss={() => setShowExitIntent(false)}
          itemCount={items.length}
        />
      )}
    </>
  )
}
