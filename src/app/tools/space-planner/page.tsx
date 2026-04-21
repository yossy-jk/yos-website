'use client'

import dynamic from 'next/dynamic'
import { useState, useRef, useEffect, useCallback } from 'react'
import { usePlannerStore, getCategoryColor } from '@/lib/space-planner/store'
import { MOCK_PRODUCTS } from '@/components/space-planner/ProductSidebar'
import ProductSidebar from '@/components/space-planner/ProductSidebar'
import QuotePanel from '@/components/space-planner/QuotePanel'
import QuoteModal from '@/components/space-planner/QuoteModal'
import { Upload, Grid, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const PlannerCanvas = dynamic(() => import('@/components/space-planner/PlannerCanvas'), { ssr: false })

export default function SpacePlannerPage() {
  const [showModal, setShowModal] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const { clearAll, toggleSnap, snapToGrid, setFloorPlan, setRoomTemplate, addItem } = usePlannerStore()

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

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setFloorPlan(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const raw = e.dataTransfer.getData('application/json')
      if (!raw) return
      try {
        const data = JSON.parse(raw)
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
      } catch {
        // ignore malformed drag data
      }
    },
    [addItem]
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1A1A1A', overflow: 'hidden' }}>

      {/* TOP NAV BAR */}
      <header style={{
        background: '#1A1A1A',
        borderBottom: '1px solid #2a2a2a',
        padding: '0 1.25rem',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: '1rem',
      }}>
        {/* Left: back + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/furniture" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6B6B6B', fontSize: '0.8rem', textDecoration: 'none' }}>
            <ArrowLeft size={14} />
            Back
          </Link>
          <div style={{ width: '1px', height: '20px', background: '#333' }} />
          <span style={{ color: '#00B5A5', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', fontFamily: 'Montserrat, sans-serif' }}>
            Space Planner
          </span>
          <span style={{ color: '#6B6B6B', fontSize: '0.7rem', fontFamily: 'Montserrat, sans-serif' }}>beta</span>
        </div>

        {/* Centre: toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <label style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#F7F6F4',
            fontSize: '0.78rem',
            padding: '0.3rem 0.65rem',
            border: '1px solid #3a3a3a',
            borderRadius: '6px',
            background: 'transparent',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            <Upload size={13} />
            Upload floor plan
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFloorPlanUpload} />
          </label>

          <select
            onChange={(e) => setRoomTemplate(e.target.value || null)}
            style={{
              background: '#222',
              color: '#F7F6F4',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              padding: '0.3rem 0.55rem',
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <option value="">Room template</option>
            <option value="open-plan">Open Plan 15x12m</option>
            <option value="boardroom">Boardroom 8x6m</option>
            <option value="small-office">Small Office 6x5m</option>
            <option value="reception">Reception 10x8m</option>
          </select>

          <button
            onClick={toggleSnap}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: snapToGrid ? '#00B5A5' : '#6B6B6B',
              fontSize: '0.78rem',
              padding: '0.3rem 0.65rem',
              border: `1px solid ${snapToGrid ? '#00B5A5' : '#3a3a3a'}`,
              borderRadius: '6px',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <Grid size={13} />
            Snap
          </button>

          <button
            onClick={clearAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#ef4444',
              fontSize: '0.78rem',
              padding: '0.3rem 0.65rem',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <Trash2 size={13} />
            Clear
          </button>
        </div>

        {/* Right: YOS link */}
        <Link href="/" style={{ color: '#6B6B6B', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', flexShrink: 0 }}>
          yourofficespace.au
        </Link>
      </header>

      {/* MAIN THREE-PANEL AREA */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT: Furniture catalogue */}
        <div style={{ width: '240px', flexShrink: 0, overflow: 'hidden' }}>
          <ProductSidebar products={MOCK_PRODUCTS} />
        </div>

        {/* CENTRE: Canvas */}
        <main
          ref={canvasContainerRef}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#242424' }}
        >
          <PlannerCanvas
            width={canvasSize.width}
            height={canvasSize.height}
            onDrop={handleDrop}
          />
        </main>

        {/* RIGHT: Quote panel */}
        <div style={{ width: '260px', flexShrink: 0, overflow: 'hidden' }}>
          <QuotePanel onGetQuote={() => setShowModal(true)} />
        </div>
      </div>

      {/* Mobile guard */}
      <div className="md:hidden" style={{
        position: 'fixed',
        inset: 0,
        background: '#1A1A1A',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '340px' }}>
          <div style={{ width: '48px', height: '4px', background: '#00B5A5', margin: '0 auto 1.5rem', borderRadius: '2px' }} />
          <p style={{ color: '#F7F6F4', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em' }}>
            Open on your laptop
          </p>
          <p style={{ color: '#6B6B6B', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: 'Montserrat, sans-serif', marginBottom: '2rem' }}>
            Space Planner is a drag-and-drop design tool. It needs a full screen to work properly — open this link on your desktop or laptop.
          </p>
          <div style={{ background: '#222', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontFamily: 'Montserrat, sans-serif' }}>
            <p style={{ color: '#6B6B6B', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Copy this link</p>
            <p style={{ color: '#00B5A5', fontSize: '0.8rem', wordBreak: 'break-all' }}>yourofficespace.au/tools/space-planner</p>
          </div>
          <Link href="/furniture" style={{ display: 'inline-block', color: '#6B6B6B', fontSize: '0.8rem', fontFamily: 'Montserrat, sans-serif', textDecoration: 'none' }}>
            Back to furniture
          </Link>
        </div>
      </div>

      {showModal && <QuoteModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    </div>
  )
}
