import Image from "next/image";
import Link from "next/link";
import { CATALOGUES, cataloguePageImage } from "@/lib/catalogues";

export default function CatalogueCards() {
  return (
    <section className="catalogue-section" aria-labelledby="catalogue-heading">
      <div className="site-container">
        <p className="home-eyebrow">Your Office Furniture · 2026 catalogues</p>
        <h2 id="catalogue-heading">
          Find ideas for a workplace that works better.
        </h2>
        <p className="catalogue-section-intro">
          Browse our furniture and acoustic collections, then shop online or
          talk through your project with our Newcastle team.
        </p>
        <div className="catalogue-cards">
          {CATALOGUES.map((item) => (
            <article key={item.id} className="catalogue-card">
              <Link
                href={`/catalogues/${item.id}`}
                className="catalogue-cover-link"
                aria-label={`View ${item.title}`}
              >
                <Image
                  src={cataloguePageImage(item.id, 1)}
                  alt={`${item.title} cover`}
                  width={1600}
                  height={1131}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </Link>
              <div className="catalogue-card-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="catalogue-meta">
                  {item.pages} pages · PDF {item.size}
                </p>
                <Link
                  className="home-button home-button-dark"
                  href={`/catalogues/${item.id}`}
                >
                  View {item.shortTitle.toLowerCase()} catalogue{" "}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
