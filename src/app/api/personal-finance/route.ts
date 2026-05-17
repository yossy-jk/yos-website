/**
 * GET /api/personal-finance
 * Personal finance data derived from Joe & Sarah's bank statements (May 2025–May 2026)
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    cash: 668,
    cashNegative: false,
    emergencyFund: 0,
    emergencyFundTarget: 20000,
    healthScore: 4,
    homeLoanBalance: 815766,
    homeLoanRate: 6.15,
    homeLoanMonthlyInterest: 4180,
    homeLoanAnnualInterest: 50170,
    homeLoanPayments12m: 46900,
    owedToYOS: 0,
    burnRate: '$4,400/mo',
    burnRateRaw: 4400,
    amex: { transactions: [] },
    monthlyIncome: 3977,
    monthlySurplus: 0,
    savingsRate: 0,
    priorityActions: [
      { id: 1, label: 'Build emergency fund', detail: '$20K in NAB offset — automate $500/week', priority: 'critical' },
      { id: 2, label: 'Fix home loan rate', detail: 'Call NAB today. Target sub-6%. Every 0.75% saved = ~$6,100/year', priority: 'critical' },
      { id: 3, label: 'Stop AMEX interest', detail: 'Set AutoPay to pay full balance each month — saves $1,056/year in interest', priority: 'high' },
      { id: 4, label: 'Clarify St George loan', detail: 'Get full statement. Understand facility, balance, and interest rate', priority: 'high' },
      { id: 5, label: 'Automate savings', detail: '$500/week into NAB offset from next YOS income payment', priority: 'medium' },
    ],
    monthlyBreakdown: {
      groceries: 613,
      health: 459,
      insurance: 372,
      kids: 200,
      diningOut: 174,
      fuel: 59,
      subscriptions: 23,
      gambling: 13,
      other: 2674,
    },
    ytdIncome: 51400,
    ytdSpending: 49000,
  })
}