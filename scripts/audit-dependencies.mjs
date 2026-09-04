import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const TRANSIENT_AUDIT_PATTERNS = [
  /audit endpoint returned an error/i,
  /internal server error/i,
  /bad gateway/i,
  /service unavailable/i,
  /gateway timeout/i,
  /eai_again/i,
  /econnreset/i,
  /etimedout/i,
  /fetch failed/i,
];

const AUDIT_PROCESS_TIMEOUT_MS = 75_000;

export function parseAuditReport(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

export function classifyAuditFailure({ stdout = '', stderr = '', error = null }) {
  const report = parseAuditReport(stdout);
  const vulnerabilities = report?.metadata?.vulnerabilities;

  if ((vulnerabilities?.high ?? 0) > 0 || (vulnerabilities?.critical ?? 0) > 0) {
    return { kind: 'vulnerabilities', report };
  }

  const diagnostic = `${stdout}\n${stderr}\n${error?.code ?? ''}\n${error?.message ?? ''}`;
  if (report?.error || TRANSIENT_AUDIT_PATTERNS.some((pattern) => pattern.test(diagnostic))) {
    return { kind: 'transient', report };
  }

  return { kind: 'unknown', report };
}

export function runAudit({
  attempts = 3,
  run = spawnSync,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = run(
      'npm',
      [
        'audit',
        '--audit-level=high',
        '--json',
        '--fetch-retries=0',
        '--fetch-timeout=60000',
      ],
      {
        encoding: 'utf8',
        timeout: AUDIT_PROCESS_TIMEOUT_MS,
      },
    );

    if (result.stdout) stdout.write(result.stdout);
    if (result.stderr) stderr.write(result.stderr);

    if (result.status === 0) return 0;

    const failure = classifyAuditFailure(result);
    if (failure.kind === 'vulnerabilities') {
      stderr.write('Dependency audit found vulnerabilities at or above the configured severity threshold.\n');
      return result.status ?? 1;
    }

    if (failure.kind !== 'transient' || attempt === attempts) {
      stderr.write(`Dependency audit could not produce a trustworthy result after ${attempt} attempt(s).\n`);
      return result.status ?? 1;
    }

    stderr.write(`Dependency audit service failed transiently (attempt ${attempt}/${attempts}); retrying.\n`);
  }

  return 1;
}

const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  process.exitCode = runAudit();
}
