import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyAuditFailure,
  extractLockedNpmPackages,
  runAudit,
  runOsvAudit,
} from './audit-dependencies.mjs';

const discard = { write() {} };

test('classifies a real high-severity finding as a vulnerability result', () => {
  const result = classifyAuditFailure({
    stdout: JSON.stringify({ metadata: { vulnerabilities: { high: 1, critical: 0 } } }),
  });

  assert.equal(result.kind, 'vulnerabilities');
});

test('classifies an npm registry service error as transient', () => {
  const result = classifyAuditFailure({
    stdout: JSON.stringify({ error: 'Internal Server Error' }),
    stderr: 'npm error audit endpoint returned an error',
  });

  assert.equal(result.kind, 'transient');
});

test('classifies a hard process timeout as transient', () => {
  const result = classifyAuditFailure({
    error: Object.assign(new Error('audit command timed out'), { code: 'ETIMEDOUT' }),
  });

  assert.equal(result.kind, 'transient');
});

test('retries a transient service error and succeeds only on a clean audit', async () => {
  const results = [
    {
      status: 1,
      stdout: JSON.stringify({ error: 'Internal Server Error' }),
      stderr: 'npm error audit endpoint returned an error\n',
    },
    {
      status: 0,
      stdout: JSON.stringify({ metadata: { vulnerabilities: { high: 0, critical: 0 } } }),
      stderr: '',
    },
  ];
  let calls = 0;
  let spawnOptions;

  const status = await runAudit({
    attempts: 2,
    run: (_command, _args, options) => {
      calls += 1;
      spawnOptions = options;
      return results.shift();
    },
    stdout: discard,
    stderr: discard,
  });

  assert.equal(status, 0);
  assert.equal(calls, 2);
  assert.equal(spawnOptions.timeout, 90_000);
});

test('fails immediately when the audit reports a real vulnerability', async () => {
  let calls = 0;
  const status = await runAudit({
    run: () => {
      calls += 1;
      return {
        status: 1,
        stdout: JSON.stringify({ metadata: { vulnerabilities: { high: 1, critical: 0 } } }),
        stderr: '',
      };
    },
    stdout: discard,
    stderr: discard,
  });

  assert.equal(status, 1);
  assert.equal(calls, 1);
});

test('uses the OSV fallback after the npm transient retry budget is exhausted', async () => {
  let calls = 0;
  let fallbackCalls = 0;
  const status = await runAudit({
    run: () => {
      calls += 1;
      return {
        status: 1,
        stdout: JSON.stringify({ error: 'Service Unavailable' }),
        stderr: '',
      };
    },
    fallback: async () => {
      fallbackCalls += 1;
      return 0;
    },
    stdout: discard,
    stderr: discard,
  });

  assert.equal(status, 0);
  assert.equal(calls, 1);
  assert.equal(fallbackCalls, 1);
});

test('fails closed when both npm and OSV cannot produce a trustworthy result', async () => {
  const status = await runAudit({
    run: () => ({
      status: 1,
      stdout: JSON.stringify({ error: 'Service Unavailable' }),
      stderr: '',
    }),
    fallback: async () => 1,
    stdout: discard,
    stderr: discard,
  });

  assert.equal(status, 1);
});

test('extracts and deduplicates exact npm package versions from lockfile v3', () => {
  const packages = extractLockedNpmPackages({
    packages: {
      '': { name: 'website', version: '1.0.0' },
      'node_modules/react': { version: '19.2.4' },
      'node_modules/a/node_modules/react': { version: '19.2.4' },
      'node_modules/@scope/package': { version: '2.3.4' },
      'node_modules/local-link': { link: true },
    },
  });

  assert.deepEqual(packages, [
    { name: 'react', version: '19.2.4' },
    { name: '@scope/package', version: '2.3.4' },
  ]);
});

test('passes when OSV returns a complete clean result set', async () => {
  const stdout = [];
  const status = await runOsvAudit({
    read: async () => JSON.stringify({
      packages: {
        'node_modules/react': { version: '19.2.4' },
        'node_modules/next': { version: '16.3.4' },
      },
    }),
    request: async (_url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.queries.length, 2);
      assert.deepEqual(body.queries[0], {
        package: { ecosystem: 'npm', name: 'react' },
        version: '19.2.4',
      });
      return {
        ok: true,
        status: 200,
        json: async () => ({ results: [{}, {}] }),
      };
    },
    signalFactory: () => undefined,
    stdout: { write: (message) => stdout.push(message) },
    stderr: discard,
  });

  assert.equal(status, 0);
  assert.match(stdout.join(''), /0 known vulnerabilities across 2 locked package versions/);
});

test('fails when OSV returns a known vulnerability', async () => {
  const stderr = [];
  const status = await runOsvAudit({
    read: async () => JSON.stringify({
      packages: { 'node_modules/example': { version: '1.0.0' } },
    }),
    request: async () => ({
      ok: true,
      status: 200,
      json: async () => ({ results: [{ vulns: [{ id: 'GHSA-test-test-test' }] }] }),
    }),
    signalFactory: () => undefined,
    stdout: discard,
    stderr: { write: (message) => stderr.push(message) },
  });

  assert.equal(status, 1);
  assert.match(stderr.join(''), /GHSA-test-test-test \(example@1\.0\.0\)/);
});

test('fails closed when OSV returns an incomplete result set', async () => {
  const status = await runOsvAudit({
    read: async () => JSON.stringify({
      packages: { 'node_modules/example': { version: '1.0.0' } },
    }),
    request: async () => ({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    }),
    signalFactory: () => undefined,
    stdout: discard,
    stderr: discard,
  });

  assert.equal(status, 1);
});
