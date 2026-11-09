import Link from 'next/link'
import { BLOG_CLUSTERS, getBlogCluster, type BlogClusterId } from '@/lib/blog-clusters'
import { getPublicPosts } from '@/lib/blog'
import styles from './BlogTopicGuides.module.css'

export default function BlogTopicGuides({ clusterId }: { clusterId?: BlogClusterId }) {
  const clusters = clusterId ? BLOG_CLUSTERS.filter(cluster => cluster.id === clusterId) : BLOG_CLUSTERS
  const posts = new Map(getPublicPosts().map(post => [post.slug, post]))
  return <section className={styles.section} aria-label={clusterId ? `${clusters[0].shortLabel} planning guides` : 'Newcastle workplace guides by topic'}>
    <div className={styles.inner}>
      <h2>{clusterId ? `${clusters[0].shortLabel} planning guides` : 'Newcastle workplace guides by topic'}</h2>
      {!clusterId && <p className={styles.intro}>Start with the decision your business needs to make. Each collection connects practical guides with the relevant YOS service.</p>}
      <div className={clusterId ? undefined : styles.grid}>
        {clusters.map(cluster => {
          const articles = cluster.slugs.flatMap(slug => posts.get(slug) ? [posts.get(slug)!] : [])
          const first = articles.slice(0, 4), remaining = articles.slice(4)
          const links = (items: typeof articles) => <ul>{items.map(post => <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></li>)}</ul>
          return <div key={cluster.id} id={clusterId ? undefined : cluster.id} className={styles.card}>
            <h3>{cluster.label}</h3>
            <p>{cluster.description}</p>
            {!clusterId && <Link href={cluster.serviceHref} className={styles.service}>{cluster.serviceLabel}</Link>}
            {links(first)}
            {remaining.length > 0 && <details><summary>More {cluster.shortLabel.toLowerCase()} guides ({remaining.length})</summary>{links(remaining)}</details>}
            {clusterId && <Link href={`/blog#${cluster.id}`} className={styles.directoryLink}>Browse the {cluster.shortLabel.toLowerCase()} collection</Link>}
          </div>
        })}
      </div>
    </div>
  </section>
}

export function ArticleTopicLink({ slug }: { slug: string }) {
  const cluster = getBlogCluster(slug)
  if (!cluster) return null
  return <p className={styles.topicLink}>Continue planning with our <Link href={`/blog#${cluster.id}`}>{cluster.label} guides</Link>, or <Link href={cluster.serviceHref}>{cluster.serviceLabel.toLowerCase()}</Link>.</p>
}
