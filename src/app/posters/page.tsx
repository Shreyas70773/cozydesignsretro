import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { PostersPage } from "@/components/posters-page";
import { posters } from "@/lib/posters";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Explore retro comic poster design by Cozy Designs, including hip-hop posters, illustrated portraits, music artwork, and culture-led visual studies.",
  image: "/cozydesigns/portfolio-assets/dd276a8e-the-world-is-yours-poster.webp",
  imageAlt: "The World Is Yours retro comic poster by Cozy Designs",
  path: "/posters",
  title: "Retro Comic Poster Design",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          hasPart: posters.map((poster) => ({
            "@type": "VisualArtwork",
            creator: {
              "@type": "Person",
              name: siteConfig.creatorName,
            },
            image: absoluteUrl(poster.src),
            name: poster.title,
            url: `${absoluteUrl("/posters")}#${poster.slug}`,
          })),
          name: "Retro Comic Poster Design",
          url: absoluteUrl("/posters"),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Retro Comic Poster Design", path: "/posters" }])} />
      <PostersPage />
    </>
  );
}
