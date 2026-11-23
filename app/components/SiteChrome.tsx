"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Download, Menu, X } from "lucide-react";

export const GITHUB_REPO_URL = "https://github.com/LevkaDev/Rapto";

export function GitHubMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.02 11.02 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const navLinks = [
  { href: "#why-rapto", label: "Why Rapto" },
  { href: "#desktops-bar", label: "Desktops Bar" },
  { href: "#modes", label: "Modes" },
  { href: "#layouts", label: "Layouts" },
  { href: "#workspaces", label: "Workspaces" },
  { href: "#features", label: "Features" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
  { href: "#faq", label: "FAQ" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 50;
      setIsScrolled((prev) => (prev !== next ? next : prev));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--card-border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <Image src="/app-icon.png" alt="" width={36} height={36} priority />
          <span className="font-display font-bold text-xl group-hover:text-[var(--accent)] transition-colors">
            Rapto
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-sm font-medium whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--card-border-hover)] text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-white/30 transition-colors"
          >
            <GitHubMark className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <Link href="/download" className="btn-primary !py-2 !px-4 text-sm">
            <Download aria-hidden="true" className="w-4 h-4" />
            Download
          </Link>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <button
          type="button"
          className="xl:hidden p-2.5 min-w-11 min-h-11 flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-site-menu"
        >
          {isMobileMenuOpen ? (
            <X aria-hidden="true" className="w-6 h-6" />
          ) : (
            <Menu aria-hidden="true" className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile / Tablet Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-site-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="xl:hidden bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--card-border)] max-h-[calc(100dvh-4.5rem)] overflow-y-auto"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors py-2.5 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-1 border-t border-[var(--card-border)] flex flex-col sm:flex-row gap-3">
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary justify-center !py-3 text-sm flex-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <GitHubMark className="w-4 h-4" />
                  Open Source on GitHub
                </a>
                <Link
                  href="/download"
                  className="btn-primary justify-center !py-3 text-sm flex-1"
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

// Compositor-only cursor glow: updates MotionValues directly without triggering React re-renders
export function CursorGlow() {
  const rawX = useMotionValue(-300);
  const rawY = useMotionValue(-300);
  const opacity = useMotionValue(0);
  const x = useSpring(rawX, { damping: 30, stiffness: 200 });
  const y = useSpring(rawY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (min-width: 1024px)");
    if (!media.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      opacity.set(0.15);
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
