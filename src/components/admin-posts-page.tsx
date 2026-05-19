"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import type { LatestPost } from "@/lib/latest-posts";

import styles from "./admin-posts-page.module.css";
import { SiteNav } from "./site-nav";

const tokenStorageKey = "cozy-admin-token";
const maxUploadBytes = 4 * 1024 * 1024;

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json().catch(() => ({}))) as T;
}

export function AdminPostsPage() {
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [editingPost, setEditingPost] = useState<LatestPost | null>(null);
  const [loginError, setLoginError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDeleting, setIsDeleting] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [hasLoadedStoredToken, setHasLoadedStoredToken] = useState(false);
  const [publishedLink, setPublishedLink] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setToken(window.localStorage.getItem(tokenStorageKey) ?? "");
      setHasLoadedStoredToken(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    void refreshPosts();
  }, [token]);

  async function refreshPosts() {
    try {
      const response = await fetch("/api/latest-posts");
      const result = await readJson<{ posts?: LatestPost[] }>(response);
      setPosts(result.posts ?? []);
    } catch {
      setUploadError("Could not load posts. Check the dev server and try again.");
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        body: JSON.stringify({
          password: formData.get("password"),
          username: formData.get("username"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = await readJson<{ error?: string; token?: string }>(response);

      if (!response.ok || !result.token) {
        setLoginError(result.error ?? "Could not log in.");
        return;
      }

      window.localStorage.setItem(tokenStorageKey, result.token);
      setToken(result.token);
    } catch {
      setLoginError("Could not reach the login endpoint. Check the dev server and try again.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError("");
    setPublishedLink("");
    setIsUploading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const media = formData.get("media");

    if (media instanceof File && media.size > maxUploadBytes) {
      setUploadError(
        "This file is over 4 MB. Use the hosted media URL field for larger videos.",
      );
      setIsUploading(false);
      return;
    }

    if (!editingPost) {
      const mediaUrl = formData.get("mediaUrl");
      const hasMediaUrl = typeof mediaUrl === "string" && mediaUrl.trim().length > 0;
      const hasFile = media instanceof File && media.size > 0;

      if (!hasMediaUrl && !hasFile) {
        setUploadError("Upload a file or paste a hosted media URL.");
        setIsUploading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/latest-posts", {
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: editingPost ? "PATCH" : "POST",
      });

      const result = await readJson<{
        error?: string;
        post?: { slug: string };
      }>(response);

      if (!response.ok || !result.post) {
        setUploadError(result.error ?? "Could not publish this post.");
        return;
      }

      form.reset();
      setEditingPost(null);
      setPublishedLink(`/latest-posts/${result.post.slug}`);
      await refreshPosts();
    } catch {
      setUploadError("Could not reach the posts endpoint. Check the dev server and try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(post: LatestPost) {
    setIsDeleting(post.id);
    setUploadError("");

    try {
      const response = await fetch("/api/latest-posts", {
        body: JSON.stringify({ id: post.id }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await readJson<{ error?: string }>(response);
        setUploadError(result.error ?? "Could not delete this post.");
        return;
      }

      if (editingPost?.id === post.id) {
        setEditingPost(null);
      }

      await refreshPosts();
    } catch {
      setUploadError("Could not reach the posts endpoint. Check the dev server and try again.");
    } finally {
      setIsDeleting("");
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(tokenStorageKey);
    setToken("");
    setPosts([]);
    setPublishedLink("");
    setEditingPost(null);
  }

  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <section className={styles.shell}>
          <div className={styles.heading}>
            <p className={styles.kicker}>Admin</p>
            <h1>Latest Posts</h1>
          </div>

          {!hasLoadedStoredToken ? (
            <div className={styles.panel}>Loading...</div>
          ) : !token ? (
            <form className={styles.panel} onSubmit={handleLogin}>
              <label>
                Username
                <input autoComplete="username" name="username" required type="text" />
              </label>
              <label>
                Password
                <input autoComplete="current-password" name="password" required type="password" />
              </label>
              {loginError ? <p className={styles.error}>{loginError}</p> : null}
              <button disabled={isLoggingIn} type="submit">
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <>
            <form
              className={styles.panel}
              key={editingPost?.id ?? "new-post"}
              onSubmit={handleUpload}
            >
              <div className={styles.topBar}>
                <p>{editingPost ? "Editing post" : "Signed in"}</p>
                <button className={styles.secondaryButton} onClick={handleLogout} type="button">
                  Logout
                </button>
              </div>

              {editingPost ? <input name="id" type="hidden" value={editingPost.id} /> : null}

              <label>
                Post title
                <input
                  defaultValue={editingPost?.title}
                  maxLength={70}
                  minLength={10}
                  name="title"
                  required
                  type="text"
                />
              </label>
              <label>
                One line description
                <textarea
                  defaultValue={editingPost?.description}
                  minLength={80}
                  name="description"
                  required
                  rows={3}
                />
              </label>
              <label>
                Media alt text
                <input
                  defaultValue={editingPost?.alt}
                  maxLength={125}
                  minLength={10}
                  name="alt"
                  required
                  type="text"
                />
              </label>
              <label>
                Small file upload
                <input
                  accept="image/gif,image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  name="media"
                  type="file"
                />
              </label>
              <p className={styles.fieldNote}>
                Upload JPG, PNG, WEBP, GIF, MP4, or WEBM up to 4 MB. Paste a hosted media URL for
                larger videos.
              </p>

              <div className={styles.fieldGrid}>
                <label>
                  Hosted media URL
                  <input
                    defaultValue={editingPost?.mediaKey ? "" : editingPost?.mediaUrl}
                    name="mediaUrl"
                    placeholder="https://..."
                    type="url"
                  />
                </label>
                <label>
                  Hosted media type
                  <select defaultValue={editingPost?.mediaType ?? "image"} name="mediaType">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </label>
              </div>

              <div className={styles.fieldGrid}>
                <label>
                  Instagram URL
                  <input
                    defaultValue={editingPost?.instagramUrl}
                    name="instagramUrl"
                    placeholder="https://www.instagram.com/..."
                    type="url"
                  />
                </label>
                <label>
                  Pinterest URL
                  <input
                    defaultValue={editingPost?.pinterestUrl}
                    name="pinterestUrl"
                    placeholder="https://www.pinterest.com/..."
                    type="url"
                  />
                </label>
              </div>

              <div className={styles.seoBox}>
                <label>
                  SEO title
                  <input
                    defaultValue={editingPost?.seoTitle}
                    maxLength={60}
                    minLength={10}
                    name="seoTitle"
                    required
                    type="text"
                  />
                </label>
                <label>
                  SEO description
                  <textarea
                    defaultValue={editingPost?.seoDescription}
                    maxLength={160}
                    minLength={120}
                    name="seoDescription"
                    required
                    rows={3}
                  />
                </label>
                <label>
                  SEO keywords
                  <input
                    defaultValue={editingPost?.seoKeywords}
                    name="seoKeywords"
                    placeholder="poster, motion, cozy designs"
                    required
                    type="text"
                  />
                </label>
              </div>

              {uploadError ? <p className={styles.error}>{uploadError}</p> : null}
              {publishedLink ? (
                <p className={styles.success}>
                  Published at <Link href={publishedLink}>{publishedLink}</Link>
                </p>
              ) : null}
              <button disabled={isUploading} type="submit">
                {isUploading ? "Saving..." : editingPost ? "Save Changes" : "Publish Post"}
              </button>
              {editingPost ? (
                <button
                  className={styles.secondaryButton}
                  onClick={() => {
                    setEditingPost(null);
                    setPublishedLink("");
                  }}
                  type="button"
                >
                  Cancel Edit
                </button>
              ) : null}
            </form>
            <section className={styles.managePanel} aria-label="Manage posts">
              <div className={styles.manageHeader}>
                <h2>Manage Posts</h2>
                <button className={styles.secondaryButton} onClick={refreshPosts} type="button">
                  Refresh
                </button>
              </div>
              {posts.length > 0 ? (
                <div className={styles.postList}>
                  {posts.map((post) => (
                    <article className={styles.postRow} key={post.id}>
                      <div className={styles.postPreview}>
                        {post.mediaType === "video" ? (
                          <video muted playsInline preload="metadata" src={post.mediaUrl} />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt="" decoding="async" loading="lazy" src={post.mediaUrl} />
                        )}
                      </div>
                      <div className={styles.postMeta}>
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                        <Link href={`/latest-posts/${post.slug}`}>View post</Link>
                      </div>
                      <div className={styles.postActions}>
                        <button onClick={() => setEditingPost(post)} type="button">
                          Edit
                        </button>
                        <button
                          className={styles.dangerButton}
                          disabled={isDeleting === post.id}
                          onClick={() => handleDelete(post)}
                          type="button"
                        >
                          {isDeleting === post.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyManager}>No posts published yet.</p>
              )}
            </section>
            </>
          )}
        </section>
      </main>
    </>
  );
}
