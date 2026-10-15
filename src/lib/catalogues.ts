export const CATALOGUES = [
  {
    id: "furniture",
    title: "Furniture Catalogue 2026",
    shortTitle: "Furniture",
    pages: 73,
    size: "7.8 MB",
    pdf: "/catalogues/your-office-furniture-2026.pdf",
    description:
      "Explore workstations, seating, storage and accessories for your workplace.",
  },
  {
    id: "acoustics",
    title: "Acoustic Catalogue 2026",
    shortTitle: "Acoustics",
    pages: 19,
    size: "5.9 MB",
    pdf: "/catalogues/your-office-acoustics-2026.pdf",
    description:
      "Explore acoustic solutions and the 2026 Habitat collection for your workplace.",
  },
] as const;
export type Catalogue = (typeof CATALOGUES)[number];
export const cataloguePageImage = (id: Catalogue["id"], page: number) =>
  `/catalogues/${id}/page-${String(page).padStart(2, "0")}.jpg`;
export const CATALOGUE_OFFER_TERMS =
  "5% off products in your first online order at Your Office Furniture. One use per customer. Excludes shipping. Cannot be combined with other discounts. Enter your email at checkout so first-order eligibility can be checked.";
