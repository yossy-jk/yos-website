export const CATALOGUES = [
  {
    id: "furniture",
    title: "Furniture Planning Catalogue 2026",
    shortTitle: "Furniture",
    pages: 4,
    size: "0.1 MB",
    pdf: "/catalogues/your-office-furniture-2026.pdf",
    description:
      "Explore workstations, seating, storage and accessories for your workplace.",
  },
  {
    id: "acoustics",
    title: "Acoustic Planning Catalogue 2026",
    shortTitle: "Acoustics",
    pages: 3,
    size: "0.1 MB",
    pdf: "/catalogues/your-office-acoustics-2026.pdf",
    description:
      "Explore acoustic screens, room requirements and a clear project brief.",
  },
] as const;
export type Catalogue = (typeof CATALOGUES)[number];
export const cataloguePageImage = (id: Catalogue["id"], page: number) =>
  `/catalogues/${id}/page-${String(page).padStart(2, "0")}.jpg`;
export const CATALOGUE_OFFER_TERMS =
  "5% off products in your first online order at Your Office Furniture. One use per customer. Excludes shipping. Cannot be combined with other discounts. Enter your email at checkout so first-order eligibility can be checked.";
