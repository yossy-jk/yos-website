'use client'

import { useState, useCallback, useEffect } from 'react'

type Stage = 'Evaluation' | 'Shortlisted' | 'Inspection' | 'Negotiations' | 'Disqualified'

interface Property {
  id: string
  client_id: string
  stage: Stage
  address: string
  suburb: string
  size_sqm: number | null
  asking_rent: number | null
  notes: string | null
  disqualified_reason: string | null
  created_at: string
  updated_at: string
}

interface Interaction {
  id: string
  property_id: string
  interaction_type: string
  note: string
  created_at: string
}

const STAGES: Stage[] = ['Evaluation', 'Shortlisted', 'Inspection', 'Negotiations', 'Disqualified']

const SC: Record<Stage, { dot: string; lbl: string; bg: string; sel: string }> = {
  Evaluation:   { dot: '#00B5A5', lbl: '#00B5A5', bg: 'rgba(0,181,165,0.06)',  sel: 'rgba(0,181,165,0.15)' },
  Shortlisted:  { dot: '#6366f1', lbl: '#6366f1', bg: 'rgba(99,102,241,0.06)', sel: 'rgba(99,102,241,0.15)' },
  Inspection:   { dot: '#f59e0b', lbl: '#f59e0b', bg: 'rgba(245,158,11,0.06)',  sel: 'rgba(245,158,11,0.15)' },
  Negotiations: { dot: '#a78bfa', lbl: '#a78bfa', bg: 'rgba(167,139,250,0.06)', sel: 'rgba(167,139,250,0.15)' },
  Disqualified: { dot: '#6b7280', lbl: '#6b7280', bg: 'rgba(107,114,128,0.06)', sel: 'rgba(107,114,128,0.15)' },
}

function fmtRent(r: number | null) {
  if (!r) return ''
  return ` · $${r.toLocaleString()}/sqm`
}

function daysAgo(s: string) {
  const d = Math.floor((Date.now() - new Date(s).getTime()) / 86400000)
  return d === 0 ? 'today' : d === 1 ? '1d ago' : `${d}d ago`
}

interface PropsCardProps {
  property: Property
  interactions: Interaction[]
  stageColour: typeof SC[keyof typeof SC]
  selProp: string | null
  propNote: string
  onSelect: (id: string | null) => void
  onNoteChange: (v: string) => void
  onAddNote: () => void
  onStageChange: (id: string, stage: Stage) => void
}

function PropertyCard({ property: p, interactions, stageColour: c, selProp, propNote, onSelect, onNoteChange, onAddNote, onStageChange }: PropsCardProps) {
  const pin = selProp === p.id
  const propInts = interactions.filter(i => i.property_id === p.id)
  return (
    <div key={p.id} onClick={() => onSelect(pin ? null : p.id)} style={{
      background: pin ? c.sel : 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '6px',
      padding: '0.85rem',
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white', marginBottom: '0.2rem' }}>{p.address}</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>
            {p.suburb || 'Suburb TBC'}{p.size_sqm ? ` ${p.size_sqm}sqm` : ''}{fmtRent(p.asking_rent)}
          </div>
        </div>
        <select value={p.stage} onChange={e => { e.stopPropagation(); onStageChange(p.id, e.target.value as Stage) }} onClick={e => e.stopPropagation()} style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '4px',
          padding: '0.3rem 0.5rem',
          color: c.lbl,
          fontSize: '0.62rem',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}>
          {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {p.notes && (
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.5rem', fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: '0.5rem' }}>
          {p.notes.slice(-300)}
        </div>
      )}
      {p.disqualified_reason && (
        <div style={{ fontSize: '0.68rem', color: 'rgba(239,68,68,0.8)', marginTop: '0.4rem', fontWeight: 600 }}>
          Disqualified: {p.disqualified_reason}
        </div>
      )}
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.4rem' }}>
        Updated {daysAgo(p.updated_at)}
      </div>
      {pin && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input value={propNote} onChange={e => onNoteChange(e.target.value)} placeholder="Add a note..." style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '4px',
              padding: '0.4rem 0.6rem',
              color: 'white',
              fontSize: '0.75rem',
              fontFamily: 'inherit',
            }} />
            <button onClick={onAddNote} style={{
              background: '#00B5A5',
              border: 'none',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              color: 'white',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '4px',
            }}>Add</button>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            {propInts.slice(0, 5).map(i => (
              <div key={i.id} style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>[{i.interaction_type}]</span> {i.note}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TenantRepTab() {
  const [properties, setProperties] = useState<Property[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [selProp, setSelProp] = useState<string | null>(null)
  const [propNote, setPropNote] = useState('')
  const [addingProp, setAddingProp] = useState(false)
  const [showInt, setShowInt] = useState(false)
  const [loading, setLoading] = useState(true)
  const [propForm, setPropForm] = useState({ address: '', suburb: '', size_sqm: '', asking_rent: '', stage: 'Evaluation' as Stage })
  const [intForm, setIntForm] = useState({ interaction_type: 'call', note: '' })
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    try {
      const [pRes, iRes] = await Promise.all([
        fetch('/api/tenant-rep-pipeline/properties'),
        fetch('/api/tenant-rep-pipeline/interactions'),
      ])
      if (pRes.ok) setProperties(await pRes.json())
      if (iRes.ok) setInteractions(await iRes.json())
    } catch { /* silent */ } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const selProps = selProp ? properties : properties
  const updateStage = async (id: string, stage: Stage) => {
    setProperties(ps => ps.map(p => p.id === id ? { ...p, stage } : p))
    await fetch(`/api/tenant-rep-pipeline/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
  }

  const addProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!propForm.address.trim()) return
    const body = { ...propForm, size_sqm: propForm.size_sqm ? Number(propForm.size_sqm) : null, asking_rent: propForm.asking_rent ? Number(propForm.asking_rent) : null }
    const res = await fetch('/api/tenant-rep-pipeline/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const np = await res.json()
      setProperties(ps => [...ps, np])
      setPropForm({ address: '', suburb: '', size_sqm: '', asking_rent: '', stage: 'Evaluation' })
      setAddingProp(false)
      setMsg('Property added.')
      setTimeout(() => setMsg(''), 2000)
    }
  }

  const addNote = async () => {
    if (!selProp || !propNote.trim()) return
    const res = await fetch(`/api/tenant-rep-pipeline/properties/${selProp}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: propNote }),
    })
    if (res.ok) {
      const ni = await res.json()
      setInteractions(prev => [...prev, ni])
      setPropNote('')
      load()
    }
  }

  const addInteraction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!propForm.address.trim() || !intForm.note.trim()) return
    const res = await fetch('/api/tenant-rep-pipeline/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...intForm, address: propForm.address }),
    })
    if (res.ok) {
      const ni = await res.json()
      setInteractions(prev => [...prev, ni])
      setIntForm({ interaction_type: 'call', note: '' })
      setShowInt(false)
    }
  }

  const copyLink = async (clientId: string) => {
    const res = await fetch('/api/tenant-rep/generate-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId }),
    })
    if (res.ok) {
      const { url } = await res.json()
      await navigator.clipboard.writeText(url)
      setMsg('Link copied!')
      setTimeout(() => setMsg(''), 2000)
    }
  }

  if (loading) return (
    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '3rem' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <p style={{ color: 'white', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Tenant Rep Pipeline</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', margin: '0.2rem 0 0' }}>{properties.length} properties tracked</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {msg && <span style={{ color: '#00B5A5', fontSize: '0.72rem', padding: '0.4rem 0.75rem', background: 'rgba(0,181,165,0.1)', borderRadius: 4 }}>{msg}</span>}
          <button onClick={() => setAddingProp(!addingProp)} style={{
            background: addingProp ? 'rgba(239,68,68,0.1)' : '#00B5A5',
            border: addingProp ? '1px solid rgba(239,68,68,0.3)' : 'none',
            color: addingProp ? '#ef4444' : 'white',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            borderRadius: '4px',
          }}>Add Property</button>
          <button onClick={() => setShowInt(!showInt)} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            borderRadius: '4px',
          }}>Log Interaction</button>
        </div>
      </div>

      {addingProp && (
        <form onSubmit={addProperty} style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input value={propForm.address} onChange={e => setPropForm(f => ({ ...f, address: e.target.value }))} placeholder="Property address *" required style={inputStyle} />
            <input value={propForm.suburb} onChange={e => setPropForm(f => ({ ...f, suburb: e.target.value }))} placeholder="Suburb" style={inputStyle} />
            <input value={propForm.size_sqm} onChange={e => setPropForm(f => ({ ...f, size_sqm: e.target.value }))} placeholder="Size (sqm)" type="number" style={inputStyle} />
            <input value={propForm.asking_rent} onChange={e => setPropForm(f => ({ ...f, asking_rent: e.target.value }))} placeholder="Asking rent ($/sqm)" type="number" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <select value={propForm.stage} onChange={e => setPropForm(f => ({ ...f, stage: e.target.value as Stage }))} style={{ ...inputStyle, width: 'auto' }}>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="submit" style={{ background: '#00B5A5', border: 'none', padding: '0.5rem 1.25rem', cursor: 'pointer', color: 'white', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '4px' }}>Save Property</button>
            <button type="button" onClick={() => setAddingProp(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontFamily: 'inherit', fontSize: '0.65rem' }}>Cancel</button>
          </div>
        </form>
      )}

      {showInt && (
        <form onSubmit={addInteraction} style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          border: '1px solid rgba(0,181,165,0.3)',
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            <select value={intForm.interaction_type} onChange={e => setIntForm(f => ({ ...f, interaction_type: e.target.value }))} style={{ ...inputStyle, width: 'auto' }}>
              {['call', 'email', 'meeting', 'sighting', 'drop-in', 'proposal', 'negotiation'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input value={propForm.address} onChange={e => setPropForm(f => ({ ...f, address: e.target.value }))} placeholder="Property address *" style={{ ...inputStyle, flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <textarea value={intForm.note} onChange={e => setIntForm(f => ({ ...f, note: e.target.value }))} placeholder="What happened?" rows={3} style={{ ...inputStyle, flex: 1 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ background: '#00B5A5', border: 'none', padding: '0.5rem 1.25rem', cursor: 'pointer', color: 'white', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '4px' }}>Log</button>
              <button type="button" onClick={() => setShowInt(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontFamily: 'inherit', fontSize: '0.65rem' }}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {STAGES.map(stage => {
        const sp = properties.filter(p => p.stage === stage)
        const c = SC[stage]
        return sp.length > 0 ? (
          <div key={stage} style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.dot, display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: c.lbl }}>{stage}</span>
              <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>({sp.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sp.map(p => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  interactions={interactions}
                  stageColour={c}
                  selProp={selProp}
                  propNote={propNote}
                  onSelect={setSelProp}
                  onNoteChange={setPropNote}
                  onAddNote={addNote}
                  onStageChange={updateStage}
                />
              ))}
            </div>
          </div>
        ) : null
      })}

      {properties.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
          No properties yet. Add your first above.
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '4px',
  padding: '0.5rem 0.75rem',
  color: 'white',
  fontSize: '0.78rem',
  fontFamily: 'inherit',
  width: '100%',
}