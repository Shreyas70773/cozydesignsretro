import { getStoredMedia } from "@/lib/latest-posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ key: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { key } = await params;
  const media = await getStoredMedia(decodeURIComponent(key));

  if (!media) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(media.bytes, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": media.contentType,
    },
  });
}
