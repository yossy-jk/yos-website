export const TEAM_ROLES = ['Contract cleaner', 'Installer', 'Tenant representative'] as const
export const TEAM_ARRANGEMENTS = ['Employment', 'Contracting', 'Partnership', 'Open to discussing'] as const

export function parseTeamInterest(raw: Record<string, unknown>) {
  const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : ''
  const name = text(raw.name, 200), email = text(raw.email, 254).toLowerCase(), location = text(raw.location, 200)
  const role = text(raw.role, 100), arrangement = text(raw.arrangement, 100)
  if (raw._honey || !name || !location || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !TEAM_ROLES.some(value => value === role) || !TEAM_ARRANGEMENTS.some(value => value === arrangement) || raw.contactPermission !== true) throw Error('Check your required details.')
  return { name, email, phone: text(raw.phone, 80), company: text(raw.company, 200), role, location, arrangement, experience: text(raw.experience, 3000), availability: text(raw.availability, 500) }
}
