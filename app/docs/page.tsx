"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Keyboard,
  Monitor,
  LayoutGrid,
  Layers,
  ArrowLeftRight,
  Maximize2,
  Undo2,
  MoveHorizontal,
  Grid3X3,
  PinOff,
  ShieldCheck,
  ChevronRight,
  Download,
  Menu,
  X,
  PlayCircle,
  Zap,
  Ban,
} from "lucide-react";

const ACCENT = "#BFFF00";

// Navigation component
function DocsNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--card-border)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/app-icon.png" alt="Rapto" width={32} height={32} />
            <span className="font-display font-bold text-lg">Rapto</span>
          </Link>
          <span className="text-[var(--foreground-muted)]">/</span>
          <span className="font-medium">Documentation</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/#features"
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-sm"
          >
            Features
          </Link>
          <Link
            href="/#faq"
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-sm"
          >
            FAQ
          </Link>
          <Link
            href="/#download"
            className="btn-primary !py-2 !px-4 text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-[var(--foreground-muted)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--card-border)] px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link href="/#features" className="text-[var(--foreground-muted)]">Features</Link>
            <Link href="/#faq" className="text-[var(--foreground-muted)]">FAQ</Link>
            <Link href="/#download" className="text-[var(--foreground-muted)]">Download</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// Table of Contents
function TableOfContents() {
  const sections = [
    { id: "getting-started", title: "Getting Started", icon: PlayCircle },
    { id: "modes", title: "Operating Modes", icon: Zap },
    { id: "keyboard", title: "Keyboard Shortcuts", icon: Keyboard },
    { id: "templates", title: "Layout Templates", icon: Grid3X3 },
    { id: "features", title: "Features", icon: LayoutGrid },
    { id: "settings", title: "Settings", icon: Settings },
    { id: "troubleshooting", title: "Troubleshooting", icon: ShieldCheck },
  ];

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-2">
        <h3 className="font-display font-semibold text-sm text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
          Contents
        </h3>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-all group"
          >
            <section.icon className="w-4 h-4" />
            <span className="text-sm">{section.title}</span>
            <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </aside>
  );
}

// Section component
function Section({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-6"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${ACCENT}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: ACCENT }} />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
      </motion.div>
      <div className="prose prose-invert max-w-none">{children}</div>
    </section>
  );
}

// Info box component
function InfoBox({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "tip" | "warning" }) {
  const colors = {
    info: { bg: "#00FFE520", border: "#00FFE5", text: "#00FFE5" },
    tip: { bg: `${ACCENT}20`, border: ACCENT, text: ACCENT },
    warning: { bg: "#FFB80020", border: "#FFB800", text: "#FFB800" },
  };

  return (
    <div
      className="rounded-xl p-4 my-4 border"
      style={{
        backgroundColor: colors[type].bg,
        borderColor: `${colors[type].border}40`,
      }}
    >
      <p className="text-sm leading-relaxed m-0" style={{ color: "var(--foreground)" }}>
        {children}
      </p>
    </div>
  );
}

// Keyboard shortcut display
function Shortcut({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i}>
          <kbd
            className="px-2 py-1 rounded-md text-xs font-mono font-medium"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 2px 0 var(--card-border)",
            }}
          >
            {key}
          </kbd>
          {i < keys.length - 1 && <span className="mx-1 text-[var(--foreground-muted)]">+</span>}
        </span>
      ))}
    </span>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DocsNavigation />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Rapto <span style={{ color: ACCENT }}>Documentation</span>
          </h1>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl">
            Learn how to organize your windows efficiently with Rapto. This guide covers all features and settings to help you get the most out of the app.
          </p>
        </motion.div>

        <div className="flex gap-12">
          <TableOfContents />

          <div className="flex-1 max-w-3xl">
            {/* Getting Started */}
            <Section id="getting-started" title="Getting Started" icon={PlayCircle}>
              <h3 className="font-display text-xl font-semibold mb-3">Installation</h3>
              <ol className="list-decimal list-inside space-y-2 text-[var(--foreground-muted)] mb-6">
                <li>Download Rapto from the website and open the DMG file</li>
                <li>Drag Rapto to your Applications folder</li>
                <li>Launch Rapto — it will appear in your menu bar</li>
              </ol>

              <h3 className="font-display text-xl font-semibold mb-3">Required Permissions</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Rapto needs two permissions to work properly:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: ACCENT }} />
                  <div>
                    <strong>Accessibility</strong> — Allows Rapto to move and resize windows. Without this, the app cannot manage your windows.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: ACCENT }} />
                  <div>
                    <strong>Screen Recording</strong> — Allows Rapto to see window titles and generate previews. Your screen is never recorded or uploaded.
                  </div>
                </li>
              </ul>

              <InfoBox type="tip">
                When prompted, grant the permissions and restart Rapto if needed. You can always manage permissions in System Settings → Privacy & Security.
              </InfoBox>

              <h3 className="font-display text-xl font-semibold mb-3">Disable macOS Window Tiling</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                macOS Sequoia and later includes built-in window tiling that can conflict with Rapto. We recommend disabling it for the best experience:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[var(--foreground-muted)] mb-4">
                <li>Open <strong>System Settings → Desktop & Dock</strong></li>
                <li>Scroll down to the <strong>Windows</strong> section</li>
                <li>Disable these options:</li>
              </ol>
              <ul className="space-y-2 mb-4 ml-6">
                <li className="flex gap-3">
                  <Ban className="w-4 h-4 mt-1 shrink-0" style={{ color: "#FFB800" }} />
                  <span className="text-[var(--foreground-muted)]">Drag windows to left or right edge of screen to tile</span>
                </li>
                <li className="flex gap-3">
                  <Ban className="w-4 h-4 mt-1 shrink-0" style={{ color: "#FFB800" }} />
                  <span className="text-[var(--foreground-muted)]">Drag windows to menu bar to fill screen</span>
                </li>
                <li className="flex gap-3">
                  <Ban className="w-4 h-4 mt-1 shrink-0" style={{ color: "#FFB800" }} />
                  <span className="text-[var(--foreground-muted)]">Hold ⌥ key while dragging windows to tile</span>
                </li>
                <li className="flex gap-3">
                  <Ban className="w-4 h-4 mt-1 shrink-0" style={{ color: "#FFB800" }} />
                  <span className="text-[var(--foreground-muted)]">Tiled windows have margins</span>
                </li>
              </ul>

              <InfoBox type="warning">
                If these options remain enabled, macOS and Rapto may fight over window positions, causing unexpected behavior when dragging or snapping windows.
              </InfoBox>

              <h3 className="font-display text-xl font-semibold mb-3">First Launch</h3>
              <p className="text-[var(--foreground-muted)]">
                After launching, you&apos;ll see the Rapto icon in your menu bar. Click it to access settings, change modes, or select templates. Press <Shortcut keys={["⌃", "⌥", "G"]} /> to open the overlay and start organizing your windows.
              </p>
            </Section>

            {/* Operating Modes */}
            <Section id="modes" title="Operating Modes" icon={Zap}>
              <p className="text-[var(--foreground-muted)] mb-6">
                Rapto offers three different ways to manage your windows. You can choose a different mode for each monitor and each macOS Space.
              </p>

              <div className="space-y-6">
                {/* Manual Mode */}
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACCENT }} />
                    <h4 className="font-display text-lg font-semibold">Manual Mode</h4>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-3">
                    Developer&apos;s favorite. Quickly select a layout template from the menu bar, or press the hotkey to open an overlay where you can assign specific windows to specific slots with precision.
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    <strong>Best for:</strong> Power users who want full control over which window goes where.
                  </p>
                </div>

                {/* Auto Tiling */}
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00FFE5" }} />
                    <h4 className="font-display text-lg font-semibold">Auto Tiling</h4>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-3">
                    Windows automatically arrange themselves as you open or close them. The layout adapts based on how many windows you have. You can set the maximum number of tiled windows (2-8).
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    <strong>Best for:</strong> Users who want hands-off window management, similar to i3 or yabai.
                  </p>
                </div>

                {/* Drag to Snap */}
                <div className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#A855F7" }} />
                    <h4 className="font-display text-lg font-semibold">Drag to Snap</h4>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-3">
                    Drag a window to the edge of the screen to snap it into position. A preview zone appears before you release, showing where the window will go.
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    <strong>Best for:</strong> Users who prefer mouse-based interaction, similar to Rectangle or Magnet.
                  </p>
                </div>
              </div>

              <InfoBox type="info">
                Change modes from the menu bar icon or using Settings. Each monitor and Space can have its own mode.
              </InfoBox>
            </Section>

            {/* Keyboard Shortcuts */}
            <Section id="keyboard" title="Keyboard Shortcuts" icon={Keyboard}>
              <p className="text-[var(--foreground-muted)] mb-6">
                Rapto is designed for keyboard-first usage. Choose between two presets or customize every shortcut in Settings.
              </p>

              <h3 className="font-display text-xl font-semibold mb-4">Hotkey Presets</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Rapto offers two built-in presets. Switch between them in Settings → Hotkeys.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="card p-4">
                  <h4 className="font-semibold mb-2" style={{ color: ACCENT }}>Rapto Style</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Arrow-based navigation. Intuitive for most users. Uses <Shortcut keys={["⌃", "⌥"]} /> as base modifier.
                  </p>
                </div>
                <div className="card p-4">
                  <h4 className="font-semibold mb-2" style={{ color: "#00FFE5" }}>Vim Style</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    HJKL navigation. Familiar for Vim/i3/yabai users. Uses <Shortcut keys={["⌥"]} /> as base modifier.
                  </p>
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold mb-4">Core Shortcuts (Rapto Style)</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Open/Close Overlay</span>
                  <Shortcut keys={["⌃", "⌥", "G"]} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Focus Window (expand/restore)</span>
                  <Shortcut keys={["⌃", "⌥", "F"]} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Toggle Floating Window</span>
                  <Shortcut keys={["⌃", "⌥", "T"]} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Restore Layout</span>
                  <Shortcut keys={["⌃", "⌥", "R"]} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Cycle Window Group</span>
                  <Shortcut keys={["⌃", "Tab"]} />
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold mb-4">Window Navigation</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Move focus between tiled windows:
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Focus Left / Right / Up / Down</span>
                  <Shortcut keys={["⌃", "⌥", "Arrow"]} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Swap Left / Right / Up / Down</span>
                  <Shortcut keys={["⌃", "⇧", "Arrow"]} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Move to Slot Left / Right / Up / Down</span>
                  <Shortcut keys={["⌥", "⇧", "Arrow"]} />
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold mb-4">Window Resize</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Shrink / Grow Width</span>
                  <Shortcut keys={["⌃", "⌥", "H / L"]} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Shrink / Grow Height</span>
                  <Shortcut keys={["⌃", "⌥", "K / J"]} />
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold mb-4">Focus Slots</h3>
              <p className="text-[var(--foreground-muted)] mb-4">
                Jump directly to a window in a specific slot:
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Focus Slot 1-9</span>
                  <Shortcut keys={["⌃", "⇧", "1-9"]} />
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold mb-4">Multi-Monitor</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Move Window to Left Monitor</span>
                  <Shortcut keys={["⌃", "⌥", "⌘", "←"]} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Move Window to Right Monitor</span>
                  <Shortcut keys={["⌃", "⌥", "⌘", "→"]} />
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold mb-4">Mode Switching</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between py-2 border-b border-[var(--card-border)]">
                  <span>Cycle Layout Mode</span>
                  <Shortcut keys={["⌃", "⌥", "M"]} />
                </div>
              </div>
              <p className="text-[var(--foreground-muted)] mb-4 text-sm">
                Cycles through operating modes. You can also switch modes from the menu bar icon.
              </p>

              <InfoBox type="tip">
                All shortcuts can be customized in Settings → Hotkeys. You can also disable shortcuts for specific apps using Passthrough Apps.
              </InfoBox>
            </Section>

            {/* Layout Templates */}
            <Section id="templates" title="Layout Templates" icon={Grid3X3}>
              <p className="text-[var(--foreground-muted)] mb-6">
                Templates define how your screen is divided into zones. Rapto comes with built-in templates and lets you create your own.
              </p>

              <h3 className="font-display text-xl font-semibold mb-4">Built-in Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  { name: "Full", desc: "Single window fullscreen" },
                  { name: "Halves Vertical", desc: "Two equal columns" },
                  { name: "Halves Horizontal", desc: "Two equal rows" },
                  { name: "Thirds", desc: "Three equal columns" },
                  { name: "Quarters", desc: "Four equal quadrants" },
                  { name: "1+2 Left", desc: "Large left, two stacked right" },
                  { name: "1+2 Right", desc: "Two stacked left, large right" },
                  { name: "Center Focus", desc: "Centered main window" },
                  { name: "Center + Sidebars", desc: "Wide center with side columns" },
                ].map((template) => (
                  <div key={template.name} className="card p-4">
                    <h4 className="font-semibold mb-1">{template.name}</h4>
                    <p className="text-xs text-[var(--foreground-muted)]">{template.desc}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-display text-xl font-semibold mb-4">Creating Custom Templates</h3>
              <ol className="list-decimal list-inside space-y-2 text-[var(--foreground-muted)] mb-4">
                <li>Open the overlay (press <Shortcut keys={["⌃", "⌥", "G"]} />)</li>
                <li>Click the &quot;Custom&quot; button in the template picker</li>
                <li>Draw zones by clicking and dragging on the grid</li>
                <li>Name your template and save it</li>
              </ol>

              <InfoBox type="info">
                Custom templates are saved automatically and appear alongside built-in templates. You can rename or delete them from the template picker.
              </InfoBox>
            </Section>

            {/* Features */}
            <Section id="features" title="Features" icon={LayoutGrid}>
              <div className="space-y-8">
                {/* Multi-Monitor */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Monitor className="w-5 h-5" style={{ color: ACCENT }} />
                    <h3 className="font-display text-xl font-semibold">Multi-Monitor Support</h3>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-2">
                    Each monitor can have its own layout template and operating mode. Windows can be moved between monitors using <Shortcut keys={["⌃", "⌥", "⌘", "← / →"]} /> or by dragging.
                  </p>
                  <p className="text-[var(--foreground-muted)]">
                    Per-monitor settings are saved automatically and restored when you reconnect displays.
                  </p>
                </div>

                {/* Window Groups */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Layers className="w-5 h-5" style={{ color: ACCENT }} />
                    <h3 className="font-display text-xl font-semibold">Window Groups</h3>
                  </div>
                  <p className="text-[var(--foreground-muted)]">
                    Place multiple windows in the same zone. They stack on top of each other, and you can cycle through them with a keyboard shortcut. Great for keeping related windows together.
                  </p>
                </div>

                {/* Window Swap */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <ArrowLeftRight className="w-5 h-5" style={{ color: ACCENT }} />
                    <h3 className="font-display text-xl font-semibold">Window Swap</h3>
                  </div>
                  <p className="text-[var(--foreground-muted)]">
                    Instantly swap the positions of two windows. Use the keyboard shortcut or drag one window onto another while holding a modifier key.
                  </p>
                </div>

                {/* Focus Window */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Maximize2 className="w-5 h-5" style={{ color: ACCENT }} />
                    <h3 className="font-display text-xl font-semibold">Focus Window</h3>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-2">
                    Temporarily expand any window to fullscreen (or a custom focus zone) with a single shortcut. Press again to return to the original position.
                  </p>
                  <p className="text-[var(--foreground-muted)]">
                    <strong>Mouse shortcut:</strong> Hold <Shortcut keys={["⇧"]} /> and double-click any window to toggle focus mode. The modifier key can be changed in Settings.
                  </p>
                </div>

                {/* Snap Back */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Undo2 className="w-5 h-5" style={{ color: ACCENT }} />
                    <h3 className="font-display text-xl font-semibold">Snap Back & Restore Layout</h3>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-2">
                    <strong>Snap Back:</strong> If you accidentally move a tiled window, it automatically returns to its assigned zone. This keeps your layout intact without manual correction.
                  </p>
                  <p className="text-[var(--foreground-muted)]">
                    <strong>Restore Layout:</strong> Press <Shortcut keys={["⌃", "⌥", "R"]} /> to restore all windows to their saved positions. Useful after major layout disruptions.
                  </p>
                </div>

                {/* Resize Adjacent */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <MoveHorizontal className="w-5 h-5" style={{ color: ACCENT }} />
                    <h3 className="font-display text-xl font-semibold">Resize Adjacent</h3>
                  </div>
                  <p className="text-[var(--foreground-muted)]">
                    When you resize one window, neighboring windows automatically adjust to fill the space. No gaps, no overlaps.
                  </p>
                </div>

                {/* Floating Windows */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <PinOff className="w-5 h-5" style={{ color: ACCENT }} />
                    <h3 className="font-display text-xl font-semibold">Floating Windows</h3>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-2">
                    Exclude specific windows from tiling. They&apos;ll float freely above your tiled layout and stay on top. Toggle with keyboard shortcut <Shortcut keys={["⌃", "⌥", "T"]} />.
                  </p>
                  <p className="text-[var(--foreground-muted)]">
                    <strong>Mouse shortcut:</strong> Hold <Shortcut keys={["⌃"]} /> and double-click any window to toggle floating mode. This feature can be enabled in Settings → Floating Windows.
                  </p>
                </div>

                {/* Per-Space Layouts */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <LayoutGrid className="w-5 h-5" style={{ color: ACCENT }} />
                    <h3 className="font-display text-xl font-semibold">Per-Space Layouts</h3>
                  </div>
                  <p className="text-[var(--foreground-muted)]">
                    Each macOS Space can have its own layout. Switch between Spaces and Rapto remembers which template you were using. Great for separating work contexts.
                  </p>
                </div>
              </div>
            </Section>

            {/* Settings */}
            <Section id="settings" title="Settings" icon={Settings}>
              <p className="text-[var(--foreground-muted)] mb-6">
                Access Settings from the menu bar icon → Settings, or press <Shortcut keys={["⌘", ","]} /> when the overlay is open.
              </p>

              <h3 className="font-display text-xl font-semibold mb-4">General</h3>
              <ul className="space-y-2 text-[var(--foreground-muted)] mb-6">
                <li>• <strong>Launch at Login</strong> — Start Rapto automatically when you log in</li>
                <li>• <strong>Window Gap</strong> — Space between tiled windows (0-20 pixels)</li>
                <li>• <strong>Screen Edge Gap</strong> — Space from screen edges (0-20 pixels)</li>
              </ul>

              <h3 className="font-display text-xl font-semibold mb-4">Apps</h3>
              <ul className="space-y-2 text-[var(--foreground-muted)] mb-6">
                <li>• <strong>Ignored Apps</strong> — Apps that are never managed by Rapto (e.g., system dialogs, utilities)</li>
                <li>• <strong>Passthrough Apps</strong> — Apps where Rapto&apos;s shortcuts are disabled (e.g., games, virtual machines)</li>
              </ul>

              <h3 className="font-display text-xl font-semibold mb-4">Hotkeys</h3>
              <ul className="space-y-2 text-[var(--foreground-muted)] mb-6">
                <li>• <strong>Preset</strong> — Choose between Rapto Style (arrows) or Vim Style (HJKL)</li>
                <li>• <strong>Custom Bindings</strong> — Override any shortcut with your preferred key combination</li>
                <li>• <strong>Focus Slots 1-9</strong> — Quickly jump to windows in specific grid positions</li>
              </ul>

              <h3 className="font-display text-xl font-semibold mb-4">Focus Mode & Floating</h3>
              <ul className="space-y-2 text-[var(--foreground-muted)] mb-6">
                <li>• <strong>Focus Mode</strong> — Enable/disable the focus window feature</li>
                <li>• <strong>Focus Zone</strong> — Set a custom zone for focused windows (instead of fullscreen)</li>
                <li>• <strong>Double-Tap Modifier</strong> — Choose modifier key for mouse double-tap activation (Shift by default)</li>
                <li>• <strong>Floating Double-Tap</strong> — Enable Control+double-tap to toggle floating windows</li>
              </ul>

              <h3 className="font-display text-xl font-semibold mb-4">Appearance</h3>
              <ul className="space-y-2 text-[var(--foreground-muted)] mb-6">
                <li>• <strong>Highlight Active Window</strong> — Show a colored border around the focused window</li>
                <li>• <strong>Highlight Color</strong> — Customize the border color</li>
                <li>• <strong>Show Zone Previews</strong> — Display zone outlines when dragging windows</li>
                <li>• <strong>Group Indicators</strong> — Show/hide indicators for stacked window groups</li>
              </ul>

              <InfoBox type="tip">
                Most settings take effect immediately. Some (like permissions) may require restarting Rapto.
              </InfoBox>
            </Section>

            {/* Troubleshooting */}
            <Section id="troubleshooting" title="Troubleshooting" icon={ShieldCheck}>
              <div className="space-y-6">
                <div className="card p-5">
                  <h4 className="font-display font-semibold mb-2">Rapto doesn&apos;t move my windows</h4>
                  <p className="text-[var(--foreground-muted)] text-sm">
                    Make sure Accessibility permission is granted in System Settings → Privacy & Security → Accessibility. If already granted, try removing Rapto from the list and adding it again, then restart the app.
                  </p>
                </div>

                <div className="card p-5">
                  <h4 className="font-display font-semibold mb-2">Window previews aren&apos;t showing</h4>
                  <p className="text-[var(--foreground-muted)] text-sm">
                    Grant Screen Recording permission in System Settings → Privacy & Security → Screen Recording. Restart Rapto after granting permission.
                  </p>
                </div>

                <div className="card p-5">
                  <h4 className="font-display font-semibold mb-2">Hotkeys don&apos;t work in a specific app</h4>
                  <p className="text-[var(--foreground-muted)] text-sm">
                    Some apps (like games or VMs) capture all keyboard input. Add them to the &quot;Passthrough Apps&quot; list in Settings → Apps to prevent conflicts.
                  </p>
                </div>

                <div className="card p-5">
                  <h4 className="font-display font-semibold mb-2">Windows jump around when switching Spaces</h4>
                  <p className="text-[var(--foreground-muted)] text-sm">
                    This can happen briefly during Space transitions. If it persists, try disabling Auto Tiling for that Space or increasing the transition delay in advanced settings.
                  </p>
                </div>

                <div className="card p-5">
                  <h4 className="font-display font-semibold mb-2">How do I report a bug?</h4>
                  <p className="text-[var(--foreground-muted)] text-sm">
                    Enable Debug Logging in Settings → About → Troubleshooting. Reproduce the issue, then click &quot;Open Log Folder&quot; and send the logs to{" "}
                    <a href="mailto:support@rapto.app" style={{ color: ACCENT }}>support@rapto.app</a>.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-xl text-center" style={{ backgroundColor: `${ACCENT}10`, border: `1px solid ${ACCENT}30` }}>
                <h3 className="font-display text-xl font-semibold mb-2">Need more help?</h3>
                <p className="text-[var(--foreground-muted)] mb-4">
                  Contact us at{" "}
                  <a href="mailto:support@rapto.app" style={{ color: ACCENT }}>support@rapto.app</a>
                </p>
              </div>
            </Section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/app-icon.png" alt="Rapto" width={24} height={24} />
            <span className="text-sm text-[var(--foreground-muted)]">
              © 2026 Rapto. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
              Home
            </Link>
            <Link href="/privacy" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
              Privacy
            </Link>
            <a href="mailto:support@rapto.app" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
