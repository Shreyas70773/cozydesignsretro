/* eslint-disable @next/next/no-img-element */

import styles from "./album-covers-page.module.css";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

const assetBase = "/cozydesigns/album-covers";
const figmaAssetBase = `${assetBase}/figma`;
const optimizedAssets = new Set([
  "artist-reference.png",
  "color-development-alt.png",
  "composition-initial.png",
  "composition-revised.png",
  "concept-cover.png",
  "concept-lettering-left.png",
  "final-color-art.png",
  "kobe-reference.png",
  "lettering-strip.png",
  "reference-cover.png",
  "want-it-all-cover.png",
]);

function asset(name: string) {
  const filename = optimizedAssets.has(name) ? name.replace(/\.(png|jpe?g)$/i, ".webp") : name;
  return `${assetBase}/${filename}`;
}

function figmaAsset(name: string) {
  return `${figmaAssetBase}/${name}`;
}

const heroImages = [
  {
    alt: "Want It All comic-inspired album cover for TRIN",
    className: styles.heroCover,
    eager: true,
    src: asset("reference-cover.png"),
  },
  {
    alt: "Want It All track shown in a Spotify player",
    className: styles.heroPlayer,
    eager: false,
    src: asset("spotify-player.png"),
  },
];

const referenceItems = [
  {
    alt: "Kobe Bryant holding the championship trophy as visual reference",
    caption: "A visual reference inspired by Kobe Bryant's championship moment.",
    src: asset("kobe-reference.png"),
  },
  {
    alt: "Black and white comic illustration study of the artist",
    caption:
      "The reference was reinterpreted into a custom illustration to match the client's identity and narrative.",
    src: asset("img-4503-1.png"),
  },
];

const compositionItems = [
  {
    alt: "Initial black and white comic album cover composition",
    caption: "Initial composition exploring a more introspective and grounded pose.",
    src: asset("composition-initial.png"),
  },
  {
    alt: "Revised black and white comic album cover composition",
    caption:
      "The composition was revised based on client feedback to better reflect the artist's message.",
    src: asset("composition-revised.png"),
  },
];

const colorItems = [
  {
    alt: "Black and white linework stage of the Want It All cover",
    caption: "Linework stage focusing on clarity, structure, and depth.",
    src: asset("color-development-alt.png"),
  },
  {
    alt: "Color development stage of the Want It All cover",
    caption: "Color was introduced to enhance the overall impact of the composition.",
    src: asset("final-color-art.png"),
  },
];

function DisplayTitle({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <div className={styles.titleStack}>
      <p aria-hidden="true" className={styles.titleShadow}>
        {children}
      </p>
      <h2 className={styles.sectionTitle} id={id}>
        {children}
      </h2>
    </div>
  );
}

function FigureCard({
  alt,
  caption,
  className,
  src,
}: {
  alt: string;
  caption: string;
  className?: string;
  src: string;
}) {
  return (
    <figure className={`${styles.figureCard} ${className ?? ""}`}>
      <div className={styles.imageShell}>
        <img
          alt={alt}
          className={styles.figureImage}
          decoding="async"
          height={1400}
          loading="lazy"
          src={src}
          width={1400}
        />
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  );
}

export function AlbumCoversPage() {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="album-title">
        <div className={styles.pageTitleWrap}>
          <p aria-hidden="true" className={styles.pageTitleShadow}>
            ALBUM COVER DESIGN
          </p>
          <h1 className={styles.pageTitle} id="album-title">
            ALBUM COVER DESIGN
          </h1>
        </div>

        <div className={styles.heroGrid}>
          {heroImages.map((image) => (
            <div className={image.className} key={image.src}>
              <img
                alt={image.alt}
                decoding="async"
                fetchPriority={image.eager ? "high" : "auto"}
                height={1400}
                loading={image.eager ? "eager" : "lazy"}
                src={image.src}
                width={1400}
              />
            </div>
          ))}
          <p className={styles.heroCopy}>
            A comic-inspired album cover designed for UK-based artist TRIN, combining hip-hop
            visual culture with narrative-driven illustration.
          </p>
        </div>
      </section>

      <section className={styles.reference} aria-labelledby="reference-title">
        <h2 className={styles.kickerTitle} id="reference-title">
          REFERENCE + INITIAL ILLUSTRATION
        </h2>
        <div className={styles.twoColumnGrid}>
          {referenceItems.map((item) => (
            <FigureCard {...item} key={item.src} />
          ))}
        </div>
      </section>

      <section className={styles.caseSection} aria-labelledby="concept-title">
        <DisplayTitle id="concept-title">Concept &amp; Lettering</DisplayTitle>
        <div className={styles.conceptSpread}>
          <div className={styles.conceptLeft}>
            <div className={styles.conceptReferenceRow}>
              <figure className={styles.conceptPoster}>
                <img
                  alt="The World Is Yours poster reference for the album cover concept"
                  decoding="async"
                  height={1280}
                  loading="lazy"
                  src={figmaAsset("concept-poster.webp")}
                  width={903}
                />
              </figure>
            </div>
            <p className={styles.conceptBodyCopy}>
              The concept evolved from an earlier poster, reinterpreted into a comic-style album
              cover tailored to the artist&apos;s identity.
            </p>
            <figure className={styles.conceptWorldTitle}>
              <img
                alt="The World Is Yours custom title lettering"
                decoding="async"
                height={693}
                loading="lazy"
                src={figmaAsset("concept-world-title.webp")}
                width={1800}
              />
            </figure>
          </div>
          <div className={styles.conceptRight}>
            <figure className={styles.conceptLineArt}>
              <img
                alt="Want It All black and white comic cover line art"
                decoding="async"
                height={2250}
                loading="lazy"
                src={figmaAsset("concept-line-art.webp")}
                width={1800}
              />
            </figure>
            <figure className={styles.conceptWantTitle}>
              <img
                alt="Want It All final custom lettering"
                decoding="async"
                height={1004}
                loading="lazy"
                src={figmaAsset("concept-want-title.webp")}
                width={1800}
              />
            </figure>
          </div>
          <p className={styles.conceptCaption}>
            Custom lettering for both the title and artist name was developed by re-creating the
            existing poster.
          </p>
        </div>
      </section>

      <section className={styles.caseSection} aria-labelledby="composition-title">
        <DisplayTitle id="composition-title">Composition</DisplayTitle>
        <div className={styles.twoColumnGrid}>
          {compositionItems.map((item) => (
            <FigureCard {...item} key={item.src} />
          ))}
        </div>
      </section>

      <section className={styles.caseSection} aria-labelledby="color-title">
        <DisplayTitle id="color-title">Color Development</DisplayTitle>
        <div className={styles.twoColumnGrid}>
          {colorItems.map((item) => (
            <FigureCard {...item} key={item.src} />
          ))}
        </div>
      </section>

      <section className={styles.finalSection} aria-labelledby="final-title">
        <DisplayTitle id="final-title">Final</DisplayTitle>
        <FigureCard
          alt="Final Want It All album cover artwork"
          caption=""
          className={styles.featuredCover}
          src={asset("reference-cover.png")}
        />
        <a
          className={styles.listenLink}
          href="https://open.spotify.com/search/TRIN%20Want%20It%20All"
          rel="noreferrer"
          target="_blank"
        >
          Listen to &apos;Want It All&apos; here.
        </a>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
