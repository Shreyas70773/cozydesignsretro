import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { RoutePreloader } from "@/components/route-preloader";
import { defaultOgImage, siteConfig } from "@/lib/seo";
import "./globals.css";

const PRELOADER_ASSET_VERSION = "20260519-fit-a";
const preloaderVideoSources = [
  {
    href: `/preloader/preloader-phone-bg-fff9dc.mp4?v=${PRELOADER_ASSET_VERSION}`,
    media: "(max-width: 767px)",
  },
  {
    href: `/preloader/preloader-tab-bg-fff9dc.mp4?v=${PRELOADER_ASSET_VERSION}`,
    media: "(min-width: 768px) and (max-width: 1024px), (pointer: coarse) and (max-width: 1180px)",
  },
  {
    href: `/preloader/preloader-1-loop-bg-fff9dc.mp4?v=${PRELOADER_ASSET_VERSION}`,
    media: "(min-width: 1025px) and (pointer: fine)",
  },
];

// adjustFontFallback: false keeps Safari on the real font metrics instead
// of Next's Arial-based metric shim. The display faces use heavier system
// fallbacks, while the smaller text fonts are vendored locally to avoid
// browser differences in Google font subset selection.
// next/font requires literal array values, so the chain is inlined per call.

const freeFat = localFont({
  adjustFontFallback: false,
  display: "swap",
  fallback: ["Impact", "Haettenschweiler", "Arial Black", "Helvetica", "sans-serif"],
  src: "../../public/cozydesigns/FREEFATFONT-Regular.woff2",
  variable: "--font-stroke",
});

const bigFatStroke = localFont({
  adjustFontFallback: false,
  display: "swap",
  fallback: ["Impact", "Haettenschweiler", "Arial Black", "Helvetica", "sans-serif"],
  src: "../../public/cozydesigns/BigFatStroke-Regular.woff2",
  variable: "--font-outline",
});

const strokeBlue = localFont({
  adjustFontFallback: false,
  display: "swap",
  fallback: ["Impact", "Haettenschweiler", "Arial Black", "Helvetica", "sans-serif"],
  src: "../../public/cozydesigns/CUSTOMBIG.woff2",
  variable: "--font-display",
});

const jersey = localFont({
  adjustFontFallback: false,
  display: "swap",
  fallback: ["Courier New", "ui-monospace", "monospace"],
  src: "../../public/cozydesigns/Jersey15-Regular-latin.woff2",
  variable: "--font-body",
  weight: "400",
});

const afacad = localFont({
  adjustFontFallback: false,
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
  src: "../../public/cozydesigns/Afacad-Variable-latin.woff2",
  variable: "--font-copy",
  weight: "400 700",
});

export const metadata: Metadata = {
  applicationName: siteConfig.siteName,
  authors: [{ name: siteConfig.creatorName, url: "/about" }],
  creator: siteConfig.creatorName,
  description: siteConfig.description,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    description: siteConfig.description,
    images: [defaultOgImage],
    locale: siteConfig.locale,
    siteName: siteConfig.siteName,
    title: siteConfig.siteName,
    type: "website",
    url: siteConfig.siteUrl,
  },
  publisher: siteConfig.siteName,
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: "Cozy Designs - Poster, Album Cover & Motion Design",
    template: "%s | Cozy Designs",
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultOgImage.url],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#8bb9b8",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${freeFat.variable} ${bigFatStroke.variable} ${strokeBlue.variable} ${jersey.variable} ${afacad.variable}`}
      data-scroll-behavior="smooth"
      lang="en-IN"
    >
      <head>
        {preloaderVideoSources.map((video) => (
          <link
            as="video"
            fetchPriority="high"
            href={video.href}
            key={video.href}
            media={video.media}
            rel="preload"
            type="video/mp4"
          />
        ))}
      </head>
      <body>
        <RoutePreloader>{children}</RoutePreloader>
      </body>
    </html>
  );
}
