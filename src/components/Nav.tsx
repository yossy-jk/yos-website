"use client";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(26,26,26,0.97)", backdropFilter: "blur(8px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)"
    }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto", padding: "0 5%",
        display: "flex", justifyContent: "space-between", alignItems: "center", height: "72px"
      }}>
        <Link href="/" style={{
          color: "#ffffff", fontWeight: 700, fontSize: "18px",
          textDecoration: "none", letterSpacing: "0.04em"
        }}>
          YOUR OFFICE SPACE
        </Link>

        {/* Desktop links */}
        <div className="desktop-nav" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {[
            { label: "Tenant Rep", href: "/tenant-rep" },
            { label: "Buyers Agency", href: "/buyers-agency" },
            { label: "Furniture", href: "/furniture" },
            { label: "Cleaning", href: "/cleaning" },
            { label: "Resources", href: "/resources" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              color: "#9B9B9B", fontWeight: 400, fontSize: "14px",
              textDecoration: "none", transition: "color 0.2s"
            }}>
              {link.label}
            </Link>
          ))}
          <a
            href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354"
            style={{
              background: "#00B5A5", color: "#ffffff", fontWeight: 600,
              fontSize: "14px", padding: "10px 20px", borderRadius: "4px",
              textDecoration: "none", letterSpacing: "0.04em"
            }}
          >
            Book a Call
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "none", background: "none", border: "none",
            color: "#ffffff", cursor: "pointer", fontSize: "24px"
          }}
          className="mobile-menu-btn"
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "#1A1A1A", padding: "24px 5%",
          borderTop: "1px solid rgba(255,255,255,0.06)"
        }}>
          {[
            { label: "Tenant Rep", href: "/tenant-rep" },
            { label: "Buyers Agency", href: "/buyers-agency" },
            { label: "Furniture", href: "/furniture" },
            { label: "Cleaning", href: "/cleaning" },
            { label: "Resources", href: "/resources" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{
              display: "block", color: "#9B9B9B", fontWeight: 400,
              fontSize: "16px", textDecoration: "none", padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)"
            }} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <a
            href="https://meetings-ap1.hubspot.com/projects1?uuid=05c79c5c-b183-4c09-9c74-9278a6dde354"
            style={{
              display: "inline-block", marginTop: "16px",
              background: "#00B5A5", color: "#ffffff", fontWeight: 600,
              fontSize: "14px", padding: "12px 24px", borderRadius: "4px", textDecoration: "none"
            }}
          >
            Book a Call
          </a>
        </div>
      )}
    </nav>
  );
}
