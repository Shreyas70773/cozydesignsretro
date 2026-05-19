/* eslint-disable @next/next/no-img-element */

import styles from "./animations-page.module.css";
import { AutoplayVideo } from "./autoplay-video";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

const assetPath = "/cozydesigns/animations/";
const optimizedAssets = new Set([
  "punk-rocky-frames.png",
  "punk-rocky-hero.png",
  "punk-rocky-process.png",
]);

function asset(name: string) {
  const filename = optimizedAssets.has(name) ? name.replace(/\.(png|jpe?g)$/i, ".webp") : name;
  return `${assetPath}${filename}`;
}

const swatches = ["#ffc94f", "#d4cfbd", "#61504b", "#11140f", "#dd7fb2"];

function MediaPanel({
  alt,
  className = "",
  src,
  variant = "standard",
}: {
  alt: string;
  className?: string;
  src: string;
  variant?: "standard" | "linework";
}) {
  return (
    <figure className={`${styles.mediaPanel} ${styles[variant]} ${className}`}>
      <img
        alt={alt}
        className={styles.mediaImage}
        decoding="async"
        height={900}
        loading="lazy"
        src={asset(src)}
        width={1200}
      />
    </figure>
  );
}

function VideoPanel({
  className = "",
  label,
  src,
}: {
  className?: string;
  label: string;
  src: string;
}) {
  return (
    <figure aria-label={label} className={`${styles.videoPanel} ${className}`}>
      <AutoplayVideo
        className={styles.video}
        loop
        poster={asset("punk-rocky-hero.png")}
        preload="auto"
        src={`${assetPath}${src}`}
        width={1137}
        height={872}
      />
    </figure>
  );
}

export function AnimationsPage() {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="punk-rocky-title">
        <img
          alt="Punk Rocky motion poster key artwork"
          className={styles.heroArtwork}
          decoding="async"
          fetchPriority="high"
          height={3321}
          src={asset("punk-rocky-hero.png")}
          width={4096}
        />
        <h1 className={styles.srOnly} id="punk-rocky-title">
          Punk Rocky motion poster study
        </h1>
      </section>

      <section className={styles.introSection}>
        <div className={styles.motionPreview}>
          <VideoPanel label="Punk Rocky motion poster animation" src="video4.mp4" />
        </div>
        <p className={styles.copy}>
          A motion poster inspired by Punk Rocky, translating the track&apos;s raw energy into a
          minimal, poster-driven animation. Built using frame-by-frame rotoscope. 15 frames
          per second.
        </p>
      </section>

      <section className={styles.processSection} aria-label="Punk Rocky process">
        <VideoPanel
          className={styles.originalVideo}
          label="Original Punk Rocky reference video"
          src="video2.mp4"
        />
        <MediaPanel alt="Punk Rocky title development process" src="punk-rocky-process.png" />
      </section>

      <section className={styles.paletteSection} aria-label="Punk Rocky color palette">
        <div className={styles.swatches}>
          {swatches.map((color) => (
            <span
              aria-label={`Color swatch ${color}`}
              className={styles.swatch}
              key={color}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <MediaPanel
          alt="Rotoscope line sketch sequence"
          className={styles.frameStudy}
          src="group-13.png"
          variant="linework"
        />
      </section>

      <section className={styles.frameSection}>
        <p className={styles.copy}>
          A selection of 20 frames from the 88-frame rotoscope sequence, sampled at intervals
          to highlight motion progression and key poses.
        </p>
        <VideoPanel
          className={styles.comparisonVideo}
          label="Light and dark Punk Rocky final animation comparison"
          src="video3-h264.mp4"
        />
      </section>

      <section className={styles.metricsSection}>
        <div className={styles.metricsBlock}>
          <p>
            The Punk Rocky motion poster reached 220K+ views and 33K+ interactions on Instagram,
            including 28K likes, 2K saves, and 1.9K shares.
          </p>
          <p>
            The work was also recognized by A$AP Rocky, reinforcing its impact within music and
            design culture.
          </p>
        </div>
      </section>

      <section className={styles.relatedSection} aria-labelledby="related-title">
        <h2 className={styles.relatedTitle} id="related-title">
          Related Works
        </h2>
        <div className={styles.relatedGrid}>
          <article className={`${styles.relatedCard} ${styles.relatedDark}`}>
            <VideoPanel label="Helicopter related animation" src="video1.mp4" />
          </article>
          <article className={styles.relatedCard}>
            <VideoPanel label="Stepper related animation" src="video5.mp4" />
          </article>
        </div>
      </section>

      </main>
      <SiteFooter />
    </>
  );
}
