import Link from 'next/link'
import { getPostBySlug } from '@/lib/blog'

export default function ServiceArticle({ slug }: { slug: string }) {
  const post = getPostBySlug(slug)
  if (!post) return null
  return (
    <section className="bg-warm-grey py-16">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <p className="text-action-teal text-xs font-bold uppercase tracking-widest mb-4">Practical workplace guide</p>
        <h2 className="text-near-black text-2xl md:text-3xl font-bold max-w-3xl mb-4">{post.title}</h2>
        <p className="text-readable-grey leading-relaxed max-w-3xl mb-6">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="text-action-teal font-semibold underline underline-offset-4 hover:text-dark-teal">Read the guide</Link>
      </div>
    </section>
  )
}
