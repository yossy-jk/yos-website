# Temporary Next lint root-directory adapter

Replaces the sole fast-glob consumer in @next/eslint-plugin-next 16.3.7,
without changing ESLint configuration, rules, or the audit threshold.
Uses the existing maintained glob library, excluding files from results.
This is not a general fast-glob implementation. Unsupported calls fail.
The lint preflight asserts the reviewed consumer and version, so future
dependency changes require review rather than silently expanding scope.

Reason: GHSA-vfj7-8cjw-p6xm affects braces 3.0.3, indirectly installed by
fast-glob. No patched braces release was available on 6 October 2026.
Remove the override when upstream supplies a verified unaffected chain.
Rollback: remove this override and adapter, regenerate the lockfile. The
original security audit will then fail again until upstream is patched.
