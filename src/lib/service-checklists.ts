export const SERVICE_CHECKLISTS = {
  leasing: { title: 'Before You Sign: Commercial Lease Checklist', headline: 'Before you commit to your next lease…', detail: '12 practical checks to clarify your brief, compare proposals and prepare questions for your advisers.', pdf: '/guides/tenant-lease-checklist.pdf', servicePath: '/tenant-rep', label: 'Tenant representation' },
  fitout: { title: 'Office FitOut Project Brief & Quote Comparison Checklist', headline: 'Get clearer FitOut quotes from the start.', detail: '12 practical checks for scope, responsibilities, allowances and delivery dependencies.', pdf: '/guides/fitout-project-checklist.pdf', servicePath: '/office-fitout', label: 'Office FitOut' },
  furniture: { title: 'Office Furniture Planning & Ordering Checklist', headline: 'Plan the details before you order.', detail: '12 practical checks for your layout, specifications, quotes and installation.', pdf: '/guides/furniture-ordering-checklist.pdf', servicePath: '/furniture', label: 'Office furniture' },
} as const
export type ChecklistService = keyof typeof SERVICE_CHECKLISTS
export function checklistService(path: string): ChecklistService | null {
  if (path === '/tenant-rep' || path === '/tenant-rep/newcastle') return 'leasing'
  if (path === '/office-fitout') return 'fitout'
  if (path === '/furniture') return 'furniture'
  return null
}
export const CHECKLIST_FOLLOWUP_PERMISSION = 'Email me one helpful follow-up in about 24 hours with an invitation to book a discovery session. I can unsubscribe at any time.'
