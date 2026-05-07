'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useState, useRef, useEffect, useCallback } from 'react'
import { usePlannerStore, getCategoryColor, ROOM_PRESETS, type RoomType } from '@/lib/space-planner/store'
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
    // Store in sessionStorage
    sessionStorage.setItem('yos_planner_user', JSON.stringify({ firstName, email }))
    // Fire HubSpot lead (non-blocking)
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
      background: '#111',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        {/* Logo mark */}
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
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{
              background: '#1E1E1E', border: '1px solid #333', borderRadius: 8,
              padding: '0.85rem 1rem', color: '#F7F6F4', fontSize: '0.95rem',
              fontFamily: 'Montserrat, sans-serif', outline: 'none',
            }}
            autoFocus
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: '#1E1E1E', border: '1px solid #333', borderRadius: 8,
              padding: '0.85rem 1rem', color: '#F7F6F4', fontSize: '0.95rem',
              fontFamily: 'Montserrat, sans-serif', outline: 'none',
            }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#00B5A5', color: '#FFFFFF', border: 'none', borderRadius: 8,
              padding: '0.9rem 1.5rem', fontSize: '0.95rem', fontWeight: 700,
              fontFamily: 'Montserrat, sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1, marginTop: 4,
            }}
          >
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

// ─── Step 1: Room Setup ───────────────────────────────────────────────────────

const ROOM_TYPES: Array<{ id: RoomType; label: string; desc: string; icon: string }> = [
  { id: 'open-plan', label: 'Open Plan Office', desc: '10×8m default', icon: '⬛' },
  { id: 'private-office', label: 'Private Office', desc: '5×4m default', icon: '🚪' },
  { id: 'meeting-room', label: 'Meeting Room', desc: '7×5m default', icon: '🪑' },
  { id: 'reception', label: 'Reception', desc: '8×6m default', icon: '🏢' },
  { id: 'custom', label: 'Custom', desc: 'Set your own size', icon: '✏️' },
]

const PRESET_SIZES = [
  { label: '4×3m', w: 4, d: 3 },
  { label: '6×5m', w: 6, d: 5 },
  { label: '8×6m', w: 8, d: 6 },
  { label: '10×8m', w: 10, d: 8 },
  { label: '12×10m', w: 12, d: 10 },
]

function Step1Room({ onNext }: { onNext: () => void }) {
  const { roomConfig, setRoomConfig, setStep } = usePlannerStore()
  const [selectedType, setSelectedType] = useState<RoomType>(roomConfig.type)
  const [width, setWidth] = useState(roomConfig.width)
  const [depth, setDepth] = useState(roomConfig.depth)

  const handleTypeSelect = (type: RoomType) => {
    setSelectedType(type)
    const preset = ROOM_PRESETS[type]
    if (preset) {
      setWidth(preset.defaultSize.width)
      setDepth(preset.defaultSize.depth)
    }
  }

  const handleNext = () => {
    setRoomConfig({ type: selectedType, width, depth })
    onNext()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Header */}
      <div style={{ maxWidth: 680, width: '100%', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/furniture" style={{ color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif' }}>
            <ArrowLeft size={14} /> Back
          </Link>
          <span style={{ color: '#00B5A5', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Montserrat, sans-serif' }}>Space Planner</span>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
          {['Your Space', 'Add Furniture', 'Get Quote'].map((label, i) => (
            <React.Fragment key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 0 ? '#00B5A5' : '#2A2A2A',
                  color: i === 0 ? '#FFF' : '#6B6B6B',
                  fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '0.8rem', color: i === 0 ? '#F7F6F4' : '#6B6B6B', fontFamily: 'Montserrat, sans-serif', fontWeight: i === 0 ? 700 : 400 }}>
                  {label}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: '#2A2A2A' }} />}
            </React.Fragment>
          ))}
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.5rem' }}>
          What type of space are you planning?
        </h2>
        <p style={{ color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem' }}>
          Pick a room type and set your dimensions.
        </p>
      </div>

      {/* Room type cards */}
      <div style={{ maxWidth: 680, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {ROOM_TYPES.map((rt) => (
          <button
            key={rt.id}
            onClick={() => handleTypeSelect(rt.id)}
            style={{
              padding: '1rem 0.5rem',
              borderRadius: 10,
              border: `2px solid ${selectedType === rt.id ? '#00B5A5' : '#2A2A2A'}`,
              background: selectedType === rt.id ? 'rgba(0,181,165,0.08)' : '#1E1E1E',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{rt.icon}</div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: selectedType === rt.id ? '#00B5A5' : '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: 3 }}>
              {rt.label}
            </p>
            <p style={{ fontSize: '0.65rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>
              {rt.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Size controls */}
      <div style={{ maxWidth: 680, width: '100%', background: '#1E1E1E', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '1rem' }}>
          Room dimensions
        </h3>

        {/* Presets */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {PRESET_SIZES.map((ps) => (
            <button
              key={ps.label}
              onClick={() => { setWidth(ps.w); setDepth(ps.d); }}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: 6,
                border: `1px solid ${width === ps.w && depth === ps.d ? '#00B5A5' : '#333'}`,
                background: width === ps.w && depth === ps.d ? 'rgba(0,181,165,0.1)' : 'transparent',
                color: width === ps.w && depth === ps.d ? '#00B5A5' : '#9B9B9B',
                fontSize: '0.78rem',
                fontFamily: 'Montserrat, sans-serif',
                cursor: 'pointer',
              }}
            >
              {ps.label}
            </button>
          ))}
        </div>

        {/* Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {[
            { label: 'Width', value: width, onChange: setWidth },
            { label: 'Depth', value: depth, onChange: setDepth },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.78rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif' }}>{label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif' }}>{value}m</span>
              </div>
              <input
                type="range" min={2} max={20} step={0.5} value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#00B5A5' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.65rem', color: '#4B4B4B', fontFamily: 'Montserrat, sans-serif' }}>2m</span>
                <span style={{ fontSize: '0.65rem', color: '#4B4B4B', fontFamily: 'Montserrat, sans-serif' }}>20m</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>
          Floor area: <strong style={{ color: '#F7F6F4' }}>{(width * depth).toFixed(0)}m²</strong>
        </p>
      </div>

      <div style={{ maxWidth: 680, width: '100%' }}>
        <button
          onClick={handleNext}
          style={{
            width: '100%', background: '#00B5A5', color: '#FFFFFF', border: 'none', borderRadius: 8,
            padding: '1rem', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          Next: Add Furniture <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Furnish ──────────────────────────────────────────────────────────

function AreaStatsBar() {
  const { items, roomConfig } = usePlannerStore()

  const workstations = items.filter((i) => i.category === 'Desks').length
  const meetingSeats = items.filter((i) => {
    const id = i.productId.toLowerCase()
    return i.category === 'Seating' && (id.includes('meeting') || id.includes('visitor'))
  }).length
  const loungeSeats = items.filter((i) => {
    const id = i.productId.toLowerCase()
    return i.category === 'Breakout' || id.includes('lounge') || id.includes('sofa')
  }).length

  const roomAreaPx = roomConfig.width * 80 * roomConfig.depth * 80
  const usedAreaPx = items.reduce((sum, i) => sum + i.width * i.height, 0)
  const floorUsed = roomAreaPx > 0 ? Math.round((usedAreaPx / roomAreaPx) * 100) : 0

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1.5rem',
      padding: '0.5rem 1rem', background: '#1A1A1A', borderTop: '1px solid #2A2A2A',
      flexShrink: 0, flexWrap: 'wrap',
    }}>
      <StatPill label="Room" value={`${roomConfig.width}×${roomConfig.depth}m · ${(roomConfig.width * roomConfig.depth).toFixed(0)}m²`} />
      <StatPill label="Workstations" value={String(workstations)} />
      <StatPill label="Meeting seats" value={String(meetingSeats)} />
      <StatPill label="Lounge seats" value={String(loungeSeats)} />
      <StatPill label="Floor used" value={`${Math.min(floorUsed, 100)}%`} warn={floorUsed > 80} />
      <StatPill label="Items placed" value={String(items.length)} />
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

function Step2Furnish({
  onBack,
  onNext,
}: {
  onBack: () => void
  onNext: () => void
}) {
  const {
    selectedId, snapToGrid, toggleSnap,
    undo, redo, history, historyIndex,
    duplicateItem, rotateItem, removeItem,
    addItem, items, roomConfig, applyPreset,
  } = usePlannerStore()

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage | null>(null)
  const [presetApplied, setPresetApplied] = useState(false)

  // Apply preset furniture on mount (once)
  useEffect(() => {
    if (!presetApplied && roomConfig.type !== 'custom') {
      applyPreset(roomConfig.type)
      setPresetApplied(true)
    }
  }, [presetApplied, roomConfig.type, applyPreset])

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
      <header style={{
        background: '#1A1A1A', borderBottom: '1px solid #2A2A2A',
        height: 52, padding: '0 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, gap: '1rem',
      }}>
        {/* Left: back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: '#333' }} />
          <span style={{ color: '#00B5A5', fontWeight: 700, fontSize: '1rem', fontFamily: 'Montserrat, sans-serif' }}>Space Planner</span>
          <span style={{ color: '#6B6B6B', fontSize: '0.7rem', fontFamily: 'Montserrat, sans-serif' }}>Step 2 of 3</span>
        </div>

        {/* Centre: toolbar */}
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
        </div>

        {/* Right: submit */}
        <button
          onClick={onNext}
          style={{
            background: '#00B5A5', color: '#FFF', border: 'none', borderRadius: 8,
            padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 700,
            fontFamily: 'Montserrat, sans-serif', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}
        >
          Submit for Quote <ChevronRight size={14} />
        </button>
      </header>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar */}
        <div style={{ width: 240, flexShrink: 0, overflow: 'hidden' }}>
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
        </main>
      </div>

      {/* Bottom stats bar */}
      <AreaStatsBar />
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
  const { items, roomConfig } = usePlannerStore()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', notes: '' })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.email) { setError('First name and email are required.'); return }
    if (!form.email.includes('@')) { setError('Enter a valid email.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/space-planner-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemList, room: roomConfig, contact: form }),
      })
      const data = await res.json() as { success?: boolean; reference?: string; error?: string }
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Try again.')
        setLoading(false)
        return
      }
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
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#00B5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.4rem' }}>
            ✓
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.75rem' }}>
            Quote submitted
          </h2>
          <p style={{ color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.7, marginBottom: '0.5rem' }}>
            Joe&apos;s team will prepare your quote within 24 hours.
          </p>
          {reference && (
            <p style={{ color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Reference: <strong style={{ color: '#00B5A5' }}>{reference}</strong>
            </p>
          )}
          <Link href="/furniture" style={{ display: 'inline-block', background: '#00B5A5', color: '#FFF', borderRadius: 8, padding: '0.75rem 1.5rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
            Back to Furniture
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A1A', display: 'flex', padding: '2rem', gap: '2rem', justifyContent: 'center' }}>
      {/* Summary column */}
      <div style={{ width: 320, flexShrink: 0 }}>
        <div style={{ background: '#1E1E1E', borderRadius: 12, padding: '1.25rem', position: 'sticky', top: '2rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.75rem' }}>
            Your plan summary
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: '1rem' }}>
            {roomConfig.type.replace('-', ' ')} · {roomConfig.width}×{roomConfig.depth}m · {(roomConfig.width * roomConfig.depth).toFixed(0)}m²
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {itemList.length === 0 && (
              <p style={{ fontSize: '0.78rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>No items placed.</p>
            )}
            {itemList.map((item) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif' }}>{item.name}</span>
                <span style={{ fontSize: '0.78rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif' }}>×{item.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #2A2A2A', marginTop: '1rem', paddingTop: '1rem' }}>
            <p style={{ fontSize: '0.72rem', color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif' }}>
              Pricing will be prepared and sent to you.
            </p>
          </div>
        </div>
      </div>

      {/* Form column */}
      <div style={{ maxWidth: 480, width: '100%' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif', marginBottom: '1.5rem', padding: 0 }}>
          <ArrowLeft size={14} /> Back to planner
        </button>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F7F6F4', fontFamily: 'Montserrat, sans-serif', marginBottom: '0.5rem' }}>
          Get your quote
        </h2>
        <p style={{ color: '#6B6B6B', fontFamily: 'Montserrat, sans-serif', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
          Fill in your details and we&apos;ll prepare a quote based on your plan.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <FormField label="First name *" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
            <FormField label="Last name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
          </div>
          <FormField label="Email *" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          <FormField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
          <FormField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: 4 }}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Anything else we should know..."
              rows={3}
              style={{
                width: '100%', background: '#1E1E1E', border: '1px solid #333', borderRadius: 8,
                padding: '0.75rem', color: '#F7F6F4', fontSize: '0.88rem',
                fontFamily: 'Montserrat, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#00B5A5', color: '#FFF', border: 'none', borderRadius: 8,
              padding: '1rem', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {loading ? 'Submitting...' : 'Submit for Quote'}
          </button>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', color: '#9B9B9B', fontFamily: 'Montserrat, sans-serif', marginBottom: 4 }}>{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', background: '#1E1E1E', border: '1px solid #333', borderRadius: 8,
          padding: '0.75rem', color: '#F7F6F4', fontSize: '0.88rem',
          fontFamily: 'Montserrat, sans-serif', outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SpacePlannerPage() {
  const [gateCleared, setGateCleared] = useState(false)
  const { step, setStep, setRoomConfig, applyPreset } = usePlannerStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('yos_planner_user')
      if (stored) setGateCleared(true)

      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleGateComplete = () => {
    setGateCleared(true)
    setStep(1)
  }

  const handleStep1Next = () => {
    setStep(2)
  }

  const handleStep2Back = () => {
    setStep(1)
  }

  const handleStep3Back = () => {
    setStep(2)
  }

  if (!gateCleared) {
    return <GateScreen onComplete={handleGateComplete} />
  }

  // Mobile guard
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
          <Link href="/furniture" style={{ color: '#6B6B6B', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif', textDecoration: 'none' }}>
            Back to furniture
          </Link>
        </div>
      </div>
    )
  }

  if (step === 1) return <Step1Room onNext={handleStep1Next} />
  if (step === 2) return <Step2Furnish onBack={handleStep2Back} onNext={() => setStep(3)} />
  if (step === 3) return <Step3Quote onBack={handleStep3Back} />

  return null
}
