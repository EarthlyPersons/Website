/**
 * Sanitize a string for safe Firestore storage.
 * Encodes HTML entities to prevent injection.
 * Does NOT strip characters — preserves content, encodes dangerous chars.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\0/g, '')
    .replace(/\s{3,}/g, '\n\n')
    .trim()
}
