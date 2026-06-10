'use client'
import { useEffect, useState, useCallback, useRef } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)', purple: '#8b5cf6' }

const TYPE_CONFIG: Record<string, { label: string; colour: string; icon: string; editable?: boolean }> = {
  'linkedin-post':   { label: 'LinkedIn', colour: '#0077b5', icon: '💼' },
  'proposal':        { label: 'Proposal', colour: C.teal, icon: '📄', editable: true },
  'cold-email':      { label: 'Cold Email', colour: '#8b5cf6', icon: '✉️', editable: true },
  'invoice-chaser':  { label: 'Invoice', colour: C.red, icon: '💰' },
  'tender-decision': { label: 'Tender', colour: C.amber, icon: '🏗️' },
  'blog-post':       { label: 'Blog Post', colour: '#10b981', icon: '📝', editable: true },
  'email-draft':     { label: 'Email', colour: '#6366f1', icon: '📧', editable: true },
  'other':           { label: 'Other', colour: '#6b7280', icon: '📌' },
}

interface ModalState {
  item: Record<string, unknown>
  mode: 'edit' | 'revision'
}

export default function ApprovalsTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const [queue, setQueue] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [editContent, setEditContent] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const loadQueue = useCallback(() => {
    fetch('/api/queue/list', { credentials: 'include' })
      .then(r => r.ok ? r.json() : { items: [] })
      .then(d => {
        const rawItems = d.pending || d.items || []
        const items = rawItems.map((item: Record<string, unknown>) => ({
          ...item,
          title: item.title || (item.content as string || '').slice(0, 60) || item.type,
        }))
        setQueue(items)
        onCountChange?.(items.length)
        setLoading(false)
      }).catch(() => setLoading(false))
  }, [onCountChange])

  useEffect(() => { loadQueue() }, [loadQueue])

  const doAction = async (
    id: string,
    act: 'approve' | 'skip' | 'edit' | 'revision',
    opts?: { editedContent?: string; feedback?: string }
  ) => {
    setActing(id)
    const body: Record<string, unknown> = { id, action: act }
    if (act === 'edit') body.editedContent = opts?.editedContent
    if (act === 'revision') body.feedback = opts?.feedback
    await fetch('/api/queue/action', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {})
    setQueue(q => q.filter(i => i.id !== id))
    onCountChange?.(queue.length - 1)
    setActing(null)
    setModal(null)
    setEditContent('')
    setFeedback('')
  }

  const openEdit = (item: Record<string, unknown>) => {
    setModal({ item, mode: 'edit' })
    setEditContent(item.content as string || '')
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const openRevision = (item: Record<string, unknown>) => {
    setModal({ item, mode: 'revision' })
    setFeedback('')
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading approvals...</div>

  if (queue.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '3rem', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>✅</p>
        <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.25rem' }}>Queue is clear</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: 0 }}>Agents are working. Blog posts, emails and proposals will appear here for your approval.</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
          {queue.length} item{queue.length !== 1 ? 's' : ''} need your approval
        </p>
        <button onClick={loadQueue}
          style={{ background: 'transparent', border: `1px solid ${C.border}`, color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', padding: '0.35rem 0.875rem', cursor: 'pointer', borderRadius: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Refresh
        </button>
      </div>

      {queue.map((item: Record<string, unknown>) => {
        const cfg = TYPE_CONFIG[item.type as string] || TYPE_CONFIG.other
        const isExp = expanded === item.id as string
        const content = item.content as string || ''
        const isActing = acting === item.id as string
        const canEdit = cfg.editable
        const revisionCount = (item.revisionCount as number || 0) + (item.editCount as number || 0)

        return (
          <div key={item.id as string} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{cfg.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title as string || content.slice(0, 60)}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.58rem', background: `${cfg.colour}22`, color: cfg.colour, padding: '0.1rem 0.4rem', borderRadius: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {cfg.label}
                  </span>
                  {item.status === 'pending-revised' && (
                    <span style={{ fontSize: '0.55rem', background: `${C.teal}22`, color: C.teal, padding: '0.1rem 0.4rem', borderRadius: 3, fontWeight: 700 }}>
                      REVISED
                    </span>
                  )}
                  {revisionCount > 0 && (
                    <span style={{ fontSize: '0.55rem', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', padding: '0.1rem 0.4rem', borderRadius: 3 }}>
                      v{revisionCount + 1}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => setExpanded(isExp ? null : item.id as string)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.35rem 0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', cursor: 'pointer' }}>
                  {isExp ? 'Hide' : 'Preview'}
                </button>
                <button onClick={() => openRevision(item)} disabled={isActing}
                  style={{ background: 'rgba(245,158,11,0.12)', border: `1px solid rgba(245,158,11,0.25)`, borderRadius: 4, padding: '0.35rem 0.75rem', color: C.amber, fontSize: '0.62rem', fontWeight: 600, cursor: 'pointer' }}>
                  Revise
                </button>
                {canEdit && (
                  <button onClick={() => openEdit(item)} disabled={isActing}
                    style={{ background: 'rgba(0,181,165,0.12)', border: `1px solid rgba(0,181,165,0.25)`, borderRadius: 4, padding: '0.35rem 0.75rem', color: C.teal, fontSize: '0.62rem', fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                )}
                <button onClick={() => doAction(item.id as string, 'skip')} disabled={isActing}
                  style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.35rem 0.75rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', cursor: 'pointer' }}>
                  Skip
                </button>
                <button onClick={() => doAction(item.id as string, 'approve')} disabled={isActing}
                  style={{ background: C.green, border: 'none', borderRadius: 4, padding: '0.35rem 1rem', color: 'white', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', opacity: isActing ? 0.5 : 1 }}>
                  {isActing ? '...' : '✓ Approve'}
                </button>
              </div>
            </div>

            {/* Expanded preview */}
            {isExp && (
              <div style={{ borderTop: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.2)', maxHeight: item.type === 'blog-post' ? '70vh' : '50vh', overflowY: 'auto' }}>
                <pre style={{ margin: 0, padding: '1rem 1.25rem', fontSize: '0.78rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {content}
                </pre>
              </div>
            )}
          </div>
        )
      })}

      {/* Edit / Revision modal */}
      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div style={{ background: '#111827', border: `1px solid ${C.border}`, borderRadius: 12, width: '100%', maxWidth: 860, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: '1.4rem' }}>{modal.item.type === 'blog-post' ? '📝' : '✏️'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>
                  {modal.mode === 'edit' ? 'Edit content' : 'Send back for revision'}
                </p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                  {modal.mode === 'edit'
                    ? `Editing "${(modal.item.title || (modal.item.content as string || '').slice(0, 40))}"`
                    : 'Leave feedback for the team — they will fix and resubmit'}
                </p>
              </div>
              <button onClick={() => { setModal(null); setEditContent(''); setFeedback('') }}
                style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.4rem 0.8rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>

            {/* Edit mode */}
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
                    fontSize: '0.8rem',
                    lineHeight: 1.75,
                    padding: '1.25rem 1.5rem',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'ui-monospace, Menlo, monospace',
                    minHeight: 400,
                  }}
                />
                {/* Edit toolbar */}
                <div style={{ display: 'flex', gap: '0.75rem', padding: '0.875rem 1.5rem', borderTop: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setModal(null); setEditContent('') }}
                    style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.5rem 1.25rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Discard
                  </button>
                  <button onClick={() => { setSaving(true); doAction(modal.item.id as string, 'edit', { editedContent: editContent }) }}
                    disabled={saving || editContent === (modal.item.content as string)}
                    style={{ background: C.teal, border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', color: 'white', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', opacity: (saving || editContent === (modal.item.content as string)) ? 0.5 : 1 }}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  <button onClick={() => { setSaving(true); doAction(modal.item.id as string, 'approve', { editedContent: editContent }) }}
                    disabled={saving}
                    style={{ background: C.green, border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', color: 'white', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                    {saving ? '...' : 'Save & Approve'}
                  </button>
                </div>
              </div>
            )}

            {/* Revision mode */}
            {modal.mode === 'revision' && (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Original content preview */}
                <div>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>Original content</p>
                  <div style={{ background: '#0a0f1a', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.875rem 1rem', maxHeight: 160, overflowY: 'auto' }}>
                    <pre style={{ margin: 0, fontSize: '0.72rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {((modal.item.content as string) || '').slice(0, 600)}{((modal.item.content as string) || '').length > 600 ? '…' : ''}
                    </pre>
                  </div>
                </div>

                {/* Feedback input */}
                <div>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>
                    What needs to change?
                  </p>
                  <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="E.g. Introduction is too generic — needs more Newcastle-specific context. Also the CTA at the end doesn't match our brand voice."
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

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setModal(null); setFeedback('') }}
                    style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.5rem 1.25rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={() => { setSaving(true); doAction(modal.item.id as string, 'revision', { feedback }) }}
                    disabled={saving || !feedback.trim()}
                    style={{ background: C.amber, border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', color: 'white', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', opacity: (saving || !feedback.trim()) ? 0.5 : 1 }}>
                    {saving ? 'Sending...' : 'Send back to team'}
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