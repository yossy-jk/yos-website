'use client'
import { useEffect, useState, useCallback, useRef } from 'react'

const C = {
  teal:    '#00B5A5',
  red:     '#ef4444',
  green:   '#22c55e',
  amber:   '#f59e0b',
  purple:  '#8b5cf6',
  card:    'rgba(255,255,255,0.03)',
  border:  'rgba(255,255,255,0.07)',
  hover:   'rgba(255,255,255,0.06)',
}

interface BlogItem {
  id: string
  type: string
  title: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
  metadata?: {
    targetKeyword?: string
    excerpt?: string
    division?: string
    author?: string
    scheduledFor?: string
    tags?: string[]
    slug?: string
    revisionCount?: number
    editCount?: number
  }
}

const DIVISION_LABELS: Record<string, string> = {
  'tenant-rep':    'Tenant Rep',
  'buyers-agency': 'Buyers Agency',
  'furniture':     'Furniture & Fitout',
  'cleaning':      'Cleaning',
  'general':       'General',
  'lease-intel':   'Lease Intel',
}

const DIVISION_COLOURS: Record<string, string> = {
  'tenant-rep':    '#00B5A5',
  'buyers-agency': '#10b981',
  'furniture':     '#8b5cf6',
  'cleaning':      '#f59e0b',
  'general':       '#6b7280',
  'lease-intel':   '#ec4899',
}

export default function ApprovalsTab({
  onCountChange,
}: {
  onCountChange?: (n: number) => void
}) {
  const [items, setItems] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state: 'preview' | 'edit' | 'revision' | 'delete'
  const [modal, setModal] = useState<{
    item: BlogItem
    mode: 'preview' | 'edit' | 'revision' | 'delete'
  } | null>(null)

  const [editContent, setEditContent] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionMsg, setActionMsg] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showMsg = (msg: string) => {
    setActionMsg(msg)
    if (msgTimer.current) clearTimeout(msgTimer.current)
    msgTimer.current = setTimeout(() => setActionMsg(null), 3000)
  }

  const loadQueue = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/queue/list', { credentials: 'include' })
      if (!res.ok) throw new Error('Not authenticated')
      const data = await res.json()
      const rawItems = data.pending || data.items || []
      const blogItems: BlogItem[] = rawItems
        .filter((i: Record<string, unknown>) => i.type === 'blog-post')
        .map((i: Record<string, unknown>) => ({
          id:         String(i.id),
          type:       String(i.type),
          title:      String(i.title || (i.content as string || '').slice(0, 80) || 'Untitled'),
          content:    String(i.content || ''),
          status:     String(i.status || 'pending'),
          createdAt:  String(i.createdAt || ''),
          updatedAt:  String(i.updatedAt || ''),
          metadata:   (i.metadata as BlogItem['metadata']) || {},
        }))
      setItems(blogItems)
      onCountChange?.(blogItems.length)
    } catch (e: unknown) {
      setError('Could not load queue. Is the dashboard session active?')
    } finally {
      setLoading(false)
    }
  }, [onCountChange])

  useEffect(() => { loadQueue() }, [loadQueue])

  // ── API calls ─────────────────────────────────────────────────────────────

  const doAction = async (
    item: BlogItem,
    act: 'approve' | 'edit' | 'revision' | 'delete'
  ) => {
    setSaving(true)
    try {
      if (act === 'approve') {
        const res = await fetch('/api/blog/approve', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: item.id,
            editedContent: editContent || undefined,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to publish')
        showMsg(`"${item.title.slice(0, 50)}" published to ${data.slug}`)

      } else if (act === 'edit') {
        if (!editContent.trim()) return
        const res = await fetch('/api/queue/action', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: item.id,
            action: 'edit',
            editedContent: editContent,
            feedback: 'Manual edit by Joe',
          }),
        })
        if (!res.ok) throw new Error('Failed to save edit')
        showMsg('Edit saved — the post stays in the queue for re-approval')

      } else if (act === 'revision') {
        if (!feedback.trim()) return
        const res = await fetch('/api/queue/action', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: item.id,
            action: 'revision',
            feedback,
          }),
        })
        if (!res.ok) throw new Error('Failed to request revision')
        showMsg('Revision sent — the team will fix and resubmit')

      } else if (act === 'delete') {
        const res = await fetch('/api/blog/delete-from-queue', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id }),
        })
        if (!res.ok) throw new Error('Failed to delete')
        showMsg('Deleted — permanently removed from the queue')
      }

      // Remove item from local list
      setItems(prev => prev.filter(i => i.id !== item.id))
      onCountChange?.(items.length - 1)
      setModal(null)
      setEditContent('')
      setFeedback('')
    } catch (e: unknown) {
      showMsg(`Error: ${String(e)}`)
    } finally {
      setSaving(false)
    }
  }

  // ── Open modal helpers ───────────────────────────────────────────────────

  const openPreview = (item: BlogItem) => {
    setModal({ item, mode: 'preview' })
  }

  const openEdit = (item: BlogItem) => {
    setEditContent(item.content)
    setFeedback('')
    setModal({ item, mode: 'edit' })
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const openRevision = (item: BlogItem) => {
    setEditContent('')
    setFeedback('')
    setModal({ item, mode: 'revision' })
  }

  const openDelete = (item: BlogItem) => {
    setModal({ item, mode: 'delete' })
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (loading) return (
    <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center', fontSize: '0.85rem' }}>
      Loading approvals...
    </div>
  )

  if (error) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <p style={{ color: C.red, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>
      <button onClick={loadQueue} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.4rem 1rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.75rem' }}>Retry</button>
    </div>
  )

  if (items.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {actionMsg && (
        <div style={{ background: 'rgba(34,197,94,0.12)', border: `1px solid rgba(34,197,94,0.25)`, borderRadius: 8, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: C.green, fontSize: '0.8rem' }}>Last action:</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{actionMsg}</span>
        </div>
      )}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '3.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.75rem', margin: '0 0 0.75rem' }}>All clear</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0 0 0.25rem', lineHeight: 1.6 }}>
          No blog posts need your approval.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', margin: 0 }}>
          New drafts appear here when the Innovation agent finishes them.
        </p>
      </div>
    </div>
  )

  const revCount = (item: BlogItem) =>
    (item.metadata?.revisionCount || 0) + (item.metadata?.editCount || 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Action feedback */}
      {actionMsg && (
        <div style={{
          background: 'rgba(34,197,94,0.08)', border: `1px solid rgba(34,197,94,0.2)`,
          borderRadius: 6, padding: '0.6rem 1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{ color: C.green, fontSize: '0.72rem', fontWeight: 700 }}>Done:</span>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>{actionMsg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
            Blog Approvals
          </p>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: 'white', fontWeight: 600 }}>
            {items.length} post{items.length !== 1 ? 's' : ''} waiting for review
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => { setActionMsg(null); loadQueue() }}
            style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.35rem 0.875rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Refresh
          </button>
        </div>
      </div>

      {/* Post cards */}
      {items.map((item) => {
        const div    = item.metadata?.division || 'general'
        const divCol = DIVISION_COLOURS[div] || C.purple
        const revNum = revCount(item)
        const kw     = item.metadata?.targetKeyword

        return (
          <div key={item.id} style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            overflow: 'hidden',
          }}>
            {/* Card header */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '1rem',
              padding: '1.1rem 1.25rem',
              background: 'rgba(0,0,0,0.15)',
              borderBottom: `1px solid ${C.border}`,
            }}>
              {/* Division badge */}
              <div style={{ flexShrink: 0, paddingTop: '0.15rem' }}>
                <span style={{
                  background: `${divCol}18`,
                  color: divCol,
                  border: `1px solid ${divCol}35`,
                  fontSize: '0.55rem', fontWeight: 800,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '0.2rem 0.5rem', borderRadius: 4,
                }}>
                  {DIVISION_LABELS[div] || div}
                </span>
              </div>

              {/* Title + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: '0 0 0.25rem',
                  fontWeight: 700, fontSize: '0.88rem',
                  color: 'white', lineHeight: 1.35,
                }}>
                  {item.title}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {kw && (
                    <span style={{ fontSize: '0.62rem', color: C.teal, fontStyle: 'italic' }}>
                      Target: {kw}
                    </span>
                  )}
                  {item.metadata?.excerpt && (
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>
                      {item.metadata.excerpt.slice(0, 80)}...
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', alignItems: 'center' }}>
                  {revNum > 0 && (
                    <span style={{ fontSize: '0.55rem', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', padding: '0.1rem 0.35rem', borderRadius: 3 }}>
                      v{revNum + 1}
                    </span>
                  )}
                  <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : ''}
                  </span>
                  <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)' }}>
                    {item.content.split(/\s+/).length} words
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center' }}>
                <button
                  onClick={() => openPreview(item)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.35rem 0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                  Preview
                </button>
                <button
                  onClick={() => openRevision(item)}
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 4, padding: '0.35rem 0.75rem', color: C.amber, fontSize: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                  Revise
                </button>
                <button
                  onClick={() => openEdit(item)}
                  style={{ background: 'rgba(0,181,165,0.1)', border: '1px solid rgba(0,181,165,0.25)', borderRadius: 4, padding: '0.35rem 0.75rem', color: C.teal, fontSize: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                  Edit
                </button>
                <button
                  onClick={() => openDelete(item)}
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '0.35rem 0.75rem', color: C.red, fontSize: '0.6rem', cursor: 'pointer', fontWeight: 600 }}>
                  Delete
                </button>
                <button
                  onClick={() => { setEditContent(''); doAction(item, 'approve') }}
                  disabled={saving}
                  style={{ background: C.green, border: 'none', borderRadius: 4, padding: '0.35rem 1rem', color: 'white', fontSize: '0.62rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                  {saving ? '...' : 'Approve'}
                </button>
              </div>
            </div>

            {/* Content snippet */}
            <div style={{ padding: '0.75rem 1.25rem' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content.replace(/[#*_`]/g, '').slice(0, 300)}
              </p>
            </div>
          </div>
        )
      })}

      {/* ── MODAL ──────────────────────────────────────────────────────────── */}

      {modal && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.88)',
            zIndex: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div style={{
            background: '#0f1117',
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            width: '100%',
            maxWidth: modal.mode === 'delete' ? 420 : 900,
            maxHeight: '92vh',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>

            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.5rem',
              borderBottom: `1px solid ${C.border}`,
              flexShrink: 0,
            }}>
              {/* Icon */}
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>
                {modal.mode === 'preview'  ? 'Read' :
                 modal.mode === 'edit'     ? 'Edit' :
                 modal.mode === 'revision' ? 'Revise' : 'Delete'}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>
                  {modal.mode === 'preview'  ? 'Full post preview' :
                   modal.mode === 'edit'     ? 'Edit post content' :
                   modal.mode === 'revision' ? 'Request revision' :
                                             'Delete this post?'}
                </p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>
                  {modal.mode === 'preview'  ? modal.item.title :
                   modal.mode === 'edit'     ? 'Changes will be saved to the queue for re-approval' :
                   modal.mode === 'revision' ? 'Tell the team exactly what needs to change' :
                                             'This cannot be undone.'}
                </p>
              </div>
              <button
                onClick={() => { setModal(null); setEditContent(''); setFeedback('') }}
                style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.35rem 0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', cursor: 'pointer' }}>
                Close
              </button>
            </div>

            {/* ── PREVIEW ─────────────────────────────────────────────────── */}
            {modal.mode === 'preview' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                    {modal.item.title}
                  </p>
                  {modal.item.metadata?.targetKeyword && (
                    <span style={{ fontSize: '0.62rem', color: C.teal, fontStyle: 'italic' }}>
                      Target keyword: {modal.item.metadata.targetKeyword}
                    </span>
                  )}
                </div>
                <pre style={{
                  margin: 0, padding: '1.5rem',
                  fontSize: '0.8rem', lineHeight: 1.85,
                  color: 'rgba(255,255,255,0.8)',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  background: '#0a0f1a',
                }}>
                  {modal.item.content}
                </pre>
              </div>
            )}

            {/* ── EDIT ────────────────────────────────────────────────────── */}
            {modal.mode === 'edit' && (
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#0a0f1a',
                    border: 'none',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.78rem',
                    lineHeight: 1.8,
                    padding: '1.5rem',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'ui-monospace, Menlo, monospace',
                    minHeight: 480,
                  }}
                />
                <div style={{
                  display: 'flex', gap: '0.75rem', padding: '0.875rem 1.5rem',
                  borderTop: `1px solid ${C.border}`,
                  background: 'rgba(0,0,0,0.3)',
                  justifyContent: 'flex-end',
                }}>
                  <button
                    onClick={() => { setModal(null); setEditContent('') }}
                    style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.5rem 1.25rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Discard
                  </button>
                  <button
                    onClick={() => doAction(modal.item, 'edit')}
                    disabled={saving || !editContent.trim() || editContent === modal.item.content}
                    style={{ background: 'rgba(0,181,165,0.15)', border: `1px solid rgba(0,181,165,0.3)`, borderRadius: 6, padding: '0.5rem 1.25rem', color: C.teal, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', opacity: (!editContent.trim() || editContent === modal.item.content) ? 0.4 : 1 }}>
                    Save edit
                  </button>
                  <button
                    onClick={() => doAction(modal.item, 'approve')}
                    disabled={saving}
                    style={{ background: C.green, border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', color: 'white', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                    {saving ? 'Publishing...' : 'Save & Approve'}
                  </button>
                </div>
              </div>
            )}

            {/* ── REVISION ─────────────────────────────────────────────────── */}
            {modal.mode === 'revision' && (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
                <div>
                  <p style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>
                    Original content (first 500 chars)
                  </p>
                  <div style={{ background: '#0a0f1a', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.75rem 1rem', maxHeight: 140, overflowY: 'auto' }}>
                    <pre style={{ margin: 0, fontSize: '0.7rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {modal.item.content.slice(0, 500)}{modal.item.content.length > 500 ? '...' : ''}
                    </pre>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.58rem', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>
                    What needs to change?
                  </p>
                  <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="E.g. The intro is too generic — needs more Newcastle-specific context. The CTA at the end doesn't match our brand voice. Target keyword 'commercial fitout Newcastle' should appear in the first 100 words."
                    style={{
                      width: '100%',
                      background: '#0a0f1a',
                      border: `1px solid rgba(245,158,11,0.3)`,
                      borderRadius: 6,
                      padding: '0.875rem 1rem',
                      color: 'white',
                      fontSize: '0.8rem',
                      lineHeight: 1.65,
                      resize: 'vertical',
                      minHeight: 120,
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setModal(null); setFeedback('') }}
                    style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.5rem 1.25rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => doAction(modal.item, 'revision')}
                    disabled={saving || !feedback.trim()}
                    style={{ background: C.amber, border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', color: 'white', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', opacity: (!feedback.trim() || saving) ? 0.4 : 1 }}>
                    {saving ? 'Sending...' : 'Send back to team'}
                  </button>
                </div>
              </div>
            )}

            {/* ── DELETE ──────────────────────────────────────────────────── */}
            {modal.mode === 'delete' && (
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: C.red, fontSize: '1.3rem' }}>X</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', margin: '0 0 0.5rem' }}>
                    Delete &quot;{modal.item.title.slice(0, 60)}&quot;?
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6 }}>
                    This removes the post from the queue permanently.
                    It will not be published and cannot be recovered.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                  <button
                    onClick={() => setModal(null)}
                    style={{ flex: 1, background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.6rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Keep it
                  </button>
                  <button
                    onClick={() => doAction(modal.item, 'delete')}
                    disabled={saving}
                    style={{ flex: 1, background: C.red, border: 'none', borderRadius: 6, padding: '0.6rem 1rem', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                    {saving ? 'Deleting...' : 'Delete permanently'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
