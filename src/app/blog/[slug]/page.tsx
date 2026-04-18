import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { getAllPosts, getPostBySlug, DIVISION_LABELS, DIVISION_COLORS } from '@/lib/blog'
import { HUBSPOT } from '@/lib/constants'
import type { Division } from '@/lib/blog'

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.metaTitle || `${post.title} | Your Office Space`,
    description: post.metaDescription || post.excerpt
  }
}

function renderBody(body: string) {
  // Convert markdown-style content to JSX-friendly HTML segments
  const lines = body.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-near-black font-bold text-2xl lg:text-3xl mt-12 mb-4">{line.replace('## ', '')}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-near-black font-bold text-xl mt-8 mb-3">{line.replace('### ', '')}</h3>)
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={key++} className="text-near-black font-semibold text-base mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>)
    } else if (line.startsWith('- ')) {
      elements.push(
        <div key={key++} className="flex gap-3 items-start mb-2">
          <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-2.5" />
          <p className="text-charcoal font-light text-base leading-relaxed">{line.replace('- ', '')}</p>
        </div>
      )
    } else if (line.startsWith('[') && line.includes('](')) {
      const match = line.match(/\[(.+?)\]\((.+?)\)/)
      if (match) {
        elements.push(
          <Link key={key++} href={match[2]} className="inline-block text-teal font-semibold no-underline hover:text-dark-teal transition-colors mt-2">
            {match[1]}
          </Link>
        )
      }
    } else if (line.includes('|') && line.trim().startsWith('|')) {
      // Simple table row — skip for now, rendered as text
      elements.push(<p key={key++} className="text-charcoal font-light text-sm leading-relaxed font-mono bg-warm-grey px-3 py-1 rounded my-1">{line}</p>)
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />)
    } else {
      // Inline bold handling
      const parts = line.split(/\*\*(.+?)\*\*/)
      if (parts.length > 1) {
        elements.push(
          <p key={key++} className="text-charcoal font-light text-base lg:text-lg leading-relaxed mb-1">
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="text-near-black font-semibold">{part}</strong> : part
            )}
          </p>
        )
      } else {
        elements.push(<p key={key++} className="text-charcoal font-light text-base lg:text-lg leading-relaxed mb-1">{line}</p>)
      }
    }
  }
  return elements
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <Nav />

      <section className="bg-near-black pt-[72px] pb-16">
        <div className="max-w-3xl mx-auto px-[5%] pt-16">
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIVISION_COLORS[post.division as Division]}`}>
              {DIVISION_LABELS[post.division as Division]}
            </span>
            <span className="text-white/40 text-xs">
              {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-white/40 text-xs">by {post.author}</span>
          </div>
          <h1 className="text-white font-bold text-4xl lg:text-5xl leading-tight">{post.title}</h1>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-[5%]">
          <p className="text-charcoal font-light text-xl leading-relaxed mb-12 pb-10 border-b border-gray-100">{post.excerpt}</p>
          <div className="prose-custom">
            {renderBody(post.body)}
          </div>

          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-warm-grey text-charcoal text-xs px-3 py-1.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          <div className="mt-12 bg-warm-grey rounded-sm p-10">
            <p className="text-near-black font-bold text-xl mb-3">Want to talk about your situation?</p>
            <p className="text-charcoal font-light text-base mb-6">
              First conversation is always free. No pitch — just an honest assessment of what you&apos;re dealing with and whether we can help.
            </p>
            <Button href={HUBSPOT.bookingUrl} variant="primary" external>Book a Clarity Call</Button>
          </div>

          <div className="mt-10">
            <Link href="/blog" className="text-teal font-semibold text-sm no-underline hover:text-dark-teal transition-colors">
              ← All articles
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
