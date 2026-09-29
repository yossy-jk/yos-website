'use client'

import { useState } from 'react'

const slices = [
  { label: 'Property', risk: 'A space that does not fit the brief creates cost before design begins.', protection: 'We test the property decision against the workplace brief and total project budget.' },
  { label: 'Fit out', risk: 'Unclear scope and late decisions quickly consume contingency.', protection: 'We keep scope, allowances, decisions and programme visible from the start.' },
  { label: 'Furniture', risk: 'Product, access and installation gaps often appear too late.', protection: 'We coordinate specification, pricing, delivery and placement as one workstream.' },
  { label: 'Consultants', risk: 'Disconnected advice can create redesign, delay and duplicated cost.', protection: 'We connect the specialist team around one approved brief and decision register.' },
  { label: 'Programme', risk: 'Delay, changes and unclear ownership put pressure on every other budget line.', protection: 'We track decisions, dependencies and responsibilities through to handover.' },
  { label: 'Contingency', risk: 'Contingency disappears when assumptions stay hidden.', protection: 'We expose assumptions early so contingency remains protection, not a default funding source.' },
] as const

export default function BudgetExplorer() {
  const [active, setActive] = useState(0)
  const item = slices[active]

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="mx-auto grid aspect-square w-full max-w-md grid-cols-2 overflow-hidden rounded-full border-8 border-white bg-white shadow-sm" aria-label="Project budget areas">
        {slices.map((slice, index) => (
          <button
            key={slice.label}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            className={`min-h-0 min-w-0 justify-center border border-white p-4 text-center text-sm font-bold transition duration-200 focus-visible:z-10 sm:text-base ${active === index ? 'bg-near-black text-white' : 'bg-action-teal text-white hover:bg-dark-teal'}`}
          >
            {slice.label}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-dark-teal">Selected budget area</p>
        <h3 className="mt-3 text-3xl font-bold text-near-black sm:text-4xl">{item.label}</h3>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="font-bold text-near-black">What can go wrong</p>
            <p className="mt-3 leading-relaxed text-charcoal">{item.risk}</p>
          </div>
          <div className="rounded-2xl border border-action-teal/30 bg-white p-6">
            <p className="font-bold text-near-black">How YOS protects it</p>
            <p className="mt-3 leading-relaxed text-charcoal">{item.protection}</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-charcoal">Choose a budget area to see the risk and the control.</p>
      </div>
    </div>
  )
}
