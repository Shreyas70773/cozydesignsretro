import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920, 2400],
    formats: ["image/avif", "image/webp"],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    localPatterns: [
      {
        pathname: "/cozydesigns/**",
        search: "",
      },
      {
        pathname: "/preloader/**",
        search: "",
      },
    ],
    minimumCacheTTL: 31536000,
    qualities: [75, 85],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
