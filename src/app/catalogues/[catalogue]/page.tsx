import { withPageSeo } from "@/lib/page-seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CatalogueViewer from "@/components/CatalogueViewer";
import { CATALOGUES } from "@/lib/catalogues";
import Link from "next/link";
export function generateStaticParams() {
  return CATALOGUES.map((item) => ({ catalogue: item.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ catalogue: string }>;
}): Promise<Metadata> {
  const { catalogue } = await params;
  const item = CATALOGUES.find((c) => c.id === catalogue);
  return withPageSeo({
    title: `${item?.title || "Catalogue"} | Your Office Space`,
    description: item?.description,
    alternates: {
      canonical: `https://www.yourofficespace.au/catalogues/${catalogue}`,
    },
    openGraph: {
      images: [
        {
          url: `/catalogues/${catalogue}/page-01.jpg`,
          alt: `${item?.title || "Catalogue"} cover`,
        },
      ],
    },
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ catalogue: string }>;
}) {
  const { catalogue } = await params;
  const item = CATALOGUES.find((c) => c.id === catalogue);
  if (!item) notFound();
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1} className="catalogue-reader">
        <div className="site-container">
          <Link href="/furniture">← Office furniture</Link>
          <h1>{item.title}</h1>
          <p>
            {item.description} Browse page by page or download the original PDF.
          </p>
          <section className="my-8 max-w-4xl" aria-labelledby="catalogue-guidance-heading">
            <h2 id="catalogue-guidance-heading" className="text-2xl font-bold mb-4">{catalogue === 'acoustics' ? 'Choose acoustics for the problem you need to solve.' : 'Turn your furniture shortlist into a clear brief.'}</h2>
            <p className="text-charcoal leading-relaxed mb-4">{catalogue === 'acoustics'
              ? 'Note where speech, meetings or focused work are being disrupted. Share the room dimensions, existing surfaces and how the space is used. Product suitability and any acoustic performance requirements need assessment against the actual room; a catalogue alone cannot establish the result.'
              : 'Record product names or page numbers, quantities, dimensions and preferred finishes. Include any existing furniture to retain and check circulation, power and daily use before finalising the selection.'}</p>
            <p className="text-charcoal leading-relaxed mb-5">Confirm availability, delivery address, building access, installation scope and target date in the project quote. Catalogue browsing does not confirm stock, final pricing or delivery timing.</p>
            <div className="flex flex-wrap gap-6"><Link href="/resources/furniture-quote#furniture-quote-form" className="text-action-teal font-semibold underline underline-offset-4">Request a furniture project quote</Link><Link href="/contact?service=furniture#contact-enquiry" className="text-action-teal font-semibold underline underline-offset-4">Book a Project Discovery Session</Link><a href="https://www.yourofficefurniture.com.au" className="text-action-teal font-semibold underline underline-offset-4">Shop at Your Office Furniture</a></div>
          </section>
          <CatalogueViewer catalogue={item} />
        </div>
      </main>
      <Footer />
    </>
  );
}
