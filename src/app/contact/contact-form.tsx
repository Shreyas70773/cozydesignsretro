"use client";

import { useState } from "react";

import styles from "./contact.module.css";

const referralOptions = [
  "Instagram",
  "Behance",
  "Dribbble",
  "Pinterest",
  "Spotify",
  "Friend or referral",
  "Google search",
  "Other",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        body: formData,
        method: "POST",
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as {
          message?: string;
          scriptResult?: { error?: string };
        } | null;

        throw new Error(
          errorData?.scriptResult?.error ||
            errorData?.message ||
            "Contact form submission failed.",
        );
      }

      form.reset();
      setStatus("sent");
      setStatusMessage("Thanks, your message has been sent.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please email hello@cozydesigns.art.",
      );
    }
  }

  return (
    <form
      className={styles.form}
      method="post"
      onSubmit={handleSubmit}
    >
      <div className={styles.formHeader}>
        <p>Project Note</p>
        <span>Google Sheets fields ready</span>
      </div>

      <label className={styles.honeypot} aria-hidden="true" htmlFor="contact-company">
        <span>Company website</span>
        <input
          autoComplete="off"
          id="contact-company"
          name="_gotcha"
          tabIndex={-1}
          type="text"
        />
      </label>

      <div className={styles.fieldGrid}>
        <label className={styles.field} htmlFor="contact-name">
          <span>Name</span>
          <input autoComplete="name" id="contact-name" name="Name" required type="text" />
        </label>

        <label className={styles.field} htmlFor="contact-email">
          <span>Email</span>
          <input autoComplete="email" id="contact-email" name="Email" required type="email" />
        </label>
      </div>

      <div className={styles.fieldGrid}>
        <label className={styles.field} htmlFor="contact-mobile">
          <span>Mobile</span>
          <input autoComplete="tel" id="contact-mobile" name="Mobile" required type="tel" />
        </label>

        <label className={styles.field} htmlFor="contact-referral">
          <span>How did you hear about us?</span>
          <select id="contact-referral" name="How did you hear about us?" required>
            <option value="">Select one</option>
            {referralOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field} htmlFor="contact-message">
        <span>Message</span>
        <textarea
          id="contact-message"
          name="Message"
          placeholder="Tell us about the project, timeline, references, and deliverables."
          required
          rows={7}
        />
      </label>

      <button className={styles.submitButton} disabled={status === "sending"} type="submit">
        {status === "sending" ? "Sending..." : "Send Project Note"}
      </button>

      <p className={styles.formStatus} role="status">
        {status === "sent" || status === "error" ? statusMessage : ""}
      </p>
    </form>
  );
}
