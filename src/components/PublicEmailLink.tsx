import type { CSSProperties } from 'react'
import { publicEmailMarkup } from '@/lib/public-email'

export default function PublicEmailLink({ email, label, className, style }: { email: string; label?: string; className?: string; style?: CSSProperties }) {
  return <span className="public-email-link" style={style} dangerouslySetInnerHTML={{ __html: publicEmailMarkup(email, label, className) }} />
}
