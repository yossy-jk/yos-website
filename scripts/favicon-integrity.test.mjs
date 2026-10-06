import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
test('app favicon is the approved public YOS icon, not a competing default', () => {
  assert.deepEqual(readFileSync('src/app/favicon.ico'), readFileSync('public/favicon.ico'));
});
test('favicon and home-screen assets have their declared dimensions', async () => {
  for (const [file, size] of [['favicon.png', 512], ['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180]]) {
    const metadata = await sharp(`public/${file}`).metadata();
    assert.equal(metadata.width, size);
    assert.equal(metadata.height, size);
    assert.ok(metadata.hasAlpha);
  }
});
test('browser and home-screen icons use refreshed URLs', () => {
  const layout = readFileSync('src/app/layout.tsx', 'utf8');
  for (const file of ['favicon.ico', 'favicon-32.png', 'favicon-192.png', 'apple-touch-icon.png']) {
    assert.ok(layout.includes(`/${file}?v=yos-oct06`));
  }
});
