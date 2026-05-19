import Link from "next/link";

import styles from "./legal-page.module.css";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

type LegalSection = {
  body: string;
  title: string;
};

type LegalPageProps = {
  intro: string;
  sections: LegalSection[];
  title: string;
};

export function LegalPage({ intro, sections, title }: LegalPageProps) {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <article className={styles.document} aria-labelledby="legal-page-title">
          <p className={styles.eyebrow}>Cozy Designs</p>
          <h1 className={styles.title} id="legal-page-title">
            {title}
          </h1>
          <p className={styles.intro}>{intro}</p>

          <div className={styles.sections}>
            {sections.map((section) => (
              <section className={styles.section} key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>

          <div className={styles.relatedLinks} aria-label="Related legal pages">
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
