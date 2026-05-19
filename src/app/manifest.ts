import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#fff9dc",
    description: siteConfig.description,
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "/manifest-icon-192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/manifest-icon-512.png",
        type: "image/png",
      },
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "/maskable-icon-512.png",
        type: "image/png",
      },
    ],
    name: siteConfig.siteName,
    scope: "/",
    short_name: "Cozy",
    start_url: "/",
    theme_color: "#8bb9b8",
  };
}
