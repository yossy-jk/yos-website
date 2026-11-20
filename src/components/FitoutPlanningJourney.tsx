import Link from 'next/link'
import styles from './FitoutPlanningJourney.module.css'

const STAGES = [
  {
    id: 'fitout-before-committing', number: '01', title: 'Before committing',
    question: 'Will these premises work for your business?',
    description: 'Gather premises evidence, approval questions and proposed landlord works before relying on an opening date or a square-metre budget.',
    links: [
      ['Fitout readiness: assess the premises and information gaps', '/blog/office-fitout-readiness-newcastle'],
      ['Fitout approvals: prepare the questions for your advisers', '/blog/office-fitout-approvals-newcastle'],
      ['Landlord and tenant works: clarify who is doing what', '/blog/landlord-tenant-fitout-works-newcastle'],
    ],
    download: ['/guides/office-fitout-readiness-newcastle-checklist.pdf', 'Download the readiness checklist (PDF)'],
    action: 'Discuss my premises questions',
  },
  {
    id: 'fitout-planning-project', number: '02', title: 'Planning the project',
    question: 'Can everyone price and plan from the same brief?',
    description: 'Connect workplace requirements, design information, the whole-project budget and decision dates before comparing proposals.',
    links: [
      ['Design brief: decide what the workplace needs to do', '/blog/office-fitout-design-brief-newcastle'],
      ['Workplace examples: connect furniture with the fitout brief', '/blog/newcastle-office-furniture-workplace-examples'],
      ['Newcastle fitout costs: understand scope and allowances', '/blog/commercial-fitout-cost-newcastle-2026'],
      ['Construction quotes: compare inclusions and exclusions', '/blog/compare-office-construction-quotes-newcastle'],
      ['Fitout timeline: connect decisions and dependencies', '/blog/office-fitout-timeline-newcastle'],
    ],
    download: ['/guides/office-fitout-design-brief-newcastle-checklist.pdf', 'Download the design brief checklist (PDF)'],
    action: 'Discuss my fitout brief',
  },
  {
    id: 'fitout-managing-delivery', number: '03', title: 'Managing delivery',
    question: 'Are changes, business operations and handover visible?',
    description: 'Track the client decisions, scope changes and completion information alongside the appointed team’s delivery programme.',
    links: [
      ['Staying open: plan the refurbishment around operations', '/blog/office-refurbishment-newcastle-stay-open'],
      ['Fitout variations: track cost, scope and decisions', '/blog/office-fitout-variations-newcastle'],
      ['Handover: organise evidence and outstanding actions', '/blog/office-fitout-handover-checklist'],
    ],
    download: ['/guides/office-fitout-variations-newcastle-checklist.pdf', 'Download the variation checklist (PDF)'],
    action: 'Discuss my delivery questions',
  },
] as const

export default function FitoutPlanningJourney() {
  return <section className={styles.section} aria-labelledby="newcastle-planning-pack">
    <div className={styles.inner}>
      <p className={styles.label}>Newcastle office fitout planning resources</p>
      <h2 id="newcastle-planning-pack">Start with the decision in front of you.</h2>
      <p className={styles.intro}>Choose your project stage for practical guides and free checklists. YOS provides client-side coordination under an agreed engagement; appointed contractors and specialist advisers retain their respective responsibilities.</p>
      <nav aria-label="FitOut planning stages" className={styles.stageNav}>{STAGES.map(stage => <a key={stage.id} href={`#${stage.id}`}>{stage.title}</a>)}</nav>
      <div className={styles.grid}>{STAGES.map(stage => <article key={stage.id} id={stage.id} className={styles.stage} aria-labelledby={`${stage.id}-heading`}>
        <p className={styles.number}>Stage {stage.number}</p>
        <h3 id={`${stage.id}-heading`}>{stage.title}</h3>
        <p className={styles.question}>{stage.question}</p>
        <p>{stage.description}</p>
        <ul>{stage.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
        <div className={styles.next}><a className={styles.download} href={stage.download[0]}>{stage.download[1]}</a><Link className={styles.action} href="#fitout-enquiry">{stage.action}</Link></div>
      </article>)}</div>
      <aside className={styles.tools} aria-label="Whole-project planning tools">
        <h3>Keep the whole project in view.</h3>
        <p>Use the <Link href="/resources/fitout-estimator">fitout cost calculator</Link> as an indicative starting point, then develop the design, services scope and budget together. Furniture, mechanical work and other scope differences can substantially change a square-metre comparison.</p>
        <div className={styles.toolLinks}><Link href="/blog/office-fitout-newcastle-planning-checklist">Read the Newcastle planning overview</Link><a href="/guides/fitout-project-checklist.pdf">Download the four-page planning pack (PDF)</a><Link href="/blog#office-fitout-newcastle">Browse all office fitout guides</Link></div>
        <p className={styles.note}>Downloads are free, with no email required. They are planning prompts for your appointed team, rather than an approval assessment or construction quote.</p>
      </aside>
    </div>
  </section>
}
