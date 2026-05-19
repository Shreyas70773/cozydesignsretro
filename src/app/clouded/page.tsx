import type { Metadata } from "next";

import { CloudedPage } from "@/components/clouded-page";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Clouded event identity case study by Cozy Designs, covering branding, illustration, typography, flyers, and rollout for an R&B event series.",
  image: "/cozydesigns/clouded/img-4518.png",
  imageAlt: "Clouded event identity cover artwork by Cozy Designs",
  path: "/clouded",
  title: "Clouded Event Identity Case Study",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          creator: {
            "@type": "Person",
            name: siteConfig.creatorName,
          },
          description:
            "Event identity, illustration, and typography for Clouded, an R&B-focused event and discovery platform.",
          image: absoluteUrl("/cozydesigns/clouded/img-4518.png"),
          name: "Clouded Event Identity",
          url: absoluteUrl("/clouded"),
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Clouded Event Identity", path: "/clouded" }])} />
      <CloudedPage />
    </>
  );
}
