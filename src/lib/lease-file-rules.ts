export const MAX_LEASE_BYTES = 3 * 1024 * 1024
export const LEASE_ACCEPT = '.pdf,.doc,.docx'
export function leaseFileError(file: { name: string; size: number }): string {
  if (!/\.(pdf|doc|docx)$/i.test(file.name)) return 'Choose a PDF or Word document, or continue without a lease.'
  if (!file.size) return 'This file is empty. Choose another file or continue without a lease.'
  if (file.size > MAX_LEASE_BYTES) return 'Choose a lease smaller than 3 MB, or continue without uploading it.'
  return ''
}
