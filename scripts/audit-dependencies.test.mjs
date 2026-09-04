import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyAuditFailure, runAudit } from './audit-dependencies.mjs';

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

test('retries a transient service error and succeeds only on a clean audit', () => {
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

  const status = runAudit({
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
  assert.equal(spawnOptions.timeout, 135_000);
});

test('fails immediately when the audit reports a real vulnerability', () => {
  let calls = 0;
  const status = runAudit({
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

test('fails closed after the transient retry budget is exhausted', () => {
  let calls = 0;
  const status = runAudit({
    attempts: 3,
    run: () => {
      calls += 1;
      return {
        status: 1,
        stdout: JSON.stringify({ error: 'Service Unavailable' }),
        stderr: '',
      };
    },
    stdout: discard,
    stderr: discard,
  });

  assert.equal(status, 1);
  assert.equal(calls, 3);
});
