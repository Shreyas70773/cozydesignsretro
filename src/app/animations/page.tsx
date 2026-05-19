import type { Metadata } from "next";

import { AnimationsPage } from "@/components/animations-page";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Motion poster and animation work by Cozy Designs, including frame-by-frame rotoscope studies, music visuals, and animated poster experiments.",
  image: "/cozydesigns/animations/punk-rocky-hero.webp",
  imageAlt: "Punk Rocky motion poster key artwork by Cozy Designs",
  path: "/animations",
  title: "Motion Poster Design",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          contentUrl: absoluteUrl("/cozydesigns/animations/video3-h264.mp4"),
          creator: {
            "@type": "Person",
            name: siteConfig.creatorName,
          },
          description:
            "A motion poster inspired by Punk Rocky, built with frame-by-frame rotoscope and poster-led animation.",
          duration: "PT15S",
          embedUrl: absoluteUrl("/animations"),
          name: "Punk Rocky Motion Poster Study",
          thumbnailUrl: absoluteUrl("/cozydesigns/animations/punk-rocky-hero.webp"),
          uploadDate: "2026-05-11",
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Motion Poster Design", path: "/animations" }])} />
      <AnimationsPage />
    </>
  );
}
