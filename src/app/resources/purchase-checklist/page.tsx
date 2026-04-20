'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import { HUBSPOT } from '@/lib/constants'

const SECTIONS = [
  {
    title: 'Title & Ownership',
    items: [
      'Obtain a copy of the title search — confirm ownership, encumbrances and caveats',
      'Check for easements, covenants or restrictions on the title',
      'Confirm no mortgages or charges will remain at settlement',
      'Verify the vendor has authority to sell (trustee, company director, executor)',
      'Search for any outstanding land tax or council rates arrears'
    ]
  },
  {
    title: 'Zoning & Permitted Use',
    items: [
      'Confirm the property is zoned for your intended use (LEP zoning check)',
      'Review any DCP overlays or heritage listings that affect development',
      'Check if existing use rights apply and what conditions are attached',
      'Confirm there are no orders or notices issued by council against the property',
      'Verify the current DA/CC approvals cover the existing use and any planned changes'
    ]
  },
  {
    title: 'Building & Structure',
    items: [
      'Commission an independent building and pest inspection',
      'Obtain a copy of the current building certificate or occupation certificate',
      'Check for any unapproved structures or additions',
      'Review council DA history — identify any outstanding compliance matters',
      'Inspect roof, structure, cladding and façade for visible defects'
    ]
  },
  {
    title: 'Tenancy & Leases',
    items: [
      'Obtain copies of all current leases and review terms, options and rent reviews',
      'Confirm rental income and verify against lease agreements',
      'Check for any rent arrears, lease breaches or pending disputes',
      'Review lease expiry dates and assess vacancy risk',
      'Confirm make-good and reinstatement obligations for each tenant'
    ]
  },
  {
    title: 'Services & Environmental',
    items: [
      'Commission a Phase 1 environmental assessment if there is contamination risk',
      'Confirm connection to town water, sewer, electricity and gas (where applicable)',
      'Check for any flooding, bushfire or hazard overlays on the title',
      'Review stormwater connections and any drainage obligations',
      'Confirm asbestos register exists and is current (required for commercial buildings)'
    ]
  }
] as const

export default function PurchaseChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(key: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const total = SECTIONS.reduce((sum, s) => sum + s.items.length, 0)
  const done = checked.size
  const pct = Math.round((done / total) * 100)

  return (
    <>
      <Nav />

      <section className="bg-near-black ">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(4rem,10vw,9rem)', paddingBottom: 'clamp(3rem,7vw,7rem)' }}>
          <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">Free tool</p>
          <h1 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-4">Commercial Purchase Checklist</h1>
          <p className="text-white/60 font-light text-lg leading-relaxed">
            25 due diligence checks for commercial property buyers in NSW. Tick each off as you complete it.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>

          {/* Progress */}
          <div className="mb-10 bg-warm-grey rounded-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-near-black font-semibold text-sm">{done} of {total} checks completed</p>
              <p className="text-teal font-bold text-lg">{pct}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal h-2 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            {done === total && (
              <p className="text-teal font-semibold text-sm mt-3">All checks complete — you&apos;re ready to proceed with confidence.</p>
            )}
          </div>

          {/* Checklist */}
          <div className="space-y-10">
            {SECTIONS.map((section) => {
              const sectionDone = section.items.filter((_, i) => checked.has(`${section.title}-${i}`)).length
              return (
                <div key={section.title}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-near-black font-bold text-xl">{section.title}</h2>
                    <span className="text-mid-grey font-light text-sm">{sectionDone}/{section.items.length}</span>
                  </div>
                  <div className="space-y-3">
                    {section.items.map((item, i) => {
                      const key = `${section.title}-${i}`
                      const isChecked = checked.has(key)
                      return (
                        <button
                          key={key}
                          onClick={() => toggle(key)}
                          className={`w-full text-left flex gap-4 items-start p-4 rounded-sm border transition-all duration-200 ${
                            isChecked
                              ? 'bg-light-teal border-teal'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center transition-all ${
                            isChecked ? 'bg-teal border-teal' : 'border-gray-300'
                          }`}>
                            {isChecked && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${isChecked ? 'text-teal font-normal line-through' : 'text-charcoal font-light'}`}>
                            {item}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 bg-near-black rounded-sm p-8">
            <p className="text-white font-semibold text-base mb-3">This checklist covers the essentials — but every commercial deal is different.</p>
            <p className="text-white/60 font-light text-sm leading-relaxed mb-6">
              Additional due diligence may be required depending on property type, use, age, and location. Always engage a commercial solicitor and a qualified buyers agent before exchanging contracts.
            </p>
            <Button href={HUBSPOT.bookingUrl} variant="primary" external>Talk to a buyers agent</Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
