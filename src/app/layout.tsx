import PublicAssistant from '@/components/PublicAssistant'
import './tenant-rep/tenant-journey.css'
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import ServiceChecklistPopup from '@/components/ServiceChecklistPopup'
import ScrollManager from "@/components/ScrollManager";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 } },
  verification: {
    google: "y_reMqD1jgJLEUomnBsCqbMF-ZrEZs0dcbQiMlpSZDE",
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=yos-oct06', sizes: 'any' },
      { url: '/favicon-32.png?v=yos-oct06', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png?v=yos-oct06', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png?v=yos-oct06',
  },
  title: "Your Office Space | Find It, Fit It Out and Furnish It",
  description: "Lease or buy the right commercial space, then coordinate the FitOut, furniture and ongoing workplace services with one team on your side.",
  metadataBase: new URL("https://www.yourofficespace.au"),
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
        <script id="yos-gtm-head" dangerouslySetInnerHTML={{ __html: `
if (window.location.pathname === '/' && ['www.yourofficespace.au','yourofficespace.au'].includes(window.location.hostname)) {
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
try { if(localStorage.getItem('yos_analytics_consent')==='accepted') gtag('consent','update',{analytics_storage:'granted'}); } catch(e) {}
// Google Tag Manager
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TQQ9MD23');
// End Google Tag Manager
}` }} />
      </head>
      <body><ScrollManager />{children}<AnalyticsConsent /><PublicAssistant /><ServiceChecklistPopup enabled={process.env.SERVICE_CHECKLISTS_ENABLED === 'true'} /></body>
    </html>
  );
}
