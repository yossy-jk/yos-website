# YOS website Gold v3.1 audit

Audit date: 27 September 2026 (Australia/Sydney)

Governing sources: YOS Brand Design System v3.1 and YOS Agent Knowledge Base v1.1. This review treats unverified claims as defects and does not infer permission, licences, partnerships, outcomes or delivery times.

## Release standard

Every public page must:

- use Montserrat, the v3.1 palette, 4px corners, flat colour and no decorative shadows;
- present Tenant Representation, Office Fit Out & Project Management, and Commercial Furniture as the three equal core services;
- treat Commercial Cleaning as supplementary and limited to Newcastle and the Hunter;
- say “Based in Newcastle. Working Australia-wide.” only with the service qualification: tenant representation in NSW; fit out and furniture Australia-wide;
- use “Book a Clarity Call” as the primary consultation action;
- contain no invented statistics, testimonials, client outcomes, delivery times, prices, affiliations or regulatory claims;
- provide descriptive headings, keyboard access, visible focus, sufficient contrast, useful image alternatives and one main landmark;
- use unique metadata, a canonical URL, accurate schema, internal links and crawlable content;
- pass tests, lint, dependency audit, production build, accessibility checks and responsive visual review.

## Route-by-route review

| Route | Purpose and Gold v3.1 action |
|---|---|
| `/` | Primary conversion page. Three equal core services, qualified geography, proof only from confirmed relationships, clear Clarity Call path. |
| `/about` | Company credibility. Remove broad tenant-advisory geography and qualify each service area. |
| `/contact` | Unified enquiry. Accurate service geography, direct contact, accessible form and Clarity Call option. |
| `/tenant-rep` | NSW tenant representation. State independence, scope, process and limitations without promised savings. |
| `/tenant-rep/newcastle` | Newcastle/Hunter search page. Local market context without unsupported market outcomes or absolutes. |
| `/buyers-agency` | Referral-only boundary. Must not imply YOS provides a licensed buyers-agent service where it does not. |
| `/lease-review` | Lease review pathway. Educational language, no legal-advice implication, and clear next step. |
| `/leaseintel` | Product/service explanation. Explain inputs, outputs and limitations without fabricated precision. |
| `/newcastle-commercial-property` | Local hub. Separate NSW tenant representation from national fit out/furniture. |
| `/not-for-profit-lease-support` | Sector landing page. Evidence-led support with no preferential-outcome claim. |
| `/market-snapshot` | Dated market information. Attribute data, remove unsupported predictions and distinguish information from advice. |
| `/office-fitout` | National core service. Replace unverified project counts, cost bands and lead times with brief-led planning. |
| `/furniture` | National core service. Replace unsupported delivery and client claims; clarify specification, procurement and installation. |
| `/cleaning` | Supplementary service. Newcastle/Hunter only, clear scope and enquiry path. |
| `/cleaning/work-with-us` | Employment hub. Clear role types, privacy notice and accessible application path. |
| `/cleaning/work-with-us/cleaning` | Cleaning role page. Accurate requirements, no guaranteed work or earnings. |
| `/case-studies` | Evidence index. Publish only attributable, approved projects and outcomes. |
| `/case-studies/[slug]` | Evidence detail. Separate facts, client-approved statements and contextual commentary. |
| `/blog` | Educational index. Readable cards, accurate categories and no low-contrast metadata. |
| `/blog/[slug]` | Article template. Author/date, useful hierarchy, related service links and factual citations where needed. |
| `/resources` | Tool hub. Explain assumptions and distinguish estimates from quotes/advice. |
| `/resources/cap-rate-calculator` | Calculator. Show formula, assumptions and limitations. |
| `/resources/fitout-estimator` | Indicative estimator. Clearly label ranges as estimates and prevent false precision. |
| `/resources/furniture-quote` | Structured brief. Privacy, consent, validation and confirmation state. |
| `/resources/health-check` | Diagnostic tool. Avoid deterministic risk claims; provide explainable results. |
| `/resources/land-tax-calculator` | Educational calculator. Date the rules and link to official sources. |
| `/resources/lease-comparison` | Comparison tool. Preserve assumptions and avoid legal-advice framing. |
| `/resources/lease-review` | Lead path. Explain document handling, privacy and review boundaries. |
| `/resources/lease-vs-buy` | Scenario tool. State financial assumptions and encourage professional advice. |
| `/resources/office-size-calculator` | Planning estimate. Explain density assumptions and accessibility needs. |
| `/resources/purchase-checklist` | Download/checklist. No implied buyers-agent service beyond approved referral boundary. |
| `/resources/relocate-quiz` | Decision aid. Non-deterministic results with transparent logic. |
| `/resources/rental-yield-calculator` | Educational calculator. Show formula and exclude investment recommendations. |
| `/resources/stamp-duty-calculator` | Educational calculator. Date rates and link to official authority. |
| `/resources/workspace-builder` | Brief builder. Save/submit consent, accessible steps and printable output. |
| `/tools/space-planner` | Planning tool. Accessible controls, save-state clarity and indicative layouts only. |
| `/privacy` | Plain-language collection, processing, retention, service-provider and rights disclosures. |
| `/terms` | Website/tool terms, estimate limitations, IP and governing law. |
| `/wholesale` | Trade pathway. Confirm eligibility, scope, service boundaries and enquiry process. |

## Cross-site findings and remediation

1. **Service geography:** legacy copy overextended tenant-side advisory nationally. Shared metadata, footer, About and Contact now distinguish NSW tenant representation, national fit out/furniture and local cleaning.
2. **Proof integrity:** fit-out and furniture pages contained unverified counts, prices, delivery windows and sector claims. These are being removed or converted to project-specific statements.
3. **Visual system:** legacy v1.1 colours, multiple typefaces, oversized radii, shadows and decorative treatments had drifted across the site. Shared v3.1 tokens and Montserrat are now enforced by the brand check.
4. **Accessibility:** automated coverage exists for navigation, forms, landmarks, links and colour contrast. Stale v1.1 assertions have been migrated to v3.1; browser-level accessibility and responsive review remain release gates.
5. **SEO/AEO:** metadata and schema exist widely but must match visible, verified copy. Unsupported FAQ/schema claims must be removed, not hidden from the page.
6. **Conversion:** legacy CTA variants compete with one another. Consultation pages should converge on “Book a Clarity Call”; task-specific tools may retain a precise secondary action.

## Known owner-controlled inputs

- Approved primary YOS logo master and complete logo variants are not present in the repository. Do not recreate the wordmark from text; install supplied masters when available.
- Public use of client and commercial-agent logos requires confirmation that each relationship and display permission is current. Assets may be staged but should not be represented as endorsements without approval.
- Exact delivery counts, cost ranges, turnaround times, testimonials and regulated credentials require a current evidence source before publication.

## Definition of done

The rebuild is release-ready only when all route actions above are satisfied and the automated and visual gates pass. A production release remains a separate owner-approved action with an auditable release receipt and rollback commit.
