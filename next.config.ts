import type { NextConfig } from "next";

/**
 * Force Webpack instead of Turbopack for build.
 * Turbopack (next@16) has a bug where middleware.js.nft.json is not generated,
 * causing Vercel deploy --prebuilt to fail. Webpack build path works correctly.
 */
process.env.TURBOPACK = '0';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...[
        ['/sitemap_index.xml', '/sitemap.xml'],
        ['/commercial-cleaning', '/cleaning'],
        ['/tennant-representation', '/tenant-rep'],
        ['/tenant-representation', '/tenant-rep'],
        ['/ContactPage', '/contact'],
        ['/Services', '/#services'],
        ['/category/commercial-real-estate', '/blog'],
        ['/commercial-lease-renewal-newcastle-timeline', '/blog/commercial-lease-renewal-newcastle-timeline'],
        ['/off-market-commercial-property-deserves-look', '/blog/off-market-commercial-property-newcastle'],
        ['/avoiding-common-pitfalls-in-commercial-lease-negotiations', '/blog/commercial-lease-negotiation-tips-australia'],
        ['/top-5-risks-in-commercial-property-investment-and-how-to-mitigate-them', '/blog/commercial-property-due-diligence-newcastle'],
        ['/eof-group', '/about'],
        ['/eof-group/furniture', '/furniture'],
        ['/eof-group/tenant-representation', '/tenant-rep'],
        ['/eof-group/lease-review', '/lease-health-check'],
        ['/lease-review', '/lease-health-check'],
        ['/leaseintel', '/lease-health-check'],
        ['/eof-group/newcastle', '/newcastle-commercial-property'],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'yourofficespace.au' }],
        destination: 'https://www.yourofficespace.au/:path*',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...(process.env.VERCEL_ENV === "preview" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // XSS protection (legacy browsers)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Referrer policy — don't leak full URL to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy — disable unnecessary browser features
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // HSTS
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // CSP — prevent XSS, control resource origins
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js-ap1.hs-scripts.com https://js-ap1.hs-analytics.net https://js-ap1.hscollectedforms.net https://js-ap1.usemessages.com https://js-ap1.hs-banner.com https://js.hs-scripts.com https://js.hscollectedforms.net https://www.virustotal.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.virustotal.com https://formsubmit.co https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net; frame-src 'none'; object-src 'none'; base-uri 'self';" },
        ],
      },
    ]
  },
};

export default nextConfig;
