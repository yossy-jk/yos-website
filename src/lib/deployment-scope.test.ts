import assert from 'node:assert/strict'
import test from 'node:test'
import { deploymentScopedKey, isPreviewDeployment } from './deployment-scope.ts'

test('preview deployments receive an isolated storage prefix', () => {
  assert.equal(isPreviewDeployment('preview'), true)
  assert.equal(deploymentScopedKey('yos:users:id:123', 'preview'), 'preview:yos:users:id:123')
})

test('production and local deployments retain existing storage keys', () => {
  assert.equal(isPreviewDeployment('production'), false)
  assert.equal(deploymentScopedKey('yos:users:id:123', 'production'), 'yos:users:id:123')
  assert.equal(deploymentScopedKey('yos:users:id:123', undefined), 'yos:users:id:123')
})
