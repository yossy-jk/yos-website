export const MAX_FURNITURE_FILE_BYTES = 3 * 1024 * 1024
export const FURNITURE_FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.dwg'
export function furnitureFileError(file: { name: string; size: number }): string {
  if (!/\.(pdf|jpe?g|png|dwg)$/i.test(file.name)) return 'Choose a PDF, JPG, PNG or DWG file, or remove the file to continue.'
  if (!file.size) return 'This file is empty. Choose another file or remove it to continue.'
  if (file.size > MAX_FURNITURE_FILE_BYTES) return 'Choose a file smaller than 3 MB, or remove it to send your brief without a file.'
  return ''
}
