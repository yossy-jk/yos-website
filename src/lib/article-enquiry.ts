type ArticleService = 'Leasing' | 'Buying' | 'Cleaning' | 'FitOut' | 'Furniture' | 'Not sure'

const COPY = {
  Leasing: { title: 'Put your next lease decision into a clear brief.', intro: 'Tell us your preferred location, key lease dates and what the workplace needs to do. Share what you know; we can help clarify the next step.', action: 'Discuss my lease requirements', submit: 'Send my leasing enquiry →', placeholder: 'Preferred location, current lease timing and workplace priorities, if known...' },
  Buying: { title: 'Start with what the property needs to do for your business.', intro: 'Share the intended use, preferred location and buying timeline, if known. We can discuss the brief and the next steps in your commercial property search.', action: 'Discuss my property brief', submit: 'Send my buying enquiry →', placeholder: 'Intended use, preferred suburbs, space requirements and timing, if known...' },
  Cleaning: { title: 'Tell us what your workplace needs cleaned.', intro: 'Share the site suburb, type of workplace and preferred cleaning schedule, if known. We can clarify the scope and the information needed for a quote.', action: 'Discuss my cleaning requirements', submit: 'Send my cleaning enquiry →', placeholder: 'Site suburb, workplace type, cleaning priorities and preferred schedule, if known...' },
  FitOut: { title: 'Turn your project questions into a useful FitOut brief.', intro: 'Share the site, project stage and target opening date, if known. YOS can discuss the client-side coordination scope and the next decisions for your workplace.', action: 'Discuss my FitOut project', submit: 'Send my FitOut enquiry →', placeholder: 'Site suburb, project stage, what needs changing and target opening date, if known...' },
  Furniture: { title: 'Get the furniture brief ready for a useful quote.', intro: 'Share your location, furniture quantities and target delivery date, if known. Mention any items you want to keep so we can discuss the whole furniture scope.', action: 'Discuss my furniture requirements', submit: 'Send my furniture enquiry →', placeholder: 'Location, furniture types or quantities, existing items to retain and target date, if known...' },
  'Not sure': { title: 'Find the right next step for your workplace.', intro: 'Tell us what you want to achieve and where you are in the process. We can help identify which YOS service fits the brief.', action: 'Discuss my workplace needs', submit: 'Send my enquiry →', placeholder: 'What would you like to achieve for your business or workplace?' },
} as const

export function articleEnquiry(slug: string, division: string) {
  // Respect the primary service division, then route project guides to FitOut.
  const service: ArticleService = division === 'tenant-rep' ? 'Leasing' : division === 'buyers-agency' ? 'Buying' : division === 'cleaning' ? 'Cleaning' : /fitout|construction|handover/i.test(slug) ? 'FitOut' : division === 'furniture' ? 'Furniture' : 'Not sure'
  return { service, ...COPY[service] }
}
