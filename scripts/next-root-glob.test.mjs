import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const adapter = require('../vendor/next-root-glob/index.cjs');
const pluginRequire = createRequire(require.resolve('@next/eslint-plugin-next'));
test('replacement has exactly the reviewed Next consumer and version', () => {
  const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url)));
  const consumers = Object.entries(lock.packages).filter(([, pkg]) => pkg.dependencies?.['fast-glob']);
  assert.deepEqual(consumers.map(([path]) => path), ['node_modules/@next/eslint-plugin-next']);
  assert.equal(consumers[0][1].version, '16.3.7');
});
test('installed Next dependency resolves to the scoped replacement', () => {
  assert.equal(pluginRequire('fast-glob').globSync, adapter.globSync);
});
test('project directories resolve, while files and missing paths do not', () => {
  assert.deepEqual(adapter.globSync('src/app', { onlyDirectories: true }), ['src/app']);
  assert.deepEqual(adapter.globSync('package.json', { onlyDirectories: true }), []);
  assert.deepEqual(adapter.globSync('missing-yos-directory', { onlyDirectories: true }), []);
  assert.ok(adapter.globSync('src/*', { onlyDirectories: true }).includes('src/app'));
  assert.deepEqual(adapter.globSync(process.cwd(), { onlyDirectories: true }), [process.cwd()]);
});
test('unsupported calls and deeply nested inputs fail closed', () => {
  assert.throws(() => adapter.globSync('src/*', {}), TypeError);
  assert.throws(() => adapter.globSync('{'.repeat(1000), { onlyDirectories: true }), RangeError);
});
test('Next lint rules still detect an invalid synchronous script', async () => {
  const { ESLint } = await import('eslint');
  const eslint = new ESLint();
  const [result] = await eslint.lintText('export default function Page() { return <script src="/unsafe.js" />; }', {
    filePath: 'src/app/lint-contract-fixture.jsx',
  });
  assert.ok(result.messages.some(message => message.ruleId === '@next/next/no-sync-scripts'));
});
