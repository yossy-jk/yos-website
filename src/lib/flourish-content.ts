export type FlourishService = {
  slug: string
  name: string
  formService: string
  metaTitle: string
  description: string
  headline: string
  intro: string
  image: string
  imageAlt: string
  answerHeading: string
  answer: string
  cards: readonly { title: string; text: string }[]
  planningHeading: string
  planning: readonly string[]
  process: readonly { title: string; text: string }[]
  scope: string
  enquiry: string
  faqs: readonly { question: string; answer: string }[]
  sources: readonly { title: string; href: string }[]
}

export const FLOURISH_SERVICES: readonly FlourishService[] = [
  {
    slug: 'office-plant-hire-newcastle', name: 'Office Plant Hire Newcastle', formService: 'Office Plant Hire',
    metaTitle: 'Office Plant Hire Newcastle | Indoor Plants & Care | YOS',
    description: 'Office plant hire enquiries in Newcastle. Plan indoor plants, pots, placement, installation and ongoing care around your workplace with YOS.',
    headline: 'A greener office. A clear plan for its care.',
    intro: 'Bring life to reception, meeting rooms and work areas with office plant hire planned around your space. Start with the look you want, the conditions plants will live in and who will care for them.',
    image: '/images/furniture/space-cogc-wide.jpg', imageAlt: 'Indoor greenery arranged alongside commercial office workstations',
    answerHeading: 'How does office plant hire work?',
    answer: 'Office plant hire combines a plant and pot selection with an agreed hire arrangement. A useful proposal sets out placement, delivery, installation, maintenance visits and replacement conditions, so you know what is included before the plants arrive.',
    cards: [
      { title: 'Match plants to the space', text: 'Review light, air-conditioning, access and the way people move through your office before selecting plants and pots.' },
      { title: 'Make the first impression count', text: 'Plan feature plants for reception, greenery for shared spaces or planting integrated with storage and furniture.' },
      { title: 'Define ongoing care', text: 'Agree watering, plant checks, maintenance access and what happens if a plant declines or your layout changes.' },
    ],
    planningHeading: 'Good placement comes before a plant list.',
    planning: [
      'Begin with a floor plan or a walkthrough. Reception, breakout areas and workstation edges offer different opportunities; each needs enough space for people, cleaning and maintenance access.',
      'Choose pot sizes and finishes alongside your furniture rather than adding them as an afterthought. Keep circulation, accessible routes and exits clear, and check how containers protect the floor beneath them.',
      'Treat any suggested species or layout as a proposal for your actual conditions. Plants add visual warmth and character; we do not promise air purification, productivity gains or health outcomes.',
    ],
    process: [
      { title: 'Tell us about the office', text: 'Share your Newcastle address, a floor plan or photos, preferred style and the areas you want to improve.' },
      { title: 'Review the proposed display', text: 'Confirm plant and pot options, placement, access, provider arrangements and the hire terms before proceeding.' },
      { title: 'Agree installation and care', text: 'Set the delivery plan, maintenance scope and replacement conditions in writing, including any exclusions.' },
    ],
    scope: 'YOS helps coordinate the plant-hire brief and provider arrangements. Plant availability, minimum terms, maintenance frequency and replacement cover are confirmed in the site-specific proposal.',
    enquiry: 'Tell us your location, the spaces you want to green, approximate plant numbers and whether you want ongoing care included.',
    faqs: [
      { question: 'Can I hire indoor plants for a Newcastle office?', answer: 'Yes, enquire with YOS about office plant hire in Newcastle. We start with your location and workplace brief, then confirm the proposed provider, availability, hire terms and care arrangements.' },
      { question: 'Does office plant hire include watering and maintenance?', answer: 'Maintenance can be included in the proposed scope. Confirm watering, plant checks, visit frequency and access arrangements in writing; do not assume every hire package includes the same care.' },
      { question: 'How much does office plant hire cost?', answer: 'Pricing depends on plant and pot sizes, quantities, installation access, hire duration and the agreed care scope. A site-specific proposal gives you the inclusions, recurring charges and any separate costs.' },
      { question: 'Which plants work in a low-light office?', answer: 'Selection depends on the actual light, temperature and placement. A site review helps the plant provider recommend suitable options; photographs alone may not show how conditions change throughout the day.' },
      { question: 'Can plants be integrated with office furniture?', answer: 'Yes, planting can be planned alongside storage, screens and shared areas. Check container support, access, floor protection and maintenance requirements before relying on a furniture item as a planter.' },
      { question: 'What happens if a hired plant needs replacement?', answer: 'The hire agreement should explain when replacement is included and what exclusions apply. Ask about damage, relocation and care responsibilities before accepting the proposal.' },
      { question: 'Is there a minimum hire term?', answer: 'Any minimum term, renewal arrangement and cancellation condition is confirmed in the proposal. We do not publish a universal term because the arrangement depends on the provider and your brief.' },
      { question: 'Do you cover Lake Macquarie as well as Newcastle?', answer: 'We welcome enquiries from Newcastle and Lake Macquarie. Send your site address so coverage, travel arrangements and provider availability can be confirmed before booking.' },
    ],
    sources: [],
  },
  {
    slug: 'office-electrical-test-and-tag', name: 'Office Electrical Test & Tag Newcastle', formService: 'Electrical Test & Tag',
    metaTitle: 'Office Electrical Test & Tag Newcastle | YOS',
    description: 'Office electrical test and tag support in Newcastle. Coordinate a risk-based equipment scope, competent testing, records and follow-up with YOS.',
    headline: 'Keep the equipment checks out of the too-hard basket.',
    intro: 'Coordinate office electrical test and tag around the equipment you use and the risks of your workplace. Bring the scope, access plan and testing records together so the next step is clear.',
    image: '/images/furniture/space-pillowtalk-a.jpg', imageAlt: 'Commercial office workstations with desks and computer equipment',
    answerHeading: 'Does every office appliance need annual test and tag?',
    answer: 'No universal annual rule applies to every office appliance. In NSW, testing requirements depend on the equipment and the conditions in which it is used; a competent person should establish the appropriate scope and interval for your workplace.',
    cards: [
      { title: 'Identify the equipment', text: 'Build a practical list of plug-in items, power boards and leads in work areas, kitchens and shared spaces for the provider to assess.' },
      { title: 'Plan access and downtime', text: 'Agree how equipment will be accessed and when any disconnection can occur, including equipment staff bring in or use away from their desk.' },
      { title: 'Keep results usable', text: 'Request clear test results, equipment identification, failed-item actions and the provider’s recommended next steps.' },
    ],
    planningHeading: 'A sticker is one part of the picture.',
    planning: [
      'Start with your equipment list, previous testing records and any known changes in use. The provider needs to understand the operating environment, rather than apply a construction-site schedule to an ordinary office.',
      'Ask for the scope and frequency to be explained with reference to the applicable requirements and standards. Equipment testing is separate from assessing fixed wiring, repairing faults or undertaking electrical installation work.',
      'If an item is damaged or suspected to be unsafe, stop using it and arrange appropriate assessment. Do not wait for a scheduled visit to address a known concern.',
    ],
    process: [
      { title: 'Define the brief', text: 'Tell us the site address, approximate item count, current records and access constraints.' },
      { title: 'Confirm specialist scope', text: 'Establish the provider’s competence, testing approach, exclusions and scheduling before the visit.' },
      { title: 'Record and follow up', text: 'Keep the results and any failed-item actions together. Confirm who owns rectification and future reviews.' },
    ],
    scope: 'YOS coordinates the brief and specialist provider arrangements. Inspection and testing are performed by a competent person; electrical repairs and installation work require the appropriate licensed contractor. Testing does not certify the entire workplace.',
    enquiry: 'Include your Newcastle or Lake Macquarie address, approximate equipment count, preferred access times and any previous testing records you can describe.',
    faqs: [
      { question: 'How often does office equipment need test and tag?', answer: 'The interval depends on workplace conditions, equipment use and the applicable requirements. Ask the competent testing provider to explain the recommended schedule; do not assume all office items need annual testing.' },
      { question: 'Who can inspect and test electrical equipment?', answer: 'Inspection and testing must be carried out by a competent person with the relevant knowledge and skills. Electrical repairs or installation work are a separate scope and require the appropriate licence.' },
      { question: 'What equipment should we include in the enquiry?', answer: 'Describe plug-in equipment, extension leads and power boards, including shared appliances and items used in higher-risk conditions. The provider confirms what belongs in the testing scope.' },
      { question: 'Will staff need to stop using their equipment?', answer: 'Some checks require equipment to be disconnected. Agree a practical access and downtime plan with the provider before the visit, especially for equipment supporting essential operations.' },
      { question: 'Does test and tag cover fixed wiring or switchboards?', answer: 'Portable equipment testing does not replace assessment of the electrical installation. Tell us about any fixed-wiring or switchboard concerns so they can be scoped separately with the appropriate electrical contractor.' },
      { question: 'How is office test and tag priced?', answer: 'The quote depends on the agreed scope, item count, access, travel, timing and reporting needs. Confirm minimum charges and any separate rectification costs before proceeding.' },
      { question: 'Can YOS guarantee electrical compliance after testing?', answer: 'No. YOS coordinates the enquiry and provider arrangements; the specialist reports on the agreed work. The business still needs to manage electrical risks and act on identified issues.' },
    ],
    sources: [{ title: 'SafeWork NSW: electrical inspection and testing', href: 'https://www.safework.nsw.gov.au/hazards-a-z/electrical-and-power/electrical-inspection-and-testing' }],
  },
  {
    slug: 'office-fire-compliance', name: 'Office Fire Compliance Newcastle', formService: 'Office Fire Compliance',
    metaTitle: 'Office Fire Compliance Newcastle | Coordination | YOS',
    description: 'Office fire compliance support in Newcastle. Coordinate building records, specialist servicing, responsibilities and follow-up through YOS.',
    headline: 'Know what is due. Know who owns it.',
    intro: 'Bring fire safety records, servicing and workplace arrangements into one clear brief. We help connect office needs with the building owner, manager and appropriate fire safety specialists.',
    image: '/images/furniture/space-liverpool-b.jpg', imageAlt: 'Commercial office reception and shared seating area',
    answerHeading: 'What does office fire compliance involve?',
    answer: 'It involves the fire measures and records applicable to the building, ongoing servicing and workplace emergency arrangements. Begin with the current fire safety schedule and building-owner responsibilities, then establish what the tenant and appointed specialists need to do.',
    cards: [
      { title: 'Establish responsibilities', text: 'Clarify the roles of the owner, strata or building manager and your business before commissioning overlapping work.' },
      { title: 'Coordinate specialist work', text: 'Define the servicing, assessment or advisory scope and confirm the qualifications or accreditation required for that work.' },
      { title: 'Track outstanding actions', text: 'Keep reports, due dates and responsibility for rectification visible instead of treating a completed visit as the end of the process.' },
    ],
    planningHeading: 'Start with the building documents.',
    planning: [
      'For a building subject to annual fire safety statement requirements, the statement is issued by or on behalf of the owner and relies on the relevant specialist assessments. Ask for the current schedule and statement rather than assuming your tenancy has a separate annual certificate.',
      'Routine inspection and maintenance are distinct from the assessments supporting an annual statement. NSW introduced AS 1851-2012 maintenance requirements for applicable measures from 13 February 2026; the fire specialist should establish how these apply to your building.',
      'Workplace emergency planning is a separate part of the brief. A new layout, fitout or change in occupancy should prompt a review with the appropriate people of exits, signage, responsibilities and emergency arrangements.',
    ],
    process: [
      { title: 'Gather the records', text: 'Share the site address, building contact, available fire safety documents and the issue or deadline you need help with.' },
      { title: 'Confirm the right pathway', text: 'Agree whether the need is servicing, specialist assessment, records coordination or workplace emergency planning.' },
      { title: 'Close the action loop', text: 'Keep provider findings, rectification responsibilities and supporting records together with clear next steps.' },
    ],
    scope: 'YOS coordinates the workplace brief and provider arrangements. Accredited practitioners, appropriately qualified contractors and the building owner retain their respective assessment, certification and legal responsibilities. YOS does not issue fire safety certification.',
    enquiry: 'Tell us your building address, whether you are the owner or tenant, the relevant building contact and what documentation or deadline needs attention.',
    faqs: [
      { question: 'Who is responsible for an annual fire safety statement in NSW?', answer: 'Where required, it is issued by or on behalf of the building owner, supported by the applicable accredited practitioner assessments. Tenants should establish arrangements with the owner or building manager.' },
      { question: 'Is servicing the same as annual fire safety assessment?', answer: 'No. Routine servicing and maintenance are distinct from the assessments supporting an annual statement. Confirm both scopes and the people qualified to perform them.' },
      { question: 'Does every office need its own fire safety statement?', answer: 'Do not assume each tenancy has a separate statement. The building’s requirements and current fire safety schedule determine the applicable measures; check the arrangements with the owner and fire specialist.' },
      { question: 'Can you help with extinguishers, exit signs and emergency lighting?', answer: 'These may form part of a specialist scope, depending on the building and your responsibilities. Describe what you need checked so the appropriate provider can confirm the work and qualifications required.' },
      { question: 'Can you help after an office fitout or layout change?', answer: 'Yes, YOS can coordinate an enquiry about the impact of the change and the relevant specialist input. Review building approvals and workplace emergency arrangements before assuming the existing setup remains suitable.' },
      { question: 'What should I send before requesting a quote?', answer: 'Start with your address, owner or building-manager contact, available fire safety schedule, existing service records and known outstanding issues. Tell us if a due date or notice is involved.' },
      { question: 'Does YOS certify our office as fire compliant?', answer: 'No. YOS coordinates the brief and provider arrangements. Required assessments and certification remain with the appropriately qualified or accredited people and the building owner.' },
    ],
    sources: [
      { title: 'NSW Planning: fire safety certification and statements', href: 'https://www.planning.nsw.gov.au/the-planning-system/buildings/fire-safety-in-buildings/fire-safety-certification' },
      { title: 'NSW Government: building-owner responsibilities under AS 1851-2012', href: 'https://www.nsw.gov.au/departments-and-agencies/building-commission/industry-changes/as1851-2012/responsibilities-of-building-owners-under-as-1851-2012' },
    ],
  },
  {
    slug: 'office-first-aid-compliance', name: 'Office First Aid Compliance Newcastle', formService: 'Office First Aid Compliance',
    metaTitle: 'Office First Aid Compliance Newcastle | Workplace Support | YOS',
    description: 'Office first aid compliance support in Newcastle. Review kits, first-aider coverage, training arrangements and workplace procedures with YOS.',
    headline: 'A kit on the wall is only the start.',
    intro: 'Plan practical first aid arrangements around your people, working hours and workplace risks. Connect kit care, access to trained first aiders and clear procedures so responsibilities are understood.',
    image: '/images/furniture/opal-office.jpg', imageAlt: 'Office meeting area and shared workplace facilities',
    answerHeading: 'What does an office need for first aid?',
    answer: 'NSW workplaces need appropriate first aid equipment, access to facilities and adequate access to trained first aiders. The arrangements should reflect workplace risks, location, size and the people present, including how coverage works during leave and different working hours.',
    cards: [
      { title: 'Review kit arrangements', text: 'Check location, accessibility, contents and the process for replacing used, damaged or expired items.' },
      { title: 'Plan first-aider coverage', text: 'Identify who is available when people are on site, and consider leave, hybrid attendance and shifts.' },
      { title: 'Make procedures clear', text: 'Help staff identify first aid contacts, find equipment and understand the workplace reporting process.' },
    ],
    planningHeading: 'Build the plan around a real working week.',
    planning: [
      'A staff list may show several trained first aiders while a particular working day has none on site. Review attendance patterns and arrange suitable access across the hours your workplace operates.',
      'Nominate who owns kit checks and replenishment. Keep equipment identifiable and accessible, and review the arrangements when hazards, layout or workforce needs change.',
      'Ask an appropriate specialist to review your requirements and a Registered Training Organisation to confirm nationally recognised training options. Equipment supply, kit maintenance and staff training should be clearly scoped rather than treated as one automatic compliance package.',
    ],
    process: [
      { title: 'Describe the workplace', text: 'Share your location, activities, attendance pattern, existing kits and current first-aider arrangements.' },
      { title: 'Identify the gaps', text: 'Confirm the equipment, access, training or procedure support needed with the appropriate provider.' },
      { title: 'Assign ongoing ownership', text: 'Record who checks kits, tracks training arrangements and reviews coverage when the workplace changes.' },
    ],
    scope: 'YOS coordinates the brief and appropriate provider arrangements. Specialist advice and nationally recognised training are delivered by the relevant professionals and training organisations; the business retains responsibility for adequate workplace first aid provisions.',
    enquiry: 'Tell us about staff numbers, working hours, existing kits and whether you need kit servicing, help reviewing arrangements or access to training providers. Please leave personal medical information out of the enquiry.',
    faqs: [
      { question: 'Is a first aid kit enough to make an office compliant?', answer: 'No. Equipment is one part of the arrangements; workplace risks, facilities, access to trained first aiders and procedures also matter.' },
      { question: 'How many first aiders does our office need?', answer: 'Use a workplace assessment rather than headcount alone. Consider risk, operating hours, absences, location and access to trained people, then confirm suitable coverage with an appropriate adviser.' },
      { question: 'Can YOS help arrange first aid training?', answer: 'YOS can coordinate an enquiry with an appropriate training provider. Nationally recognised qualifications must be issued by the relevant Registered Training Organisation, rather than by YOS.' },
      { question: 'Can kit checks and replenishment be included?', answer: 'They can be requested as part of the proposed scope. Confirm kit locations, item replacement, expiry checks, visit frequency and separate charges with the provider before proceeding.' },
      { question: 'Do we need a defibrillator in every office?', answer: 'Do not assume every office has the same requirement. Discuss workplace risks, emergency access and the people present with an appropriate adviser when assessing whether an AED is suitable.' },
      { question: 'When should first aid arrangements be reviewed?', answer: 'Review them when activities, attendance, working hours, hazards or the layout change, and when experience identifies a gap. Give kit care and training records a named owner.' },
      { question: 'Can YOS issue a first aid compliance certificate?', answer: 'YOS does not certify the workplace or issue first aid qualifications. We coordinate your brief and provider arrangements; the business remains responsible for suitable provisions.' },
    ],
    sources: [
      { title: 'SafeWork NSW: first aid in the workplace', href: 'https://www.safework.nsw.gov.au/safety-starts-here/safety-overview/first-aid-in-the-workplace' },
      { title: 'Safe Work Australia: first aid in the workplace model code', href: 'https://www.safeworkaustralia.gov.au/doc/model-code-practice-first-aid-workplace' },
    ],
  },
]
