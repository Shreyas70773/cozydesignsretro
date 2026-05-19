import type { Metadata } from "next";

export const siteConfig = {
  brandName: "Cozy Designs",
  creatorName: "Gautham J Paul",
  description:
    "Independent design studio crafting retro-modern posters, album covers, motion artwork, and culture-led visuals for musicians, brands, and events.",
  email: "hello@cozydesigns.art",
  locale: "en_IN",
  siteName: "Cozy Designs",
  siteUrl: "https://cozydesigns.art",
  social: {
    behance: "https://www.behance.net/gauthamjpaul",
    dribbble: "https://dribbble.com/Co-Z_Designs",
    instagram: "https://www.instagram.com/cozydesigns._/",
    pinterest: "https://www.pinterest.com/gautham_jpaul/",
    spotify: "https://open.spotify.com/user/v7wmjdm5yjjz2494wj7vgig2g?si=36cbf828e92442da",
  },
};

export const organizationId = `${siteConfig.siteUrl}/#organization`;
export const personId = `${siteConfig.siteUrl}/about#person`;

export const defaultOgImage = {
  alt: "Cozy Designs retro poster, album cover, and motion artwork",
  height: 630,
  url: "/opengraph-image",
  width: 1200,
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path, siteConfig.siteUrl).toString();
}

export function buildMetadata({
  description = siteConfig.description,
  image = defaultOgImage.url,
  imageAlt = defaultOgImage.alt,
  noIndex = false,
  path = "/",
  title,
}: {
  description?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  path?: string;
  title: string;
}): Metadata {
  const canonical = absoluteUrl(path);

  return {
    alternates: {
      canonical: path,
    },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: imageAlt,
          height: defaultOgImage.height,
          url: image,
          width: defaultOgImage.width,
        },
      ],
      locale: siteConfig.locale,
      siteName: siteConfig.siteName,
      title,
      type: "website",
      url: canonical,
    },
    robots: noIndex
      ? {
          follow: false,
          googleBot: {
            follow: false,
            index: false,
            noarchive: true,
          },
          index: false,
          nocache: true,
        }
      : {
          follow: true,
          googleBot: {
            follow: true,
            index: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
          index: true,
        },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: [image],
      title,
    },
  };
}

export function clampMetaDescription(value: string, fallback: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length < 50) {
    return fallback;
  }

  if (normalized.length <= 160) {
    return normalized;
  }

  return `${normalized.slice(0, 157).trimEnd()}...`;
}

export function cleanMetaTitle(value: string, fallback: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length < 5) {
    return fallback;
  }

  return normalized.length > 60 ? normalized.slice(0, 57).trimEnd() : normalized;
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: siteConfig.siteUrl,
        name: "Home",
        position: 1,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        item: absoluteUrl(item.path),
        name: item.name,
        position: index + 2,
      })),
    ],
  };
}
