"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { EOF_PRODUCTS, getCategoryColor, type EOFProduct } from "@/lib/space-planner/store";

// Keep Product interface for backward compat
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  width: number;
  depth: number;
}

// Convert EOF_PRODUCTS → Product format for consumers that still use MOCK_PRODUCTS
export const MOCK_PRODUCTS: Product[] = EOF_PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: 0,
  image: "",
  width: p.width,
  depth: p.depth,
}));

const CATEGORIES = ["All", "Seating", "Desks", "Storage", "Meeting", "Breakout", "Screens"];

// pixels per cm — matches the store/canvas convention
const PIXELS_PER_CM = 0.5;

// Category icons (text-based, no emoji)
const CATEGORY_ICON: Record<string, string> = {
  Seating: "CH",
  Desks: "DK",
  Storage: "ST",
  Meeting: "MT",
  Breakout: "BR",
  Screens: "SC",
};

function ProductThumbnail({ product }: { product: EOFProduct }) {
  const bg = getCategoryColor(product.category);
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 6,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#FFFFFF",
        fontSize: "0.65rem",
        fontWeight: 700,
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {CATEGORY_ICON[product.category] ?? product.name.substring(0, 2).toUpperCase()}
    </div>
  );
}

interface ProductSidebarProps {
  products?: Product[];
}

export default function ProductSidebar({ products: _propProducts }: ProductSidebarProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = EOF_PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, product: EOFProduct) => {
    const data = {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: 0,
      width: product.width * PIXELS_PER_CM,
      depth: product.depth * PIXELS_PER_CM,
      color: getCategoryColor(product.category),
    };
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "#FAFAFA",
        borderRight: "1px solid #E5E5E5",
      }}
    >
      {/* Header */}
      <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid #E5E5E5" }}>
        <h2
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#1A1A1A",
            fontFamily: "Montserrat, sans-serif",
            marginBottom: "0.75rem",
          }}
        >
          Furniture Catalogue
        </h2>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "0.65rem" }}>
          <Search
            size={13}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9B9B9B" }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              fontSize: "0.78rem",
              padding: "0.45rem 0.5rem 0.45rem 2rem",
              borderRadius: 8,
              border: "1px solid #E5E5E5",
              outline: "none",
              fontFamily: "Montserrat, sans-serif",
              color: "#1A1A1A",
              background: "#FFFFFF",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Category pills — two rows of 4 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontSize: "0.68rem",
                padding: "0.22rem 0.55rem",
                borderRadius: 6,
                border: `1px solid ${activeCategory === cat ? "#00B5A5" : "#E5E5E5"}`,
                background: activeCategory === cat ? "#00B5A5" : "#FFFFFF",
                color: activeCategory === cat ? "#FFFFFF" : "#3D3D3D",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: activeCategory === cat ? 700 : 400,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Drag hint */}
      <div
        style={{
          padding: "0.4rem 1rem",
          fontSize: "0.68rem",
          color: "#9B9B9B",
          fontFamily: "Montserrat, sans-serif",
          borderBottom: "1px solid #E5E5E5",
          background: "#F2F2F2",
        }}
      >
        Drag items onto the canvas
      </div>

      {/* Product list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.75rem", display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.length === 0 && (
          <p style={{ fontSize: "0.78rem", color: "#9B9B9B", fontFamily: "Montserrat, sans-serif", textAlign: "center", paddingTop: "2rem" }}>
            No products found
          </p>
        )}
        {filtered.map((product) => (
          <div
            key={product.id}
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0.5rem 0.6rem",
              borderRadius: 8,
              background: "#FFFFFF",
              border: "1px solid #E5E5E5",
              cursor: "grab",
              userSelect: "none",
              transition: "box-shadow 0.1s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
          >
            <ProductThumbnail product={product} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1A1A1A", fontFamily: "Montserrat, sans-serif", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {product.name}
              </p>
              <p style={{ fontSize: "0.65rem", color: "#9B9B9B", fontFamily: "Montserrat, sans-serif", margin: 0 }}>
                {product.width} × {product.depth}cm
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Keyboard shortcuts hint */}
      <div style={{ padding: "0.5rem 0.75rem", borderTop: "1px solid #E5E5E5", background: "#F8F8F8" }}>
        <p style={{ fontSize: "0.65rem", color: "#9B9B9B", fontFamily: "Montserrat, sans-serif", margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: "#6B6B6B" }}>R</strong> rotate · <strong style={{ color: "#6B6B6B" }}>D</strong> duplicate<br />
          <strong style={{ color: "#6B6B6B" }}>Del</strong> delete · <strong style={{ color: "#6B6B6B" }}>Ctrl+Z</strong> undo
        </p>
      </div>
    </div>
  );
}
