import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { getStore } from "@netlify/blobs";

export type LatestPost = {
  alt: string;
  createdAt: string;
  description: string;
  id: string;
  instagramUrl: string;
  mediaContentType?: string;
  mediaKey?: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  pinterestUrl: string;
  seoDescription: string;
  seoKeywords: string;
  seoTitle: string;
  slug: string;
  title: string;
  updatedAt?: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "latest-posts.json");
const postsBlobKey = "posts.json";
const postStoreName = "cozy-latest-posts";
const mediaStoreName = "cozy-latest-media";
export const uploadDirectory = path.join(
  process.cwd(),
  "public",
  "cozydesigns",
  "latest-posts",
  "uploads",
);
export const uploadUrlBase = "/cozydesigns/latest-posts/uploads";

export class PersistentStorageUnavailableError extends Error {
  constructor(message = "Persistent storage is unavailable in this runtime") {
    super(message);
    this.name = "PersistentStorageUnavailableError";
  }
}

export function isPersistentStorageUnavailableError(
  error: unknown,
): error is PersistentStorageUnavailableError {
  return error instanceof PersistentStorageUnavailableError;
}

function isReadOnlyFunctionRuntime() {
  return (
    process.env.NETLIFY === "true" ||
    process.env.LAMBDA_TASK_ROOT === "/var/task" ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.cwd() === "/var/task"
  );
}

// getStore() throws synchronously with MissingBlobsEnvironmentError when no
// Lambda runtime context is present (e.g. during `next build` static prerender).
// Return undefined in that case so callers can treat the store as empty.
function tryGetStore(name: string) {
  try {
    return getStore({ consistency: "strong", name });
  } catch {
    return undefined;
  }
}

function getPostsStore() {
  return tryGetStore(postStoreName);
}

function getMediaStore() {
  return tryGetStore(mediaStoreName);
}

export async function getLatestPosts(): Promise<LatestPost[]> {
  const store = getPostsStore();
  if (store) {
    const posts = ((await store
      .get(postsBlobKey, { type: "json" })
      .catch((error: unknown) => {
        if ((error as { status?: number }).status === 404) {
          return [];
        }

        return [];
      })) ?? []) as LatestPost[];

    return sortPosts(posts);
  }

  if (isReadOnlyFunctionRuntime()) {
    return [];
  }

  try {
    const raw = await readFile(dataFile, "utf8");
    const posts = JSON.parse(raw) as LatestPost[];
    return sortPosts(posts);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function getLatestPost(slug: string): Promise<LatestPost | undefined> {
  const posts = await getLatestPosts();
  return posts.find((post) => post.slug === slug);
}

export async function saveLatestPost(post: LatestPost) {
  const posts = await getLatestPosts();
  await writeLatestPosts([post, ...posts]);
}

export async function updateLatestPost(
  postId: string,
  updates: Partial<Omit<LatestPost, "createdAt" | "id" | "slug">>,
) {
  const posts = await getLatestPosts();
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex === -1) {
    return undefined;
  }

  const updatedPost = { ...posts[postIndex], ...updates };
  const oldPost = posts[postIndex];
  posts[postIndex] = updatedPost;
  await writeLatestPosts(posts);

  if ("mediaKey" in updates && oldPost.mediaKey && oldPost.mediaKey !== updates.mediaKey) {
    await deleteStoredMedia(oldPost);
  }

  return updatedPost;
}

export async function deleteLatestPost(postId: string) {
  const posts = await getLatestPosts();
  const post = posts.find((entry) => entry.id === postId);

  if (!post) {
    return false;
  }

  await writeLatestPosts(posts.filter((entry) => entry.id !== postId));
  await deleteStoredMedia(post);
  return true;
}

async function writeLatestPosts(posts: LatestPost[]) {
  const sortedPosts = sortPosts(posts);
  const store = getPostsStore();

  if (store) {
    await store.setJSON(postsBlobKey, sortedPosts);
    return;
  }

  if (isReadOnlyFunctionRuntime()) {
    throw new PersistentStorageUnavailableError(
      "Netlify Blobs is unavailable, and the deployed function filesystem is read-only.",
    );
  }

  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, JSON.stringify(sortedPosts, null, 2), "utf8");
}

export async function saveMediaFile({
  bytes,
  contentType,
  filename,
}: {
  bytes: Buffer;
  contentType: string;
  filename: string;
}) {
  const mediaKey = filename;
  const store = getMediaStore();

  if (store) {
    const mediaBody = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;

    await store.set(mediaKey, mediaBody, {
      metadata: { contentType },
    });

    return {
      mediaKey,
      mediaUrl: `/api/latest-posts/media/${encodeURIComponent(mediaKey)}`,
    };
  }

  if (isReadOnlyFunctionRuntime()) {
    throw new PersistentStorageUnavailableError(
      "Netlify Blobs media storage is unavailable, and the deployed function filesystem is read-only.",
    );
  }

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, filename), bytes);

  return {
    mediaKey,
    mediaUrl: `${uploadUrlBase}/${filename}`,
  };
}

export async function getStoredMedia(mediaKey: string) {
  const store = getMediaStore();
  if (store) {
    const result = await store.getWithMetadata(mediaKey, {
      type: "arrayBuffer",
    });

    if (!result) {
      return undefined;
    }

    return {
      bytes: Buffer.from(result.data),
      contentType:
        typeof result.metadata.contentType === "string"
          ? result.metadata.contentType
          : "application/octet-stream",
    };
  }

  if (isReadOnlyFunctionRuntime()) {
    return undefined;
  }

  const filePath = path.join(uploadDirectory, mediaKey);
  const resolvedFile = path.resolve(filePath);
  const resolvedRoot = path.resolve(uploadDirectory);

  if (!resolvedFile.startsWith(resolvedRoot)) {
    return undefined;
  }

  try {
    return {
      bytes: await readFile(resolvedFile),
      contentType: contentTypeFromFilename(mediaKey),
    };
  } catch {
    return undefined;
  }
}

async function deleteStoredMedia(post: LatestPost) {
  if (!post.mediaKey) {
    return;
  }

  const store = getMediaStore();
  if (store) {
    await store.delete(post.mediaKey).catch(() => undefined);
    return;
  }

  if (isReadOnlyFunctionRuntime()) {
    return;
  }

  const filePath = path.resolve(uploadDirectory, post.mediaKey);
  const resolvedRoot = path.resolve(uploadDirectory);

  if (filePath.startsWith(resolvedRoot)) {
    await rm(filePath, { force: true }).catch(() => undefined);
  }
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createUniqueSlug(title: string) {
  const baseSlug = createSlug(title) || `post-${Date.now()}`;
  const posts = await getLatestPosts();
  const existingSlugs = new Set(posts.map((post) => post.slug));

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  while (existingSlugs.has(`${baseSlug}-${index}`)) {
    index += 1;
  }

  return `${baseSlug}-${index}`;
}

function sortPosts(posts: LatestPost[]) {
  return [...posts].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  );
}

function contentTypeFromFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase();

  if (extension === ".gif") return "image/gif";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".mp4") return "video/mp4";
  if (extension === ".webm") return "video/webm";

  return "application/octet-stream";
}
