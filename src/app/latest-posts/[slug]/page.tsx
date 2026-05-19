/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "@/components/latest-posts-page.module.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { getLatestPost } from "@/lib/latest-posts";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  clampMetaDescription,
  cleanMetaTitle,
  siteConfig,
} from "@/lib/seo";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getLatestPost(slug);

  if (!post) {
    return {
      title: "Post not found | Cozy Designs",
    };
  }

  const title = cleanMetaTitle(post.seoTitle || post.title, post.title);
  const description = clampMetaDescription(post.seoDescription || post.description, post.description);
  const fallbackImage = post.mediaType === "image" ? post.mediaUrl : "/opengraph-image";
  const baseMetadata = buildMetadata({
    description,
    image: fallbackImage,
    imageAlt: post.alt || post.title,
    path: `/latest-posts/${post.slug}`,
    title,
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      description,
      images: [
        {
          alt: post.alt || post.title,
          height: 630,
          url: fallbackImage,
          width: 1200,
        },
      ],
      siteName: siteConfig.siteName,
      title,
      type: "article",
      url: absoluteUrl(`/latest-posts/${post.slug}`),
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getLatestPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": post.mediaType === "video" ? "VideoObject" : "ImageObject",
          author: {
            "@type": "Person",
            name: siteConfig.creatorName,
            url: absoluteUrl("/about"),
          },
          contentUrl: absoluteUrl(post.mediaUrl),
          creator: {
            "@type": "Person",
            name: siteConfig.creatorName,
            url: absoluteUrl("/about"),
          },
          datePublished: post.createdAt,
          description: post.description,
          mainEntityOfPage: absoluteUrl(`/latest-posts/${post.slug}`),
          name: post.title,
          keywords: post.seoKeywords,
          thumbnailUrl: post.mediaType === "image" ? absoluteUrl(post.mediaUrl) : undefined,
          uploadDate: post.mediaType === "video" ? post.createdAt : undefined,
          url: absoluteUrl(`/latest-posts/${post.slug}`),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Latest Posts", path: "/latest-posts" },
          { name: post.title, path: `/latest-posts/${post.slug}` },
        ])}
      />
      <SiteNav />
      <main className={styles.page}>
        <article className={styles.detail}>
          <div className={styles.detailMedia}>
            {post.mediaType === "video" ? (
              <video
                className={styles.media}
                controls
                playsInline
                preload="metadata"
                src={post.mediaUrl}
              />
            ) : (
              <img
                alt={post.alt}
                className={styles.media}
                decoding="async"
                fetchPriority="high"
                src={post.mediaUrl}
              />
            )}
          </div>
          <div className={styles.detailPanel}>
            <Link className={styles.backLink} href="/latest-posts">
              Back to latest posts
            </Link>
            <p className={styles.date}>
              {new Intl.DateTimeFormat("en", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(post.createdAt))}
            </p>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.description}>{post.description}</p>
            <div className={styles.socials}>
              {post.instagramUrl ? (
                <a href={post.instagramUrl} rel="noreferrer" target="_blank">
                  Instagram
                </a>
              ) : null}
              {post.pinterestUrl ? (
                <a href={post.pinterestUrl} rel="noreferrer" target="_blank">
                  Pinterest
                </a>
              ) : null}
              <Link href={`/latest-posts/${post.slug}`}>Share Link</Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
