"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { GITHUB_REPO_URL, GitHubMark } from "../components/SiteChrome";

const ACCENT = "#BFFF00";
// Site download buttons must link to /download, not to the DMG, so analytics counts each download as a pageview
const DMG_URL = "https://github.com/LevkaDev/rapto-releases/releases/latest/download/Rapto.dmg";
const START_DELAY_MS = 800;

const steps = [
  "Open Rapto.dmg and drag Rapto to Applications",
  "Open Rapto from Applications",
  "Allow Accessibility when Rapto asks (Screen Recording is optional, for window previews)",
];

export default function DownloadStarter() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = DMG_URL;
    }, START_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden pretty-copy">
      <div aria-hidden="true" className="absolute inset-0 atmosphere" />
      <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-20" />

      <div className="relative max-w-xl w-full text-center">
        <Link href="/" className="inline-block mb-10">
          <Image src="/app-icon.png" alt="Back to Rapto home" width={96} height={96} priority className="drop-shadow-2xl" />
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Your download is <span style={{ color: ACCENT }}>starting</span>
        </h1>
        <p className="text-lg text-[var(--foreground-muted)] mb-10">
          If nothing happens,{" "}
          <a href={DMG_URL} className="underline font-medium" style={{ color: ACCENT }}>
            download Rapto.dmg manually
          </a>
          .
        </p>

        <ol className="text-left space-y-4 mb-8">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-4 px-5 py-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]"
            >
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-black"
                style={{ background: ACCENT }}
              >
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-[var(--foreground-muted)] mb-8">
          <span className="inline-flex items-center gap-1.5 text-[var(--foreground)]/90">
            <ShieldCheck aria-hidden="true" className="w-4 h-4" style={{ color: ACCENT }} />
            Signed &amp; Notarized by Apple
          </span>
          <span aria-hidden="true">·</span>
          <span>macOS 26 Tahoe+</span>
          <span aria-hidden="true">·</span>
          <span>Apple Silicon &amp; Intel</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="/docs" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
            Documentation
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <GitHubMark className="w-4 h-4" />
            Source on GitHub
          </a>
          <a
            href={DMG_URL}
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <Download aria-hidden="true" className="w-4 h-4" />
            Download again
          </a>
        </div>
      </div>
    </main>
  );
}
