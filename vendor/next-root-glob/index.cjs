'use strict';
// Only the Next 16.3.7 get-root-dirs call contract is supported.
// Fail closed if a future plugin starts using a broader fast-glob API.
// The upstream consumer uses require(), so this entry point must remain CommonJS.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { globSync: maintainedGlob } = require('glob');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { statSync } = require('node:fs');
function globSync(pattern, options) {
  if (typeof pattern !== 'string' || options?.onlyDirectories !== true ||
      Object.keys(options).some(key => key !== 'onlyDirectories')) {
    throw new TypeError('Unsupported Next root-directory glob contract');
  }
  if (pattern.length > 4096) throw new RangeError('Root-directory pattern too long');
  let depth = 0;
  for (const char of pattern) {
    if (char === '{' && ++depth > 32) throw new RangeError('Root-directory pattern too deeply nested');
    if (char === '}') depth = Math.max(0, depth - 1);
  }
  return maintainedGlob(pattern, { dot: false, follow: false }).filter(path => statSync(path).isDirectory());
}
module.exports = Object.freeze({ globSync });
