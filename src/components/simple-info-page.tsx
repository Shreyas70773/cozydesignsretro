/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import styles from "./simple-info-page.module.css";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

type SimpleInfoPageProps = {
  body: string[];
  eyebrow: string;
  imageAlt: string;
  imageSrc: string;
  intro: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  title: string;
};

function ActionLink({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const className = `${styles.actionLink} ${
    variant === "secondary" ? styles.secondaryAction : styles.primaryAction
  }`;

  if (href.startsWith("mailto:")) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

export function SimpleInfoPage({
  body,
  eyebrow,
  imageAlt,
  imageSrc,
  intro,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  title,
}: SimpleInfoPageProps) {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="simple-page-title">
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 className={styles.title} id="simple-page-title">
              {title}
            </h1>
            <p className={styles.intro}>{intro}</p>
            <div className={styles.bodyText}>
              {body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className={styles.actions}>
              <ActionLink href={primaryHref}>{primaryLabel}</ActionLink>
              <ActionLink href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </ActionLink>
            </div>
          </div>

          <div className={styles.media} aria-hidden="true">
            <img
              alt={imageAlt}
              className={styles.image}
              decoding="async"
              loading="lazy"
              src={imageSrc}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
