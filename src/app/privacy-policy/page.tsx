import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Privacy policy for Cozy Designs, including how project enquiry information is received and used.",
  path: "/privacy-policy",
  title: "Privacy Policy - Cozy Designs Studio",
});

const sections = [
  {
    title: "Information You Share",
    body: "If you contact Cozy Designs by email or through the contact form, you may share your name, email address, mobile number, referral source, and project message.",
  },
  {
    title: "How It Is Used",
    body: "Your information is used to reply to your enquiry, understand your project, plan communication, and manage potential or active client work.",
  },
  {
    title: "Sharing",
    body: "Cozy Designs does not sell your personal information. Information may be shared only when needed to respond to your request, comply with legal obligations, or use trusted tools that help operate the site and communication workflow.",
  },
  {
    title: "Contact",
    body: "To ask about your information or request an update, contact Cozy Designs at hello@cozydesigns.art.",
  },
];

export default function Page() {
  return (
    <LegalPage
      intro="This privacy policy explains what information Cozy Designs may receive when you use the website or get in touch."
      sections={sections}
      title="Privacy Policy"
    />
  );
}
