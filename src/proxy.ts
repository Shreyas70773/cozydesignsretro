import { NextResponse, type NextRequest } from "next/server";

const noIndexValue = "noindex, nofollow, noarchive";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const isDeployPreview =
    process.env.CONTEXT != null && process.env.CONTEXT !== "production";
  const isNetlifySubdomain = request.nextUrl.hostname.endsWith(".netlify.app");

  if (
    isDeployPreview ||
    isNetlifySubdomain ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api")
  ) {
    response.headers.set("X-Robots-Tag", noIndexValue);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icon.png|apple-icon.png|opengraph-image|robots.txt|sitemap.xml).*)",
  ],
};
