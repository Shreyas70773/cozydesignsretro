import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { absoluteUrl, defaultOgImage, siteConfig } from "@/lib/seo";

import styles from "./not-found.module.css";

const description =
  "This Cozy Designs page could not be found. Explore poster design, album cover artwork, or the latest studio updates.";

export const metadata: Metadata = {
  alternates: {
    canonical: "/404",
  },
  description:
    "This Cozy Designs page could not be found. Explore poster design, album cover artwork, or the latest studio updates.",
  openGraph: {
    description,
    images: [
      {
        alt: defaultOgImage.alt,
        height: defaultOgImage.height,
        url: defaultOgImage.url,
        width: defaultOgImage.width,
      },
    ],
    locale: siteConfig.locale,
    siteName: siteConfig.siteName,
    title: "Not Found - Cozy Designs",
    type: "website",
    url: absoluteUrl("/404"),
  },
  robots: {
    follow: false,
    googleBot: {
      follow: false,
      index: false,
      noarchive: true,
    },
    index: false,
    nocache: true,
  },
  title: {
    absolute: "Not Found - Cozy Designs",
  },
  twitter: {
    card: "summary_large_image",
    description,
    images: [defaultOgImage.url],
    title: "Not Found - Cozy Designs",
  },
};

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <section className={styles.panel} aria-labelledby="not-found-title">
          <p className={styles.eyebrow}>404</p>
          <h1 className={styles.title} id="not-found-title">
            Page Not Found
          </h1>
          <p className={styles.copy}>
            This page drifted out of the layout. Jump back into the portfolio or read the latest
            studio notes.
          </p>
          <div className={styles.actions}>
            <Link href="/posters">Posters</Link>
            <Link href="/album-covers">Album Covers</Link>
            <Link href="/latest-posts">Latest Posts</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
