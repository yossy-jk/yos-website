import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const KEY = process.env.MATON_API_KEY || ''
const TENANT = process.env.XERO_TENANT_ID || 'e916ee6b-ca12-4abd-ad84-c8fa0b1c476b'
const H = { 'Authorization': `Bearer ${KEY}`, 'Accept': 'application/json', 'Xero-Tenant-Id': TENANT }
const BASE = 'https://gateway.maton.ai/xero/api.xro/2.0'

async function xero(path: string) {
  const r = await fetch(`${BASE}/${path}`, { headers: H })
  if (!r.ok) throw new Error(`xero ${r.status} on ${path}`)
  return r.json()
}

function median(ns: number[]) { const s=[...ns].sort((a,b)=>a-b); return s[Math.floor(s.length/2)] }

export async function GET(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  try {
    const today = new Date(); const horizon = new Date(today.getTime() + 60*86400000)
    type Bill = { payee: string; amount: number; due: string; source: string; status: string }
    const bills: Bill[] = []

    // 1. Entered bills awaiting payment
    const inv = await xero('Invoices?where=Type%3D%3D%22ACCPAY%22%20AND%20Status%3D%3D%22AUTHORISED%22&order=DueDate')
    for (const i of (inv.Invoices || [])) {
      bills.push({ payee: i.Contact?.Name || '?', amount: i.AmountDue || 0,
        due: (i.DueDateString || '').slice(0,10), source: 'bill', status: 'awaiting payment' })
    }

    // 2. Scheduled repeating bills
    const rep = await xero('RepeatingInvoices')
    for (const x of (rep.RepeatingInvoices || [])) {
      if (x.Type !== 'ACCPAY') continue
      bills.push({ payee: x.Contact?.Name || '?', amount: x.Total || 0,
        due: (x.Schedule?.NextScheduledDateString || '').slice(0,10),
        source: 'scheduled', status: `repeats every ${x.Schedule?.Period || '?'} ${(x.Schedule?.Unit||'').toLowerCase()}` })
    }

    // 3. Predicted direct debits from SPEND recurrence
    const txs: any[] = []
    for (const pg of [1,2,3]) {
      const bt = await xero(`BankTransactions?where=Type%3D%3D%22SPEND%22&order=Date%20DESC&page=${pg}`)
      txs.push(...(bt.BankTransactions || []))
      if ((bt.BankTransactions || []).length < 100) break
    }
    const groups = new Map<string, {dates: number[]; amounts: number[]}>()
    for (const t of txs) {
      const name = (t.Contact?.Name || '').trim(); if (!name) continue
      const d = Date.parse((t.DateString || '').slice(0,10)); if (!d) continue
      const g = groups.get(name.toLowerCase()) || { dates: [], amounts: [] }
      g.dates.push(d); g.amounts.push(t.Total || 0)
      groups.set(name.toLowerCase(), g)
    }
    const enteredPayees = new Set(bills.map(b => b.payee.toLowerCase()))
    for (const [name, g] of groups) {
      if (g.dates.length < 2 || enteredPayees.has(name)) continue
      const amps = g.amounts; const med = median(amps)
      if (med <= 0 || amps.some(a => Math.abs(a - med) > med * 0.25)) continue
      const ds = [...g.dates].sort((a,b)=>a-b)
      const gaps = ds.slice(1).map((d,i)=>(d-ds[i])/86400000)
      const iv = median(gaps)
      if (iv < 6 || iv > 70) continue
      const next = new Date(ds[ds.length-1] + iv*86400000)
      if (next > horizon || next < new Date(today.getTime() - 7*86400000)) continue
      const disp = txs.find(t => (t.Contact?.Name||'').toLowerCase() === name)?.Contact?.Name || name
      bills.push({ payee: disp, amount: Math.round(med), due: next.toISOString().slice(0,10),
        source: 'predicted-dd', status: `direct debit ~every ${Math.round(iv)}d (${g.dates.length}x observed)` })
    }

    bills.sort((a,b) => (a.due || '9999').localeCompare(b.due || '9999'))
    const in7 = bills.filter(b => b.due && Date.parse(b.due) <= today.getTime()+7*86400000)
    const in30 = bills.filter(b => b.due && Date.parse(b.due) <= today.getTime()+30*86400000)
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      bills,
      totals: { next7: Math.round(in7.reduce((s,b)=>s+b.amount,0)), next7Count: in7.length,
                next30: Math.round(in30.reduce((s,b)=>s+b.amount,0)), next30Count: in30.length },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}
