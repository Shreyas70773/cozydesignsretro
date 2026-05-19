"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./site-nav.module.css";

const menuItems = [
  { href: "/posters", label: "Posters" },
  { href: "/animations", label: "Animations" },
  { href: "/latest-posts", label: "Latest Posts" },
  { href: "/about", label: "About" },
  { href: "/clouded", label: "Clouded" },
  { href: "/album-covers", label: "Album Covers" },
  { href: "/contact", label: "Contact" },
];

const navIconSrc =
  "/cozydesigns/portfolio-assets/72abda80-cozy-designs-nav-icon.webp";

type SiteNavProps = {
  mobilePlacement?: "bottom" | "top";
};

export function SiteNav({ mobilePlacement = "bottom" }: SiteNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`${styles.header} ${
        mobilePlacement === "top" ? styles.headerMobileTop : ""
      }`}
    >
      <div className={styles.navBar}>
        <Link aria-label="Cozy Designs home" className={styles.navIconLink} href="/">
          <Image
            alt=""
            className={styles.navIcon}
            height={480}
            src={navIconSrc}
            width={480}
          />
        </Link>
          <Image
            alt="Cozy Designs"
            className={styles.navLogo}
            height={548}
            src="/cozydesigns/navbar-text.webp"
            width={2400}
          />
        <button
          aria-controls="site-menu"
          aria-expanded={isMenuOpen}
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div
        className={`${styles.menuPanel} ${isMenuOpen ? styles.menuPanelOpen : ""}`}
        id="site-menu"
      >
        <div className={styles.menuPanelInner}>
          <nav className={styles.menuLinks} aria-label="Primary">
            {menuItems.map((link) => (
              <Link
                className={styles.menuLink}
                href={link.href}
                key={link.label}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
