'use client'
import { useState, useEffect, useCallback } from 'react'

interface TRClient { id: string; name: string; email: string; phone: string; brief_summary: string; created_at: string; updated_at: string }
interface TRProperty { id: string; client_id: string; address: string; suburb: string; size_sqm: number|null; asking_rent: number|null; stage: string; notes: string; disqualified_reason: string|null; created_at: string; updated_at: string }
interface Interaction { id: number; client_id: string; property_id: string|null; interaction_type: string; note: string; created_at: string }
type Stage = 'Evaluation'|'Shortlisted'|'Inspection'|'Negotiations'|'Disqualified'
const STAGES: Stage[] = ['Evaluation','Shortlisted','Inspection','Negotiations','Disqualified']
const SC: Record<Stage,{dot:string;lbl:string;sel:string}> = {
  Evaluation:   {dot:'#eab308',lbl:'rgba(234,179,8,0.85)',sel:'rgba(234,179,8,0.15)'},
  Shortlisted:  {dot:'#3b82f6',lbl:'rgba(59,130,246,0.85)',sel:'rgba(59,130,246,0.15)'},
  Inspection:   {dot:'#f97316',lbl:'rgba(249,115,22,0.85)',sel:'rgba(249,115,22,0.15)'},
  Negotiations: {dot:'#22c55e',lbl:'rgba(34,197,94,0.85)',sel:'rgba(34,197,94,0.15)'},
  Disqualified: {dot:'#71717a',lbl:'rgba(113,113,122,0.85)',sel:'rgba(113,113,122,0.15)'},
}
function daysAgo(iso: string) { const d=Math.floor((Date.now()-new Date(iso).getTime())/86400000); return d===0?'today':d===1?'1d ago':`${d}d ago` }
function fmtRent(n: number|null) { return n ? ` ${(n/1000).toFixed(0)}k/yr` : '' }
export default function TenantRepTab() {
  const [clients, setClients] = useState<TRClient[]>([])
  const [properties, setProperties] = useState<TRProperty[]>([])
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [selectedClient, setSelectedClient] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'board'|'clients'>('board')
  const [addingClient, setAddingClient] = useState(false)
  const [nc, setNc] = useState({name:'',email:'',phone:'',brief:''})
  const [addingProp, setAddingProp] = useState(false)
  const [pf, setPf] = useState({address:'',suburb:'',size_sqm:'',asking_rent:'',notes:''})
  const [selProp, setSelProp] = useState<string|null>(null)
  const [propNote, setPropNote] = useState('')
  const [showInt, setShowInt] = useState(false)
  const [intType, setIntType] = useState('Call')
  const [intNote, setIntNote] = useState('')
  const [copied, setCopied] = useState('')
  const [linkPw, setLinkPw] = useState('')
  const loadAll = useCallback(async () => {
    setLoading(true)
    try { const [c,p,i] = await Promise.all([fetch('/api/tenant-rep-pipeline').then(r=>r.json()),fetch('/api/tenant-rep-pipeline/properties').then(r=>r.json()),fetch('/api/tenant-rep-pipeline/interactions').then(r=>r.json())]); setClients(Array.isArray(c)?c:[]); setProperties(Array.isArray(p)?p:[]); setInteractions(Array.isArray(i)?i:[]) } catch {} setLoading(false)
  }, [])
  useEffect(()=>{loadAll()},[loadAll])
  const selClientObj = clients.find(c=>c.id===selectedClient)
  const selProps = selectedClient ? properties.filter(p=>p.client_id===selectedClient) : []
  const propInts = selProp ? interactions.filter(i=>i.property_id===selProp) : []
  async function addClient(e: React.FormEvent) { e.preventDefault(); const res = await fetch('/api/tenant-rep-pipeline',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify(nc)}); if(res.ok){ setNc({name:'',email:'',phone:'',brief:''}); setAddingClient(false); loadAll() }}
  async function addProperty(e: React.FormEvent) { e.preventDefault(); if(!selectedClient) return; const res = await fetch('/api/tenant-rep-pipeline/properties',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({client_id:selectedClient,address:pf.address,suburb:pf.suburb,size_sqm:pf.size_sqm?parseFloat(pf.size_sqm):null,asking_rent:pf.asking_rent?parseFloat(pf.asking_rent):null,notes:pf.notes})}); if(res.ok){ setPf({address:'',suburb:'',size_sqm:'',asking_rent:'',notes:''}); setAddingProp(false); loadAll() }}
  async function updateStage(propId: string, newStage: Stage) { await fetch(`/api/tenant-rep-pipeline/properties/${propId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body: JSON.stringify({stage:newStage})}); loadAll() }
  async function addNote() { if(!selProp||!propNote.trim()) return; await fetch(`/api/tenant-rep-pipeline/properties/${selProp}/notes`,{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({note:propNote})}); setPropNote(''); loadAll() }
  async function addInteraction(e: React.FormEvent) { e.preventDefault(); if(!selectedClient||!intNote.trim()) return; await fetch('/api/tenant-rep-pipeline/interactions',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({client_id:selectedClient,property_id:selProp,interaction_type:intType,note:intNote})}); setIntNote(''); setShowInt(false); loadAll() }
  async function generateLink() { if(!selectedClient) return; const res = await fetch('/api/tenant-rep/generate-link',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({client_id:selectedClient,password:linkPw||undefined})}); if(res.ok){ const d=await res.json(); navigator.clipboard.writeText(d.link).then(()=>setCopied(d.link)); setTimeout(()=>setCopied(''),3000) }}
  const stageProps = (cid:string,s:Stage) => properties.filter(p=>p.client_id===cid&&p.stage===s)
  const si = () => ({background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',fontSize:'0.6rem',padding:'0.3rem 0.7rem',cursor:'pointer',borderRadius:'3px',fontFamily:'inherit',letterSpacing:'0.05em',textTransform:'uppercase' as const})
  const fi = () => ({background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'4px',padding:'0.5rem',color:'white',fontSize:'0.78rem',fontFamily:'inherit',width:'100%'})
  return (
    <div style={{color:'white'}}>
      <div style={{display:'flex',gap:'0.75rem',marginBottom:'1.5rem',borderBottom:'1px solid rgba(255,255,255,0.1)',paddingBottom:'0',alignItems:'center'}}>
        <button onClick={()=>setTab('board')} style={{background:'transparent',border:'none',padding:'0.5rem 0.75rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:tab==='board'?'#00B5A5':'rgba(255,255,255,0.4)',borderBottom:tab==='board'?'2px solid #00B5A5':'2px solid transparent',marginBottom:'-1px'}}>Pipeline Board</button>
        <button onClick={()=>setTab('clients')} style={{background:'transparent',border:'none',padding:'0.5rem 0.75rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:tab==='clients'?'#00B5A5':'rgba(255,255,255,0.4)',borderBottom:tab==='clients'?'2px solid #00B5A5':'2px solid transparent',marginBottom:'-1px'}}>Clients</button>
        <div style={{flex:1}}/>
        <button onClick={()=>{setAddingClient(true);setTab('clients')}} style={{background:'#00B5A5',border:'none',padding:'0.45rem 1rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'white',borderRadius:'4px'}}>+ New Client</button>
      </div>
      {loading && <div style={{textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.4)',fontSize:'0.8rem'}}>Loading pipeline...</div>}
      {!loading && tab==='board' && (
        <div>
          {clients.length===0 ? (
            <div style={{textAlign:'center',padding:'3rem',color:'rgba(255,255,255,0.4)'}}>
              <p style={{fontSize:'0.9rem',marginBottom:'1rem'}}>No clients yet. Add your first client to get started.</p>
              <button onClick={()=>{setAddingClient(true);setTab('clients')}} style={{background:'#00B5A5',border:'none',padding:'0.6rem 1.5rem',cursor:'pointer',color:'white',fontFamily:'inherit',fontWeight:700,borderRadius:'4px',fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>+ Add Client</button>
            </div>
          ) : clients.map(client=>{
            const sp = (s:Stage)=>stageProps(client.id,s)
            return (
              <div key={client.id} style={{background:'rgba(255,255,255,0.04)',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.08)',padding:'1.25rem',marginBottom:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
                  <div>
                    <h3 style={{fontSize:'0.95rem',fontWeight:700,color:'white',marginBottom:'0.15rem'}}>{client.name}</h3>
                    <p style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.4)'}}>{client.email}{client.phone ? ` ${client.phone}` : ''}</p>
                    {client.brief_summary && <p style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.5)',marginTop:'0.3rem',fontStyle:'italic'}}>{client.brief_summary}</p>}
                  </div>
                  <div style={{display:'flex',gap:'0.5rem'}}>
                    <button onClick={()=>{setSelectedClient(client.id);setTab('clients')}} style={si()}>Manage</button>
                    <button onClick={()=>{setSelectedClient(client.id);setLinkPw('');generateLink()}} style={{background:'rgba(0,181,165,0.1)',border:'1px solid rgba(0,181,165,0.3)',color:'#00B5A5',fontSize:'0.6rem',padding:'0.3rem 0.7rem',cursor:'pointer',borderRadius:'3px',fontFamily:'inherit',letterSpacing:'0.05em',textTransform:'uppercase' as const}}>Share Link</button>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'0.75rem'}}>
                  {STAGES.map(stage=>{
                    const pp = sp(stage); const c = SC[stage]
                    return (
                      <div key={stage} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'6px',padding:'0.75rem',minHeight:'80px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.6rem'}}>
                          <span style={{width:'8px',height:'8px',borderRadius:'50%',background:c.dot,display:'inline-block',flexShrink:0}}></span>
                          <span style={{fontSize:'0.58rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:c.lbl}}>{stage}</span>
                          <span style={{marginLeft:'auto',fontSize:'0.62rem',fontWeight:700,color:'rgba(255,255,255,0.4)'}}>{pp.length}</span>
                        </div>
                        {pp.length===0 ? <p style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.2)',fontStyle:'italic',textAlign:'center',padding:'0.5rem 0'}}>Empty</p> : (
                          <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                            {pp.map(p=>(<div key={p.id} onClick={()=>{setSelectedClient(client.id);setSelProp(p.id);setTab('clients')}} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'4px',padding:'0.5rem',cursor:'pointer',fontSize:'0.68rem'}}><div style={{fontWeight:600,color:'white',lineHeight:1.3}}>{p.address.split(',')[0]}</div>{p.suburb&&<div style={{color:'rgba(255,255,255,0.45)',fontSize:'0.6rem'}}>{p.suburb}</div>}{(p.size_sqm||p.asking_rent)&&<div style={{color:'rgba(255,255,255,0.35)',fontSize:'0.58rem',marginTop:'0.15rem'}}>{p.size_sqm ? `${p.size_sqm}sqm` : ''}{fmtRent(p.asking_rent)}</div>}</div>))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {!loading && tab==='clients' && (
        <div style={{display:'grid',gridTemplateColumns:selectedClient?'280px 1fr':'1fr',gap:'1.5rem'}}>
          <div>
            <div style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:'0.75rem'}}>Clients ({clients.length})</div>
            {clients.map(c=>(<div key={c.id} onClick={()=>{setSelectedClient(c.id);setSelProp(null)}} style={{padding:'0.75rem',borderRadius:'6px',marginBottom:'0.4rem',cursor:'pointer',background:selectedClient===c.id?'rgba(0,181,165,0.15)':'rgba(255,255,255,0.04)',border:selectedClient===c.id?'1px solid rgba(0,181,165,0.4)':'1px solid transparent',transition:'all 0.15s'}}><div style={{fontWeight:600,fontSize:'0.8rem',color:'white'}}>{c.name}</div><div style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.4)',marginTop:'0.2rem'}}>{c.email}</div><div style={{fontSize:'0.58rem',color:'rgba(255,255,255,0.3)',marginTop:'0.3rem'}}>{STAGES.map(s=>{const n=properties.filter(p=>p.client_id===c.id&&p.stage===s).length;return n>0?`${s}: ${n}`:null}).filter(Boolean).join(' ')}</div></div>))}
            {addingClient&&(<form onSubmit={addClient} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'1rem',border:'1px solid rgba(0,181,165,0.3)',marginTop:'0.5rem'}}><div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#00B5A5',marginBottom:'0.75rem'}}>New Client</div><input value={nc.name} onChange={e=>setNc(n=>({...n,name:e.target.value}))} placeholder='Full name' required style={fi()}/><input value={nc.email} onChange={e=>setNc(n=>({...n,email:e.target.value}))} placeholder='Email' required type='email' style={{...fi(),marginTop:'0.5rem'}}/><input value={nc.phone} onChange={e=>setNc(n=>({...n,phone:e.target.value}))} placeholder='Phone' style={{...fi(),marginTop:'0.5rem'}}/><textarea value={nc.brief} onChange={e=>setNc(n=>({...n,brief:e.target.value}))} placeholder='Brief (e.g. 100-150sqm Maitland healthcare)' rows={3} style={{...fi(),marginTop:'0.5rem',resize:'vertical'}}/><div style={{display:'flex',gap:'0.5rem',marginTop:'0.75rem'}}><button type='submit' style={{flex:1,background:'#00B5A5',border:'none',padding:'0.5rem',cursor:'pointer',color:'white',fontFamily:'inherit',fontWeight:700,fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>Save</button><button type='button' onClick={()=>setAddingClient(false)} style={{flex:1,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',padding:'0.5rem',cursor:'pointer',color:'rgba(255,255,255,0.5)',fontFamily:'inherit',fontWeight:700,fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>Cancel</button></div></form>)}
          </div>
          {selectedClientObj&&(<div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
              <div>
                <h2 style={{fontSize:'1.1rem',fontWeight:700,color:'white',marginBottom:'0.25rem'}}>{selectedClientObj.name}</h2>
                <p style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.5)'}}>{selectedClientObj.email}{selectedClientObj.phone?` ${selectedClientObj.phone}`:''}</p>
                {selectedClientObj.brief_summary&&<p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.5)',marginTop:'0.3rem',fontStyle:'italic'}}>{selectedClientObj.brief_summary}</p>}
              </div>
              <div style={{display:'flex',gap:'0.4rem',alignItems:'center',flexWrap:'wrap'}}>
                <input value={linkPw} onChange={e=>setLinkPw(e.target.value)} placeholder='Password (opt)' style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'4px',padding:'0.35rem 0.6rem',color:'white',fontSize:'0.7rem',fontFamily:'inherit',width:'120px'}}/>
                <button onClick={generateLink} style={{background:copied?'#22c55e':'rgba(0,181,165,0.2)',border:'1px solid rgba(0,181,165,0.4)',color:copied?'white':'#00B5A5',padding:'0.35rem 0.8rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>{copied?'Copied!':'Share Link'}</button>
                <button onClick={()=>{setShowInt(true);setAddingProp(false)}} style={{background:'rgba(0,181,165,0.1)',border:'1px solid rgba(0,181,165,0.3)',color:'#00B5A5',padding:'0.35rem 0.8rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>+ Interaction</button>
                <button onClick={()=>setAddingProp(!addingProp)} style={{background:addingProp?'rgba(239,68,68,0.1)':'#00B5A5',border:addingProp?'1px solid rgba(239,68,68,0.3)':'none',color:addingProp?'#ef4444':'white',padding:'0.35rem 0.8rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>{addingProp?'Cancel':'+ Property'}</button>
              </div>
            </div>
            {addingProp&&(<form onSubmit={addProperty} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'1rem',marginBottom:'1rem',border:'1px solid rgba(255,255,255,0.1)'}}><div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)',marginBottom:'0.75rem'}}>Add Property</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginBottom:'0.5rem'}}><input value={pf.address} onChange={e=>setPf(p=>({...p,address:e.target.value}))} placeholder='Address' required style={fi()}/><input value={pf.suburb} onChange={e=>setPf(p=>({...p,suburb:e.target.value}))} placeholder='Suburb' style={fi()}/><input value={pf.size_sqm} onChange={e=>setPf(p=>({...p,size_sqm:e.target.value}))} placeholder='Size sqm' type='number' style={fi()}/><input value={pf.asking_rent} onChange={e=>setPf(p=>({...p,asking_rent:e.target.value}))} placeholder='Asking rent $/yr' type='number' style={fi()}/></div><textarea value={pf.notes} onChange={e=>setPf(p=>({...p,notes:e.target.value}))} placeholder='Initial notes...' rows={2} style={{...fi(),resize:'vertical',marginBottom:'0.5rem'}}/><div style={{display:'flex',gap:'0.5rem'}}><button type='submit' style={{background:'#00B5A5',border:'none',padding:'0.5rem 1.2rem',cursor:'pointer',color:'white',fontFamily:'inherit',fontWeight:700,fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>Add Property</button><button type='button' onClick={()=>setAddingProp(false)} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.1)',padding:'0.5rem 1rem',cursor:'pointer',color:'rgba(255,255,255,0.5)',fontFamily:'inherit',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>Cancel</button></div></form>)}
            {showInt&&(<form onSubmit={addInteraction} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'1rem',marginBottom:'1rem',border:'1px solid rgba(0,181,165,0.3)'}}><div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#00B5A5',marginBottom:'0.75rem'}}>Log Interaction</div><div style={{display:'flex',gap:'0.4rem',marginBottom:'0.5rem',flexWrap:'wrap'}}>{['Call','Email','Meeting','Inspection','Offer','Other'].map(t=>(<button key={t} type='button' onClick={()=>setIntType(t)} style={{background:intType===t?'rgba(0,181,165,0.3)':'rgba(255,255,255,0.05)',border:intType===t?'1px solid rgba(0,181,165,0.5)':'1px solid rgba(255,255,255,0.1)',color:intType===t?'#00B5A5':'rgba(255,255,255,0.5)',padding:'0.3rem 0.65rem',cursor:'pointer',fontFamily:'inherit',fontSize:'0.65rem',letterSpacing:'0.05em',textTransform:'uppercase',borderRadius:'4px'}}>{t}</button>))}</div><textarea value={intNote} onChange={e=>setIntNote(e.target.value)} placeholder='What happened...' rows={3} required style={{...fi(),resize:'vertical',marginBottom:'0.5rem'}}/><div style={{display:'flex',gap:'0.5rem'}}><button type='submit' style={{background:'#00B5A5',border:'none',padding:'0.5rem 1.2rem',cursor:'pointer',color:'white',fontFamily:'inherit',fontWeight:700,fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>Log</button><button type='button' onClick={()=>setShowInt(false)} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.1)',padding:'0.5rem 1rem',cursor:'pointer',color:'rgba(255,255,255,0.5)',fontFamily:'inherit',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>Cancel</button></div></form>)}
            {STAGES.map(stage=>{
              const sp = selProps.filter(p=>p.stage===stage); const c=SC[stage]
              return sp.length>0?(<div key={stage} style={{marginBottom:'1.25rem'}}><div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.6rem'}}><span style={{width:'10px',height:'10px',borderRadius:'50%',background:c.dot,display:'inline-block'}}></span><span style={{fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:c.lbl}}>{stage}</span><span style={{fontSize:'0.62rem',color:'rgba(255,255,255,0.3)'}}>({sp.length})</span></div><div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>{sp.map(p=>{const pin=selProp===p.id;return(<div key={p.id} onClick={()=>setSelProp(pin?null:p.id)} style={{background:pin?c.sel:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'6px',padding:'0.85rem',cursor:'pointer',transition:'all 0.15s'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div style={{flex:1}}><div style={{fontWeight:700,fontSize:'0.85rem',color:'white',marginBottom:'0.2rem'}}>{p.address}</div><div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.45)'}}>{p.suburb||'Suburb TBC'}{p.size_sqm?` ${p.size_sqm}sqm`:''}{fmtRent(p.asking_rent)}</div></div><select value={p.stage} onChange={e=>{e.stopPropagation();updateStage(p.id,e.target.value as Stage)}} onClick={e=>e.stopPropagation()} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'4px',padding:'0.3rem 0.5rem',color:c.lbl,fontSize:'0.62rem',fontFamily:'inherit',cursor:'pointer'}}>{STAGES.map(s=><option key={s} value={s} style={{background:'#1a1a1a',color:'white'}}>{s}</option>)}</select></div>{p.notes&&<div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.45)',marginTop:'0.5rem',fontStyle:'italic',borderLeft:'2px solid rgba(255,255,255,0.15)',paddingLeft:'0.5rem'}}>{p.notes.slice(-300)}</div>}{p.disqualified_reason&&<div style={{fontSize:'0.68rem',color:'rgba(239,68,68,0.8)',marginTop:'0.4rem',fontWeight:600}}>Disqualified: {p.disqualified_reason}</div>}<div style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.25)',marginTop:'0.4rem'}}>Updated {daysAgo(p.updated_at)}</div>{pin&&(<div style={{marginTop:'0.75rem',paddingTop:'0.75rem',borderTop:'1px solid rgba(255,255,255,0.08)'}}><div style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem'}}><input value={propNote} onChange={e=>setPropNote(e.target.value)} placeholder='Add a note...' style={{flex:1,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'4px',padding:'0.4rem 0.6rem',color:'white',fontSize:'0.75rem',fontFamily:'inherit'}}/><button onClick={addNote} style={{background:'#00B5A5',border:'none',padding:'0.4rem 0.8rem',cursor:'pointer',color:'white',fontFamily:'inherit',fontWeight:700,fontSize:'0.62rem',letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:'4px'}}>Add</button></div><div style={{marginTop:'0.5rem'}}>{propInts.slice(0,5).map(i=>(<div key={i.id} style={{fontSize:'0.68rem',color:'rgba(255,255,255,0.4)',padding:'0.3rem 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}><span style={{fontWeight:700,color:'rgba(255,255,255,0.6)'}}>[{i.interaction_type}]</span> {i.note}</div>))}</div></div>)}</div>)}</div>)}
            })}
          </div></div>)}
        </div>
      )}
    </div>
  )
}
