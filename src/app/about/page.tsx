/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  organizationId,
  personId,
  siteConfig,
} from "@/lib/seo";

import styles from "./about.module.css";

const practiceParagraphs = [
  "Cozy Designs is my independent studio for culture-led design, posters, custom typography, and music-driven art direction. From concept to final, everything is built by me.",
  'Recently, my Nas comic poster "The World Is Yours" crossed 1M views on Pinterest, widely shared, often uncredited.',
  "That shaped how I work: original, intentional, and authored.",
  "Currently my work is expanding into motion posters and 2D animation, bringing the same storytelling into movement.",
];

export const metadata: Metadata = buildMetadata({
  description:
    "Meet Gautham J Paul, the designer behind Cozy Designs: hip-hop posters, comic storytelling, album art, motion design, and brand identity.",
  path: "/about",
  title: "About Gautham J Paul",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@id": personId,
          "@type": "Person",
          description:
            "Visual designer and illustrator working across hip-hop culture, comic storytelling, album art, posters, and identity design.",
          email: siteConfig.email,
          image: absoluteUrl("/cozydesigns/about-us-picture-final.jpeg"),
          jobTitle: "Visual Designer and Illustrator",
          name: siteConfig.creatorName,
          sameAs: Object.values(siteConfig.social),
          url: absoluteUrl("/about"),
          worksFor: {
            "@id": organizationId,
            "@type": "Organization",
            name: siteConfig.siteName,
            url: siteConfig.siteUrl,
          },
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "About Gautham J Paul", path: "/about" }])} />
      <SiteNav mobilePlacement="top" />
      <main className={styles.page}>
        <section className={styles.aboutSheet} aria-labelledby="about-title">
          <div className={styles.copyColumn}>
            <h1 className={styles.srOnly} id="about-title">
              About Gautham J Paul - Cozy Designs
            </h1>
            <div aria-hidden="true" className={styles.title}>
              <span>Hello, I&apos;m</span>
              <span>Gautham</span>
            </div>

            <p className={styles.statement}>
              I am a visual designer &amp; illustrator working across hip-hop culture,
              comic storytelling, and narrative-driven visuals. I am focused on album
              art, posters, and brand identity.
            </p>

            <div className={styles.practiceBlock}>
              <h2 className={styles.practiceTitle}>Practice</h2>
              <div className={styles.practiceText}>
                {practiceParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <figure className={styles.portraitFrame}>
            <img
              alt="Gautham standing in front of a red wall"
              className={styles.portrait}
              decoding="async"
              fetchPriority="high"
              height={1616}
              src="/cozydesigns/about-us-picture-final.jpeg"
              width={1080}
            />
          </figure>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
