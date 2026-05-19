import type { MetadataRoute } from "next";

import { getLatestPosts } from "@/lib/latest-posts";
import { siteConfig } from "@/lib/seo";

export const revalidate = 3600;

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/posters", priority: 0.9 },
  { path: "/album-covers", priority: 0.9 },
  { path: "/animations", priority: 0.9 },
  { path: "/clouded", priority: 0.8 },
  { path: "/latest-posts", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/privacy-policy", priority: 0.2 },
  { path: "/terms-and-conditions", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getLatestPosts();
  const staticLastModified = new Date();

  return [
    ...staticRoutes.map((route) => ({
      changeFrequency: "weekly" as const,
      lastModified: staticLastModified,
      priority: route.priority,
      url: `${siteConfig.siteUrl}${route.path === "/" ? "" : route.path}`,
    })),
    ...posts.map((post) => ({
      changeFrequency: "monthly" as const,
      images: post.mediaType === "image" ? [new URL(post.mediaUrl, siteConfig.siteUrl).toString()] : undefined,
      lastModified: new Date(post.updatedAt ?? post.createdAt),
      priority: 0.65,
      url: `${siteConfig.siteUrl}/latest-posts/${post.slug}`,
    })),
  ];
}
