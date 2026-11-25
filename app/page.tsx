import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Cpu,
  Download,
  Layers,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { HeroPlayground } from "./HeroPlayground";
import { PauseToggle } from "./motion-pause";
import { CursorGlow, GitHubMark, Navigation } from "./components/SiteChrome";
import { GITHUB_REPO_URL } from "@/lib/links";
import { FaqExpandAll } from "./components/FaqExpandAll";
import {
  DesktopsBar,
  Features,
  Layouts,
  MotionScope,
  OperatingModes,
  Workspaces,
} from "./components/InteractiveSections";

const ACCENT = "#BFFF00";

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Rapto",
  operatingSystem: "macOS 26+",
  applicationCategory: "UtilitiesApplication",
  license: "https://www.gnu.org/licenses/gpl-3.0.html",
  url: "https://rapto.app",
  downloadUrl: "https://rapto.app/download",
  codeRepository: GITHUB_REPO_URL,
  description:
    "Free and open-source native macOS tiling window manager with Auto Tiling, custom layouts, Window Flow 3D switching, Desktops Bar, window groups, and one-click Workspaces per display and Space.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

function MeasurementLine({ width = 60 }: { width?: number }) {
  return (
    <div aria-hidden="true" className="inline-flex items-center gap-2 text-[var(--foreground-muted)]">
      <div className="h-2 w-px bg-current" />
      <div className="h-px bg-current" style={{ width }} />
      <div className="h-2 w-px bg-current" />
    </div>
  );
}

// ============================================
// HERO SECTION (SSR-first for instant LCP)
// ============================================
function Hero() {
  const stats = [
    { value: "4", label: "Per-Space modes" },
    { value: "14+", label: "Built-in & custom layouts" },
    { value: "40+", label: "Shortcuts + Vim preset" },
    { value: "0", label: "Accounts or telemetry" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div aria-hidden="true" className="absolute inset-0 atmosphere" />
      <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-30" />
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${ACCENT} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 md:pt-32 pb-20">
        {/* Top tag */}
        <div className="flex justify-center mb-6">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tag hover:border-[var(--accent)] transition-colors"
          >
            <Terminal aria-hidden="true" className="w-4 h-4" />
            <span>Free &amp; Open-Source Window Manager for macOS</span>
            <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Heading: immediate paint on first HTML byte */}
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5">
            Stop wrestling with <span style={{ color: ACCENT }}>windows</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
            Rapto puts every window in its place with automatic tiling, ready-made and custom layouts,
            Window Flow 3D switching, a menu bar Desktops Bar, window groups, and one-click Workspaces.
          </p>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-wrap gap-4 justify-center mb-5">
          <Link href="/download" className="btn-primary text-lg">
            <Download aria-hidden="true" className="w-5 h-5" />
            Download for Mac
            <ArrowRight aria-hidden="true" className="w-5 h-5" />
          </Link>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-lg"
          >
            <GitHubMark className="w-5 h-5" />
            View on GitHub
          </a>
        </div>

        {/* Trust & System Requirements Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[var(--foreground-muted)] mb-12">
          <span className="inline-flex items-center gap-1.5 text-[var(--foreground)]/90 font-medium">
            <ShieldCheck aria-hidden="true" className="w-4 h-4" style={{ color: ACCENT }} />
            Signed &amp; Notarized by Apple
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Lock aria-hidden="true" className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            No Accounts, Zero Telemetry
          </span>
          <span aria-hidden="true">·</span>
          <span>macOS 26 Tahoe+</span>
          <span aria-hidden="true">·</span>
          <span>Apple Silicon &amp; Intel</span>
        </div>

        {/* Interactive Product Playground */}
        <div className="relative mx-auto max-w-5xl mb-16">
          <div
            aria-hidden="true"
            className="absolute -inset-10 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${ACCENT}40 0%, transparent 70%)` }}
          />
          <HeroPlayground />
        </div>

        {/* Stats */}
        <div className="flex justify-center">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 md:gap-14 px-6 sm:px-10 py-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dd
                  className="font-display text-3xl md:text-4xl font-bold"
                  style={{ color: ACCENT }}
                >
                  {stat.value}
                </dd>
                <dt className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// ============================================
// WHY RAPTO (Competitive Positioning Strip)
// ============================================
function WhyRapto() {
  const pillars = [
    {
      icon: Sparkles,
      badge: "vs. macOS Built-in Tiling",
      title: "Real grids, groups & memory",
      points: [
        "Draw multi-zone custom grids or save your current window arrangement in one click",
        "Extra windows stack into a single slot with a draggable group badge instead of cluttering the screen",
        "One-click Workspaces launch, place, and close every app for a task",
      ],
    },
    {
      icon: Layers,
      badge: "vs. Simple Edge Snappers",
      title: "Full desktop & Space awareness",
      points: [
        "Desktops Bar in the menu bar shows every Space and the apps open on it — switch instantly with zero slide animation",
        "Drag an app icon onto another Space (or onto +) without leaving the Space you're working on",
        "Combine Auto Tiling on your laptop with Manual custom zones on an ultrawide display",
      ],
    },
    {
      icon: Terminal,
      badge: "vs. Config-File Tilers",
      title: "Zero TOML, zero SIP hacks",
      points: [
        "Works natively with real macOS Spaces and Mission Control — no disabling SIP or fighting macOS",
        "Set any Space or display to None when you want free-floating windows for design, video, or games",
        "Guided setup with a Smart App Scanner for terminals & IDEs, searchable Settings (⌘F), Vim preset, Raycast, and AppleScript",
      ],
    },
  ];

  return (
    <section id="why-rapto" className="py-20 px-6 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="mb-4">
            <MeasurementLine width={60} />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Why <span style={{ color: ACCENT }}>Rapto</span>?
          </h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            The sweet spot between basic window snappers and config-heavy tiling managers — built natively in Swift.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="feature-icon shrink-0 !w-10 !h-10">
                    <Icon aria-hidden="true" className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-4">{pillar.title}</h3>
                <ul className="space-y-3 text-sm text-[var(--foreground-muted)] flex-1">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden="true"
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: ACCENT }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// MID-PAGE DOWNLOAD BAND
// ============================================
function DownloadBand() {
  return (
    <section aria-label="Quick download" className="px-6 pb-8">
      <div
        className="max-w-4xl mx-auto rounded-2xl border px-6 py-8 sm:px-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left"
        style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}
      >
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold mb-1">
            Free &amp; Open Source — forever
          </h2>
          <p className="text-[var(--foreground-muted)]">
            No trial, subscription, account, or license key. Signed &amp; notarized for macOS 26 Tahoe and later.
          </p>
        </div>
        <Link href="/download" className="btn-primary shrink-0">
          <Download aria-hidden="true" className="w-5 h-5" />
          Download for Mac
        </Link>
      </div>
    </section>
  );
}

// ============================================
// NATIVE <details> FAQ SECTION (Find-in-Page searchable)
// ============================================
const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Why does Rapto need Accessibility permission?",
    a: "Rapto uses macOS Accessibility APIs to move and resize windows, focus or raise them, and apply layouts. If Accessibility is turned off, Rapto shows a notice in Settings, the Desktops Bar, and the menu bar with a button that opens System Settings, and clears the warning automatically once granted.",
  },
  {
    q: "Why does Rapto ask for Screen Recording permission?",
    a: "Screen Recording is optional. It lets Rapto show live previews of your windows in Window Flow and the layout overlay, and match the highlight border to each window's corners. The images stay in memory on your Mac and are never saved or uploaded. Without it, Window Flow and the overlay show app icons instead of previews and everything else works the same.",
  },
  {
    q: "Is Rapto safe? Does it record or upload my screen?",
    a: "Yes — Rapto is open source (GPL-3.0 on GitHub at LevkaDev/Rapto), signed and notarized by Apple, and runs 100% locally on your Mac. It never saves or uploads what is on your screen, has no servers or user accounts, and collects zero analytics or crash reports. Its only network request is Sparkle's update feed check on GitHub, which you can disable in Settings.",
  },
  {
    q: "How easy is it to set up and learn Rapto?",
    a: "Settings → Guide lets you pick a Starter Profile (Drag to Snap, Manual, or Auto-tiling) in one click and runs a local Smart App Scanner to suggest terminals, editors, and VMs where shortcuts should pause. While you drag a window or an app icon, live hints show what will happen on release and which modifier key (Control, Shift, or Option) changes it — updating the preview immediately as you press a key. Hints step aside once you have learned a key, and you can bring them back in Settings → Guide.",
  },
  {
    q: "Does Rapto work per monitor and per Space?",
    a: "Yes. You can choose a different mode (Auto Tiling, Manual, Drag to Snap, or None/Off) and a different layout independently for each display and each macOS Space.",
  },
  {
    q: "What is Window Flow, and how is it different from Window Switcher?",
    a: "Window Flow (⌃⌥S, or ⌥S in Vim Style) is a visual 3D strip of live window previews across all desktops on your active display — scroll with your trackpad or arrows and click or press Return to jump straight there. Your previous window sits right next to the current one, followed by the windows you use most. Window Switcher (⌃⌥W) is for typing: enter a couple of letters of an app or window name to filter and jump immediately.",
  },
  {
    q: "What is the Desktops Bar?",
    a: "A compact bar in the middle of your menu bar that shows every Space and the apps open on it. Click a number to jump there instantly without macOS's slide animation, drag an app icon onto another desktop to move its window there (hold Option to switch along with it), drop it on “+” to open a new desktop, or right-click any app icon to ignore that app or pause shortcuts in it right away.",
  },
  {
    q: "How does the Desktops Bar work on a MacBook with a notch, or with multiple monitors?",
    a: "On notched MacBooks the bar stays tucked away and drops smoothly below the notch when you point at it (configurable between Always On, Auto-Hide, and Notched Screens in Settings → General → Menu Bar). With multiple monitors, each display gets its own bar for its own Spaces when “Displays have separate Spaces” is enabled in macOS System Settings.",
  },
  {
    q: "Why did my desktops change their order?",
    a: "macOS reorders Spaces by default based on recent use. Each Space keeps its Rapto mode and layout wherever macOS moves it. To lock a fixed order, turn off “Automatically rearrange Spaces based on most recent use” in System Settings → Desktop & Dock → Mission Control.",
  },
  {
    q: "What’s the difference between Manual, Auto Tiling, Drag to Snap, and None?",
    a: "In Manual mode you pick a layout (or draw your own) and Rapto keeps windows in those slots. In Auto Tiling Rapto chooses and reflows the grid automatically as windows open and close (up to your max tiled window limit, stacking extras into groups). Drag to Snap lets you snap windows to edges, the top drop bar, or layout zones with a live preview. None leaves that specific Space or monitor completely unmanaged.",
  },
  {
    q: "Can I create my own custom layouts?",
    a: "Yes, in two ways. Press ⌃⌥G to open the layout overlay in Manual, Drag to Snap, or None, click “Custom”, and draw zones directly on screen — or click “Use Open Windows” inside the editor to create zones from the windows already open on that display. You can also choose “Create Layout from Windows” right from the Desktops Bar or Rapto menu.",
  },
  {
    q: "How do I exclude apps or pause hotkeys in specific apps?",
    a: "Right-click any app icon in the Desktops Bar (or open Quick Actions from the menu bar icon) to choose “Always Ignore” or “Pause Shortcuts” immediately. You can also manage Ignored Apps and Passthrough Apps together in Settings → Apps, or use the Smart App Scanner in Settings → Guide.",
  },
  {
    q: "Does Rapto support Vim shortcuts, Raycast, or AppleScript?",
    a: "Yes. Settings → Shortcuts includes a built-in Vim-style shortcut preset (and ⌘F searches across every Settings tab), plus a free official Raycast extension in the Raycast Store and AppleScript commands for custom macOS automation.",
  },
  {
    q: "How do I report a bug?",
    a: "Open Settings → About and choose Report a Problem. Rapto opens a GitHub issue or an email with your Rapto and macOS versions and display setup already filled in. Nothing is sent until you send it.",
  },
  {
    q: "Why does Rapto require macOS 26 Tahoe or later?",
    a: "Rapto is built with modern Swift and targets macOS 26 Tahoe+ APIs on both Apple Silicon and Intel Macs so it stays lightweight, fast, and maintainable without legacy compatibility bloat.",
  },
  {
    q: "Is Rapto really free?",
    a: "Yes. Rapto is free and open-source software (GPL-3.0). Download the notarized DMG and use every feature immediately — no trial, no subscription, and no license key.",
  },
];

function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="deferred-section py-28 px-6 relative scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="mb-4">
            <MeasurementLine width={60} />
          </div>

          <h2 id="faq-heading" className="font-display text-5xl md:text-6xl font-bold mb-6">
            Frequently asked <span style={{ color: ACCENT }}>questions</span>
          </h2>

          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-6">
            Quick answers about permissions, privacy, modes, and everyday usage. Tip: every answer works with{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--card-border-hover)] text-sm font-mono text-[var(--foreground)]">
              ⌘F
            </kbd>{" "}
            find-in-page.
          </p>

          <div className="flex justify-center">
            <FaqExpandAll containerId="faq-list" />
          </div>
        </div>

        <div id="faq-list" className="space-y-3">
          {FAQS.map((item) => (
            <details key={item.q} className="card faq-item">
              <summary>
                <ChevronDown aria-hidden="true" className="w-5 h-5 faq-chevron" />
                <span className="font-display text-lg font-semibold">{item.q}</span>
              </summary>
              <div className="px-6 pb-6 pl-[54px]">
                <p className="text-[var(--foreground-muted)] leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Support & GitHub contact */}
        <div className="text-center mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[var(--foreground-muted)]">
          <span>
            Still have questions?{" "}
            <a
              href="mailto:support@rapto.app"
              className="inline-flex items-center gap-1.5 font-medium hover:underline"
              style={{ color: ACCENT }}
            >
              <Mail aria-hidden="true" className="w-4 h-4" />
              support@rapto.app
            </a>
          </span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <a
            href={`${GITHUB_REPO_URL}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
            style={{ color: ACCENT }}
          >
            <GitHubMark className="w-4 h-4" />
            Report an issue on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================
// DOWNLOAD SECTION
// ============================================
function DownloadSection() {
  return (
    <section id="download" className="deferred-section py-32 px-6 relative overflow-hidden scroll-mt-20">
      <div aria-hidden="true" className="absolute inset-0 atmosphere" />
      <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-20" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${ACCENT}28 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Icon with decorative rings */}
        <div className="mb-12 inline-block relative">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[40px] border-2"
            style={{ borderColor: `${ACCENT}40` }}
          />
          <div
            aria-hidden="true"
            className="absolute -inset-12 rounded-[50px] border"
            style={{ borderColor: `${ACCENT}20` }}
          />
          <Image
            src="/app-icon.png"
            alt="Rapto app icon"
            width={120}
            height={120}
            className="drop-shadow-2xl relative"
          />
        </div>

        <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
          Ready to get <span style={{ color: ACCENT }}>organized</span>?
        </h2>

        <p className="text-xl text-[var(--foreground-muted)] mb-8">
          Download Rapto and put every window in its place in under a minute.
        </p>

        {/* Free & Open Source Pill */}
        <div className="mb-8">
          <div
            className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2"
            style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}05` }}
          >
            <span className="text-3xl sm:text-4xl font-display font-bold" style={{ color: ACCENT }}>
              Free &amp; Open Source
            </span>
            <p className="text-sm text-[var(--foreground-muted)]">
              GPL-3.0 · No trial, subscription, or license key
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/download" className="btn-primary text-xl animate-pulse-glow">
            <Download aria-hidden="true" className="w-6 h-6" />
            Download for Mac
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-lg"
          >
            <GitHubMark className="w-5 h-5" />
            Source on GitHub
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-sm text-[var(--foreground-muted)]">
          <span className="flex items-center gap-2">
            <Cpu aria-hidden="true" className="w-4 h-4" />
            Apple Silicon &amp; Intel
          </span>
          <span aria-hidden="true">•</span>
          <span>macOS 26 Tahoe+</span>
          <span aria-hidden="true">•</span>
          <span className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="w-4 h-4" style={{ color: ACCENT }} />
            Notarized by Apple
          </span>
          <span aria-hidden="true">•</span>
          <span className="flex items-center gap-2">
            <Zap aria-hidden="true" className="w-4 h-4" style={{ color: ACCENT }} />
            Native Swift
          </span>
        </div>
      </div>
    </section>
  );
}

// ============================================
// TOP-LEVEL FOOTER LANDMARK
// ============================================
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--card-border)] relative bg-[var(--background)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/app-icon.png" alt="" width={32} height={32} />
          <span className="font-display font-semibold text-lg">Rapto</span>
          <span className="text-[var(--foreground-muted)] text-sm">
            © {new Date().getFullYear()} · GPL-3.0
          </span>
        </div>

        <nav aria-label="Footer" className="flex items-center gap-6 md:gap-8 text-sm flex-wrap justify-center">
          <Link
            href="#features"
            className="py-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Features
          </Link>
          <Link
            href="#faq"
            className="py-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/download"
            className="py-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Download
          </Link>
          <Link
            href="/docs"
            className="py-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/changelog"
            className="py-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Changelog
          </Link>
          <Link
            href="/privacy"
            className="py-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Privacy
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 inline-flex items-center gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <GitHubMark className="w-4 h-4" />
            GitHub
          </a>
        </nav>

        <a
          href="mailto:support@rapto.app"
          className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-2"
        >
          <Mail aria-hidden="true" className="w-4 h-4" />
          support@rapto.app
        </a>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE (Server Component + Client Islands)
// ============================================
export default function Home() {
  return (
    <MotionScope>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <header>
        <Navigation />
      </header>

      {/* Pure CSS compositor scroll-timeline indicator */}
      <div aria-hidden="true" className="scroll-progress" />
      <PauseToggle />
      <CursorGlow />
      <div aria-hidden="true" className="noise-overlay" />

      <main id="content" tabIndex={-1} className="bg-[var(--background)] outline-none pretty-copy">
        <Hero />
        <WhyRapto />
        <DesktopsBar />
        <OperatingModes />
        <Layouts />
        <Workspaces />
        <DownloadBand />
        <Features />
        <FAQSection />
        <DownloadSection />
      </main>

      <Footer />
    </MotionScope>
  );
}
