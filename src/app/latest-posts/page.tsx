import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { LatestPostsPage } from "@/components/latest-posts-page";
import { getLatestPosts } from "@/lib/latest-posts";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  description:
    "Explore the latest Cozy Designs posts: new poster artwork, album cover experiments, motion design studies, process notes, and culture-led visual updates.",
  path: "/latest-posts",
  title: "Latest Posts",
});

export default async function Page() {
  const posts = await getLatestPosts();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Latest Posts", path: "/latest-posts" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            item: absoluteUrl(`/latest-posts/${post.slug}`),
            name: post.title,
            position: index + 1,
          })),
          name: "Latest Posts",
          url: absoluteUrl("/latest-posts"),
        }}
      />
      <LatestPostsPage posts={posts} />
    </>
  );
}
