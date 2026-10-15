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
          <CatalogueViewer catalogue={item} />
        </div>
      </main>
      <Footer />
    </>
  );
}
