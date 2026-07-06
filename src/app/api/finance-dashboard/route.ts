/**
 * GET /api/finance-dashboard — Business finance data (YOS/EOF)
 * Xero AR, cashflow projections, outstanding invoices
 */
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const MATON_KEY = process.env.MATON_API_KEY || ''
const XERO_CONN = process.env.XERO_CONNECTION_ID || '5082bc91-b9dd-4cf1-9ca0-95d8e3dd251c'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const headers = {
    'Authorization': `Bearer ${MATON_KEY}`,
    'Content-Type': 'application/json',
  }

  let outstanding = 0
  let overdue = 0
  let overdueCount = 0
  let outstandingCount = 0
  let owedToYOS = 0
  let xeroError = ''

  // Pull Xero bank transactions for cash position
  let cashBalance = 0
  let arTotal = 0

  try {
    // Xero bank summary — everyday account
    const bankRes = await fetch(
      `https://gateway.maton.ai/xero/connections/${XERO_CONN}/xero/api.xro/2.0/BankTransactions?where=Type=="ACCPAYCC"&page=1`,
      { headers, cache: 'no-store' }
    )
    // Cash position from Xero bank summary
    const cashRes = await fetch(
      `https://gateway.maton.ai/xero/connections/${XERO_CONN}/xero/api.xro/2.0/Accounts?where=Type=="BANQ"`,
      { headers, cache: 'no-store' }
    )
    if (cashRes.ok) {
      const cashData = await cashRes.json()
      const accounts = cashData.Accounts || []
      const everyday = accounts.find((a: { Code: string; Name: string }) =>
        a.Name?.toLowerCase().includes('everyday') || a.Code === '090'
      )
      if (everyday) cashBalance = parseFloat(everyday.Balance || '0')
    }
  } catch (e) {
    // fallback silent
  }

  // Pull unpaid invoices
  try {
    const invRes = await fetch(
      `https://gateway.maton.ai/xero/connections/${XERO_CONN}/xero/api.xro/2.0/Invoices?status= AUTHORISED&page=1`,
      { headers, cache: 'no-store' }
    )
    if (invRes.ok) {
      const invData = await invRes.json()
      const invoices = invData.Invoices || []
      invoices.forEach((inv: {
        Total: number; AmountDue: number; DueDate: string; Status: string
        InvoiceNumber: string; Contact: { Name: string }
      }) => {
        const due = inv.DueDate ? new Date(inv.DueDate) : null
        const now = new Date()
        owedToYOS += inv.AmountDue ?? 0
        outstanding += inv.Total ?? 0
        outstandingCount++
        if (due && due < now && inv.Status !== 'PAID') {
          overdue += inv.AmountDue ?? 0
          overdueCount++
        }
      })
    }
  } catch (e) {
    xeroError = 'Could not reach Xero'
  }

  // Cashflow projections — 30/60/90 day forward-looking
  // Based on YOS monthly burn ~$8-10K and known AR
  const incoming30Days = owedToYOS // AR is the main incoming
  const outgoing30Days = 8000      // conservative monthly burn
  const outgoing60Days = outgoing30Days * 2
  const outgoing90Days = outgoing30Days * 3
  const projectedLow30 = cashBalance + incoming30Days - outgoing30Days
  const projectedLow60 = cashBalance + (incoming30Days * 2) - outgoing60Days
  const projectedLow90 = Math.max(0, cashBalance + (incoming30Days * 3) - outgoing90Days)
  const projectedLowDate  = new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  const projectedLowDate60 = new Date(Date.now() + 60 * 86400000).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  const projectedLowDate90 = new Date(Date.now() + 90 * 86400000).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    owedToYOS,
    cashBalance,
    xero: { outstanding, overdue, overdueCount, outstandingCount },
    cashflow: {
      arTotal,
      incoming30Days,
      outgoing30Days,
      incoming60Days: incoming30Days,
      outgoing60Days,
      incoming90Days: incoming30Days,
      outgoing90Days,
      projectedLow: Math.max(0, projectedLow30),
      projectedLow60: Math.max(0, projectedLow60),
      projectedLow90: Math.max(0, projectedLow90),
      projectedLowDate,
      projectedLowDate60,
      projectedLowDate90,
      days30: 30,
      days60: 60,
      days90: 90,
    },
    xeroError: xeroError || undefined,
  })
}