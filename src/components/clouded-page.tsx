/* eslint-disable @next/next/no-img-element */

import type { CSSProperties, ReactNode } from "react";

import { AutoplayVideo } from "./autoplay-video";
import styles from "./clouded-page.module.css";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

const optimizedAssets = new Set([
  "animated-gif-frame.png",
  "event-flyers-bg.png",
  "final-output-1.png",
  "final-output-2.png",
  "final-output-3.png",
  "final-output-4.png",
  "final-output-5.png",
  "final-output-6.png",
  "font-ziv-comic.png",
  "img-4517.png",
  "img-4536.png",
  "logo-explorations.png",
  "outcome-right.png",
  "photo-wall.png",
]);

const asset = (name: string) => {
  const filename = optimizedAssets.has(name) ? name.replace(/\.(png|jpe?g)$/i, ".webp") : name;
  return `/cozydesigns/clouded/${filename}`;
};

const motionAssets: Record<string, string> = {
  "animated-gif-frame.png": "/cozydesigns/clouded/animated-gif-frame.mp4",
  "img-4536.png": "/cozydesigns/clouded/img-4536.mp4",
};

type Box = {
  h: number;
  left: number;
  top: number;
  w: number;
};

type ImageLayer = Box & {
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
  img?: Partial<Box>;
  name: string;
};

type TextLayer = Box & {
  align?: "left" | "center" | "right";
  children: ReactNode;
  className?: string;
  size: number;
  tag?: "div" | "h2" | "h3";
};

const pos = ({ h, left, top, w }: Box): CSSProperties => ({
  height: `${h}px`,
  left: `${left}px`,
  top: `${top}px`,
  width: `${w}px`,
});

const imgPos = (box?: Partial<Box>): CSSProperties =>
  box
    ? {
        height: box.h == null ? undefined : `${box.h}%`,
        left: box.left == null ? undefined : `${box.left}%`,
        top: box.top == null ? undefined : `${box.top}%`,
        width: box.w == null ? undefined : `${box.w}%`,
      }
    : {};

function ImageLayer({ alt, className, fit = "cover", img, name, ...box }: ImageLayer) {
  const mediaClass = fit === "contain" ? styles.imageContain : styles.imageCover;
  const videoSrc = motionAssets[name];

  return (
    <div className={`${styles.imageLayer} ${className ?? ""}`} style={pos(box)}>
      {videoSrc ? (
        <AutoplayVideo
          aria-label={alt}
          className={mediaClass}
          height={Math.round(box.h)}
          loop
          poster={asset(name)}
          preload="auto"
          style={imgPos(img)}
          width={Math.round(box.w)}
        >
          <source src={videoSrc} type="video/mp4" />
        </AutoplayVideo>
      ) : (
        <img
          alt={alt}
          className={mediaClass}
          decoding="async"
          height={Math.round(box.h)}
          loading="lazy"
          src={asset(name)}
          style={imgPos(img)}
          width={Math.round(box.w)}
        />
      )}
    </div>
  );
}

function MotionClip({ alt, className, name }: { alt: string; className?: string; name: string }) {
  return (
    <AutoplayVideo
      aria-label={alt}
      className={className}
      loop
      poster={asset(name)}
      preload="auto"
    >
      <source src={motionAssets[name]} type="video/mp4" />
    </AutoplayVideo>
  );
}

function TextLayer({ align = "left", children, className, size, tag = "div", ...box }: TextLayer) {
  const Component = tag;

  return (
    <Component
      className={`${styles.textLayer} ${className ?? ""}`}
      style={{ ...pos(box), fontSize: `${size}px`, textAlign: align }}
    >
      {children}
    </Component>
  );
}

const finalOutput = [
  { alt: "Clouded final illustrated flyer one", name: "final-output-1.png" },
  { alt: "Clouded final illustrated flyer two", name: "final-output-2.png" },
  { alt: "Clouded final illustrated flyer three", name: "final-output-3.png" },
  { alt: "Clouded final illustrated flyer four", name: "final-output-4.png" },
  { alt: "Clouded final illustrated flyer five", name: "final-output-5.png" },
  { alt: "Clouded final illustrated flyer six", name: "final-output-6.png" },
];

const mobileHighlights = [
  {
    body: "Kinetic and dramatic but too frenetic. CLOUDED needed stillness, not acceleration.",
    imageClass: styles.logoCropTop,
    title: "02 - Arched Lettering + Speed Lines",
  },
  {
    body: "Too literal. When the letterform is the concept, it becomes decorative rather than iconic.",
    imageClass: styles.logoCropRight,
    title: "03 - Cloud-Form Bubble Letters",
  },
  {
    body: "Rounded strokes, retro 70s soul-record warmth, mixed-case personality. Strong foundation, then refined.",
    imageClass: styles.logoCropBottom,
    title: "04 - Groovy Mixed-Case",
  },
];

export function CloudedPage() {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <section className={styles.desktopStage} aria-label="Clouded case study desktop layout">
        <h1 className={styles.srOnly}>Clouded Event Identity, Illustration and Typography</h1>
        <div className={styles.artboard}>
          <ImageLayer
            alt=""
            h={1144}
            left={0}
            name="img-4517.png"
            top={-32}
            w={2033}
          />
          <ImageLayer alt="" h={248} left={487} name="torn-paper.png" top={675} w={496} />
          <ImageLayer
            alt=""
            className={styles.paperRight}
            h={248}
            left={957}
            name="torn-paper.png"
            top={663}
            w={496}
          />
          <TextLayer className={styles.heroLabel} h={62} left={499} size={62} top={761} w={937}>
            Event Identity, Illustration & Typography
          </TextLayer>
          <ImageLayer
            alt="Clouded event cover artwork"
            h={570}
            img={{ h: 160.18, left: 0, top: 0, w: 100.01 }}
            left={148}
            name="img-4518.png"
            top={49}
            w={1623}
          />
          <div className={styles.blackBlock} style={pos({ h: 1090, left: -22, top: 1112, w: 1942 })} />
          <div className={styles.translucentCard} style={pos({ h: 303, left: 898, top: 1819, w: 620 })} />
          <ImageLayer
            alt="Clouded event crowd"
            h={680}
            img={{ h: 223.04, left: 0, top: -69.71, w: 100 }}
            left={898}
            name="event-crowd.png"
            top={1116}
            w={1013}
          />
          <ImageLayer
            alt="The Pit venue strip"
            h={133}
            img={{ h: 577.91, left: -0.01, top: -116.56, w: 100.01 }}
            left={16}
            name="img-4205.png"
            top={1294}
            w={882}
          />
          <ImageLayer
            alt="Clouded night atmosphere"
            h={381}
            img={{ h: 159.64, left: -0.06, top: -16.36, w: 105.22 }}
            left={-25}
            name="img-4032.png"
            top={1819}
            w={882}
          />
          <TextLayer className={styles.lightText} h={360} left={71} size={44} top={1463} w={786}>
            <p>UK-based music discovery platform, dedicated to the evolution of R&B.</p>
            <p>300K+ Followers on Instagram, 400K+ on TikTok.</p>
            <p>
              Label partnerships with Sony, Warner, Universal & RCA. Work with Drake, SZA,
              PARTYNEXTDOOR, Brent Faiyaz.
            </p>
          </TextLayer>
          <TextLayer className={styles.lightText} h={255} left={947} size={44} top={1842} w={539}>
            <p>&quot;Do Not Disturb&quot; is Manchester&apos;s fastest growing R&B event brand:</p>
            <p>13 live shows, 10 sold out, across 5 venues and 3 cities.</p>
          </TextLayer>
          <ImageLayer
            alt="Clouded mark"
            h={309}
            img={{ h: 129.96, left: -73.7, top: -13.32, w: 249.26 }}
            left={1518}
            name="just-logo.png"
            top={1807}
            w={308}
          />

          <ImageLayer
            alt="Clouded animated identity spread"
            className={styles.motionSpread}
            h={1813}
            img={{ h: 108.77, left: -2.71, top: -7.78, w: 102.71 }}
            left={-3}
            name="animated-gif-frame.png"
            top={2200}
            w={1920}
          />

          <ImageLayer
            alt="Logo exploration one"
            h={435}
            img={{ h: 538.83, left: -11.38, top: 0.07, w: 111.42 }}
            left={1035}
            name="logo-explorations.png"
            top={4119}
            w={898}
          />
          <ImageLayer
            alt="Logo exploration two"
            h={322}
            img={{ h: 700.65, left: -10.67, top: -323.92, w: 119.56 }}
            left={32}
            name="logo-explorations.png"
            top={4610}
            w={806}
          />
          <ImageLayer
            alt="Logo exploration three"
            h={396}
            img={{ h: 535.74, left: -10.12, top: -129.14, w: 110.15 }}
            left={1068}
            name="logo-explorations.png"
            top={5249}
            w={822}
          />
          <ImageLayer
            alt="Logo exploration four"
            h={309}
            img={{ h: 700.65, left: -8.85, top: -460.84, w: 116.43 }}
            left={37}
            name="logo-explorations.png"
            top={5613}
            w={794}
          />
          <TextLayer h={96} left={56} size={96} tag="h2" top={4091} w={635}>
            Logo Explorations
          </TextLayer>
          <TextLayer h={160} left={56} size={40} top={4210} w={647}>
            The word &quot;CLOUDED&quot; needed to feel simultaneously retro and contemporary, bold and
            atmospheric, structured and organic.
          </TextLayer>
          <TextLayer align="right" h={48} left={1147} size={48} tag="h3" top={4618} w={657}>
            01 - 3D Comic Font + Hard Shadow
          </TextLayer>
          <TextLayer align="right" h={80} left={1134} size={40} top={4700} w={670}>
            Too aggressive. Marvel/DC energy reads confrontational, wrong frequency for an intimate
            R&B night.
          </TextLayer>
          <TextLayer h={48} left={56} size={48} tag="h3" top={4940} w={657}>
            02 - Arched Lettering + Speed Lines
          </TextLayer>
          <TextLayer h={103} left={56} size={40} top={5011} w={672}>
            Kinetic and dramatic but too frenetic. CLOUDED needed stillness, not acceleration.
          </TextLayer>
          <TextLayer align="right" h={48} left={1137} size={48} tag="h3" top={5668} w={657}>
            03 - Cloud-Form Bubble Letters
          </TextLayer>
          <TextLayer align="right" h={234} left={1075} size={40} top={5739} w={725}>
            Too literal. When the letterform IS the concept, it becomes decorative rather than iconic.
          </TextLayer>
          <TextLayer h={48} left={67} size={48} tag="h3" top={5872} w={657}>
            04 - Groovy Mixed-Case
          </TextLayer>
          <TextLayer h={234} left={60} size={40} top={5945} w={715}>
            First direction that felt right. Rounded strokes, retro 70s soul-record warmth, mixed-case
            personality. Strong foundation, needed refinement.
          </TextLayer>
          <TextLayer h={64} left={50} size={64} tag="h2" top={6258} w={569}>
            Final Selected Logo
          </TextLayer>
          <ImageLayer
            alt="Final selected Clouded logo"
            h={404}
            img={{ h: 168.61, left: 0, top: -34.28, w: 100 }}
            left={163}
            name="final-logo.png"
            top={6387}
            w={1532}
          />
          <TextLayer h={234} left={50} size={44} top={6880} w={1759}>
            <p>Refined evolution of 04.</p>
            <p>The defining move: CLOUDed in mixed-case.</p>
            <p>
              Bold uppercase CLOUD announces itself, lowercase ed trails off - present, then fades.
              The whole concept in one typographic decision.
            </p>
          </TextLayer>

          <TextLayer align="center" h={84} left={711} size={96} tag="h2" top={7202} w={498}>
            LETTERING
          </TextLayer>
          <ImageLayer
            alt="ZIV comic font specimen"
            h={494}
            img={{ h: 149.01, left: -0.04, top: 0, w: 100.08 }}
            left={244}
            name="font-ziv-comic.png"
            top={7564}
            w={1308}
          />
          <ImageLayer
            alt="ZIV comic font lowercase specimen"
            h={224}
            img={{ h: 328.17, left: -2.43, top: -218.03, w: 109.15 }}
            left={327}
            name="font-ziv-comic.png"
            top={8048}
            w={1199}
          />
          <TextLayer align="center" h={128} left={518} size={128} tag="h3" top={7467} w={759}>
            ZIV Comic font
          </TextLayer>
          <TextLayer align="center" h={88} left={288} size={44} top={8318} w={1238}>
            Display typeface: Used for all headline copy across the event series. Hand-constructed 3D
            comic bold with outlined shadow.
          </TextLayer>
          <ImageLayer
            alt="Secondary lettering mark"
            h={140}
            img={{ h: 137.95, left: -0.11, top: -18.86, w: 100.08 }}
            left={951}
            name="img-4082.png"
            top={8486}
            w={261}
          />
          <ImageLayer
            alt="Artist name lettering"
            h={412}
            img={{ h: 155.6, left: -0.05, top: 0, w: 100.11 }}
            left={244}
            name="img-4072.png"
            top={8680}
            w={1291}
          />
          <ImageLayer
            alt="Artist name lettering detail"
            h={229}
            img={{ h: 278.79, left: -0.03, top: -178.94, w: 116.09 }}
            left={372}
            name="img-4072.png"
            top={9092}
            w={1110}
          />
          <TextLayer align="center" h={88} left={307} size={44} top={9335} w={1163}>
            Derived from the logo letterforms. Used for artist name treatments and secondary display
            text.
          </TextLayer>

          <ImageLayer
            alt="Clouded event flyer wall"
            className={styles.flyerWallMotion}
            h={1324}
            left={0}
            name="img-4536.png"
            top={9504}
            w={1920}
          />
          <TextLayer align="center" h={96} left={723} size={96} tag="h2" top={10872} w={473}>
            EVENT FLYERS
          </TextLayer>
          <ImageLayer alt="Clouded event flyer artwork" h={1080} left={0} name="event-flyers-bg.png" top={11072} w={1920} />

          <div className={styles.darkFinal} style={pos({ h: 8035, left: 0, top: 12152, w: 1913 })} />
          <TextLayer className={styles.lightText} h={108} left={160} size={36} top={12204} w={1676}>
            Every figure across all six flyers began as a full ink-style illustration - drawn from
            photographic reference, rendered in comic linework, and built to hold detail at large print
            scale. This spread shows the full cast across the event series: all twelve figures,
            together.
          </TextLayer>
          <TextLayer align="center" className={styles.lightText} h={96} left={765} size={96} tag="h2" top={12332} w={448}>
            FINAL OUTPUT
          </TextLayer>
          <ImageLayer alt="Clouded final illustrated flyer one" h={1085} left={55} name="final-output-1.png" top={12447} w={868} />
          <ImageLayer alt="Clouded final illustrated flyer two" h={1087} left={989} name="final-output-2.png" top={12445} w={870} />
          <ImageLayer alt="Clouded final illustrated flyer three" h={1080} left={60} name="final-output-3.png" top={13629} w={864} />
          <ImageLayer alt="Clouded final illustrated flyer four" h={1083} left={994} name="final-output-4.png" top={13629} w={866} />
          <ImageLayer alt="Clouded final illustrated flyer five" h={1076} left={65} name="final-output-5.png" top={14802} w={861} />
          <ImageLayer alt="Clouded final illustrated flyer six" h={1080} left={996} name="final-output-6.png" top={14800} w={864} />
          <ImageLayer
            alt="Clouded event photography wall"
            h={2436}
            img={{ h: 110.41, left: -0.01, top: -15.58, w: 100.01 }}
            left={66}
            name="photo-wall.png"
            top={15927}
            w={1794}
          />
          <ImageLayer
            alt="Clouded outcome phone capture"
            h={990}
            img={{ h: 101.1, left: -3.13, top: -1.07, w: 120.92 }}
            left={70}
            name="outcome-mid.png"
            top={18294}
            w={547}
          />
          <ImageLayer
            alt="Clouded outcome poster capture"
            h={990}
            img={{ h: 100, left: 0, top: 0, w: 103.94 }}
            left={644}
            name="outcome-left.png"
            top={18295}
            w={635}
          />
          <ImageLayer
            alt="Clouded outcome event capture"
            h={996}
            img={{ h: 100.1, left: -7.33, top: -0.13, w: 118.46 }}
            left={1302}
            name="outcome-right.png"
            top={18294}
            w={558}
          />
          <div className={styles.outcomeCard} style={pos({ h: 631, left: 70, top: 19455, w: 760 })} />
          <div className={styles.outcomeCard} style={pos({ h: 631, left: 896, top: 19455, w: 932 })} />
          <TextLayer className={styles.lightText} h={96} left={86} size={96} tag="h2" top={19341} w={356}>
            OUTCOMES
          </TextLayer>
          <TextLayer className={styles.lightText} h={96} left={1125} size={96} tag="h2" top={19341} w={509}>
            CONTRIBUTIONS
          </TextLayer>
          <TextLayer className={styles.lightText} h={576} left={102} size={48} top={19489} w={680}>
            <p>6 illustrated flyers deployed across 2 events, 7 months apart</p>
            <p>Identity extended across print, merch, projection, and social media</p>
            <p>@clouded.clvb reel using the custom typography: 35K views, 2.1K likes, 242 saves</p>
            <p>Client returned for Clouded #2 - the identity held</p>
          </TextLayer>
          <TextLayer className={styles.lightText} h={64} left={975} size={64} tag="h3" top={19522} w={470}>
            PHOTOGRAPHY
          </TextLayer>
          <TextLayer className={styles.lightText} h={96} left={975} size={48} top={19607} w={384}>
            <p>Zidan</p>
            <p>IG - @shotsbyzidan</p>
          </TextLayer>
          <TextLayer className={styles.lightText} h={128} left={1435} size={64} tag="h3" top={19522} w={221}>
            EVENT CURATOR
          </TextLayer>
          <TextLayer className={styles.lightText} h={96} left={1437} size={48} top={19651} w={384}>
            <p>Zivoin Ristic</p>
            <p>IG - @zivsoundz</p>
          </TextLayer>
          <TextLayer className={styles.lightText} h={56} left={973} size={64} tag="h3" top={19862} w={389}>
            VIDEOGRAPHY
          </TextLayer>
          <TextLayer className={styles.lightText} h={144} left={975} size={48} top={19934} w={760}>
            <p>Event footage and social-first recap assets supported the identity rollout.</p>
          </TextLayer>
        </div>
        </section>

        <section className={styles.mobilePage} aria-label="Clouded case study mobile layout">
        <header className={styles.mobileHero}>
          <img alt="" className={styles.mobileHeroBg} decoding="async" src={asset("img-4517.png")} />
          <img
            alt="Clouded event identity cover"
            className={styles.mobileHeroPoster}
            decoding="async"
            fetchPriority="high"
            height={2304}
            src={asset("img-4518.png")}
            width={4096}
          />
          <p>Event Identity, Illustration & Typography</p>
        </header>

        <section className={styles.mobileIntro}>
          <img alt="Clouded event crowd" decoding="async" loading="lazy" src={asset("event-crowd.png")} />
          <p>
            UK-based music discovery platform dedicated to the evolution of R&B, with 300K+
            Instagram followers and label partnerships across Sony, Warner, Universal and RCA.
          </p>
          <p>
            &quot;Do Not Disturb&quot; is Manchester&apos;s fastest growing R&B event brand: 13 live shows, 10
            sold out, across 5 venues and 3 cities.
          </p>
        </section>

        <MotionClip
          alt="Clouded animated identity spread"
          className={`${styles.mobileFullBleed} ${styles.mobileMotionSpread}`}
          name="animated-gif-frame.png"
        />

        <section className={styles.mobileSection}>
          <h2>Logo Explorations</h2>
          <p>
            The word &quot;CLOUDED&quot; needed to feel retro and contemporary, bold and atmospheric,
            structured and organic.
          </p>
          <div className={styles.mobileLogoGrid}>
            {mobileHighlights.map((item) => (
              <article key={item.title}>
                <div className={`${styles.mobileLogoCrop} ${item.imageClass}`}>
                  <img alt="" decoding="async" loading="lazy" src={asset("logo-explorations.png")} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.mobileSection}>
          <h2>Final Selected Logo</h2>
          <img
            alt="Final selected Clouded logo"
            className={styles.mobileWideImage}
            decoding="async"
            loading="lazy"
            src={asset("final-logo.png")}
          />
          <p>
            Refined evolution of 04. The defining move: CLOUDed in mixed-case. Bold uppercase CLOUD
            announces itself, lowercase ed trails off - present, then fades.
          </p>
        </section>

        <section className={styles.mobileSection}>
          <h2>Lettering</h2>
          <img
            alt="ZIV comic font specimen"
            className={styles.mobileWideImage}
            decoding="async"
            loading="lazy"
            src={asset("font-ziv-comic.png")}
          />
          <p>
            Display typeface for headline copy across the event series, with secondary display text
            derived from the logo letterforms.
          </p>
          <img
            alt="Artist name lettering"
            className={styles.mobileWideImage}
            decoding="async"
            loading="lazy"
            src={asset("img-4072.png")}
          />
        </section>

        <MotionClip
          alt="Clouded event flyer wall"
          className={`${styles.mobileFullBleed} ${styles.mobileFlyerWallMotion}`}
          name="img-4536.png"
        />
        <section className={styles.mobileEventFlyers}>
          <h2>Event Flyers</h2>
          <img
            alt="Clouded event flyer artwork"
            decoding="async"
            loading="lazy"
            src={asset("event-flyers-bg.png")}
          />
        </section>

        <section className={styles.mobileFinal}>
          <p>
            Every figure across all six flyers began as a full ink-style illustration, drawn from
            photographic reference and rendered in comic linework.
          </p>
          <h2>Final Output</h2>
          <div className={styles.mobileFlyerGrid}>
            {finalOutput.map((image) => (
              <img
                alt={image.alt}
                decoding="async"
                key={image.name}
                loading="lazy"
                src={asset(image.name)}
              />
            ))}
          </div>
          <img
            alt="Clouded event photography wall"
            className={styles.mobilePhotoWall}
            decoding="async"
            loading="lazy"
            src={asset("photo-wall.png")}
          />
          <div className={styles.mobileOutcomeImages}>
            <img alt="Clouded outcome phone capture" decoding="async" loading="lazy" src={asset("outcome-mid.png")} />
            <img alt="Clouded outcome poster capture" decoding="async" loading="lazy" src={asset("outcome-left.png")} />
            <img alt="Clouded outcome event capture" decoding="async" loading="lazy" src={asset("outcome-right.png")} />
          </div>
          <div className={styles.mobileCards}>
            <article>
              <h3>Outcomes</h3>
              <p>6 illustrated flyers deployed across 2 events, 7 months apart.</p>
              <p>Identity extended across print, merch, projection, and social media.</p>
              <p>@clouded.clvb reel: 35K views, 2.1K likes, 242 saves.</p>
            </article>
            <article>
              <h3>Contributions</h3>
              <p>Photography: Zidan, IG - @shotsbyzidan</p>
              <p>Event curator: Zivoin Ristic, IG - @zivsoundz</p>
              <p>Videography and event curation supported the identity rollout.</p>
            </article>
          </div>
        </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
