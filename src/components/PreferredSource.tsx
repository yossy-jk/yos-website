import styles from './PreferredSource.module.css'

export default function PreferredSource() {
  return <aside className={styles.panel} aria-labelledby="preferred-source-heading">
    <h2 id="preferred-source-heading">Find more YOS guides on Google.</h2>
    <p>If our workplace guides help, you can choose Your Office Space as a preferred source in Google Search.</p>
    <a className={styles.button} href="https://www.google.com/preferences/source?q=yourofficespace.au" target="_blank" rel="noopener noreferrer" aria-describedby="preferred-source-note">Add YOS as a Preferred Source<span className="sr-only"> (opens in a new tab)</span></a>
    <p id="preferred-source-note" className={styles.note}>Opens Google’s source preferences. Availability is controlled by Google; if YOS isn’t listed, it isn’t available to select yet.</p>
  </aside>
}
