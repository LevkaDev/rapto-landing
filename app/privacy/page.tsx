"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";
import Link from "next/link";

const ACCENT = "#BFFF00";

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
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-12"
        >
          {/* Introduction */}
          <section>
            <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6" style={{ color: ACCENT }} />
              Introduction
            </h2>
            <div className="prose prose-invert max-w-none text-[var(--foreground-muted)] space-y-4">
              <p>
                Rapto ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our macOS window management application.
              </p>
              <p>
                By using Rapto, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6" style={{ color: ACCENT }} />
              Data Collection
            </h2>
            <div className="prose prose-invert max-w-none text-[var(--foreground-muted)] space-y-4">
              <p className="font-semibold text-white">Rapto collects minimal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Window information:</strong> Rapto accesses window titles, positions, and sizes to provide window management functionality. This data is processed locally on your device and never transmitted to external servers.</li>
                <li><strong>Screen configuration:</strong> Information about your display setup (resolution, arrangement) is used to optimize window layouts. This data remains on your device.</li>
                <li><strong>User preferences:</strong> Your custom templates, hotkey configurations, and settings are stored locally in your macOS preferences.</li>
              </ul>
              <p className="font-semibold text-white mt-6">We do NOT collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal information (name, email, address)</li>
                <li>Browsing history or web activity</li>
                <li>File contents or document data</li>
                <li>Location data</li>
                <li>Any data that leaves your device</li>
              </ul>
            </div>
          </section>

          {/* Data Storage */}
          <section>
            <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6" style={{ color: ACCENT }} />
              Data Storage & Security
            </h2>
            <div className="prose prose-invert max-w-none text-[var(--foreground-muted)] space-y-4">
              <p>
                All data collected by Rapto is stored locally on your macOS device using Apple's standard UserDefaults and Core Data frameworks. This data is:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted by macOS system-level security</li>
                <li>Accessible only to the Rapto application</li>
                <li>Never transmitted over the network</li>
                <li>Automatically deleted when you uninstall Rapto</li>
              </ul>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6" style={{ color: ACCENT }} />
              Third-Party Services
            </h2>
            <div className="prose prose-invert max-w-none text-[var(--foreground-muted)] space-y-4">
              <p>
                Rapto does not integrate with third-party analytics, advertising, or tracking services. We do not use cookies, tracking pixels, or any other tracking technologies.
              </p>
              <p>
                If you purchase Rapto through the Mac App Store, your purchase is subject to Apple's Privacy Policy and Terms of Service. We do not receive any personal information from Apple beyond what is necessary to process your purchase.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6" style={{ color: ACCENT }} />
              Your Rights
            </h2>
            <div className="prose prose-invert max-w-none text-[var(--foreground-muted)] space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access all data stored by Rapto (stored in your macOS preferences)</li>
                <li>Delete all Rapto data by uninstalling the application</li>
                <li>Modify your preferences at any time through the application settings</li>
                <li>Request information about data collection by contacting us</li>
              </ul>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6" style={{ color: ACCENT }} />
              Changes to This Policy
            </h2>
            <div className="prose prose-invert max-w-none text-[var(--foreground-muted)] space-y-4">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-3xl font-bold mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6" style={{ color: ACCENT }} />
              Contact Us
            </h2>
            <div className="prose prose-invert max-w-none text-[var(--foreground-muted)] space-y-4">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <p>
                <strong>Email:</strong> levan@hey.com
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </main>
  );
}

