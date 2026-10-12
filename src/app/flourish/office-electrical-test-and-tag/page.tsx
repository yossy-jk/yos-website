import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FlourishServicePage from '@/components/FlourishServicePage'
import { FLOURISH_SERVICES } from '@/lib/flourish-content'
import { withPageSeo } from '@/lib/page-seo'

const service = FLOURISH_SERVICES[1]
export const metadata = withPageSeo({
  title: service.metaTitle,
  description: service.description,
  alternates: { canonical: 'https://www.yourofficespace.au/flourish/office-electrical-test-and-tag' },
  openGraph: { images: [{ url: service.image, alt: service.imageAlt }] },
})

export default function Page() {
  return <><Nav /><main id="main-content" tabIndex={-1} className="flourish-page"><FlourishServicePage service={service} /></main><Footer /></>
}
