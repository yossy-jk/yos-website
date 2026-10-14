# Tenant enquiry delivery

The tenant journey uses `/api/tenant-lead` to deliver requests directly to the YOS team by email and send the submitter a confirmation or calculated results. HubSpot is not required by this route. The emergency owner-email fallback remains available.

Production requires `RESEND_API_KEY` and the existing Upstash Redis URL/token. Receipt state expires after seven days; it is delivery bookkeeping, not a customer database. Preview deployments never send emails. Marketing consent remains separate from requesting service or tool results.

## Future YOS OS connection

YOS OS is not connected yet (`TENANT_ROUTING.osEnabled` is false). When it is live, confirm its production intake URL, authentication contract, field mapping, consent handling, retention and idempotency support before implementing the server-side adapter. Reuse the submission UUID as the external reference; validated lead data already includes source, contact fields, intent, consent and server-calculated results. Keep email delivery available if the OS connection fails. Do not enable the flag or claim CRM sync until an end-to-end test confirms records arrive in the intended YOS OS account.

The other public website enquiry forms now use the direct-email boundary documented in `sitewide-enquiries.md`. Historical internal dashboard integrations are separate from public intake.
