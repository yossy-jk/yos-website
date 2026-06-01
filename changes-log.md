# Website Audit & Button Fixes — Changes Log
Date: 2026-05-31

## Changes Made

### Button.tsx (core component)
- Tightened lg padding: `px-14` → `px-10`, `py-[1.25rem]` → `py-[1.1rem]`
- Fixed border-radius: `rounded-[4px]` (was `0.5rem` — too round)
- Added consistent tracking: `0.1em` (was inconsistent on some variants)
- Fixed min-height: `48px` (was 52px which was too tall)

### BookingCTA.tsx (core component)
- Tightened lg button padding: `1.25rem 3.5rem` → `1.1rem 3rem`
- Tightened default button padding: `1rem 2.5rem` → `0.9rem 2.25rem`
- Fixed min-height: `52px` → `48px`
- Fixed border-radius: `0.5rem` → `4px`

### page.tsx (homepage)
- Section label: replaced raw `<p>` with `<SectionLabel>` component
- Gap between buttons: `gap-3` → `gap-4`
- Fixed lease-review link: `/lease-review` → `/resources/lease-review`

### tenant-rep/newcastle/page.tsx
- Removed `→` from all button labels ("Free Lease Review", "Start Free Review")

### furniture/page.tsx
- Removed `→` from "Learn about Cleaning" button

### contact/page.tsx
- Added missing Button import
- Added missing spacing constants (SEC, SEC_SM, WRAP, PAD)
- Replaced hardcoded inline `<a>` with Button component for "Book a Call"
- Fixed inline submit button: `borderRadius: '0.5rem'` → `rounded-[4px]`, `min-h-[52px]` → `min-h-[48px]`, removed trailing `→`
- Tightened padding: `1.25rem 3.5rem` → `0.9rem 3rem`

### leaseintel/page.tsx
- Removed `→` from "Submit Your Lease" button (both instances)

### resources/lease-review/page.tsx
- Fixed hardcoded button: `padding: '1.25rem 3.5rem', borderRadius: '0.5rem'` → `padding: '1.1rem 3rem', borderRadius: '4px'`
- Fixed min-height: `52px` → `48px` on question navigation buttons
- Fixed border-radius on all buttons: `0.5rem` → `4px`
- Removed `→` from: "Start the checker", "See my results", "Next", "Get my result", "Get the full report"

### market-snapshot/MarketSnapshotPageContent.tsx
- Global sed fix: `min-h-[52px]` → `min-h-[48px]`
- Global sed fix: `rounded-lg` → `rounded-[4px]`
- Global sed fix: `tracking-[0.14em]` → `tracking-[0.1em]`
- Fixed hardcoded inline button styles

### cleaning/page.tsx (subagent)
- Removed `→` from "Express interest" button

### resources/page.tsx (subagent)
- Added Button import
- Replaced hardcoded inline `<a>` with Button component for "Book a Clarity Call"

## Build Status
✓ Compiled successfully
✓ All 119 static pages generated
✓ Deployed to Vercel (yourofficespace.au)

## Remaining items (lower priority, not blocking)
- resources/health-check/page.tsx: tool card labels with `→` (design pattern, not blocking)
- blog/[slug]/page.tsx: `→ {t.label}` in sidebar links (design pattern, not blocking)
- resources/tools (relocate-quiz, workspace-builder, etc.): mostly interactive tool pages, buttons not using Button component — lower priority

## Best Practice Research
Written to: /Users/yourofficespace-main/yos-website/audit-report.md
- Benchmark: burgtec.com.au, unispace.com/au, microsoft.com.au
- Key finding: arrow `→` in button labels is the primary AI-tell — now removed from all main page CTAs
- Standardised button: 4px radius, 48px min-height, tracking 0.1em, lg padding 1.1rem 3rem