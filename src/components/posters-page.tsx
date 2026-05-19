/* eslint-disable @next/next/no-img-element */

import { posters } from "@/lib/posters";

import styles from "./posters-page.module.css";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

export function PostersPage() {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <section className={styles.hero}>
          <p aria-hidden="true" className={styles.heroShadow}>
            RETRO COMIC POSTERS
          </p>
          <h1 className={styles.heroTitle}>RETRO COMIC POSTERS</h1>
          <p className={styles.heroIntro}>
            Poster design by Cozy Designs blends comic-book framing, hip-hop references,
            hand-built type, and bold print texture. Each piece is treated like a cover:
            a clear subject, a sharp visual hook, and enough detail to reward a second look.
          </p>
        </section>

        <section className={styles.grid} aria-label="Retro comic poster gallery">
          {posters.map((poster, index) => (
            <article className={styles.card} id={poster.slug} key={poster.src}>
              <img
                alt={poster.alt}
                className={styles.posterImage}
                decoding="async"
                fetchPriority={index < 3 ? "high" : "auto"}
                height={1500}
                loading={index < 3 ? "eager" : "lazy"}
                src={poster.src}
                width={1200}
              />
              <div className={styles.posterOverlay}>
                <h2 className={styles.posterTitle}>{poster.title}</h2>
                <p className={styles.posterDescription}>{poster.description}</p>
                <a className={styles.posterLink} href={`/posters#${poster.slug}`}>
                  /posters#{poster.slug}
                </a>
              </div>
            </article>
          ))}
        </section>

        <a
          className={styles.instagram}
          href="https://www.instagram.com/cozydesigns._/"
          rel="noreferrer"
          target="_blank"
        >
          See more at Instagram
        </a>
      </main>
      <SiteFooter />
    </>
  );
}
