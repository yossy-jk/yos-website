import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Office Space | Commercial Property Advisory Newcastle",
  description: "Newcastle's commercial tenant rep, buyers agency, furniture and cleaning — one team, one call. Lease, fitout, furniture, cleaning — handled.",
  keywords: "commercial tenant rep Newcastle, commercial buyers agent Newcastle, office furniture Newcastle, commercial cleaning Newcastle",
  openGraph: {
    title: "Your Office Space | Commercial Property Advisory Newcastle",
    description: "Newcastle's commercial tenant rep, buyers agency, furniture and cleaning — one team, one call.",
    url: "https://yourofficespace.au",
    siteName: "Your Office Space",
    locale: "en_AU",
    type: "website",
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
      <body>{children}</body>
    </html>
  );
}
