import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Afacad, Jersey_15 } from "next/font/google";

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

const freeFat = localFont({
  display: "swap",
  src: "../../public/cozydesigns/FREEFATFONT-Regular.otf",
  variable: "--font-stroke",
});

const bigFatStroke = localFont({
  display: "swap",
  src: "../../public/cozydesigns/BigFatStroke-Regular.otf",
  variable: "--font-outline",
});

const strokeBlue = localFont({
  display: "swap",
  src: "../../public/cozydesigns/CUSTOMBIG.otf",
  variable: "--font-display",
});

const jersey = Jersey_15({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-body",
  weight: "400",
});

const afacad = Afacad({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-copy",
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
