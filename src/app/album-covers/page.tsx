import type { Metadata } from "next";

import { AlbumCoversPage } from "@/components/album-covers-page";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Album cover design case study for TRIN's Want It All, combining hip-hop visual culture, comic-inspired illustration, and custom lettering.",
  image: "/cozydesigns/album-covers/reference-cover.webp",
  imageAlt: "Want It All comic-inspired album cover design by Cozy Designs",
  path: "/album-covers",
  title: "Album Cover Design",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VisualArtwork",
          artMedium: "Digital illustration and custom lettering",
          creator: {
            "@type": "Person",
            name: siteConfig.creatorName,
            url: absoluteUrl("/about"),
          },
          image: absoluteUrl("/cozydesigns/album-covers/reference-cover.webp"),
          name: "Want It All Album Cover Design",
          url: absoluteUrl("/album-covers"),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Album Cover Design", path: "/album-covers" }])} />
      <AlbumCoversPage />
    </>
  );
}
