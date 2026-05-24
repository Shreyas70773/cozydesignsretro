import { randomUUID } from "node:crypto";
import path from "node:path";

import {
  createUniqueSlug,
  deleteLatestPost,
  getLatestPosts,
  isPersistentStorageUnavailableError,
  saveMediaFile,
  saveLatestPost,
  updateLatestPost,
  type LatestPost,
} from "@/lib/latest-posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const adminToken = process.env.COZY_ADMIN_TOKEN ?? "cozy-designs-local-admin-token";
const maxFunctionUploadBytes = 4 * 1024 * 1024;
const acceptedTypes = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
]);

const extensionByType: Record<string, string> = {
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

type MediaUpdate = Pick<
  LatestPost,
  "mediaContentType" | "mediaKey" | "mediaType" | "mediaUrl"
>;

export async function GET() {
  const posts = await getLatestPosts();
  return Response.json({ posts });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const title = readRequiredField(formData, "title");
  const description = readRequiredField(formData, "description");
  const alt = readRequiredField(formData, "alt");
  const seoTitle = readRequiredField(formData, "seoTitle");
  const seoDescription = readRequiredField(formData, "seoDescription");
  const seoKeywords = readRequiredField(formData, "seoKeywords");

  const missingField = [
    title,
    description,
    alt,
    seoTitle,
    seoDescription,
    seoKeywords,
  ].find((value) => value.length === 0);

  if (missingField !== undefined) {
    return Response.json(
      { error: "Title, description, alt text, and SEO fields are required." },
      { status: 400 },
    );
  }

  const validationError = validateSeoFields({ alt, description, seoDescription, seoTitle, title });

  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  try {
    const slug = await createUniqueSlug(title);
    const mediaUpdate = await readMediaUpdate(formData, slug, true);

    if ("error" in mediaUpdate) {
      return Response.json({ error: mediaUpdate.error }, { status: 400 });
    }

    if (!hasMediaUpdate(mediaUpdate)) {
      return Response.json({ error: "Upload a file or paste a hosted media URL." }, { status: 400 });
    }

    const post: LatestPost = {
      id: randomUUID(),
      title,
      slug,
      description,
      alt,
      seoTitle,
      seoDescription,
      seoKeywords,
      instagramUrl: readOptionalUrl(formData, "instagramUrl"),
      pinterestUrl: readOptionalUrl(formData, "pinterestUrl"),
      ...mediaUpdate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveLatestPost(post);

    return Response.json({ post }, { status: 201 });
  } catch (error) {
    return persistentStorageErrorResponse(error, "publish");
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const id = readRequiredField(formData, "id");

  if (!id) {
    return Response.json({ error: "Missing post id." }, { status: 400 });
  }

  const title = readRequiredField(formData, "title");
  const description = readRequiredField(formData, "description");
  const alt = readRequiredField(formData, "alt");
  const seoTitle = readRequiredField(formData, "seoTitle");
  const seoDescription = readRequiredField(formData, "seoDescription");
  const seoKeywords = readRequiredField(formData, "seoKeywords");

  const missingField = [
    title,
    description,
    alt,
    seoTitle,
    seoDescription,
    seoKeywords,
  ].find((value) => value.length === 0);

  if (missingField !== undefined) {
    return Response.json(
      { error: "Title, description, alt text, and SEO fields are required." },
      { status: 400 },
    );
  }

  const validationError = validateSeoFields({ alt, description, seoDescription, seoTitle, title });

  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  try {
    const mediaUpdate = await readMediaUpdate(formData, createSlugForFilename(title), false);

    if ("error" in mediaUpdate) {
      return Response.json({ error: mediaUpdate.error }, { status: 400 });
    }

    const post = await updateLatestPost(id, {
      alt,
      description,
      instagramUrl: readOptionalUrl(formData, "instagramUrl"),
      pinterestUrl: readOptionalUrl(formData, "pinterestUrl"),
      seoDescription,
      seoKeywords,
      seoTitle,
      title,
      updatedAt: new Date().toISOString(),
      ...mediaUpdate,
    });

    if (!post) {
      return Response.json({ error: "Post not found." }, { status: 404 });
    }

    return Response.json({ post });
  } catch (error) {
    return persistentStorageErrorResponse(error, "save changes to");
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: string } | null;

  if (!body?.id) {
    return Response.json({ error: "Missing post id." }, { status: 400 });
  }

  try {
    const deleted = await deleteLatestPost(body.id);

    if (!deleted) {
      return Response.json({ error: "Post not found." }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return persistentStorageErrorResponse(error, "delete");
  }
}

async function readMediaUpdate(
  formData: FormData,
  slug: string,
  isRequired: boolean,
): Promise<
  | MediaUpdate
  | { error: string }
  | Record<string, never>
> {
  const externalMediaUrl = readOptionalUrl(formData, "mediaUrl");
  const externalMediaType = readRequiredField(formData, "mediaType");
  const media = formData.get("media");

  if (externalMediaUrl) {
    if (externalMediaType !== "image" && externalMediaType !== "video") {
      return { error: "Choose whether the hosted media URL is an image or video." };
    }

    return {
      mediaContentType: undefined,
      mediaKey: undefined,
      mediaType: externalMediaType,
      mediaUrl: externalMediaUrl,
    };
  }

  if (!(media instanceof File) || media.size === 0) {
    return isRequired ? { error: "Upload a file or paste a hosted media URL." } : {};
  }

  if (media.size > maxFunctionUploadBytes) {
    return {
      error:
        "Files uploaded here must be 4 MB or smaller. For larger videos, paste a hosted MP4 or WEBM URL.",
    };
  }

  if (!acceptedTypes.has(media.type)) {
    return { error: "Use JPG, PNG, WEBP, GIF, MP4, or WEBM media." };
  }

  const extension = extensionByType[media.type] ?? (path.extname(media.name) || ".bin");
  const filename = `${slug}-${randomUUID()}${extension}`;
  const bytes = Buffer.from(await media.arrayBuffer());
  const savedMedia = await saveMediaFile({
    bytes,
    contentType: media.type,
    filename,
  });

  return {
    mediaContentType: media.type,
    mediaType: media.type.startsWith("video/") ? "video" : "image",
    ...savedMedia,
  };
}

function isAuthorized(request: Request) {
  return request.headers.get("authorization") === `Bearer ${adminToken}`;
}

function hasMediaUpdate(
  mediaUpdate: MediaUpdate | { error: string } | Record<string, never>,
): mediaUpdate is MediaUpdate {
  return "mediaUrl" in mediaUpdate && "mediaType" in mediaUpdate;
}

function persistentStorageErrorResponse(error: unknown, action: string) {
  if (isPersistentStorageUnavailableError(error)) {
    return Response.json(
      {
        error: `Could not ${action} this post because persistent storage is unavailable. Check Netlify Blobs configuration and redeploy.`,
      },
      { status: 503 },
    );
  }

  throw error;
}

function createSlugForFilename(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || `post-${Date.now()}`
  );
}

function readRequiredField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalUrl(formData: FormData, field: string) {
  const value = readRequiredField(formData, field);
  if (!value) {
    return "";
  }

  try {
    return new URL(value).toString();
  } catch {
    return "";
  }
}

function validateSeoFields({
  alt,
  description,
  seoDescription,
  seoTitle,
  title,
}: {
  alt: string;
  description: string;
  seoDescription: string;
  seoTitle: string;
  title: string;
}) {
  if (title.length < 10 || title.length > 70) {
    return "Title must be between 10 and 70 characters.";
  }

  if (description.length < 80) {
    return "Description must be at least 80 characters so the post is not thin content.";
  }

  if (alt.length < 10 || alt.length > 125) {
    return "Media alt text must be between 10 and 125 characters.";
  }

  if (seoTitle.length < 10 || seoTitle.length > 60) {
    return "SEO title must be between 10 and 60 characters.";
  }

  if (seoDescription.length < 120 || seoDescription.length > 160) {
    return "SEO description must be between 120 and 160 characters.";
  }

  return "";
}
