'use client'
import { useMemo, useState } from 'react'
export type Rk = { q: string; page: string; clicks: number; imp: number; pos: number; ctr?: number; prev?: number | null; delta?: number | null }
type SK = 'pos' | 'clicks' | 'imp' | 'ctr' | 'delta'
const B: Array<[string, string]> = [['all', 'All'], ['t10', 'Top 10'], ['mid', '11-20'], ['far', '21-50'], ['no', 'Not ranking'], ['mv', 'Movers']]
export default function RankingsPanel({ rankings, baseline }: { rankings: Rk[]; baseline?: string | null }) {
  const [q, sQ] = useState(''); const [k, sK] = useState<SK>('pos'); const [d, sD] = useState<'a' | 'z'>('a'); const [b, sB] = useState('all')
  const rows = useMemo(() => {
    let r = rankings.slice(); const s = q.trim().toLowerCase()
    if (s) r = r.filter(x => x.q.toLowerCase().includes(s) || (x.page || '').toLowerCase().includes(s))
    if (b === 't10') r = r.filter(x => x.pos <= 10)
    else if (b === 'mid') r = r.filter(x => x.pos > 10 && x.pos <= 20)
    else if (b === 'far') r = r.filter(x => x.pos > 20 && x.pos <= 50)
    else if (b === 'no') r = r.filter(x => x.pos > 50)
    else if (b === 'mv') r = r.filter(x => typeof x.delta === 'number' && Math.abs(x.delta) >= 1)
    const v = (x: Rk): number => k === 'pos' ? x.pos : k === 'clicks' ? x.clicks : k === 'imp' ? x.imp : k === 'ctr' ? (x.ctr ?? 0) : (typeof x.delta === 'number' ? x.delta : -9999)
    r.sort((m, n) => d === 'a' ? v(m) - v(n) : v(n) - v(m)); return r
  }, [rankings, q, k, d, b])
  const T = useMemo(() => {
    const c = rows.reduce((a, x) => a + (x.clicks || 0), 0), i = rows.reduce((a, x) => a + (x.imp || 0), 0)
    return { c, i, avg: rows.length ? rows.reduce((a, x) => a + x.pos, 0) / rows.length : 0, up: rows.filter(x => (x.delta ?? 0) > 0).length, dn: rows.filter(x => (x.delta ?? 0) < 0).length }
  }, [rows])
  const tg = (n: SK) => { if (k === n) sD(d === 'a' ? 'z' : 'a'); else { sK(n); sD(n === 'pos' ? 'a' : 'z') } }
  const ar = (n: SK) => k === n ? (d === 'a' ? ' \u2191' : ' \u2193') : ''
  const th: React.CSSProperties = { cursor: 'pointer', userSelect: 'none', fontSize: 11, textTransform: 'uppercase', opacity: .6, padding: '6px 8px', textAlign: 'right', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '7px 8px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }
  const dc = (x?: number | null) => {
    if (typeof x !== 'number') return <span style={{ opacity: .35 }}>new</span>
    if (Math.abs(x) < 0.1) return <span style={{ opacity: .45 }}>0</span>
    return <span style={{ color: x > 0 ? '#12a150' : '#e5484d', fontWeight: 600 }}>{x > 0 ? '\u25B2' : '\u25BC'} {Math.abs(x).toFixed(1)}</span>
  }
  return (
    <section className="panel" style={{ marginBottom: 16 }}>
      <div className="panel-head"><h2>Current rankings</h2><span className="panel-count">{rows.length}</span></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
        <input value={q} onChange={e => sQ(e.target.value)} placeholder="Search keyword or page..." style={{ flex: '1 1 170px', minWidth: 140, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(128,128,128,.28)', background: 'transparent', color: 'inherit', fontSize: 13 }} />
        {B.map(([key, lb]) => (
          <button key={key} onClick={() => sB(key)} style={{ padding: '5px 10px', borderRadius: 999, fontSize: 12, cursor: 'pointer', border: '1px solid ' + (b === key ? 'transparent' : 'rgba(128,128,128,.28)'), background: b === key ? '#00B5A5' : 'transparent', color: b === key ? '#fff' : 'inherit' }}>{lb}</button>
        ))}
      </div>
      {baseline && <div style={{ fontSize: 11, opacity: .55, marginBottom: 6 }}>Change measured against {baseline}</div>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ borderBottom: '1px solid rgba(128,128,128,.2)' }}>
            <th style={{ ...th, textAlign: 'left' }}>Keyword</th>
            <th style={th} onClick={() => tg('pos')}>Pos{ar('pos')}</th>
            <th style={th} onClick={() => tg('delta')}>Change{ar('delta')}</th>
            <th style={th} onClick={() => tg('clicks')}>Clicks{ar('clicks')}</th>
            <th style={th} onClick={() => tg('imp')}>Imp{ar('imp')}</th>
            <th style={th} onClick={() => tg('ctr')}>CTR{ar('ctr')}</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(128,128,128,.09)' }}>
                <td style={{ padding: '7px 8px' }}><div style={{ fontWeight: 500 }}>{r.q}</div><div style={{ fontSize: 11, opacity: .5 }}>{r.page || '/'}</div></td>
                <td style={td}><span className={'pill ' + (r.pos <= 10 ? 'pill-green' : r.pos <= 20 ? 'pill-blue' : 'pill-red')}>#{r.pos}</span></td>
                <td style={td}>{dc(r.delta)}</td><td style={td}>{r.clicks}</td><td style={td}>{r.imp}</td>
                <td style={td}>{typeof r.ctr === 'number' ? r.ctr.toFixed(1) + '%' : '-'}</td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && <tfoot><tr style={{ borderTop: '2px solid rgba(128,128,128,.25)', fontWeight: 600 }}>
            <td style={{ padding: 8 }}>{rows.length} keywords <span style={{ fontWeight: 400, opacity: .55, fontSize: 11 }}>{'\u25B2'}{T.up} {'\u25BC'}{T.dn}</span></td>
            <td style={td}>{T.avg.toFixed(1)}</td><td style={td}></td><td style={td}>{T.c}</td><td style={td}>{T.i}</td>
            <td style={td}>{T.i ? ((T.c / T.i) * 100).toFixed(1) + '%' : '-'}</td>
          </tr></tfoot>}
        </table>
      </div>
      {!rows.length && <div className="empty">{rankings.length ? 'No keywords match this filter.' : 'No ranking data yet.'}</div>}
    </section>
  )
}
