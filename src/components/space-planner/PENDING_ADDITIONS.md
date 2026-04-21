# Pending additions after drawing tools build completes

## 1. Shopify live catalogue
- Replace MOCK_PRODUCTS in ProductSidebar with live Shopify Storefront API call
- API route: /api/space-planner-products (GET)
- Uses SHOPIFY_STOREFRONT_TOKEN + SHOPIFY_STORE_DOMAIN env vars
- Maps Shopify collections to categories: Seating, Desks, Storage, Meeting, Breakout, Screens
- Shows real product images from cdn.shopify.com
- Falls back to MOCK_PRODUCTS if token not set
- Product cards: real image thumbnail, product name, category label (no price shown)

## 2. 2-minute consultant popup
- Component: ConsultantPopup.tsx
- Fires after 120 seconds of page load (setTimeout)
- Only fires once per session (sessionStorage flag)
- Does NOT fire if user has already opened the quote modal
- Slides in from bottom-right, z-index 40 (below quote modal at 50)
- Dark card style matching the tool (#1A1A1A bg, teal accent)
- Copy: 
  Heading: "Prefer someone to do this for you?"
  Body: "Our project consultants complete a full measure, discovery and scope as part of the service. Same outcome, zero effort on your end."
  Button 1 (teal): "Book a consultant call" → /contact
  Button 2 (ghost): "Keep building" → dismisses popup
- Add to page.tsx alongside QuoteModal
