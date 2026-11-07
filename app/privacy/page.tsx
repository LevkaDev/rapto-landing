"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, FileText, RefreshCw, Globe, Trash2, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const ACCENT = "#BFFF00";

function Section({ icon: Icon, title, children }: { icon: typeof Shield; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
        <Icon className="w-6 h-6" style={{ color: ACCENT }} />
        {title}
      </h2>
      <div className="prose prose-invert max-w-none text-[var(--foreground-muted)] space-y-4">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 atmosphere" />
      <div className="absolute inset-0 blueprint-grid opacity-10" />
      
      <div className="relative max-w-4xl mx-auto px-6 py-20">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl" style={{ background: `${ACCENT}20` }}>
              <Shield className="w-8 h-8" style={{ color: ACCENT }} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-[var(--foreground-muted)]">
            Last updated: November 7, 2026
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-12"
        >
          <Section icon={FileText} title="The Short Version">
            <p>
              Rapto works entirely on your Mac. It has no servers and no accounts, and it collects no personal data, usage data, analytics or crash reports. It never records, saves or uploads your screen. The only time the app goes online is to check for updates.
            </p>
          </Section>

          <Section icon={Eye} title="What the App Uses on Your Mac">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Window information.</strong> Rapto reads window titles, positions and sizes so it can arrange your windows. This is only used on your Mac and never leaves it.</li>
              <li><strong>Display setup.</strong> Rapto reads the size and arrangement of your displays and desktops to place windows correctly.</li>
              <li><strong>Your settings.</strong> Your layouts, shortcuts and preferences are saved in the standard macOS settings of your user account.</li>
              <li><strong>Diagnostic log (off by default).</strong> If you turn on file logging in Settings, Rapto keeps a log on your Mac that may include app names and window titles. It is never sent anywhere. You only share it if you choose to send it to us yourself.</li>
            </ul>
          </Section>

          <Section icon={Lock} title="Permissions">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Accessibility</strong> lets Rapto move and resize windows.</li>
              <li><strong>Screen Recording</strong> only lets Rapto read window titles and positions. Rapto never captures, saves or uploads what is on your screen.</li>
            </ul>
          </Section>

          <Section icon={RefreshCw} title="Update Checks">
            <p>
              Rapto checks for new versions when it starts, once a day, and when you choose &ldquo;Check for Updates…&rdquo;. To do this it downloads a small update file from GitHub, where Rapto&rsquo;s updates are published. Like any website, GitHub can see your IP address when this happens. Rapto sends no information about you, your Mac or how you use the app. You can turn automatic checks off in Settings.
            </p>
          </Section>

          <Section icon={Globe} title="This Website">
            <p>
              rapto.app uses Plausible Analytics to count visits and downloads. Plausible uses no cookies and collects no personal data, and visitors can&rsquo;t be identified or tracked across other websites. The site is hosted on Cloudflare, which may keep standard technical logs to deliver and protect the site.
            </p>
          </Section>

          <Section icon={Trash2} title="Removing Your Data">
            <p>
              Everything Rapto stores is on your Mac. To remove it completely, quit Rapto, delete it from Applications, and delete these items if they exist:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><code>~/Library/Preferences/app.rapto.mac.plist</code></li>
              <li><code>~/Library/Application Support/Rapto</code></li>
              <li><code>~/Library/Caches/app.rapto.mac</code></li>
              <li><code>~/Library/Logs/Rapto</code></li>
            </ul>
          </Section>

          <Section icon={FileText} title="Changes to This Policy">
            <p>
              If this policy changes, the new version will be posted on this page with a new date.
            </p>
          </Section>

          <Section icon={Mail} title="Contact">
            <p>
              Questions about privacy:{" "}
              <a href="mailto:support@rapto.app" style={{ color: ACCENT }}>support@rapto.app</a>
            </p>
          </Section>
        </motion.div>
      </div>
    </main>
  );
}
