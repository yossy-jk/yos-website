# Public website enquiry intake

Public enquiries use YOS email delivery, with no HubSpot token, form embed, CRM queue or external quoting-system requirement. The fixed inbox is `jk@yourofficespace.au`. Cleaning job/contractor applications go to Sarah with Joe copied; sales partner applications go to Joe with Sarah copied, preserving existing routing.

`src/lib/enquiry-delivery.ts` is the server delivery boundary. The shared renderer in `src/lib/enquiry-email.ts` sends branded HTML and a readable plain-text alternative with: submission ID, source, contact, request details, explicit marketing choice and client submission time where available; the email itself records delivery time. The browser transport in `src/lib/enquiry.ts` reuses a UUID for retries of unchanged details; Resend uses it as an idempotency key. Invalid submissions or provider rejection do not produce an accepted receipt. Preview deployments send no email.

| Journey | Route / delivery |
| --- | --- |
| Main contact, cleaning, Flourish services, fitout, buying, furniture, blog article enquiries | `/api/enquiry`, shared ContactForm |
| EOF partner lease review, tenant representation, furniture | Legacy URLs redirect to current services; dormant vendor embed replaced by native ContactForm |
| Not-for-profit support | `/api/enquiry`, organisation, ABN and needs in message |
| Resource tool gates, including workspace builder | `/api/enquiry`, calculated context to inbox; results visible on page |
| Blog subscription request | `/api/enquiry`, explicit marketing choice |
| Market snapshot registration | `/api/market-snapshot-register`, owner notification and customer confirmation |
| Lease risk check | `/api/lease-risk-capture`, owner notification and customer risk result |
| Capability statement | `/api/download/capability-statement`, owner notification before signed download |
| Fitout estimate report | `/api/fitout-report`, customer report plus owner notification, no CRM queue |
| Furniture quote | `/api/enquiry`; optional attachment keeps existing FormSubmit email path with attachment-failure warning |
| Lease review scope | Owner notification plus existing FormSubmit attachment delivery; failed delivery retains form and shows error |
| Space planner session / quote | `/api/space-planner-gate`, `/api/space-planner-lead`, `/api/space-planner-quote`; full selections in email |
| Cleaning / sales careers | `/api/cleaning-careers`, established Joe/Sarah routing |
| Tenant journey | `/api/tenant-lead`; see tenant-intake.md |

`/api/contact`, `/api/notify` and `/api/hubspot` are compatibility aliases for direct inbox delivery. Public booking links point to the YOS contact form. Browser HubSpot tracking is removed; optional Google Analytics remains consent gated. Staff dashboard integrations and historical CRM records are outside public enquiry intake.

## Connect YOS OS later

`ENQUIRY_ROUTING.yosOsEnabled` remains false. No webhook or CRM sync is active. Confirm the live YOS OS endpoint, server-side authentication, accepted schema, consent fields, retention and idempotency semantics. Map the typed enquiry fields and use the website submission ID as external reference. Add the adapter at the delivery boundary and the tenant route. Test genuine account receipt before enabling it, and retain email delivery when OS is unavailable. Existing mailbox history is not automatically backfilled.

Required now: existing Resend email key; Upstash rate limiting where configured. Tenant delivery additionally uses existing Redis receipts. Capability downloads still require their existing download signing secret. No HubSpot credentials are required.


## Readable inbox notifications

Owner notifications put the sender and business first, with email/call links, labelled contact details, the original message, structured answers and a clearly identified lease attachment when supplied. Tenant notifications show priority, follow-up time in Australia/Sydney and human-readable calculated estimates. Detail values are escaped before HTML rendering; false and zero answers and nested quote items remain visible. The footer records explicit marketing permission and the submission reference. No raw JSON or internal integration status is shown in the main notification. Routing, reply-to addresses, optional lease attachments and provider acceptance checks remain at the delivery boundary; tenant receipt timestamps keep retries deterministic. The tenant emergency fallback sends structured details without truncating JSON into the message.
