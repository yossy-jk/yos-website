"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getCategoryColor } from "@/lib/space-planner/store";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  width: number;
  depth: number;
}

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Task Chair", category: "Seating", price: 485, image: "/products/task-chair.jpg", width: 60, depth: 60 },
  { id: "2", name: "Executive Chair", category: "Seating", price: 1200, image: "/products/exec-chair.jpg", width: 65, depth: 65 },
  { id: "3", name: "Height Adjust Desk 1600", category: "Desks", price: 1450, image: "/products/sitstand.jpg", width: 160, depth: 80 },
  { id: "4", name: "Workstation 1800", category: "Desks", price: 680, image: "/products/workstation.jpg", width: 180, depth: 80 },
  { id: "5", name: "Meeting Table 2400", category: "Meeting", price: 3200, image: "/products/meeting-table.jpg", width: 240, depth: 100 },
  { id: "6", name: "Meeting Chair", category: "Seating", price: 320, image: "/products/meeting-chair.jpg", width: 55, depth: 55 },
  { id: "7", name: "Mobile Pedestal", category: "Storage", price: 380, image: "/products/pedestal.jpg", width: 40, depth: 50 },
  { id: "8", name: "Lounge Chair", category: "Breakout", price: 890, image: "/products/lounge-chair.jpg", width: 75, depth: 75 },
  { id: "9", name: "Lounge Sofa 2-Seat", category: "Breakout", price: 2100, image: "/products/sofa.jpg", width: 150, depth: 80 },
  { id: "10", name: "Acoustic Screen", category: "Screens", price: 580, image: "/products/screen.jpg", width: 120, depth: 5 },
];

const CATEGORIES = ["All", "Seating", "Desks", "Storage", "Meeting", "Breakout", "Screens"];

const PIXELS_PER_CM = 0.5;

interface ProductSidebarProps {
  products?: Product[];
}

export default function ProductSidebar({ products: propProducts = MOCK_PRODUCTS }: ProductSidebarProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>(propProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/space-planner-products")
      .then((r) => r.json())
      .then((data: { products: Product[] }) => {
        if (cancelled) return;
        if (data?.products?.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(propProducts);
        }
      })
      .catch(() => {
        if (!cancelled) setProducts(propProducts);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, product: Product) => {
    const data = {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      width: product.width * PIXELS_PER_CM,
      depth: product.depth * PIXELS_PER_CM,
      color: getCategoryColor(product.category),
    };
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#FAFAFA", borderRight: "1px solid #E5E5E5" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #E5E5E5" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "#1A1A1A", fontFamily: "Montserrat, sans-serif" }}>
          Furniture Catalogue
        </h2>
        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B6B6B" }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs py-2 pl-8 pr-3 rounded-lg border outline-none focus:border-teal"
            style={{
              borderColor: "#E5E5E5",
              fontFamily: "Montserrat, sans-serif",
              color: "#1A1A1A",
              background: "#FFFFFF",
            }}
          />
        </div>

        {/* Category filters - scrollable */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 text-xs px-2 py-1 rounded-lg transition-colors"
              style={{
                fontFamily: "Montserrat, sans-serif",
                background: activeCategory === cat ? "#00B5A5" : "#FFFFFF",
                color: activeCategory === cat ? "#FFFFFF" : "#3D3D3D",
                border: `1px solid ${activeCategory === cat ? "#00B5A5" : "#E5E5E5"}`,
                fontWeight: activeCategory === cat ? "600" : "400",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 py-2 text-xs" style={{ color: "#6B6B6B", fontFamily: "Montserrat, sans-serif", borderBottom: "1px solid #E5E5E5" }}>
        Drag items onto the canvas to place them
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {loading && (
          <p className="text-xs text-center py-8" style={{ color: "#6B6B6B", fontFamily: "Montserrat, sans-serif" }}>
            Loading catalogue...
          </p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-xs text-center py-8" style={{ color: "#6B6B6B", fontFamily: "Montserrat, sans-serif" }}>
            No products found
          </p>
        )}
        {!loading && filtered.map((product) => (
          <div
            key={product.id}
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            className="flex items-center gap-3 p-2 rounded-lg cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-sm"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E5E5",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {/* Thumbnail: real image if available, else colour block */}
            {product.image && !product.image.startsWith('/products/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="flex-shrink-0 w-10 h-10 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const sibling = target.nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg items-center justify-center text-white text-xs font-bold"
              style={{
                background: getCategoryColor(product.category),
                display: product.image && !product.image.startsWith('/products/') ? 'none' : 'flex',
              }}
            >
              {product.name.substring(0, 2).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "#1A1A1A" }}>
                {product.name}
              </p>
              <p className="text-xs" style={{ color: "#6B6B6B" }}>
                {product.category}
              </p>
            </div>

            {/* Price — only show if non-zero */}
            {product.price > 0 && (
              <div className="flex-shrink-0 text-right">
                <p className="text-xs font-bold" style={{ color: "#00B5A5" }}>
                  ${product.price.toLocaleString("en-AU")}
                </p>
                <p className="text-xs" style={{ color: "#9B9B9B" }}>
                  {product.width}x{product.depth}cm
                </p>
              </div>
            )}
            {product.price === 0 && (
              <div className="flex-shrink-0 text-right">
                <p className="text-xs" style={{ color: "#9B9B9B" }}>
                  {product.width}x{product.depth}cm
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
