import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://occurs.org';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "occurs.org - The Digital Chronicle",
    template: "%s | occurs.org",
  },
  description: "Your trusted source for comprehensive news coverage, delivering the latest breaking news and in-depth journalism from trusted sources worldwide.",
  keywords: ["news", "breaking news", "journalism", "world news", "politics", "business", "technology", "occurs.org"],
  authors: [{ name: "occurs.org Editorial Team" }],
  creator: "occurs.org",
  publisher: "occurs.org",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "occurs.org - The Digital Chronicle",
    title: "occurs.org - The Digital Chronicle",
    description: "Your trusted source for comprehensive news coverage, delivering the latest breaking news and in-depth journalism from trusted sources worldwide.",
    images: [
      {
        url: `${baseUrl}/android-chrome-512x512.png`,
        width: 1200,
        height: 630,
        alt: "occurs.org - The Digital Chronicle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "occurs.org - The Digital Chronicle",
    description: "Your trusted source for comprehensive news coverage and in-depth journalism.",
    creator: "@occursorg",
    site: "@occursorg",
    images: [`${baseUrl}/android-chrome-512x512.png`],
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: '76c82b16dcef701a',
    // bing: 'msvalidate.01-bing-verification',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TGFV7B27');
          `}
        </Script>
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for common external resources */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TGFV7B27"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {children}
        
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6WN37N9PHE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6WN37N9PHE');
          `}
        </Script>
      </body>
    </html>
  );
}
