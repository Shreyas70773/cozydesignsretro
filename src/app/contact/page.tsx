import type { Metadata } from "next";

import { ContactForm } from "./contact-form";
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

import styles from "./contact.module.css";

const socialLinks = [
  {
    href: "https://www.behance.net/gauthamjpaul",
    label: "Behance",
  },
  {
    href: "https://dribbble.com/Co-Z_Designs",
    label: "Dribbble",
  },
  {
    href: "https://www.pinterest.com/gautham_jpaul/",
    label: "Pinterest",
  },
  {
    href: "https://www.instagram.com/cozydesigns._/",
    label: "Instagram",
  },
  {
    href: "https://open.spotify.com/user/v7wmjdm5yjjz2494wj7vgig2g?si=36cbf828e92442da",
    label: "Spotify",
  },
];

export const metadata: Metadata = buildMetadata({
  description:
    "Contact Cozy Designs for poster design, album covers, motion graphics, branding, illustration, and culture-led visual worlds.",
  path: "/contact",
  title: "Contact - Poster & Album Cover Design Enquiries",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@id": organizationId,
          "@type": ["Organization", "ProfessionalService"],
          areaServed: ["India", "United States", "United Kingdom", "Worldwide"],
          email: siteConfig.email,
          founder: {
            "@id": personId,
          },
          image: absoluteUrl("/opengraph-image"),
          name: siteConfig.siteName,
          sameAs: Object.values(siteConfig.social),
          url: absoluteUrl("/contact"),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <SiteNav />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="contact-page-title">
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Contact</p>
            <h1 className={styles.title} id="contact-page-title">
              Let&apos;s Make&nbsp;It Cozy
            </h1>
            <p className={styles.intro}>
              Posters, album covers, motion graphics, branding, illustration, and visual worlds
              with a strong point of view.
            </p>

            <div className={styles.globalNote}>
              <h2>Working Globally</h2>
              <p>
                Based in India, working with clients across the US, UK, and beyond. We&apos;re
                flexible with time zones and communication methods to ensure smooth collaboration.
              </p>
            </div>

            <div className={styles.contactLinks} aria-label="Contact and social links">
              <a className={styles.emailLink} href="mailto:hello@cozydesigns.art">
                hello@cozydesigns.art
              </a>
              <div className={styles.socialLinks}>
                {socialLinks.map((link) => (
                  <a
                    className={styles.socialLink}
                    href={link.href}
                    key={link.label}
                    rel="me noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <ContactForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
