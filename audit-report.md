# Website UX/UI Best Practice Research — YOS Audit
Date: 2026-05-31

## Benchmark Sites Reviewed
- burgtec.com.au
- unispace.com/au
- microsoft.com.au

---

## BUTTON STANDARDS

### Burgtec (burgtec.com.au)
**What they do:**
- Primary buttons: solid dark background (#1a1a1a), white text, no visible border-radius (feels squared-off, professional)
- Secondary buttons: outlined, same dark color, clear 1px border
- Buttons labelled as verbs first: "Talk to a local rep", "Book a demonstration", "Browse Nova"
- Arrows (→) placed INSIDE button text, right at the end, not after a gap
- CTAs prominent but not oversized — feel integrated into the page, not floating above it
- Hover: slight opacity or background change, no bounce or scale — professional and restrained
- CTAs appear at natural decision points, not stacked on top of each other
- Button font: uppercase, tracking wide, size small but clear (12-14px)

**Spacing pattern:**
- Buttons have generous internal padding but constrained width (auto or inline)
- Not full-width unless the page structure demands it
- Page CTAs at bottom of sections use muted secondary action — "Talk to us" style

### Unispace (unispace.com/au)
**What they do:**
- Very clean, minimal button treatment
- Primary CTA: teal or white-on-dark depending on section background
- No border-radius — squared corners, professional
- Labels: noun-first style in some contexts, verb-first in others — mixed
- Arrow (→) is consistent — inside button, after text with minimal space
- Secondary actions often just text links (no button styling) — this reduces visual noise
- On light sections: dark buttons. On dark sections: white/light buttons.
- Clear hierarchy: primary CTA is the only thing that looks like a button; secondary actions are text or very understated outlined buttons

### Microsoft (microsoft.com.au)
**What they do:**
- Subtle rounded corners on buttons (2-4px radius) — not zero, not full round
- Generous padding: ~12px 24px on standard buttons, ~16px 32px on larger CTAs
- Font size: 14px body, button text ~12-13px uppercase with tracking 0.5-1px
- Very clear hover state: background shift, not scale or bounce
- Button groups: always horizontal on desktop, never stacked without good reason
- They use pill-shaped buttons (full round) for feature highlights — those are different from action CTAs
- Text links vs buttons: clear distinction, no "button-like" text links

### Best Practice Summary — Buttons

**Padding:**
- Small buttons: 10px 20px — no more
- Medium buttons: 14px 28px
- Large CTAs: 16px 32px — NOT 20px 60px which looks bloated

**Font:**
- Button text: 13px (not 10px which is unreadable)
- Uppercase with tracking 0.08em to 0.12em
- Font weight: semibold or bold (600-700)

**Border-radius:**
- 0px (squared) = corporate, serious
- 4px = refined, modern
- DON'T use 8px+ radius — too casual for commercial property

**Arrow placement:**
- → always INSIDE the button text, right before the edge, no extra margin
- No trailing spaces or gaps

**Label format:**
- Verb first: "Book a Call", "Get a Quote", "View Projects"
- NO: "Book a Free Call →" (arrow splits the label)
- YES: "Book a Call" with → inline

**Hover:**
- Background shift or opacity change only
- No translateY, no scale, no shadow explosion

---

## TEXT LAYOUT STANDARDS

### Section Spacing

**Big sections (hero, full-page sections):**
- Top and bottom padding: clamp(5rem, 10vw, 12rem) — generous but not wasteful
- Side padding: clamp(1.5rem, 8vw, 10rem) — breathing room on all screen sizes

**Small/medium sections:**
- Top and bottom padding: clamp(3rem, 6vw, 5rem) — enough to separate from adjacent sections
- DON'T use inconsistent values like clamp(4rem,8vw,7rem) — creates visual noise

**Spacing between text elements within a section:**
- Heading to body: 1.5rem
- Body to button: 2rem (minimum — buttons need air)
- Don't jam buttons tight against text blocks

### Typography System

**Section Labels (e.g. "Tenant Representation"):**
- Font size: 0.65rem (11-12px) — small and precise
- Uppercase, tracking: 0.25em to 0.35em — wide enough to feel intentional
- Color: teal (#00B5A5)
- Weight: semibold or bold
- Bottom margin: 0.75rem to 1rem

**Headings (H1, H2):**
- H1: clamp(2.5rem, 6vw, 6rem) — large, confident
- H2: clamp(1.75rem, 3.5vw, 3rem) — clear hierarchy
- Tracking: tight to normal (0 to 0.05em) — uppercase headings only
- If heading is uppercase, tracking 0.05em max — more feels like screaming
- If heading is title case, tracking 0
- Line-height: 1.0 to 1.1 (tight — headings shouldn't wrap excessively)
- Bottom margin: 1.25rem to 1.5rem

**Body text:**
- Font size: 1rem (16px) — standard, readable
- Line-height: 1.7 to 1.8 — comfortable reading
- Weight: light (300) or regular (400) — NOT semibold
- Color: charcoal (#4B5563) or near-black (#1A1A1A) — never pure black

**Lists:**
- Bullet/icon left padding: 1.25rem to 1.5rem
- Gap between items: 0.75rem to 1rem
- Icon/checkmark color: teal

### Visual Rhythm

**Alternating backgrounds:**
- White sections for content
- Near-black (#1a1a1a) sections for emphasis/different content
- Warm-grey (#F7F8F8) sections for secondary content
- Teal (#00B5A5) sections only for CTA bands — reserved for calls to action
- AVOID: random section colors that don't create narrative flow

**Image break sections:**
- Height: clamp(26rem, 42vw, 38rem) — good ratio
- Text overlay: bottom-left or bottom with left-aligned text
- Border-left on quote text: 3px teal
- Image dark overlay: 40-55% opacity — text must be readable

**Cards/component spacing:**
- Grid gap: 1.5rem to 2rem (not 0.75rem which feels cramped)
- Card padding: 1.5rem to 2rem
- Card border: 1px solid rgba(0,0,0,0.07) — not heavy black borders

---

## YOS SITE AUDIT FINDINGS

### Pages reviewed: homepage, tenant-rep, furniture, cleaning, about, buyers-agency, contact, resources, leaseintel, case-studies

### Critical issues found:

1. **Buttons: oversized and inconsistent**
   - lg buttons have `px-14` (56px horizontal) — way too wide and looks like a pill
   - Hard-coded button styles in page files instead of using Button component
   - Arrow placement: many pages use "Text →" with the arrow AFTER a trailing space — visually messy
   - Button.tsx is good but not being used consistently across pages

2. **Section padding inconsistent**
   - Some sections use `clamp(5rem,10vw,12rem)` — correct
   - Others use `clamp(4rem,8vw,7rem)` — slightly wrong, creates visual noise
   - Mobile padding sometimes too tight — 1.5rem minimum should apply everywhere

3. **Text edge too close to CTA buttons**
   - Several pages have paragraphs immediately followed by buttons with no breathing room
   - Minimum gap should be 2rem between body and button group

4. **Section labels inconsistent**
   - Some pages use `<SectionLabel>` component (good)
   - Others use raw `<p>` tags with inconsistent styling (bad)
   - Tracking varies from 0.15em to 0.3em — should be 0.25em standard

5. **List styling inconsistent**
   - Some use teal checkmarks (good), others use generic bullets (bad)
   - Some use border-left (good), others use simple flex gaps

6. **Mobile: CTA bars too cramped**
   - Mobile buttons stack without sufficient gap
   - Announcement bar text wraps awkwardly

7. **Footer: section headings use tracking — inconsistent with body text**
   - Footer links use 0.25em tracking — OK for labels but body links should not

---

## RECOMMENDED YOS STANDARDS

### Button Component (Button.tsx)
- Padding: `px-8 py-4` (md), `px-12 py-[1.1rem]` (lg) — tighten the horizontal
- Font size: 0.72rem for md, 0.75rem for lg — slightly larger, more readable
- Border-radius: 4px (refined, not squared-off)
- Arrow: always inline inside the button text, no trailing space
- Hover: `hover:bg-dark-teal` (existing) + slight opacity shift
- No scale, no translateY on hover — too playful for commercial property

### Hero Button Groups
- Gap between primary and secondary: 1rem
- Buttons side-by-side on mobile at md breakpoint, not stacked
- Secondary button: outline variant (existing good pattern)

### Section Padding Standard
- Large sections: `paddingTop: clamp(5rem,10vw,12rem), paddingBottom: clamp(5rem,10vw,12rem)`
- Medium/small sections: `paddingTop: clamp(3rem,6vw,5rem), paddingBottom: clamp(3rem,6vw,5rem)`
- Page-level padding: `paddingLeft: clamp(1.5rem,8vw,10rem), paddingRight: clamp(1.5rem,8vw,10rem)`

### Typography Hierarchy
- Section label: 0.65rem, uppercase, tracking 0.25em, teal, semibold
- H1: clamp(2.5rem,6vw,6rem), font-black, tight tracking, uppercase
- H2: clamp(1.75rem,3.5vw,3rem), font-black or font-bold, tracking 0
- Body: 1rem, font-light (300), line-height 1.8, charcoal
- Labels inside components: 0.78rem, uppercase, tracking 0.1em

### Image Break Sections
- Height: clamp(26rem,42vw,38rem)
- Overlay: 45-55% dark
- Text: bottom-left, max-width for readable line length
- Quote style: 3px teal border-left

### Stats Bar
- Consistent: 4-column on desktop, 2-column on mobile
- Stat number: text-3xl to text-4xl, font-black, teal
- Stat label: text-sm, font-light, white/70

---

*Compiled from inspection of burgtec.com.au, unispace.com/au, microsoft.com.au and full audit of YOS website pages.*