import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
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
import { CursorGlow, GitHubMark, Navigation, SiteFooter } from "./components/SiteChrome";
import { GITHUB_REPO_URL } from "@/lib/links";
import { FaqAccordionList } from "./components/FaqExpandAll";
import {
  DesktopsBar,
  Features,
  Layouts,
  MotionScope,
  OperatingModes,
  WindowFlowSection,
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
    "Free and open-source native macOS tiling window manager with Auto-tiling, custom layouts, Window Flow 3D switching, Desktops Bar, window groups, and one-click Workspaces per display and Space.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

// ============================================
// CHAPTER 1: COMPACT ABOVE-THE-FOLD HERO (SSR-first)
// ============================================
function Hero() {
  const stats = [
    { value: "4", label: "Per-Space modes" },
    { value: "13+", label: "Built-in & custom layouts" },
    { value: "40+", label: "Shortcuts + Vim preset" },
    { value: "0", label: "Accounts or telemetry" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Continuous feathered Tahoe aurora backdrop */}
      <div aria-hidden="true" className="absolute inset-0 hero-atmosphere" />
      <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-55" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pt-24 md:pt-28 pb-16">
        {/* Immediate-paint heading + concise benefit-first subtitle */}
        <div className="text-center mb-6">
          <h1 className="font-display heading-hero font-bold mb-3.5">
            Stop wrestling with <span style={{ color: ACCENT }}>windows</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
            Window tiling, custom layouts, and 3D switching with native macOS Spaces support — no config files, no disabling SIP.
          </p>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <Link href="/download" className="btn-primary text-base">
            <Download aria-hidden="true" className="w-4 h-4" />
            Download for Mac
            <ArrowRight aria-hidden="true" className="w-4 h-4" />
          </Link>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-base"
          >
            <GitHubMark className="w-4 h-4" />
            View on GitHub
          </a>
        </div>

        {/* Compact Trust & Requirements Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 text-xs sm:text-sm text-[var(--foreground-muted)] mb-8">
          <span className="inline-flex items-center gap-1.5 text-[var(--foreground)]/90 font-medium">
            <ShieldCheck aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" />
            Signed &amp; Notarized by Apple
          </span>
          <span aria-hidden="true" className="opacity-45">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Lock aria-hidden="true" className="w-3.5 h-3.5 text-[var(--ice)]" />
            Free &amp; Open Source (GPL-3.0)
          </span>
          <span aria-hidden="true" className="opacity-45">·</span>
          <span>macOS 26 Tahoe+</span>
          <span aria-hidden="true" className="opacity-45">·</span>
          <span>Apple Silicon &amp; Intel</span>
        </div>

        {/* Interactive Product Playground — positioned high enough to shine above the fold on 1440×900 */}
        <div className="relative mx-auto max-w-4xl mb-12">
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(96, 165, 250, 0.35) 0%, rgba(191, 255, 0, 0.14) 45%, transparent 72%)",
            }}
          />
          <HeroPlayground />
        </div>

        {/* Sculpted Glass Stats Bar */}
        <div className="flex justify-center">
          <dl className="card grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] w-full max-w-3xl">
            {stats.map((stat) => (
              <div key={stat.label} className="px-5 py-4 text-center">
                <dd
                  className="font-display text-2xl sm:text-3xl font-bold tabular-nums"
                  style={{ color: ACCENT }}
                >
                  {stat.value}
                </dd>
                <dt className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
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
// CHAPTER 2: WHY RAPTO (Competitive Positioning)
// ============================================
function WhyRapto() {
  const pillars = [
    {
      icon: Sparkles,
      badge: "vs. macOS Built-in Tiling",
      title: "Real grids, groups & memory",
      points: [
        "Draw multi-zone custom grids or save your open windows as a layout in one click.",
        "Extra windows stack cleanly into a slot with a draggable group badge instead of cluttering the screen.",
        "One-click Workspaces launch, arrange, and close every app for a task.",
      ],
    },
    {
      icon: Layers,
      badge: "vs. Simple Edge Snappers",
      title: "Full desktop & Space awareness",
      points: [
        "Desktops Bar shows every Space and open app — jump instantly with zero slide animation.",
        "Drag an app icon onto another Space (or onto +) without leaving your current desktop.",
        "Mix Auto-tiling on your MacBook screen with Manual custom zones on an ultrawide.",
      ],
    },
    {
      icon: Terminal,
      badge: "vs. Config-File Tilers",
      title: "Zero TOML, zero SIP hacks",
      points: [
        "Works natively with real macOS Spaces and Mission Control — no disabling SIP or fighting macOS.",
        "Set any Space or display to None whenever you want free-floating windows.",
        "Guided setup with a Smart App Scanner, searchable Settings (⌘F), Vim preset, Raycast, and AppleScript.",
      ],
    },
  ];

  return (
    <section id="why-rapto" className="py-20 md:py-24 px-6 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="eyebrow-badge mb-4">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[var(--ice)]" />
            <span>Why Rapto</span>
          </div>
          <h2 className="font-display heading-section font-bold mb-4">
            Built natively for <span style={{ color: ACCENT }}>macOS</span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            The sweet spot between basic edge snappers and config-heavy tiling managers — written in pure Swift.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="feature-icon shrink-0 !w-10 !h-10">
                    <Icon aria-hidden="true" className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--foreground-muted)]">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-4">{pillar.title}</h3>
                <ul className="space-y-3 text-sm text-[var(--foreground-muted)] leading-relaxed flex-1">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden="true"
                        className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)]"
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
// REFINED MID-PAGE DOWNLOAD BAND
// ============================================
function DownloadBand() {
  return (
    <section aria-label="Quick download" className="px-6 py-8">
      <div className="card max-w-4xl mx-auto px-6 py-7 sm:px-9 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left border-white/14">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent)] mb-1.5">
            <span>Free &amp; Open Source · GPL-3.0</span>
          </div>
          <h2 className="font-display text-2xl font-bold mb-1">
            Try Rapto on your Mac in under a minute
          </h2>
          <p className="text-sm sm:text-base text-[var(--foreground-muted)]">
            No trial, subscription, account, or license key. Signed &amp; notarized for macOS 26 Tahoe+.
          </p>
        </div>
        <Link href="/download" className="btn-primary shrink-0">
          <Download aria-hidden="true" className="w-4 h-4" />
          Download for Mac
        </Link>
      </div>
    </section>
  );
}

// ============================================
// CHAPTER 7: FOCUSED FAQ (Top 6 upfront + 10 expandable & Cmd+F searchable)
// ============================================
const PRIMARY_FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is Rapto safe? Does it record or upload my screen?",
    a: "Yes — Rapto is open source (GPL-3.0 on GitHub at LevkaDev/Rapto), signed and notarized by Apple, and runs locally on your Mac. It never saves or uploads what is on your screen, has no servers or user accounts, and collects zero analytics or crash reports. Its only network request is Sparkle's update feed check on GitHub, which you can disable in Settings.",
  },
  {
    q: "Why does Rapto need Accessibility permission?",
    a: "Rapto uses macOS Accessibility APIs to move and resize windows, focus or raise them, and apply layouts. If Accessibility is turned off, Rapto shows a notice in Settings, the Desktops Bar, and the menu bar with a button that opens System Settings, and clears the warning automatically once granted.",
  },
  {
    q: "Why does Rapto ask for Screen Recording permission?",
    a: "Screen Recording is optional. It lets Rapto show live previews of your windows in Window Flow and the layout overlay, and match the highlight border to each window's corners. The images stay in memory on your Mac and are never saved or uploaded. Without it, Window Flow and the overlay show app icons instead of previews and everything else works the same.",
  },
  {
    q: "Does Rapto work per monitor and per Space?",
    a: "Yes. You can choose a different mode (Auto-tiling, Manual, Drag to Snap, or None) and a different layout independently for each display and each macOS Space.",
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

const SECONDARY_FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How easy is it to set up and learn Rapto?",
    a: "First launch automatically tunes window limits and layouts to your display, lets you preview with Arrange Now (and one-click Put Back), and offers a short two-part mouse tour covering your mode, the Desktops Bar, and Window Flow. Settings → Guide also lets you switch starter profiles in one click and runs a local Smart App Scanner for terminals, editors, and VMs. While you drag a window or an app icon, live hints show what will happen on release and which modifier key changes it — stepping aside once you learn each feature.",
  },
  {
    q: "What is Window Flow, and how is it different from Window Switcher?",
    a: "Window Flow (click the circular button on the left of the Desktops Bar, pick Open Window Flow in the menu, or press ⌃⌥S / ⌥S in Vim Style) is a visual 3D strip of live window previews across all desktops on your active display — scroll with your trackpad or arrows and click or press Return to jump straight there. Your previous window sits right next to the current one, followed by the windows you use most. Window Switcher (⌃⌥W) is for typing: enter a couple of letters of an app or window name to filter and jump immediately.",
  },
  {
    q: "What is the Desktops Bar?",
    a: "A compact bar in the middle of your menu bar that shows every Space and the apps open on it, with a one-click Window Flow button on the left and a “+” button on the right. Click a number to jump there instantly without macOS's slide animation, drag an app icon onto another desktop to move its window there (hold Option to switch along with it), drop it on “+” to open a new desktop, or right-click to switch modes, pause Rapto, or set per-app rules.",
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
    q: "What’s the difference between Manual, Auto-tiling, Drag to Snap, and None?",
    a: "In Manual mode you pick a fixed grid for the desktop: windows stay in slots, extras group automatically, and a group indicator lets you switch between them. In Auto-tiling, Rapto switches layouts on its own as windows open and close (up to your max tiled window limit, grouping extras). Drag to Snap lets you snap dragged windows to edges, the top layout bar, or a layout, and drop in one zone to group. None leaves that specific Space or monitor unmanaged.",
  },
  {
    q: "Can I create my own custom layouts?",
    a: "Yes, in two ways. Press ⌃⌥G to open the layout overlay in Manual, Drag to Snap, or None, click “Custom”, and build zones on screen with edge snapping and one-click splits — or click “Use Open Windows” inside the editor to create zones from the windows already open on that display. You can also choose “Create Layout from Windows” right from the Desktops Bar or Rapto menu, and pin custom layouts to the top Drag to Snap bar.",
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
];

function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="deferred-section py-20 md:py-24 px-6 relative scroll-mt-24"
    >
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-10">
          <div className="eyebrow-badge mb-4">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[var(--ice)]" />
            <span>FAQ</span>
          </div>

          <h2 id="faq-heading" className="font-display heading-section font-bold mb-4">
            Frequently asked <span style={{ color: ACCENT }}>questions</span>
          </h2>

          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl mx-auto">
            Quick answers on privacy, permissions, and everyday usage. Every answer works with{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/[0.05] text-xs font-mono text-[var(--foreground)]">
              ⌘F
            </kbd>{" "}
            find-in-page.
          </p>
        </div>

        <FaqAccordionList primary={PRIMARY_FAQS} secondary={SECONDARY_FAQS} />

        {/* Support & GitHub contact */}
        <div className="text-center mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--foreground-muted)]">
          <span className="inline-flex items-center gap-1.5">
            Still have questions?{" "}
            <a
              href="mailto:support@rapto.app"
              className="inline-flex items-center gap-1.5 min-h-8 py-1 font-medium hover:underline"
              style={{ color: ACCENT }}
            >
              <Mail aria-hidden="true" className="w-4 h-4" />
              support@rapto.app
            </a>
          </span>
          <span aria-hidden="true" className="hidden sm:inline opacity-45">·</span>
          <a
            href={`${GITHUB_REPO_URL}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-8 py-1 font-medium hover:underline"
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
// FINAL DOWNLOAD SECTION (Harmonized Silver-Ice Halo + Commanding CTA)
// ============================================
function DownloadSection() {
  return (
    <section id="download" className="deferred-section-sm py-24 md:py-28 px-6 relative overflow-hidden scroll-mt-24">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] max-w-full h-[380px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(147, 197, 253, 0.14) 0%, rgba(191, 255, 0, 0.06) 45%, transparent 72%)",
          filter: "blur(64px)",
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Tahoe app icon with subtle matching silver-ice glass rings (no clashing neon squares) */}
        <div className="mb-12 inline-block relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[34px] border border-white/12 bg-white/[0.025] backdrop-blur-sm"
          />
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-[42px] border border-sky-300/[0.09]"
          />
          <Image
            src="/app-icon.png"
            alt="Rapto app icon"
            width={104}
            height={104}
            className="drop-shadow-[0_18px_36px_rgba(59,130,246,0.28)] relative rounded-[24px]"
          />
        </div>

        <div className="flex justify-center mb-4">
          <div className="eyebrow-badge">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span>Free &amp; Open Source · GPL-3.0 · No license key</span>
          </div>
        </div>

        <h2 className="font-display heading-section font-bold mb-4">
          Ready to get <span style={{ color: ACCENT }}>organized</span>?
        </h2>

        <p className="text-base sm:text-lg text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
          Download the notarized DMG and put every window in its place in under a minute.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link href="/download" className="btn-primary text-base sm:text-lg !px-8 !py-3.5">
            <Download aria-hidden="true" className="w-5 h-5" />
            Download for Mac
            <ArrowRight aria-hidden="true" className="w-5 h-5" />
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-base !px-6 !py-3.5"
          >
            <GitHubMark className="w-5 h-5" />
            Source on GitHub
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-8 text-xs sm:text-sm text-[var(--foreground-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Cpu aria-hidden="true" className="w-4 h-4 text-[var(--ice)]" />
            Apple Silicon &amp; Intel
          </span>
          <span aria-hidden="true" className="opacity-45">·</span>
          <span>macOS 26 Tahoe+</span>
          <span aria-hidden="true" className="opacity-45">·</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" />
            Notarized by Apple
          </span>
          <span aria-hidden="true" className="opacity-45">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Zap aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" />
            Native Swift
          </span>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE (7 Cohesive Chapters)
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
        <Navigation showMotionToggle />
      </header>

      {/* Pure CSS compositor scroll-timeline indicator */}
      <div aria-hidden="true" className="scroll-progress" />
      <CursorGlow />
      <div aria-hidden="true" className="noise-overlay" />

      <main id="content" tabIndex={-1} className="bg-[var(--background)] outline-none pretty-copy">
        <Hero />
        <div aria-hidden="true" className="section-divider" />
        <WhyRapto />
        <div aria-hidden="true" className="section-divider" />
        <OperatingModes />
        <div aria-hidden="true" className="section-divider" />
        <WindowFlowSection />
        <div aria-hidden="true" className="section-divider" />
        <DesktopsBar />
        <div aria-hidden="true" className="section-divider" />
        <Layouts />
        <div aria-hidden="true" className="section-divider" />
        <Workspaces />
        <DownloadBand />
        <div aria-hidden="true" className="section-divider" />
        <Features />
        <div aria-hidden="true" className="section-divider" />
        <FAQSection />
        <div aria-hidden="true" className="section-divider" />
        <DownloadSection />
      </main>

      <SiteFooter />
    </MotionScope>
  );
}
