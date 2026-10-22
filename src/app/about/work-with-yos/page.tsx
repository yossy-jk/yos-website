import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { withPageSeo } from '@/lib/page-seo'
import { COMPANY_PURPOSE } from '@/lib/company-purpose'
import InterestForm from './InterestForm'
import styles from './page.module.css'

export const metadata = withPageSeo({
  title: 'Work or Partner with YOS | Cleaners, Installers & Tenant Reps',
  description: 'Join the YOS network. We actively welcome interest from contract cleaners, installers and tenant representatives. Tell us about your skills and where you work.',
  alternates: { canonical: 'https://www.yourofficespace.au/about/work-with-yos' },
})

const roles = [
  { number: '01', title: 'Contract cleaners', detail: 'Take pride in the spaces people use every day.', body: 'We’re looking for reliable cleaners and cleaning businesses who care about presentation, consistency and looking after client spaces. Tell us your service areas, experience and availability.', qualities: 'Care with access and security, attention to detail, and clear communication with the team.', link: '/cleaning', label: 'Explore our cleaning service' },
  { number: '02', title: 'Installers', detail: 'Bring the plan together on site.', body: 'We welcome furniture installers and installation teams who work carefully, respect occupied workplaces and leave a tidy handover. Share the types of installations you handle and where you can work.', qualities: 'Safe working practices, care for products and premises, and the confidence to flag a site issue early.', link: '/furniture', label: 'Explore our furniture service' },
  { number: '03', title: 'Tenant representatives', detail: 'Stay firmly on the occupier’s side.', body: 'We want to hear from people with commercial property and leasing experience who put tenant needs first. Tell us your market knowledge, relevant licences or qualifications and the kind of role you’re looking for.', qualities: 'Good listening, sound preparation, clear advice and respect for the responsibilities of the role.', link: '/tenant-rep', label: 'Explore tenant representation' },
]

export default function WorkWithYosPage() {
  return <><Nav /><main id="main-content" tabIndex={-1} className={styles.page}>
    <section className={styles.hero}><div className={styles.wrap}>
      <p className={styles.eyebrow}>Good people. Shared standards.</p>
      <h1>Work or Partner<br /><span>with YOS.</span></h1>
      <p className={styles.lead}>We’re always looking for good people who care about doing the job well.</p>
      <p className={styles.heroDetail}>Contract cleaners, installers and tenant representatives: help us find, create and care for workplaces that work. Bring your skills, your pride in your work and your way of making things better.</p>
      <div className={styles.actions}><a className={styles.primary} href="#register-interest">Register your interest <span aria-hidden="true">→</span></a><a className={styles.secondary} href="#opportunities">Find your fit</a></div>
      <p className={styles.heroNote}>Actively welcoming expressions of interest for employment, contracting and partnership conversations.</p>
    </div></section>
    <section className={styles.section} aria-labelledby="why-yos"><div className={styles.wrap}>
      <p className={styles.eyebrow}>Why YOS</p><h2 id="why-yos">Good work starts with<br />how we treat each other.</h2>
      <p className={styles.intro}>Our mission is simple: {COMPANY_PURPOSE.mission.charAt(0).toLowerCase() + COMPANY_PURPOSE.mission.slice(1)} Joining YOS means bringing that purpose to life with people who value practical thinking and follow-through.</p>
      <div className={styles.values}>
        <article><h3>Clear conversations.</h3><p>We say it straight, listen to feedback and make expectations visible. Ask questions, flag problems early and help the team find the next step.</p></article>
        <article><h3>Respect at every level.</h3><p>Our values call for fairness to clients, agents, suppliers, team members, contractors and partners. Honour agreements, pay correctly and on time, and expect good work in return.</p></article>
        <article><h3>Pride in the outcome.</h3><p>From a careful clean to a well-finished installation or a considered property brief, the details matter. Do the basics well and earn the next recommendation together.</p></article>
      </div>
      <Link className={styles.textLink} href="/about#values">Meet our team and see our values <span aria-hidden="true">→</span></Link>
    </div></section>
    <section id="opportunities" className={`${styles.section} ${styles.tint}`} aria-labelledby="opportunities-heading"><div className={styles.wrap}>
      <p className={styles.eyebrow}>Where you could fit</p><h2 id="opportunities-heading">Three ways to make<br />a real contribution.</h2>
      <div className={styles.roles}>{roles.map(role => <article key={role.number}><span className={styles.number} aria-hidden="true">{role.number}</span><h3>{role.title}</h3><p className={styles.roleDetail}>{role.detail}</p><p>{role.body}</p><p><strong>What matters:</strong> {role.qualities}</p><Link className={styles.textLink} href={role.link}>{role.label} <span aria-hidden="true">→</span></Link></article>)}</div>
      <p className={styles.note}>Tell us where you’re based and where you can work. We’ll discuss the right fit, scope, required credentials and working arrangements with you. Registering interest isn’t a job offer or a promise of work; availability and terms are agreed individually.</p>
    </div></section>
    <section id="register-interest" tabIndex={-1} className={styles.section} aria-labelledby="interest-heading"><div className={`${styles.wrap} ${styles.register}`}>
      <div><p className={styles.eyebrow}>Put your hand up</p><h2 id="interest-heading">Let’s start<br />a conversation.</h2><p className={styles.intro}>You don’t need a polished pitch. A few details about you, what you do and where you’d like to work will help us get started.</p>
        <ol className={styles.steps}><li><strong>Tell us about yourself.</strong><span>Choose your area of interest and share the essentials.</span></li><li><strong>We review the fit.</strong><span>The relevant YOS team looks at your experience, location and availability.</span></li><li><strong>Talk through next steps.</strong><span>If there’s a suitable opportunity, we discuss expectations and working arrangements with you.</span></li></ol>
        <p className={styles.note}>For installation projects, YOS coordinates workplace services and client-side project management. Building work remains with the appointed builder and relevant trades.</p>
      </div><InterestForm />
    </div></section>
  </main><Footer /></>
}
