import type { Metadata } from "next";

import { AdminPostsPage } from "@/components/admin-posts-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description: "Private Cozy Designs content administration.",
  noIndex: true,
  path: "/admin",
  title: "Admin",
});

export default function Page() {
  return <AdminPostsPage />;
}
