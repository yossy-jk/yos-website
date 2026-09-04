import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
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

const AUDIT_PROCESS_TIMEOUT_MS = 90_000;
const OSV_REQUEST_TIMEOUT_MS = 60_000;
const OSV_QUERY_URL = 'https://api.osv.dev/v1/querybatch';

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

export function extractLockedNpmPackages(lockfile) {
  if (!lockfile?.packages || typeof lockfile.packages !== 'object') {
    throw new Error('package-lock.json does not contain a packages map.');
  }

  const packageMarker = 'node_modules/';
  const seen = new Set();
  const packages = [];

  for (const [packagePath, details] of Object.entries(lockfile.packages)) {
    const markerIndex = packagePath.lastIndexOf(packageMarker);
    if (markerIndex < 0 || !details?.version || details.link) continue;

    const name = packagePath.slice(markerIndex + packageMarker.length);
    const key = `${name}@${details.version}`;
    if (!name || seen.has(key)) continue;

    seen.add(key);
    packages.push({ name, version: details.version });
  }

  if (packages.length === 0) {
    throw new Error('package-lock.json does not contain any versioned npm dependencies.');
  }

  return packages;
}

export async function runOsvAudit({
  lockfilePath = 'package-lock.json',
  read = readFile,
  request = globalThis.fetch,
  signalFactory = AbortSignal.timeout,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  try {
    const lockfile = JSON.parse(await read(lockfilePath, 'utf8'));
    const packages = extractLockedNpmPackages(lockfile);
    const queries = packages.map(({ name, version }) => ({
      package: { ecosystem: 'npm', name },
      version,
    }));

    stderr.write(`npm audit service unavailable; checking ${packages.length} locked package versions with OSV.dev.\n`);

    const response = await request(OSV_QUERY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ queries }),
      signal: signalFactory(OSV_REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`OSV.dev returned HTTP ${response.status}.`);
    }

    const report = await response.json();
    if (!Array.isArray(report?.results) || report.results.length !== packages.length) {
      throw new Error('OSV.dev returned an incomplete or malformed result set.');
    }

    const findings = [];
    for (const [index, result] of report.results.entries()) {
      if (!result || typeof result !== 'object') {
        throw new Error('OSV.dev returned an invalid package result.');
      }
      if (result.vulns !== undefined && !Array.isArray(result.vulns)) {
        throw new Error('OSV.dev returned an invalid vulnerability list.');
      }
      if (result.next_page_token && (result.vulns?.length ?? 0) === 0) {
        throw new Error('OSV.dev returned a paginated result without vulnerability details.');
      }

      for (const vulnerability of result.vulns ?? []) {
        findings.push({
          id: typeof vulnerability?.id === 'string' ? vulnerability.id : 'unknown advisory',
          package: packages[index],
        });
      }
    }

    if (findings.length > 0) {
      const summary = findings
        .slice(0, 20)
        .map(({ id, package: dependency }) => `${id} (${dependency.name}@${dependency.version})`)
        .join(', ');
      const remainder = findings.length > 20 ? `, plus ${findings.length - 20} more` : '';
      stderr.write(`OSV fallback found ${findings.length} known vulnerability record(s): ${summary}${remainder}.\n`);
      return 1;
    }

    stdout.write(`OSV fallback found 0 known vulnerabilities across ${packages.length} locked package versions.\n`);
    return 0;
  } catch (error) {
    stderr.write(`OSV fallback could not produce a trustworthy result: ${error?.message ?? String(error)}\n`);
    return 1;
  }
}

export async function runAudit({
  attempts = 1,
  run = spawnSync,
  fallback = runOsvAudit,
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

    if (failure.kind !== 'transient') {
      stderr.write(`Dependency audit could not produce a trustworthy result after ${attempt} attempt(s).\n`);
      return result.status ?? 1;
    }

    if (attempt === attempts) {
      return fallback({ stdout, stderr });
    }

    stderr.write(`Dependency audit service failed transiently (attempt ${attempt}/${attempts}); retrying.\n`);
  }

  return 1;
}

const invokedDirectly = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  process.exitCode = await runAudit();
}
