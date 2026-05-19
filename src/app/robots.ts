import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const isDeployPreview =
    process.env.CONTEXT != null && process.env.CONTEXT !== "production";

  if (isDeployPreview) {
    return {
      rules: {
        disallow: "/",
        userAgent: "*",
      },
    };
  }

  return {
    host: siteConfig.siteUrl,
    rules: [
      {
        allow: "/",
        disallow: ["/admin", "/api"],
        userAgent: "*",
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
