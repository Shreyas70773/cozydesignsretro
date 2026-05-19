import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/seo";

export const alt = "Cozy Designs retro poster, album cover, and motion artwork";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-end",
          background: "#8bb9b8",
          color: "#fff9dc",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: 72,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 820,
          }}
        >
          <div
            style={{
              color: "#111111",
              fontSize: 28,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Retro visuals for modern culture
          </div>
          <div
            style={{
              fontSize: 98,
              fontWeight: 900,
              letterSpacing: -5,
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            Cozy Designs
          </div>
          <div
            style={{
              color: "#111111",
              fontSize: 34,
              lineHeight: 1.2,
            }}
          >
            Posters, album covers, motion artwork, and culture-led design.
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#f2a000",
            border: "8px solid #111111",
            borderRadius: 999,
            color: "#111111",
            display: "flex",
            fontSize: 30,
            fontWeight: 800,
            height: 170,
            justifyContent: "center",
            lineHeight: 1,
            textAlign: "center",
            width: 170,
          }}
        >
          {siteConfig.siteUrl.replace("https://", "")}
        </div>
      </div>
    ),
    size,
  );
}
