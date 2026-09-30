import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import ScrollManager from "@/components/ScrollManager";
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
  title: "Your Office Space | Find It, Fit It Out and Furnish It",
  description: "Lease or buy the right commercial space, then coordinate the FitOut, furniture and ongoing workplace services with one team on your side.",
  keywords: "tenant representation NSW, commercial FitOut Australia, office furniture Australia, commercial cleaning Newcastle, workplace project management",
  metadataBase: new URL("https://www.yourofficespace.au"),
  alternates: {
    canonical: "https://www.yourofficespace.au",
  },
  openGraph: {
    title: "Your Office Space | One Team for Your Commercial Space",
    description: "Find it. Fit it out. Furnish it. Look after it. Commercial space support from one accountable team.",
    url: "https://www.yourofficespace.au",
    siteName: "Your Office Space",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/og/og-default.png", width: 1200, height: 630, alt: "Your Office Space" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Office Space | One Team for Your Commercial Space",
    description: "Find it. Fit it out. Furnish it. Look after it. Commercial space support from one accountable team.",
    images: ["/og/og-default.png"],
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
      <body><ScrollManager />{children}<AnalyticsConsent /></body>
    </html>
  );
}
