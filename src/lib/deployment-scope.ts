export function isPreviewDeployment(vercelEnv = process.env.VERCEL_ENV): boolean {
  return vercelEnv === 'preview'
}

export function deploymentScopedKey(key: string, vercelEnv = process.env.VERCEL_ENV): string {
  return isPreviewDeployment(vercelEnv) ? `preview:${key}` : key
}
