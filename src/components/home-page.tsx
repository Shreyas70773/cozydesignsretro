"use client";
/* eslint-disable @next/next/no-img-element */

import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import styles from "./home-page.module.css";
import { AutoplayVideo } from "./autoplay-video";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

const carouselPosters = [
  {
    src: "/cozydesigns/portfolio-assets/f47cc9ac-spring-has-no-rules-poster.webp",
    alt: "Spring has no rules poster",
  },
  {
    src: "/cozydesigns/portfolio-assets/a8a1ef54-the-world-is-yours-poster.webp",
    alt: "The world is yours poster",
  },
  {
    src: "/cozydesigns/portfolio-assets/60b74067-the-age-of-aquarius-poster.webp",
    alt: "The age of Aquarius poster",
  },
  {
    src: "/cozydesigns/portfolio-assets/962011bd-jackman-comic-poster.webp",
    alt: "Jackman comic poster",
  },
  {
    src: "/cozydesigns/portfolio-assets/d9a09b24-gnx-illustrated-album-art.webp",
    alt: "GNX illustrated album art",
  },
  {
    src: "/cozydesigns/portfolio-assets/3b2af6d5-sinners-poster-artwork.webp",
    alt: "Sinners poster artwork",
  },
  {
    src: "/cozydesigns/portfolio-assets/688e4e3e-hunger-games-inspired-poster.webp",
    alt: "Hunger games inspired poster",
  },
];

const carouselPosterSets = Array.from({ length: 3 }, (_, setIndex) => ({
  items: carouselPosters,
  setIndex,
}));

const projectCards = [
  {
    title: "Retro Comic Posters",
    subtitle: "A collection of comic posters I have created over the years.",
    href: "/posters",
    src: "/cozydesigns/portfolio-assets/96ac9517-retro-comic-poster-project-artwork.webp",
    alt: "Retro comic poster project artwork",
  },
  {
    title: "CLOUDed",
    subtitle: "Branding and event identity",
    href: "/clouded",
    src: "/cozydesigns/portfolio-assets/8411f0cd-clouded-branding-artwork.webp",
    alt: "Clouded branding artwork",
  },
  {
    title: "Animation/Motion Posters",
    subtitle: "Animations and motion posters",
    href: "/animations",
    src: "/cozydesigns/portfolio-assets/99b411e8-animation-and-motion-poster-artwork.webp",
    alt: "Animation and motion poster artwork",
  },
  {
    title: "TRIN: Want it all",
    subtitle: "Album cover design",
    href: "/album-covers",
    src: "/cozydesigns/portfolio-assets/ee651262-trin-album-cover-artwork.webp",
    alt: "TRIN album cover artwork",
  },
];

const collageImages = [
  {
    src: "/cozydesigns/portfolio-assets/a61748ff-d-angelo-artwork.webp",
    alt: "D'Angelo artwork",
  },
  {
    src: "/cozydesigns/portfolio-assets/1a45338b-hypnophobia-artwork.webp",
    alt: "Hypnophobia artwork",
  },
  {
    src: "/cozydesigns/portfolio-assets/7a570fbb-jay-z-artwork.webp",
    alt: "Jay-Z artwork",
  },
  {
    src: "/cozydesigns/portfolio-assets/2ee98352-mamma-said-artwork.webp",
    alt: "Mamma said artwork",
  },
  {
    src: "/cozydesigns/portfolio-assets/2c6d903d-problem-artwork.webp",
    alt: "Problem artwork",
  },
  {
    src: "/cozydesigns/portfolio-assets/f90ecbd9-the-infamous-artwork.webp",
    alt: "The Infamous artwork",
  },
  {
    src: "/cozydesigns/portfolio-assets/07561ae1-die-with-a-smile-artwork.webp",
    alt: "Die with a smile artwork",
  },
  {
    src: "/cozydesigns/portfolio-assets/fc591770-baby-keem-artwork.webp",
    alt: "Baby Keem artwork",
  },
];

const storyPhrases = [
  "Animation Motion Posters Lettering Posters Album Covers Comic Illustrations Animation Motion Posters Lettering Posters Album Covers Comic Illustrations Animation Motion",
  { text: "Posters", white: true },
  "Lettering Posters",
  { text: "Album Covers", white: true },
  "Comic Illustrations Animation Motion Posters Lettering Posters Album Covers Comic Illustrations Animation Motion Posters",
  { text: "Lettering", white: true },
  "Posters Album Covers Comic Illustrations Animation",
  { text: "Motion Posters", white: true },
  "Lettering Posters Album Covers Comic Illustrations Animation Motion Posters Lettering Posters Album Covers Comic Illustrations",
  { text: "Animation", white: true },
  "Motion Posters Lettering Posters Album Covers Comic Illustrations Animation Motion Posters Lettering Posters Album Covers",
  { text: "Comic Illustrations", white: true },
  "Animation Motion Posters Lettering Posters Album Covers Comic Illustrations",
] satisfies Array<string | { text: string; white: boolean }>;

const statementLines = [
  { className: styles.statementLineAqua, text: "COZY DESIGNS IS" },
  { className: styles.statementLineOrange, text: "VISUAL CULTURE" },
  { className: styles.statementLineAqua, text: "BY DESIGN." },
];

const storyTokens = storyPhrases.flatMap((phrase, phraseIndex) => {
  const text = typeof phrase === "string" ? phrase : phrase.text;
  const white = typeof phrase !== "string" && phrase.white;

  return text.split(" ").map((word, wordIndex) => ({
    key: `${phraseIndex}-${wordIndex}-${word}`,
    text: word,
    white,
  }));
});

const originParagraphs = [
  "Cozy Designs was born from my love for hip hop and the bold storytelling of golden age American comics.",
  "What started as personal explorations of album covers and cultural moments became a visual language rooted in texture, typography, and narrative.",
  "Today, I translate ideas into posters and motion pieces that feel timeless yet contemporary.",
];

const originHotWords = new Set([
  "Cozy",
  "Designs",
  "hip",
  "hop",
  "bold",
  "storytelling",
  "comics",
  "visual",
  "texture",
  "typography",
  "narrative",
  "timeless",
  "contemporary",
]);

function staggerStyle(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

function letterStyle(index: number): CSSProperties {
  return {
    "--fly-rotate": `${-18 + (index % 5) * 8}deg`,
    "--fly-x": `${index % 2 === 0 ? -1.6 : 1.6}rem`,
    "--i": index,
  } as CSSProperties;
}

function originWordStyle(index: number): CSSProperties {
  const direction = index % 2 === 0 ? -1 : 1;

  return {
    "--origin-delay": `${(index % 24) * 22}ms`,
    "--i": index,
    "--origin-rotate": `${direction * (10 + (index % 4) * 5)}deg`,
    "--origin-x": `${direction * (0.65 + (index % 3) * 0.2)}rem`,
  } as CSSProperties;
}

function cleanWord(word: string) {
  return word.replace(/[^A-Za-z]/g, "");
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.2 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}

function AnimatedStatementLine({
  className,
  offset,
  text,
}: {
  className: string;
  offset: number;
  text: string;
}) {
  return (
    <span className={`${styles.statementLine} ${className}`}>
      {[...text].map((char, index) => (
        <span
          aria-hidden="true"
          className={styles.statementChar}
          key={`${char}-${index}`}
          style={letterStyle(offset + index)}
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
      <span className={styles.srOnly}>{text}</span>
    </span>
  );
}

export function HomePage() {
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [carouselDragOffset, setCarouselDragOffset] = useState(0);
  const carouselDragRef = useRef<{
    pointerId: number;
    startOffset: number;
    startX: number;
  } | null>(null);
  const carouselSetRef = useRef<HTMLDivElement | null>(null);
  const isCarouselHoveredRef = useRef(false);
  const [statementRef, isStatementInView] = useInView<HTMLElement>();
  const [storyRef, isStoryInView] = useInView<HTMLParagraphElement>();
  const [originRef, isOriginInView] = useInView<HTMLElement>();
  const carouselTrackStyle = {
    "--carousel-drag-offset": `${carouselDragOffset}px`,
  } as CSSProperties;

  function normalizeCarouselOffset(offset: number) {
    const setWidth = carouselSetRef.current?.getBoundingClientRect().width;

    if (!setWidth) {
      return offset;
    }

    return ((((offset + setWidth / 2) % setWidth) + setWidth) % setWidth) - setWidth / 2;
  }

  function handleCarouselPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    carouselDragRef.current = {
      pointerId: event.pointerId,
      startOffset: carouselDragOffset,
      startX: event.clientX,
    };
    setIsCarouselPaused(true);
  }

  function handleCarouselPointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = carouselDragRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    setCarouselDragOffset(
      normalizeCarouselOffset(dragState.startOffset + event.clientX - dragState.startX),
    );
  }

  function handleCarouselPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const dragState = carouselDragRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    carouselDragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsCarouselPaused(isCarouselHoveredRef.current);
  }

  function pauseCarousel() {
    isCarouselHoveredRef.current = true;
    setIsCarouselPaused(true);
  }

  function resumeCarousel() {
    isCarouselHoveredRef.current = false;

    if (!carouselDragRef.current) {
      setIsCarouselPaused(false);
    }
  }

  function handleCarouselPointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      pauseCarousel();
    }
  }

  function handleCarouselPointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      resumeCarousel();
    }
  }

  return (
    <div className={styles.page} id="top">
      <SiteNav />

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroShell}>
            <div className={styles.heroFrame}>
              <div className={styles.heroMedia}>
                <div className={styles.heroVideoFrame}>
                  <AutoplayVideo
                    className={styles.heroVideo}
                    loop
                    poster="/cozydesigns/hero-frame-preview.png"
                    preload="auto"
                    src="/cozydesigns/cozy-hero-video-new-h264.mp4"
                  />
                </div>
              </div>

              <div aria-hidden="true" className={styles.heroDivider} />

              <div className={styles.heroCopy}>
                <div className={styles.heroTitleWrap}>
                  <h1
                    className={styles.heroTitle}
                    data-text="RETRO VISUALS FOR MODERN CULTURE"
                  >
                    RETRO VISUALS FOR MODERN{" "}
                    <span className={styles.cultureTight}>
                      CUL<span className={styles.cultureT}>T</span>URE
                    </span>
                  </h1>
                </div>

                <p className={styles.heroDescription}>
                  Built for artists, musicians, brands, and culture.
                </p>

                <div className={styles.heroActions}>
                  <Link className={styles.heroAction} href="/posters">
                    Posters
                  </Link>
                  <Link className={styles.heroAction} href="/animations">
                    Animations
                  </Link>
                </div>
              </div>

              <div className={styles.heroHintRow}>
                <p className={styles.heroHint}>Scroll down</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.carouselSection}>
          <div
            className={styles.carouselViewport}
            onMouseEnter={pauseCarousel}
            onMouseLeave={resumeCarousel}
            onPointerCancel={handleCarouselPointerEnd}
            onPointerDown={handleCarouselPointerDown}
            onPointerEnter={handleCarouselPointerEnter}
            onPointerLeave={handleCarouselPointerLeave}
            onPointerMove={handleCarouselPointerMove}
            onPointerUp={handleCarouselPointerEnd}
          >
            <div
              className={styles.carouselDragSurface}
              style={carouselTrackStyle}
            >
              <div
                className={`${styles.carouselTrack} ${
                  isCarouselPaused ? styles.carouselTrackPaused : ""
                }`}
              >
                {carouselPosterSets.map(({ items, setIndex }) => (
                  <div
                    aria-hidden={setIndex === 0 ? undefined : "true"}
                    className={styles.carouselSet}
                    key={setIndex}
                    ref={setIndex === 0 ? carouselSetRef : undefined}
                  >
                    {items.map((poster) => (
                      <article
                        className={styles.carouselCard}
                        key={`${setIndex}-${poster.alt}`}
                      >
                        <img
                          alt={setIndex === 0 ? poster.alt : ""}
                          className={styles.carouselImage}
                          decoding="async"
                          draggable={false}
                          height={1500}
                          loading="lazy"
                          src={poster.src}
                          width={1200}
                        />
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.statementSection} ref={statementRef}>
          <div className={styles.statementShell}>
            <div className={styles.statementCard}>
              <div aria-hidden="true" className={styles.statementShadow}>
                <span>COZY DESIGNS IS</span>
                <span>VISUAL CULTURE</span>
                <span>BY DESIGN.</span>
              </div>
              <h2
                className={`${styles.statementTitle} ${
                  isStatementInView ? styles.statementTitleInView : ""
                }`}
              >
                {statementLines.map((line, index) => (
                  <AnimatedStatementLine
                    className={line.className}
                    key={line.text}
                    offset={index * 18}
                    text={line.text}
                  />
                ))}
              </h2>
            </div>
          </div>
        </section>

        <section className={styles.storySection}>
          <div className={styles.storyViewport}>
            <p
              aria-hidden="true"
              className={`${styles.storyParagraph} ${
                isStoryInView ? styles.storyParagraphInView : ""
              }`}
              ref={storyRef}
            >
              {storyTokens.map((token, idx) => (
                <span
                  className={`${styles.storyWord} ${token.white ? styles.storyWhite : ""}`}
                  key={token.key}
                  style={staggerStyle(idx % 34)}
                >
                  {token.text}
                  {idx < storyTokens.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
            <p className={styles.srOnly}>
              Cozy Designs creates posters, album covers, lettering, comic illustration, and
              motion artwork for music culture and visual storytelling.
            </p>
          </div>
        </section>

        <section className={styles.projectsSection} id="portfolio">
          <div className={styles.projectsHeading}>
            <p aria-hidden="true" className={styles.projectsShadow}>
              PROJECTS
            </p>
            <h2 className={styles.projectsTitle}>PROJECTS</h2>
            <p className={styles.projectsIntro}>
              My works across different design principles.
            </p>
          </div>

          <div className={styles.projectGrid}>
            {projectCards.map((project) => (
              <article className={styles.projectCard} key={project.title}>
                <Link className={styles.projectLink} href={project.href}>
                  <div className={styles.projectImageWrap}>
                    <img
                      alt={project.alt}
                      className={styles.projectImage}
                      decoding="async"
                      height={1400}
                      loading="lazy"
                      src={project.src}
                      width={1400}
                    />
                  </div>
                  <div className={styles.projectMeta}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectSubtitle}>{project.subtitle}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.originSection} aria-labelledby="origin-title" ref={originRef}>
          <h2 className={styles.originTitle} id="origin-title">
            THE STORY
          </h2>
          <div className={styles.originCard}>
            <div
              className={`${styles.originCopy} ${
                isOriginInView ? styles.originCopyInView : ""
              }`}
            >
              {originParagraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraph}>
                  {paragraph.split(" ").map((word, wordIndex) => {
                    const tokenIndex = paragraphIndex * 24 + wordIndex;
                    const hot = originHotWords.has(cleanWord(word));

                    return (
                      <span
                        className={`${styles.originWord} ${
                          hot ? styles.originWordHot : ""
                        }`}
                        key={`${paragraphIndex}-${wordIndex}-${word}`}
                        style={originWordStyle(tokenIndex)}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>
            <img
              alt="Cozy Designs mascot sketching on a bean bag"
              className={styles.originMascot}
              decoding="async"
              height={621}
              loading="lazy"
              src="/cozydesigns/cozy-design-the-story-mascot.png"
              width={683}
            />
          </div>
        </section>

        <div aria-hidden="true" className={styles.futureSpacer} />

        <section className={styles.collageSection}>
          <div className={styles.collageGrid}>
            {collageImages.map((image) => (
              <div className={styles.collageItem} key={image.src}>
                <img
                  alt={image.alt}
                  className={styles.collageImage}
                  decoding="async"
                  height={1400}
                  loading="lazy"
                  src={image.src}
                  width={1400}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
