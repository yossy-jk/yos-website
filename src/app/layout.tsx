import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["600"],
});

export const metadata: Metadata = {
  verification: {
    google: "y_reMqD1jgJLEUomnBsCqbMF-ZrEZs0dcbQiMlpSZDE",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', sizes: '32x32' },
      { url: '/favicon-192.png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
  },
  title: "Your Office Space | Commercial Property Advisory Australia",
  description: "Newcastle-based, tenant-side commercial property advisory across Australia. Tenant representation, commercial fit out and project management, office and commercial furniture, and commercial cleaning.",
  keywords: "commercial tenant representation Australia, commercial fit out project management, office commercial furniture, commercial cleaning, Newcastle tenant advisory",
  metadataBase: new URL("https://www.yourofficespace.au"),
  alternates: {
    canonical: "https://www.yourofficespace.au",
  },
  openGraph: {
    title: "Your Office Space | Commercial Property Advisory Australia",
    description: "Your space, sorted. Newcastle-based, tenant-side commercial property advisory across Australia.",
    url: "https://www.yourofficespace.au",
    siteName: "Your Office Space",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Your Office Space" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Office Space | Commercial Property Advisory Australia",
    description: "Your space, sorted. Newcastle-based, tenant-side commercial property advisory across Australia.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`scroll-smooth ${inter.variable} ${fraunces.variable}`}>
      <head>
      </head>
      <body>{children}<AnalyticsConsent /></body>
    </html>
  );
}
