import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { HomePage } from "@/components/home-page";
import { absoluteUrl, buildMetadata, organizationId, personId, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Cozy Designs creates retro comic posters, album covers, motion posters, and culture-led visuals for artists, musicians, brands, and events.",
  path: "/",
  title: "Cozy Designs - Poster, Album Cover & Motion Design",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.siteName,
            publisher: { "@id": organizationId },
            url: siteConfig.siteUrl,
          },
          {
            "@context": "https://schema.org",
            "@id": organizationId,
            "@type": "Organization",
            email: siteConfig.email,
            founder: {
              "@id": personId,
              "@type": "Person",
              image: absoluteUrl("/cozydesigns/about-us-picture-final.jpeg"),
              name: siteConfig.creatorName,
              url: absoluteUrl("/about"),
            },
            logo: {
              "@type": "ImageObject",
              url: absoluteUrl("/icon.png"),
            },
            name: siteConfig.siteName,
            sameAs: Object.values(siteConfig.social),
            url: siteConfig.siteUrl,
          },
        ]}
      />
      <HomePage />
    </>
  );
}
