import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as crypto from 'node:crypto'
import { spawn, execFileSync, execFile } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

const api = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/fireflies-webhook.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { exports: api, require: () => crypto, Buffer, Uint8Array })

test('actual Redis Lua atomically deduplicates concurrent retries and releases receipts after queue errors', async () => {
  const server = ['/opt/homebrew/bin/redis-server', '/usr/bin/redis-server'].find(file => fs.existsSync(file))
  const cli = ['/opt/homebrew/bin/redis-cli', '/usr/bin/redis-cli'].find(file => fs.existsSync(file))
  assert.ok(server && cli, 'Install the standard Redis runtime to verify the actual queue script locally.')
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yos-fixture-redis-')), socket = path.join(dir, 'redis.sock')
  const child = spawn(server, ['--port', '0', '--unixsocket', socket, '--unixsocketperm', '700', '--save', '', '--appendonly', 'no'], { stdio: 'ignore' })
  const run = (...args) => execFileSync(cli, ['-s', socket, '--raw', ...args], { encoding: 'utf8' }).trim()
  try {
    let ready = false
    for (let i = 0; i < 100; i++) {
      if (fs.existsSync(socket)) { try { if (run('PING') === 'PONG') { ready = true; break } } catch {} }
      await new Promise(resolve => setTimeout(resolve, 25))
    }
    assert.ok(ready)
    const args = ['-s', socket, '--raw', 'EVAL', api.FIREFLIES_ENQUEUE_SCRIPT, '2', 'receipt', 'queue', '{"fixture":true}', '600']
    const outputs = await Promise.all(Array.from({ length: 20 }, () => promisify(execFile)(cli, args, { encoding: 'utf8' })))
    assert.equal(outputs.filter(result => result.stdout.trim() === '1').length, 1); assert.equal(run('LLEN', 'queue'), '1'); assert.ok(Number(run('TTL', 'receipt')) > 0)
    run('SET', 'wrong-type-queue', 'fixture')
    assert.match(run('EVAL', api.FIREFLIES_ENQUEUE_SCRIPT, '2', 'retry-receipt', 'wrong-type-queue', '{}', '600'), /WRONGTYPE/)
    assert.equal(run('EXISTS', 'retry-receipt'), '0')
    run('DEL', 'wrong-type-queue')
    assert.equal(run('EVAL', api.FIREFLIES_ENQUEUE_SCRIPT, '2', 'retry-receipt', 'wrong-type-queue', '{}', '600'), '1')
  } finally {
    child.kill('SIGTERM'); await new Promise(resolve => child.once('close', resolve)); fs.rmSync(dir, { recursive: true, force: true })
  }
})
