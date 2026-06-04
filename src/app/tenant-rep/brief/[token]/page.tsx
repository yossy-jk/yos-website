/**
 * /tenant-rep/brief/[token] — Client-facing brief viewer
 * 
 * Clean, professional. Shows client their brief and pipeline.
 * No YOS branding — branded as "Your Office Space Advisory"
 * Password protected if token requires it.
 */

'use client'

import { useEffect, useState } from 'react'

interface BriefData {
  client_id: string
  brief: string
  pipeline: string
  expires_at: string
  password_protected: boolean
  requires_password?: boolean
}

export default function ClientBriefPage({ params }: { params: Promise<{ token: string }> }) {
  const [data, setData] = useState<BriefData | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
    params.then(p => setToken(p.token))
  }, [params])

  useEffect(() => {
    if (!token) return
    loadBrief(token, null)
  }, [token])

  async function loadBrief(t: string, pw: string | null) {
    setLoading(true)
    setError('')
    const url = pw ? `/api/tenant-rep/brief/${t}?password=${encodeURIComponent(pw)}` : `/api/tenant-rep/brief/${t}`
    try {
      const res = await fetch(url)
      if (res.status === 401) {
        setData({ requires_password: true } as BriefData)
        setLoading(false)
        return
      }
      if (!res.ok) {
        const body = await res.json()
        setError(body.error || 'Link not available')
        setLoading(false)
        return
      }
      const json = await res.json()
      setData(json as BriefData)
    } catch {
      setError('Could not load your brief. Please try again.')
    }
    setLoading(false)
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    loadBrief(token, password)
  }

  // Password gate
  if (data && (data as BriefData).requires_password) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">Client Brief</h1>
          <p className="text-gray-500 text-center text-sm mb-6">This brief is password protected.</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 transition"
            >
              View Brief
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading brief...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4 text-gray-300">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{error}</h2>
          <p className="text-gray-400">Contact your advisor for a new link.</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Parse brief into sections
  const lines = data.brief.split('\n')
  let currentSection = ''
  const sections: { [key: string]: string[] } = {}
  const bodyLines: string[] = []

  lines.forEach(line => {
    const h2 = line.match(/^## (.+)/)
    const h3 = line.match(/^### (.+)/)
    if (h2) { currentSection = h2[1]; sections[currentSection] = [] }
    else if (h3) { currentSection = h3[1]; sections[currentSection] = [] }
    else if (currentSection) sections[currentSection].push(line)
    else bodyLines.push(line)
  })

  // Parse pipeline board
  const pipelineLines = data.pipeline.split('\n')
  const stageBlocks: { [key: string]: string[] } = {}
  let currentStage = ''
  pipelineLines.forEach(line => {
    const stageMatch = line.match(/^### (Evaluation|Shortlisted|Inspection|Negotiations|Disqualified)/)
    if (stageMatch) { currentStage = stageMatch[1]; stageBlocks[currentStage] = [] }
    else if (currentStage) stageBlocks[currentStage].push(line)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Your Office Space</p>
              <h1 className="text-2xl font-bold text-gray-900">Property Search Brief</h1>
              <p className="text-sm text-gray-500 mt-1">
                Link valid until {new Date(data.expires_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active Search
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Pipeline Board */}
        {Object.keys(stageBlocks).length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {['Evaluation', 'Shortlisted', 'Inspection', 'Negotiations', 'Disqualified'].map(stage => {
                const stageColors: { [k: string]: string } = {
                  'Evaluation': 'bg-yellow-50 border-yellow-200',
                  'Shortlisted': 'bg-blue-50 border-blue-200',
                  'Inspection': 'bg-orange-50 border-orange-200',
                  'Negotiations': 'bg-green-50 border-green-200',
                  'Disqualified': 'bg-gray-100 border-gray-200',
                }
                const dotColors: { [k: string]: string } = {
                  'Evaluation': 'bg-yellow-400',
                  'Shortlisted': 'bg-blue-400',
                  'Inspection': 'bg-orange-400',
                  'Negotiations': 'bg-green-400',
                  'Disqualified': 'bg-gray-400',
                }
                return (
                  <div key={stage} className={`rounded-lg border p-4 ${stageColors[stage]}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`w-2 h-2 rounded-full ${dotColors[stage]}`}></span>
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stage}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {stageBlocks[stage] && stageBlocks[stage].length > 0
                        ? stageBlocks[stage].join('\n')
                        : <span className="text-gray-400 italic">No properties</span>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Brief Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Your Search Brief</h2>
          </div>
          <div className="px-8 py-6 space-y-6">
            {/* Extract key fields from brief */}
            {(() => {
              const briefText = data.brief
              const blocks: React.ReactNode[] = []
              let section = ''
              let content: string[] = []
              let key = 0

              briefText.split('\n').forEach(line => {
                const h2 = line.match(/^## (.+)/)
                if (h2) {
                  if (section && content.length) {
                    blocks.push(<BriefSection key={key++} title={section} lines={content} />)
                  }
                  section = h2[1]
                  content = []
                } else {
                  content.push(line)
                }
              })
              if (section && content.length) {
                blocks.push(<BriefSection key={key++} title={section} lines={content} />)
              }

              return blocks.length > 0 ? blocks : (
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">{briefText}</pre>
              )
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Managed by Your Office Space — Newcastle</p>
          <p className="mt-1">Questions? Contact your advisor directly.</p>
        </div>
      </div>
    </div>
  )
}

function BriefSection({ title, lines }: { title: string; lines: string[] }) {
  const clean = lines.filter(l => l.trim()).join('\n')
  if (!clean) return null

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">{title}</h3>
      <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{clean}</div>
    </div>
  )
}