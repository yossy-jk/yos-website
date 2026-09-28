import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700"],
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
  description: "One tenant-side team for leasing in NSW, commercial fit out and workplace furniture across Australia. Based in Newcastle.",
  keywords: "tenant representation NSW, commercial fit out Australia, office furniture Australia, commercial cleaning Newcastle, workplace project management",
  metadataBase: new URL("https://www.yourofficespace.au"),
  alternates: {
    canonical: "https://www.yourofficespace.au",
  },
  openGraph: {
    title: "Your Office Space | Commercial Property Advisory Australia",
    description: "One team for leasing in NSW, commercial fit out and workplace furniture across Australia. Based in Newcastle.",
    url: "https://www.yourofficespace.au",
    siteName: "Your Office Space",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Your Office Space" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Office Space | Commercial Property Advisory Australia",
    description: "One team for leasing in NSW, commercial fit out and workplace furniture across Australia. Based in Newcastle.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`scroll-smooth ${montserrat.variable}`}>
      <head>
      </head>
      <body>{children}<AnalyticsConsent /></body>
    </html>
  );
}
