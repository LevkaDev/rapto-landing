"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Download, Mail, Menu, X } from "lucide-react";

import { GITHUB_REPO_URL } from "@/lib/links";
import { HeaderPauseButton } from "../motion-pause";

export function GitHubMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.02 11.02 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const navLinks = [
  { href: "/#modes", sectionId: "modes", label: "Modes" },
  { href: "/#window-flow", sectionId: "window-flow", label: "Window Flow" },
  { href: "/#features", sectionId: "features", label: "Features" },
  { href: "/docs", sectionId: null, label: "Docs" },
  { href: "/changelog", sectionId: null, label: "Changelog" },
  { href: "/#faq", sectionId: "faq", label: "FAQ" },
];

export function Navigation({ showMotionToggle = false }: { showMotionToggle?: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 36;
      setIsScrolled((prev) => (prev !== next ? next : prev));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track which major section is currently active on the home page
  useEffect(() => {
    if (!isHome) return;
    const ids = ["modes", "window-flow", "features", "faq"];
    const updateActive = () => {
      const marker = window.innerHeight * 0.32;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) {
          current = id;
        }
      }
      setActiveSection((prev) => (prev !== current ? current : prev));
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [isHome]);

  // Escape & outside pointer click close the mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isMobileMenuOpen]);

  const isLinkActive = (link: (typeof navLinks)[number]) => {
    if (link.sectionId) return isHome && activeSection === link.sectionId;
    return pathname === link.href;
  };

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 pointer-events-none"
    >
      <div
        className={`pointer-events-auto max-w-6xl mx-auto px-3.5 sm:px-4 py-2 rounded-2xl flex items-center justify-between gap-3 transition-[background-color,border-color,box-shadow] duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "glass-nav-pill"
            : "bg-[#08090d]/45 backdrop-blur-md border border-white/[0.07]"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 min-h-9 pr-1 group">
          <Image src="/app-icon.png" alt="" width={30} height={30} priority className="rounded-[7px]" />
          <span className="font-display font-bold text-lg tracking-tight group-hover:text-[var(--accent)] transition-colors">
            Rapto
          </span>
        </Link>

        {/* Desktop Links — visible down to 1024px (lg) so split-screen MacBooks keep full nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            const resolvedHref = isHome && link.sectionId ? `#${link.sectionId}` : link.href;
            return (
              <Link
                key={link.href}
                href={resolvedHref}
                aria-current={active ? (link.sectionId ? "location" : "page") : undefined}
                className={`min-h-9 px-3 rounded-xl inline-flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "text-[var(--foreground)] bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {showMotionToggle && <HeaderPauseButton />}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-9 px-3 rounded-xl border border-white/12 bg-white/[0.04] text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-white/25 transition-colors"
          >
            <GitHubMark className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <Link href="/download" className="btn-primary !min-h-9 !py-1.5 !px-3.5 text-sm !rounded-xl">
            <Download aria-hidden="true" className="w-4 h-4" />
            Download
          </Link>
        </div>

        {/* Tablet / Mobile right controls: keep Download visible + accessible menu trigger */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0">
          {showMotionToggle && <HeaderPauseButton className="!min-w-10 !min-h-10" />}
          <Link href="/download" className="btn-primary !min-h-10 !py-1.5 !px-3.5 text-sm !rounded-xl">
            <Download aria-hidden="true" className="w-4 h-4" />
            <span>Download</span>
          </Link>
          <button
            type="button"
            className="p-2 min-w-11 min-h-11 flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-white/[0.05] transition-colors"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-site-menu"
          >
            {isMobileMenuOpen ? (
              <X aria-hidden="true" className="w-5 h-5" />
            ) : (
              <Menu aria-hidden="true" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-site-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="pointer-events-auto lg:hidden max-w-6xl mx-auto mt-2 rounded-2xl glass-nav-pill max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain"
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const resolvedHref = isHome && link.sectionId ? `#${link.sectionId}` : link.href;
                return (
                  <Link
                    key={link.href}
                    href={resolvedHref}
                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/[0.05] rounded-xl px-3 py-2.5 min-h-11 flex items-center text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !min-h-11 !py-2.5 text-sm flex-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <GitHubMark className="w-4 h-4" />
                  Open Source on GitHub
                </a>
                <Link
                  href="/download"
                  className="btn-primary !min-h-11 !py-2.5 text-sm flex-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Download aria-hidden="true" className="w-4 h-4" />
                  Download for Mac
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="py-12 px-6 border-t border-white/[0.08] relative bg-[var(--background)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/app-icon.png" alt="" width={30} height={30} className="rounded-[7px]" />
          <span className="font-display font-semibold text-lg">Rapto</span>
          <span className="text-[var(--foreground-muted)] text-sm">
            © {new Date().getFullYear()} · GPL-3.0
          </span>
        </div>

        <nav aria-label="Footer" className="flex items-center gap-x-5 gap-y-2 text-sm flex-wrap justify-center">
          <Link
            href="/#modes"
            className="min-h-9 px-1 inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Modes
          </Link>
          <Link
            href="/#window-flow"
            className="min-h-9 px-1 inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Window Flow
          </Link>
          <Link
            href="/#features"
            className="min-h-9 px-1 inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#faq"
            className="min-h-9 px-1 inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/download"
            className="min-h-9 px-1 inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Download
          </Link>
          <Link
            href="/docs"
            className="min-h-9 px-1 inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/changelog"
            className="min-h-9 px-1 inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Changelog
          </Link>
          <Link
            href="/privacy"
            className="min-h-9 px-1 inline-flex items-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Privacy
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-9 px-1 inline-flex items-center gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <GitHubMark className="w-4 h-4" />
            GitHub
          </a>
        </nav>

        <a
          href="mailto:support@rapto.app"
          className="min-h-9 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-2"
        >
          <Mail aria-hidden="true" className="w-4 h-4" />
          support@rapto.app
        </a>
      </div>
    </footer>
  );
}

// Compositor-only subtle cursor glow: updates MotionValues directly without triggering React re-renders
export function CursorGlow() {
  const rawX = useMotionValue(-300);
  const rawY = useMotionValue(-300);
  const opacity = useMotionValue(0);
  const x = useSpring(rawX, { damping: 32, stiffness: 180 });
  const y = useSpring(rawY, { damping: 32, stiffness: 180 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (min-width: 1024px)");
    if (!media.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      opacity.set(0.14);
    };
    const handleMouseLeave = () => {
      opacity.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [rawX, rawY, opacity]);

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-glow hidden lg:block"
      style={{ x, y, opacity }}
    />
  );
}
