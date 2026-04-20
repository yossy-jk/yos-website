import type { Metadata } from "next";
import FloatingCTA from "@/components/FloatingCTA";
import ExitPopup from "@/components/ExitPopup";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Office Space | Commercial Property Advisory Australia",
  description: "Tenant-side commercial property advisory across Australia. Tenant rep, buyers agency, office furniture, fitout and cleaning. NSW focus.",
  keywords: "commercial tenant rep Australia, commercial buyers agent, office furniture fitout, commercial cleaning NSW, tenant representation Sydney Newcastle",
  metadataBase: new URL("https://yourofficespace.au"),
  alternates: {
    canonical: "https://yourofficespace.au",
  },
  openGraph: {
    title: "Your Office Space | Commercial Property Advisory Australia",
    description: "Tenant-side commercial property advisory across Australia. Tenant rep, buyers agency, office furniture, fitout and cleaning.",
    url: "https://yourofficespace.au",
    siteName: "Your Office Space",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Your Office Space" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Office Space | Commercial Property Advisory Australia",
    description: "Tenant-side commercial property advisory across Australia. Tenant rep, buyers agency, furniture, fitout and cleaning.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* HubSpot Tracking Code */}
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js-ap1.hs-scripts.com/442709765.js"
        />
      </head>
      <body>{children}<FloatingCTA /><ExitPopup /></body>
    </html>
  );
}
