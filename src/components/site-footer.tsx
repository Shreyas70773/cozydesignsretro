/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import styles from "./site-footer.module.css";

const serviceLinks = [
  { href: "/posters", label: "Retro Poster Design" },
  { href: "/album-covers", label: "Album Cover Design" },
  { href: "/posters", label: "Comic Book Poster Design" },
  { href: "/clouded", label: "Branding & Identity" },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/album-covers", label: "Albums" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.behance.net/gauthamjpaul",
    icon: "/cozydesigns/animations/behance.svg",
    label: "Behance",
  },
  {
    href: "https://dribbble.com/Co-Z_Designs",
    icon: "/cozydesigns/animations/dribbble.svg",
    label: "Dribbble",
  },
  {
    href: "https://www.pinterest.com/gautham_jpaul/",
    icon: "/cozydesigns/animations/pinterest.svg",
    label: "Pinterest",
  },
  {
    href: "https://www.instagram.com/cozydesigns._/",
    icon: "/cozydesigns/animations/instagram.svg",
    label: "Instagram",
  },
  {
    href: "https://open.spotify.com/user/v7wmjdm5yjjz2494wj7vgig2g?si=36cbf828e92442da",
    icon: "/cozydesigns/animations/spotify.svg",
    label: "Spotify",
  },
  {
    href: "mailto:hello@cozydesigns.art",
    icon: "/cozydesigns/animations/gmail.svg",
    label: "Email",
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.footerGrid} id="services">
        <div className={styles.footerColumn}>
          <h2 className={styles.footerLabel}>Services</h2>
          <ul className={styles.footerList}>
            {serviceLinks.map((service) => (
              <li className={styles.footerListItem} key={service.label}>
                <Link href={service.href}>{service.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerBrand}>
          <p className={styles.footerBrandText}>
            <span>COZY</span>
            <span>DESIGNS</span>
          </p>
          <div className={styles.socialRow}>
            {socialLinks.map((link) => (
              <a
                aria-label={link.label}
                className={styles.socialIcon}
                href={link.href}
                key={link.label}
                rel={link.href.startsWith("mailto:") ? undefined : "me noreferrer"}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              >
                <img alt="" decoding="async" loading="lazy" src={link.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.footerColumnRight}>
          <h2 className={styles.footerLabel}>See More</h2>
          <div className={styles.footerLinks}>
            {footerLinks.map((link) => (
              <Link className={styles.footerLink} href={link.href} key={link.label}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.copyright}>
        &copy; 2026 Cozy Designs. All rights reserved. All designs are original and protected.{" "}
        <Link href="/terms-and-conditions">Terms and Conditions</Link> |{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> | Website powered by{" "}
        <a href="https://pixelandpunch.com" rel="sponsored noreferrer" target="_blank">
          pixel and punch
        </a>
      </p>
    </footer>
  );
}
