import Link from 'next/link'
import type { ReactNode } from 'react'
import { COMPANY_PURPOSE as purpose } from '@/lib/company-purpose'
import styles from './CompanyPurpose.module.css'

export default function CompanyPurpose({ compact = false, introduction, children }: { compact?: boolean; introduction?: string; children?: ReactNode }) {
  const prefix = compact ? 'home-purpose' : 'company-purpose'
  return <section id={compact ? undefined : 'purpose'} className={`${styles.section} ${compact ? styles.compact : ''}`} aria-labelledby={`${prefix}-heading`}>
    <div className={styles.inner}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>What drives us</p>
        <h2 id={`${prefix}-heading`}>{purpose.tagline}</h2>
        {introduction && <p className={styles.introduction}>{introduction}</p>}
      </header>
      <div className={styles.columns}>
        <div><h3>Our mission</h3><p>{purpose.mission}</p>{!compact && <p className={styles.detail}>{purpose.missionDetail}</p>}</div>
        <div><h3>Our vision</h3><p>{purpose.vision}</p>{!compact && <p className={styles.detail}>{purpose.visionDetail}</p>}</div>
      </div>
      {!compact && children && <div className={styles.context}>{children}</div>}
      {compact ? <>
        <p className={styles.compactValuesTitle}>Our values</p>
        <ul className={styles.valueNames} aria-label="Our six values">{purpose.values.map(value => <li key={value.name}>{value.name}</li>)}</ul>
        <Link className={styles.link} href="/about#values">Our values in practice <span aria-hidden="true">→</span></Link>
      </> : <div id="values" tabIndex={-1} role="region" aria-labelledby="company-values-heading" className={styles.values}>
        <h2 id="company-values-heading">How we do business.</h2>
        <p className={styles.valuesIntro}>Six values guide how we work, who we work with and the decisions we make.</p>
        <div className={styles.valueGrid}>{purpose.values.map((value, index) => <article key={value.name}>
          <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h3>{value.name}</h3><p>{value.description}</p>
        </article>)}</div>
      </div>}
    </div>
  </section>
}
