import { existsSync } from 'node:fs'
import { join } from 'node:path'

// Server-only (uses node:fs) — do not import from client components.
/**
 * Whether public/resume.pdf exists. Resume buttons are only rendered when it does,
 * so the site never links to a 404. Checked on the server at render/revalidate time.
 */
export function hasResume() {
  return existsSync(join(process.cwd(), 'public', 'resume.pdf'))
}
