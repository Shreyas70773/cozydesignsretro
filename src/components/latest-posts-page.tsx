/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import type { LatestPost } from "@/lib/latest-posts";

import styles from "./latest-posts-page.module.css";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

export function LatestPostsPage({ posts }: { posts: LatestPost[] }) {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Cozy feed</p>
          <h1 className={styles.title}>Latest Posts</h1>
        </section>

        {posts.length > 0 ? (
          <section className={styles.feed} aria-label="Latest posts">
            {posts.map((post, index) => (
              <article className={styles.card} key={post.id}>
                {post.mediaType === "video" ? (
                  <div className={styles.mediaFrame}>
                    <video
                      className={styles.media}
                      controls
                      muted
                      playsInline
                      preload="metadata"
                      src={post.mediaUrl}
                    />
                  </div>
                ) : (
                  <Link className={styles.mediaLink} href={`/latest-posts/${post.slug}`}>
                    <img
                      alt={post.alt}
                      className={styles.media}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      loading={index === 0 ? "eager" : "lazy"}
                      src={post.mediaUrl}
                    />
                  </Link>
                )}
                <div className={styles.cardBody}>
                  <p className={styles.date}>
                    {new Intl.DateTimeFormat("en", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(post.createdAt))}
                  </p>
                  <h2 className={styles.postTitle}>
                    <Link href={`/latest-posts/${post.slug}`}>{post.title}</Link>
                  </h2>
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
            ))}
          </section>
        ) : (
          <section className={styles.empty}>
            <h2>No posts yet</h2>
            <p>Fresh work is coming soon.</p>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
