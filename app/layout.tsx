import type { Metadata, Viewport } from "next";
import { Montserrat } from 'next/font/google';
import localFont from 'next/font/local';
// Vercel Analytics removed for non-Vercel hosting (Hostinger)
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

// Optimized font loading with next/font
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// Commenting out europa font until files are available
// const europa = localFont({
//   src: [
//     {
//       path: '../public/fonts/europa-regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/europa-bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   variable: '--font-europa',
//   display: 'swap',
//   fallback: ['Helvetica', 'Arial', 'sans-serif'],
// });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kinshiplanding.com'),
  title: {
    default: "Kinship Landing | Downtown Colorado Springs Boutique Hotel",
    template: "%s | Kinship Landing"
  },
  description: "Stay, Gather, Explore Colorado Springs. Outrageous hospitality, crafted by locals. Boutique adventure hotel in downtown Colorado Springs with unique rooms, HOMA café, event spaces, and local adventure guidance.",
  keywords: [
    'Colorado Springs hotel',
    'boutique hotel Colorado Springs',
    'downtown Colorado Springs hotel',
    'Kinship Landing',
    'adventure hotel Colorado',
    'HOMA cafe',
    'Colorado Springs events',
    'Pikes Peak hotel',
    'Garden of the Gods hotel',
    'Colorado Springs accommodation'
  ],
  authors: [{ name: 'Kinship Landing' }],
  creator: 'Kinship Landing',
  publisher: 'Kinship Landing',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: '/favicon-192.png',
  },
  verification: {
    google: '0oV-MEhRaBJ_PHbTZGXfXwVhT0tQZHq9pzACjYYzfaQ',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.kinshiplanding.com',
    siteName: 'Kinship Landing',
    title: 'Kinship Landing | Downtown Colorado Springs Boutique Hotel',
    description: 'Stay, Gather, Explore Colorado Springs. Outrageous hospitality, crafted by locals. Boutique adventure hotel in downtown Colorado Springs.',
    images: [
      {
        url: '/images/Rooms Page:section/King Suite/CityKingSuite-RichardSeldomridge (3)-optimized.webp',
        width: 1920,
        height: 1280,
        alt: 'Kinship Landing Boutique Hotel - Downtown Colorado Springs',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kinshiplanding',
    creator: '@kinshiplanding',
    title: 'Kinship Landing | Downtown Colorado Springs Boutique Hotel',
    description: 'Stay, Gather, Explore Colorado Springs. Outrageous hospitality, crafted by locals.',
    images: ['/images/Rooms Page:section/King Suite/CityKingSuite-RichardSeldomridge (3)-optimized.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#647B56',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Google Tag Manager - Deferred Loading for Performance */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function() {
            setTimeout(function() {
              // Initialize dataLayer
              window.dataLayer = window.dataLayer || [];
              
              // Load GTM Primary Container
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TL2MM4B');
              
              // Load GTM Secondary Container
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PHJ4NJQ');
            }, 3500);
          });
        ` }} />

        {/* Triptease (booking conversion platform) — loads site-wide */}
        <script
          defer
          async
          crossOrigin="anonymous"
          type="text/javascript"
          src="https://onboard.triptease.io/bootstrap.js?integrationId=01KAKG32JBFC3ZZ6658V4YYHAP"
        />

        {/* Unregister any stale service workers */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for (let registration of registrations) {
                registration.unregister();
              }
            });
          }
        ` }} />

        {/* Critical inline styles for no flash */}
        <style dangerouslySetInnerHTML={{ __html: `
          body { margin: 0; background: #ffffff; }
          .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
          @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        ` }} />

        {/* DNS prefetch for critical services */}
        <link rel="dns-prefetch" href="https://direct-book.com" />
        <link rel="preconnect" href="https://direct-book.com" />

        {/* Resource hints for performance */}
        <meta name="theme-color" content="#647B56" />
        <meta name="format-detection" content="telephone=yes" />


        {/* Schema.org Structured Data - Hotel */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Hotel",
          "name": "Kinship Landing",
          "description": "Boutique adventure hotel in downtown Colorado Springs offering unique guest rooms, on-site café/bar, event spaces, and local adventure guidance.",
          "url": "https://www.kinshiplanding.com",
          "logo": "https://www.kinshiplanding.com/images/Rooms Page:section/King Suite/CityKingSuite-RichardSeldomridge (3)-optimized.webp",
          "image": [
            "https://www.kinshiplanding.com/images/Rooms Page:section/King Suite/CityKingSuite-RichardSeldomridge (3)-optimized.webp"
          ],
          "telephone": "+1-719-203-9309",
          "email": "hello@kinshiplanding.com",
          "priceRange": "$$",
          "currenciesAccepted": "USD",
          "paymentAccepted": "Cash, Credit Card",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "415 South Nevada Avenue",
            "addressLocality": "Colorado Springs",
            "addressRegion": "CO",
            "postalCode": "80903",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "38.8282",
            "longitude": "-104.8231"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          },
          "checkinTime": "16:00",
          "checkoutTime": "11:00",
          "petsAllowed": true,
          "amenityFeature": [
            {
              "@type": "LocationFeatureSpecification",
              "name": "Free WiFi",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "On-site Café & Bar",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Event Spaces",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Pet Friendly",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Local Adventure Concierge",
              "value": true
            }
          ],
          "containsPlace": [
            {
              "@type": "Restaurant",
              "name": "HOMA at Kinship Landing",
              "description": "On-site café and bar serving locally-sourced food and craft beverages",
              "servesCuisine": "American, Coffee, Cocktails",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "415 South Nevada Avenue",
                "addressLocality": "Colorado Springs",
                "addressRegion": "CO",
                "postalCode": "80903",
                "addressCountry": "US"
              }
            }
          ],
          "hasMap": "https://goo.gl/maps/your-google-maps-link",
          "sameAs": [
            "https://www.facebook.com/kinshiplanding",
            "https://www.instagram.com/kinshiplanding",
            "https://www.linkedin.com/company/kinship-landing"
          ]
        }) }} />

        {/* Schema.org - Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Kinship Landing",
          "alternateName": "Kinship Landing Hotel",
          "url": "https://www.kinshiplanding.com",
          "logo": "https://www.kinshiplanding.com/images/Rooms Page:section/King Suite/CityKingSuite-RichardSeldomridge (3)-optimized.webp",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-719-203-9309",
            "contactType": "customer service",
            "email": "hello@kinshiplanding.com",
            "availableLanguage": ["English"]
          },
          "sameAs": [
            "https://www.facebook.com/kinshiplanding",
            "https://www.instagram.com/kinshiplanding",
            "https://www.linkedin.com/company/kinship-landing"
          ]
        }) }} />

        {/* Schema.org - LocalBusiness */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Kinship Landing",
          "image": "https://www.kinshiplanding.com/images/Rooms Page:section/King Suite/CityKingSuite-RichardSeldomridge (3)-optimized.webp",
          "@id": "https://www.kinshiplanding.com",
          "url": "https://www.kinshiplanding.com",
          "telephone": "+1-719-203-9309",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "415 South Nevada Avenue",
            "addressLocality": "Colorado Springs",
            "addressRegion": "CO",
            "postalCode": "80903",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 38.8282,
            "longitude": -104.8231
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          }
        }) }} />
      </head>
      <body className={`${montserrat.variable} font-body antialiased`}>
        {/* Google Tag Manager (noscript) - Primary Container */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TL2MM4B"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Google Tag Manager (noscript) - Secondary Container */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PHJ4NJQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
