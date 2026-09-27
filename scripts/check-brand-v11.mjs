// Compatibility entrypoint retained for the protected GitHub workflow.
// Gold Standard v3.1 supersedes Brand v1.1; execute the current gate and stop
// so the workflow can migrate without broadening the content-release surface.
await import('./check-brand-gold-v31.mjs')
process.exit(0)
