import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Terms and conditions for using the Cozy Designs website and viewing original design work.",
  path: "/terms-and-conditions",
  title: "Terms and Conditions - Cozy Designs Studio",
});

const sections = [
  {
    title: "Use of This Site",
    body: "This website shares Cozy Designs work, services, and contact information. By using the site, you agree not to copy, misuse, disrupt, or attempt to reproduce the site content without permission.",
  },
  {
    title: "Original Work",
    body: "All artwork, designs, images, copy, and visual assets shown on this website belong to Cozy Designs unless otherwise stated. You may not reuse or redistribute them without written approval.",
  },
  {
    title: "Project Enquiries",
    body: "Messages sent through the contact page or email are treated as project enquiries. A project begins only after scope, timing, pricing, and payment terms have been agreed in writing.",
  },
  {
    title: "External Links",
    body: "This site may link to social platforms, portfolio pages, or partner websites. Cozy Designs is not responsible for the content, policies, or availability of external sites.",
  },
];

export default function Page() {
  return (
    <LegalPage
      intro="These terms explain the basic rules for using the Cozy Designs website and viewing the work shared here."
      sections={sections}
      title="Terms and Conditions"
    />
  );
}
