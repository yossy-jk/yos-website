# Furniture and acoustic catalogues

The homepage and `/furniture` share catalogue cards linking to `/catalogues/furniture` and `/catalogues/acoustics`. Original supplied PDFs are unchanged in `public/catalogues`; page images support a mobile-friendly reader without relying on browser PDF plug-ins. The 73-page furniture and 19-page acoustic catalogues are fully navigable and downloadable.

After the first catalogue image loads, the optional offer appears after 10 seconds of visible-tab time. Hidden time is excluded. The modal can be dismissed with Escape or either close control, never gates catalogue access, and is suppressed for that catalogue for the current browser session. A persistent button reopens it manually.

## Offer

Shopify discount `YOSWELCOME5` was created and confirmed ACTIVE on 15 October 2026, ID `gid://shopify/DiscountCodeNode/1920566821233`, in the connected Your Office Furniture store. It gives 5% off products in a first online order, scoped to the existing “Customers who haven't purchased” segment (`number_of_orders = 0`), once per customer. Shipping is excluded and discount combinations are disabled. No minimum spend or expiry was added. Shopify checks buyer eligibility at checkout. No actual order was placed during setup.

Email-only discount requests send a branded code email to the prospect and a readable owner notification through the existing fixed inbox delivery boundary. A shareable Shopify discount URL is returned only after both deliveries are accepted. No HubSpot dependency, Shopify customer creation or marketing subscription is introduced.

Project Discovery Session requests collect name and email, plus optional project notes, and go straight to the owner inbox. This is a request to arrange a time, not an instant calendar booking. A calendar link was requested from the owner; no booking URL was invented.

The API validates origin, request size, catalogue, intent, email and submission reference; includes a honeypot and the existing voucher rate limiter; and uses stable idempotency keys for mail retries. Preview deployments validate and return success without sending real mail. The browser QA mocks submissions; production smoke tests are read-only.

## Verification

`npm run test:catalogues` covers routing, validation, rate limiting, delivery failures, stable retries, preview suppression and all page assets. `scripts/catalogue-flow.mjs` checks the visible-time threshold, hidden-tab pause, dismiss/reload behaviour, both forms, page navigation, PDF links and accessibility, with provider calls mocked. The same flow is part of protected CI.
