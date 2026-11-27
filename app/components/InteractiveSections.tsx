"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, MotionConfig } from "framer-motion";
import { loopOr, usePaused } from "../motion-pause";
import { CardActiveContext, useCardLoop, useNoHover } from "../demo-parts";
import { SwitcherAppIcon, type SwitcherApp } from "../AppIcons";
import { DemoVideo } from "./DemoVideo";
import {
  Grid3X3,
  LayoutGrid,
  Monitor,
  Layers,
  MousePointerClick,
  Keyboard,
  Command,
  Zap,
  LayoutDashboard,
  ArrowRight,
  Check,
  Undo2,
  MoveHorizontal,
  ShieldCheck,
  X,
  Search,
  Play,
  Briefcase,
  Eye,
  Palette,
  Clock,
  Sliders,
} from "lucide-react";

const ACCENT = "#BFFF00";
const RAYCAST_STORE_URL = "https://www.raycast.com/Levka/rapto";
const now = () => Date.now();

// ============================================
// SHARED SECTION EYEBROW, HIGHLIGHT GRID & MINI WINDOW
// ============================================

function SectionEyebrow({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <div className="eyebrow-badge mb-4">
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: highlight ? ACCENT : "var(--ice)" }}
      />
      <span>{label}</span>
    </div>
  );
}

function HighlightGrid({
  items,
}: {
  items: Array<{ icon: React.ComponentType<{ className?: string }>; title: string; text: string }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="card p-5 flex items-start gap-3.5">
            <div className="feature-icon shrink-0 !w-10 !h-10">
              <Icon aria-hidden="true" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{item.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Sculpted macOS Tahoe dark obsidian glass window (used by compact Bento demos below)
function MiniWindow({
  color,
  title,
  className = "",
  style = {},
}: {
  color: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden flex flex-col bg-[#121622]/92 backdrop-blur-md ${className}`}
      style={{
        border: "1px solid rgba(255,255,255,0.13)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), 0 10px 26px rgba(0,0,0,0.45)",
        ...style,
      }}
    >
      <div className="h-5 flex items-center gap-1 px-2 border-b border-white/[0.07] bg-white/[0.03] shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]/85" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E]/85" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]/85" />
        {title && <span className="ml-1.5 text-[10px] font-medium text-white/60 truncate">{title}</span>}
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full shrink-0 opacity-85"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="flex-1 min-h-0" />
    </div>
  );
}

// ============================================
// CHAPTER 4: WINDOW FLOW 3D SECTION (Live macOS Capture)
// ============================================
function WindowFlowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const points = [
    {
      icon: Clock,
      title: "Smart recency order",
      text: "Your previous window sits right next to the current one, followed by the windows you use most.",
    },
    {
      icon: Palette,
      title: "Four atmospheric themes",
      text: "Switch between Sky Azure, Dusk, Night, and frosted Glass anytime with B.",
    },
    {
      icon: Eye,
      title: "Optional Screen Recording",
      text: "Live previews stay strictly in memory and are never saved or uploaded — or use app icons without granting it.",
    },
  ];

  return (
    <section id="window-flow" className="py-20 md:py-24 px-6 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-10">
          <SectionEyebrow label="Window Flow · Visual 3D Switcher" highlight />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="font-display heading-section font-bold mb-4"
          >
            Glide through every window in <span style={{ color: ACCENT }}>3D</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Works in every mode — even on desktops set to None. Click the circular Flow button on the Desktops Bar or press ⌃⌥S to glide through live previews across every Space on your active display.
          </motion.p>
        </motion.div>

        <DemoVideo
          mp4="/demos/window-flow.mp4"
          poster="/demos/window-flow-poster.webp"
          width={1920}
          height={810}
          label="Window Flow 3D switcher recorded on macOS"
          caption="Real macOS capture · Scroll or use ← → to glide across Spaces, and press B to switch backdrop themes (Sky Azure, Dusk, Night, Glass)."
        />

        <HighlightGrid items={points} />
      </div>
    </section>
  );
}

// ============================================
// CHAPTER 3: FOUR MODES + WINDOW GROUPS SPOTLIGHT (Live macOS Captures)
// ============================================
function OperatingModes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeMode, setActiveMode] = useState(0);

  // Mode names & descriptions aligned with Rapto's TilingMode.swift & ModeChoice.all
  const modes = [
    {
      id: "auto",
      title: "Auto-tiling",
      subtitle: "Automatic grid reflow",
      description:
        "Switches layouts on its own as windows open and close, grouping any extras beyond your per-screen tiled limit (2–8).",
      features: [
        "Configurable max tiled windows (2–8)",
        "Newest window takes the main slot",
        "Extra windows group cleanly",
      ],
      video: {
        mp4: "/demos/mode-autotiling.mp4",
        poster: "/demos/mode-autotiling-poster.webp",
        label: "Auto-tiling mode recorded on macOS",
        caption: "Real macOS capture · Open windows one by one and the layout automatically evolves from 1 → 2 → 3 tiles.",
      },
    },
    {
      id: "manual",
      title: "Manual",
      subtitle: "Fixed grid with smart slots",
      description:
        "Fixed grid for the desktop: windows stay in slots, extras group automatically, and a group indicator lets you switch between them.",
      features: [
        "Fixed slots that remember returning apps",
        "Automatic grouping for extra windows",
        "Drag any window onto another slot to swap",
      ],
      video: {
        mp4: "/demos/mode-manual.mp4",
        poster: "/demos/mode-manual-poster.webp",
        label: "Manual mode recorded on macOS",
        caption: "Real macOS capture · Windows fill fixed layout slots one by one, and dragging swaps any two slots live.",
      },
    },
    {
      id: "drag",
      title: "Drag to Snap",
      subtitle: "Intuitive drag & drop",
      description:
        "Snap dragged windows to screen edges, the top layout bar, or a custom layout with live preview. Drop in one zone to group.",
      features: [
        "Screen edges & corners",
        "Top layout bar with pinned custom layouts",
        "Drop into an occupied zone to group",
      ],
      video: {
        mp4: "/demos/mode-dragsnap.mp4",
        poster: "/demos/mode-dragsnap-poster.webp",
        label: "Drag to Snap mode recorded on macOS",
        caption: "Real macOS capture · Drag to the top layout bar to preview built-in and pinned custom zones live.",
      },
    },
    {
      id: "none",
      title: "None",
      subtitle: "Per-Space free float",
      description:
        "No tiling or window management on this desktop — ideal for design tools, video timelines, or games while other Spaces stay tiled.",
      features: [
        "Zero interference on that Space or display",
        "Other displays & Spaces keep their modes",
        "Switch back anytime from the Desktops Bar",
      ],
      video: {
        mp4: "/demos/mode-none.mp4",
        poster: "/demos/mode-none-poster.webp",
        label: "None mode free-floating windows recorded on macOS",
        caption: "Real macOS capture · Windows float completely freely on Spaces set to None.",
      },
    },
  ];

  const current = modes[activeMode];

  return (
    <section id="modes" className="py-20 md:py-24 px-6 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-10">
          <SectionEyebrow label="Per-Space & Per-Display" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="font-display heading-section font-bold mb-4"
          >
            Four modes, <span style={{ color: ACCENT }}>your way</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Mix automatic tiling, fixed slots, drag snapping, or free-floating windows independently on every display and macOS Space.
          </motion.p>
        </motion.div>

        {/* All 4 mode tabs in one consistent Tahoe Glass segmented bar */}
        <div className="flex justify-center mb-8">
          <div
            role="group"
            aria-label="Choose operating mode"
            className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md"
          >
            {modes.map((mode, i) => {
              const active = activeMode === i;
              return (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveMode(i)}
                  className={`px-4 sm:px-5 py-2 min-h-10 rounded-xl text-sm font-semibold transition-[background-color,color] duration-200 ${
                    active
                      ? "bg-[var(--accent)] text-[#08090d]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/[0.06]"
                  }`}
                >
                  {mode.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Full-width cinematic live macOS capture + mode details bar */}
        <div className="card p-5 sm:p-7">
          <DemoVideo
            key={current.id}
            mp4={current.video.mp4}
            poster={current.video.poster}
            width={1920}
            height={810}
            label={current.video.label}
            caption={current.video.caption}
          />

          <div className="mt-6 pt-6 border-t border-white/[0.08]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-6 items-start"
              >
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--foreground-muted)] mb-2">
                    <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <span>{current.subtitle}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2.5 text-[var(--foreground)]">
                    {current.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm sm:text-base leading-relaxed">
                    {current.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <ul className="space-y-2.5">
                    {current.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]/90">
                        <Check aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                    <Monitor aria-hidden="true" className="w-4 h-4 shrink-0 text-[var(--ice)]" />
                    <span>Set independently per monitor &amp; Space — switch anytime from the Desktops Bar.</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dedicated Window Groups Spotlight */}
        <div className="card p-5 sm:p-7 mt-6">
          <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-6 items-end mb-6">
            <div>
              <div className="eyebrow-badge mb-3">
                <Layers aria-hidden="true" className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Signature feature · Works in every mode</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2.5">
                Window Groups keep clutter out of sight
              </h3>
              <p className="text-[var(--foreground-muted)] text-sm sm:text-base leading-relaxed">
                Stack multiple windows into a single slot instead of shrinking everything into tiny strips. Switch between grouped windows with a click on the floating badge, a scroll, or{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-white">⌃Tab</kbd>.
              </p>
            </div>

            <ul className="space-y-2.5 text-sm text-[var(--foreground)]/90">
              <li className="flex items-start gap-2.5">
                <Check aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)]" />
                <span>Drag the badge aside whenever it sits over an app&apos;s toolbar — it glides back automatically.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent)]" />
                <span>Works in Auto-tiling, Manual, and Drag to Snap alike.</span>
              </li>
            </ul>
          </div>

          <DemoVideo
            mp4="/demos/window-groups.mp4"
            poster="/demos/window-groups-poster.webp"
            width={1920}
            height={810}
            label="Window Groups recorded on macOS"
            caption="Real macOS capture · Drop a window onto an occupied slot to group it, drag the floating badge aside, or click an icon to switch."
          />
        </div>
      </div>
    </section>
  );
}

// ============================================
// CHAPTER 5A: DESKTOPS BAR SECTION (Live macOS Captures)
// ============================================
function DesktopsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [scene, setScene] = useState(0);

  const clips = [
    {
      id: "switch",
      label: "Switch desktops",
      mp4: "/demos/desktops-switch.mp4",
      poster: "/demos/desktops-switch-poster.webp",
      videoLabel: "Desktops Bar instant desktop switching recorded on macOS",
      caption: "Real macOS capture · Click any desktop number in the menu bar to jump there with zero slide animation.",
    },
    {
      id: "move",
      label: "Move apps across desktops",
      mp4: "/demos/desktops-move.mp4",
      poster: "/demos/desktops-move-poster.webp",
      videoLabel: "Desktops Bar dragging apps across desktops recorded on macOS",
      caption: "Real macOS capture · Drag an app icon onto another desktop — or hold ⌥ Option to follow it there.",
    },
  ];

  const current = clips[scene];

  const highlights = [
    {
      icon: MousePointerClick,
      title: "Instant switching & app rules",
      text: "Click a number to jump with no slide animation, or right-click any app icon to ignore it or pause shortcuts.",
    },
    {
      icon: LayoutDashboard,
      title: "Slots remembered",
      text: "On a Manual desktop, returning windows snap back into their saved slots while new windows take empty ones.",
    },
    {
      icon: Monitor,
      title: "One bar per display",
      text: "Every monitor gets its own menu bar pill, with Always On, Auto-Hide, and Notched Screens options.",
    },
  ];

  return (
    <section id="desktops-bar" className="py-20 md:py-24 px-6 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-10">
          <SectionEyebrow label="Desktops Bar" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="font-display heading-section font-bold mb-4"
          >
            Your desktops, <span style={{ color: ACCENT }}>in the menu bar</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            See every Space and what&apos;s open on it. Switch in one click and drag apps across desktops without leaving the one you&apos;re on.
          </motion.p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {clips.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={scene === i}
              onClick={() => setScene(i)}
              className={`px-4 py-2 min-h-10 rounded-xl text-sm font-medium transition-[background-color,color,border-color] duration-200 border ${
                scene === i
                  ? "bg-[var(--accent)] text-[#08090d] border-transparent font-semibold"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-white/[0.04] border-white/10 hover:border-white/22"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <DemoVideo
          key={current.id}
          mp4={current.mp4}
          poster={current.poster}
          width={1920}
          height={810}
          label={current.videoLabel}
          caption={current.caption}
        />

        <HighlightGrid items={highlights} />
      </div>
    </section>
  );
}

// ============================================
// CHAPTER 5B: LAYOUTS & CUSTOM EDITOR SECTION (Live macOS Captures)
// ============================================
function Layouts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [scene, setScene] = useState(0);

  const clips = [
    {
      id: "apply",
      label: "Apply a layout",
      mp4: "/demos/layout-apply.mp4",
      poster: "/demos/layout-apply-poster.webp",
      videoLabel: "Applying a layout in the overlay recorded on macOS",
      caption: "Real macOS capture · Press ⌃⌥G, pick a layout at the top, click windows in order, and press Return.",
    },
    {
      id: "draw",
      label: "Draw your own",
      mp4: "/demos/layout-custom.mp4",
      poster: "/demos/layout-custom-poster.webp",
      videoLabel: "Drawing a custom layout with snapping and splits recorded on macOS",
      caption: "Real macOS capture · Drag edges with magnetic snapping, split any zone in half in one click, and save.",
    },
  ];

  const current = clips[scene];

  const highlights = [
    {
      icon: LayoutGrid,
      title: "13 built-in layouts",
      text: "Halves, thirds, quarters, 1+2, center focus, and ultrawide splits — ready out of the box.",
    },
    {
      icon: Undo2,
      title: "Save what you already have",
      text: "Already arranged your windows? Create Layout from Windows — or Use Open Windows in the editor — saves them in one click.",
    },
    {
      icon: Keyboard,
      title: "One key per layout",
      text: "Assign any built-in or custom layout its own global shortcut in Settings → Shortcuts, or pin it to the top Drag to Snap bar.",
    },
  ];

  return (
    <section id="layouts" className="deferred-section py-20 md:py-24 px-6 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-10">
          <SectionEyebrow label="Layouts & Custom Editor" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="font-display heading-section font-bold mb-4"
          >
            Any layout, <span style={{ color: ACCENT }}>in seconds</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Open the overlay to click windows into a layout, or draw custom zones on screen with magnetic edge snapping and one-click splits.
          </motion.p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {clips.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={scene === i}
              onClick={() => setScene(i)}
              className={`px-4 py-2 min-h-10 rounded-xl text-sm font-medium transition-[background-color,color,border-color] duration-200 border ${
                scene === i
                  ? "bg-[var(--accent)] text-[#08090d] border-transparent font-semibold"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-white/[0.04] border-white/10 hover:border-white/22"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <DemoVideo
          key={current.id}
          mp4={current.mp4}
          poster={current.poster}
          width={1920}
          height={810}
          label={current.videoLabel}
          caption={current.caption}
        />

        <HighlightGrid items={highlights} />
      </div>
    </section>
  );
}

// ============================================
// CHAPTER 5C: WORKSPACES SECTION (Live macOS Capture)
// ============================================
function Workspaces() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const highlights = [
    {
      icon: Zap,
      title: "Everything comes back",
      text: "Closed apps launch, minimized windows return, and each window lands in its saved slot and layout.",
    },
    {
      icon: X,
      title: "Close in one click",
      text: "Close Workspace closes all of its windows at once, even across desktops — prompting first if work is unsaved.",
    },
    {
      icon: Layers,
      title: "Adapts to unplugged displays",
      text: "Open an office workspace on your laptop alone and choose whether to bring those apps onto the built-in screen.",
    },
  ];

  return (
    <section id="workspaces" className="deferred-section py-20 md:py-24 px-6 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-10">
          <SectionEyebrow label="Workspaces" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="font-display heading-section font-bold mb-4"
          >
            One task, <span style={{ color: ACCENT }}>one click</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Save the apps and layout you use for a project. Launch and arrange them together in one click, and close them all when you finish.
          </motion.p>
        </motion.div>

        <DemoVideo
          mp4="/demos/workspaces.mp4"
          poster="/demos/workspaces-poster.webp"
          width={1920}
          height={810}
          label="Launching a saved Workspace recorded on macOS"
          caption="Real macOS capture · Open a saved Workspace in one click — every app launches and lands in its exact zone."
        />

        <HighlightGrid items={highlights} />
      </div>
    </section>
  );
}

// ============================================
// CHAPTER 6: CURATED POWER-USER BENTO DEMOS
// ============================================

const SWITCHER_WINDOWS: Array<{ app: string; title: string; icon: SwitcherApp; desktop: number }> = [
  { app: "TradingView", title: "BTCUSD", icon: "tradingview", desktop: 1 },
  { app: "Safari", title: "GitHub", icon: "safari", desktop: 1 },
  { app: "Telegram", title: "Chats", icon: "telegram", desktop: 2 },
  { app: "Terminal", title: "~/projects", icon: "terminal", desktop: 1 },
  { app: "Visual Studio Code", title: "main.swift", icon: "vscode", desktop: 3 },
  { app: "Notes", title: "Release 6.3", icon: "notes", desktop: 2 },
];

const SWITCHER_AUTOPLAY = ["", "t", "te", "tel", "tel", "", "v", "vs", "vsc", "vsc"];
const SWITCHER_AUTOPLAY_INTERVAL = 650;
const SWITCHER_PAUSE_AFTER_INTERACTION = 6000;
const SWITCHER_VISIBLE_ROWS = 3;

function switcherScore(query: string, app: string, title: string): number | null {
  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;
  const a = normalize(app);
  const t = normalize(title);
  const appWords = a.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const titleWords = t.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const appInitials = appWords.map((w) => w[0]).join("");
  const titleInitials = titleWords.map((w) => w[0]).join("");
  const isSubsequence = (needle: string, hay: string) => {
    let i = 0;
    for (const c of hay) if (c === needle[i]) i++;
    return i === needle.length;
  };
  let total = 0;
  for (const token of tokens) {
    const long = token.length > 1;
    let best: number;
    if (a.startsWith(token)) best = 1000;
    else if (appWords.some((w) => w.startsWith(token))) best = 900;
    else if (long && appInitials.startsWith(token)) best = 800;
    else if (titleWords.some((w) => w.startsWith(token))) best = 700;
    else if (long && a.includes(token)) best = 600;
    else if (long && t.includes(token)) best = 500;
    else if (long && titleInitials.startsWith(token)) best = 400;
    else if (long && a[0] === token[0] && isSubsequence(token, a)) best = 300;
    else return null;
    total += best;
  }
  return total;
}

function WindowSwitcherDemo() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [switchedTo, setSwitchedTo] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const lastInteraction = useRef(0);
  const step = useRef(0);
  const queryIsAutoplay = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const switchedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = SWITCHER_WINDOWS.map((w, index) => ({ w, index, score: switcherScore(query, w.app, w.title) }))
    .filter((r): r is { w: (typeof SWITCHER_WINDOWS)[number]; index: number; score: number } => r.score !== null)
    .sort((x, y) => y.score - x.score || x.index - y.index)
    .map((r) => r.w);
  const selection = Math.min(selected, Math.max(0, results.length - 1));

  useCardLoop(() => {
    if (isFocused || document.activeElement === inputRef.current) return;
    if (Date.now() - lastInteraction.current < SWITCHER_PAUSE_AFTER_INTERACTION) return;
    step.current = (step.current + 1) % SWITCHER_AUTOPLAY.length;
    queryIsAutoplay.current = true;
    setQuery(SWITCHER_AUTOPLAY[step.current]);
    setSelected(0);
  }, SWITCHER_AUTOPLAY_INTERVAL);

  useEffect(() => () => {
    if (switchedTimer.current) clearTimeout(switchedTimer.current);
  }, []);

  const markInteraction = () => {
    lastInteraction.current = now();
  };

  const switchTo = (win: (typeof SWITCHER_WINDOWS)[number]) => {
    markInteraction();
    setSwitchedTo(`${win.app} · Desktop ${win.desktop}`);
    if (switchedTimer.current) clearTimeout(switchedTimer.current);
    switchedTimer.current = setTimeout(() => setSwitchedTo(null), 1400);
  };

  return (
    <div className="relative select-none">
      <div className="rounded-xl bg-[#0d1019] border border-white/14 shadow-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-3 h-10 border-b border-white/10 focus-within:shadow-[inset_0_0_0_2px_var(--accent)] rounded-t-xl">
          <Search aria-hidden="true" className="w-4 h-4 text-[var(--foreground-muted)] shrink-0" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="switcher-demo-listbox"
            aria-activedescendant={
              results.length > 0 ? `switcher-opt-${Math.min(selection, SWITCHER_VISIBLE_ROWS - 1)}` : undefined
            }
            value={query}
            onChange={(e) => {
              markInteraction();
              let next = e.target.value;
              if (queryIsAutoplay.current && next.startsWith(query)) next = next.slice(query.length);
              queryIsAutoplay.current = false;
              setQuery(next);
              setSelected(0);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (queryIsAutoplay.current) {
                queryIsAutoplay.current = false;
                setQuery("");
                setSelected(0);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              markInteraction();
            }}
            onKeyDown={(e) => {
              if (results.length === 0) return;
              const visibleCount = Math.min(results.length, SWITCHER_VISIBLE_ROWS);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((selection + 1) % visibleCount);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((selection - 1 + visibleCount) % visibleCount);
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                switchTo(results[Math.min(selection, visibleCount - 1)]);
              }
            }}
            placeholder="Type to search, try “t”…"
            aria-label="Try the window switcher: type an app or window name"
            className="flex-1 h-full bg-transparent text-sm text-white placeholder:text-[var(--foreground-muted)] outline-none"
          />
        </div>
        <div
          id="switcher-demo-listbox"
          role="listbox"
          aria-label="Matching windows"
          className="p-1.5"
          style={{ height: SWITCHER_VISIBLE_ROWS * 32 + 12 }}
        >
          {results.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[var(--foreground-muted)]">
              No matching windows
            </div>
          ) : (
            results.slice(0, SWITCHER_VISIBLE_ROWS).map((win, i) => (
              <div
                id={`switcher-opt-${i}`}
                key={win.app}
                role="option"
                aria-selected={i === selection}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSelected(i);
                  switchTo(win);
                }}
                className="w-full h-8 flex items-center gap-2.5 px-2.5 rounded-lg text-left transition-colors cursor-pointer"
                style={{ background: i === selection ? `${ACCENT}1f` : "transparent" }}
              >
                <span className="shrink-0 flex">
                  <SwitcherAppIcon app={win.icon} />
                </span>
                <span className="flex-1 min-w-0 truncate text-xs">
                  <span className="text-white font-medium">{win.title}</span>
                  <span className="text-[var(--foreground-muted)]"> · {win.app} · Desktop {win.desktop}</span>
                </span>
                <span className="text-[11px] font-mono text-[var(--foreground-muted)]">⌘{i + 1}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-2.5 h-4 text-xs text-center text-[var(--foreground-muted)]">
        <AnimatePresence mode="wait">
          <motion.span
            key={switchedTo ?? "hint"}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
            style={switchedTo ? { color: ACCENT } : undefined}
          >
            {switchedTo ? `Switched to ${switchedTo}` : "⌃⌥W in Rapto · ↑↓ and Return to jump"}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function KeyboardDemo() {
  const [position, setPosition] = useState<"left" | "right" | "full">("left");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const keyStep = useRef(0);

  useCardLoop(() => {
    const sequence = ["left", "right", "full"] as const;
    keyStep.current = (keyStep.current + 1) % sequence.length;
    const next = sequence[keyStep.current];
    setPosition(next);
    setActiveKey(next === "left" ? "←" : next === "right" ? "→" : "M");
    setTimeout(() => setActiveKey(null), 500);
  }, 2000);

  const isOn = (key: string) => activeKey !== null && (key === activeKey || key === "⌃" || key === "⌥");

  const getWindowStyle = () => {
    switch (position) {
      case "left":
        return { left: "3%", width: "45.5%" };
      case "right":
        return { left: "51.5%", width: "45.5%" };
      case "full":
        return { left: "3%", width: "94%" };
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="relative h-24 rounded-xl tahoe-wallpaper border border-white/12 overflow-hidden">
        <motion.div
          className="absolute top-2 h-[calc(100%-16px)]"
          animate={getWindowStyle()}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        >
          <MiniWindow color={ACCENT} title="Editor" className="w-full h-full" />
        </motion.div>
      </div>

      <div className="flex justify-center gap-1.5">
        {["⌃", "⌥", "←", "→", "M"].map((key) => (
          <motion.div
            key={key}
            className="min-w-8 h-8 px-2 rounded-lg flex items-center justify-center text-xs font-mono font-semibold border"
            style={{
              background: isOn(key) ? ACCENT : "rgba(255,255,255,0.05)",
              borderColor: isOn(key) ? ACCENT : "rgba(255,255,255,0.12)",
              color: isOn(key) ? "#08090d" : "rgba(255,255,255,0.7)",
              boxShadow: isOn(key) ? `0 0 18px ${ACCENT}55` : "0 2px 0 rgba(0,0,0,0.4)",
            }}
            animate={{ y: isOn(key) ? 1.5 : 0, scale: isOn(key) ? 0.96 : 1 }}
          >
            {key}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const MONITORS = [
  { x: 3, y: 26, w: 27, h: 56 },
  { x: 33.5, y: 8, w: 33, h: 74 },
  { x: 70, y: 26, w: 27, h: 56 },
];

function MultiMonitorDemo() {
  const [activeScreen, setActiveScreen] = useState(0);
  useCardLoop(() => setActiveScreen((s) => (s + 1) % MONITORS.length), 1800);
  const target = MONITORS[activeScreen];
  const inset = 2.4;

  return (
    <div className="relative h-28">
      {MONITORS.map((m, i) => (
        <div key={i} className="absolute" style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%` }}>
          <div
            className="w-full h-full rounded-lg border transition-[border-color,box-shadow] duration-300 tahoe-wallpaper"
            style={{
              borderColor: activeScreen === i ? `${ACCENT}b0` : "rgba(255,255,255,0.16)",
              boxShadow: activeScreen === i ? `0 0 20px ${ACCENT}28` : "none",
            }}
          />
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-[14%] h-[5px] bg-white/15" />
          <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+5px)] w-[40%] h-[3px] rounded-full bg-white/15" />
        </div>
      ))}

      <motion.div
        className="absolute z-10"
        initial={false}
        animate={{
          left: `${target.x + inset}%`,
          top: `${target.y + inset * 3}%`,
          width: `${target.w - inset * 2}%`,
          height: `${target.h - inset * 6}%`,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <MiniWindow color={ACCENT} className="w-full h-full" />
      </motion.div>
    </div>
  );
}

function ResizeAdjacentDemo() {
  const paused = usePaused();
  const [resized, setResized] = useState(false);
  useCardLoop(() => setResized((r) => !r), 2400);

  return (
    <div className="relative h-28 rounded-xl tahoe-wallpaper border border-white/12 overflow-hidden flex p-2 gap-1.5">
      <motion.div
        className="relative rounded-xl overflow-hidden"
        animate={{ flex: resized ? 1.85 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        <MiniWindow color={ACCENT} title="Code" className="w-full h-full" />
        <motion.div
          className="absolute right-0.5 top-3 bottom-3 w-1 rounded-full"
          style={{ background: ACCENT }}
          animate={loopOr(paused, { opacity: [0.45, 1, 0.45] })}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </motion.div>
      <motion.div
        className="relative rounded-xl overflow-hidden"
        animate={{ flex: resized ? 0.65 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        <MiniWindow color="#38BDF8" title="Docs" className="w-full h-full" />
      </motion.div>
    </div>
  );
}

function AppExclusionsDemo() {
  const [phase, setPhase] = useState<"tiled" | "listed" | "free">("tiled");
  useCardLoop(() => {
    setPhase((p) => (p === "tiled" ? "listed" : p === "listed" ? "free" : "tiled"));
  }, 1500);

  const listed = phase !== "tiled";
  const free = phase === "free";

  return (
    <div className="relative h-28 rounded-xl tahoe-wallpaper border border-white/12 overflow-hidden flex gap-2 p-2">
      <div className="relative flex-[1.5]">
        <div className="absolute left-0 top-0 bottom-0 w-[calc(50%-3px)]">
          <MiniWindow color={ACCENT} className="w-full h-full" />
        </div>
        <div
          className="absolute right-0 top-0 bottom-0 w-[calc(50%-3px)] rounded-xl"
          style={{ border: "1px dashed rgba(255,255,255,0.2)" }}
        />
        <motion.div
          className="absolute z-10"
          initial={false}
          animate={{
            right: free ? "14%" : "0%",
            top: free ? "16%" : "0%",
            width: free ? "44%" : "calc(50% - 3px)",
            height: free ? "66%" : "100%",
            rotate: free ? -3.5 : 0,
          }}
          transition={{ type: "spring", stiffness: 250, damping: 24 }}
        >
          <MiniWindow color="#38BDF8" className="w-full h-full" />
        </motion.div>
      </div>

      <div className="flex-1 rounded-xl bg-[#0e121d]/90 border border-white/12 px-2 py-1.5 flex flex-col gap-1.5 min-w-0">
        <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--foreground-muted)] truncate">Ignored Apps</div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/70">
          <span className="w-2 h-2 rounded-full shrink-0 bg-violet-400" />
          <span className="truncate">Zoom</span>
        </div>
        <AnimatePresence>
          {listed && (
            <motion.div
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5 text-[11px] rounded-md px-1 -mx-1 py-0.5 bg-sky-400/15 text-sky-300"
            >
              <span className="w-2 h-2 rounded-full shrink-0 bg-sky-400" />
              <span className="truncate">Notes</span>
              <ShieldCheck className="w-3 h-3 ml-auto shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RaycastDemo() {
  const paused = usePaused();
  const [selected, setSelected] = useState(0);
  const commands = [
    { icon: Search, title: "Switch Window", hint: "Jump to any window across Spaces" },
    { icon: Grid3X3, title: "Apply Layout", hint: "Arrange this desktop instantly" },
    { icon: Zap, title: "Change Mode", hint: "Auto-tiling, Manual, Drag to Snap, None" },
    { icon: Briefcase, title: "Open Workspace", hint: "Restore a saved set of apps" },
  ];

  useCardLoop(() => setSelected((s) => (s + 1) % commands.length), 1400);

  return (
    <div className="flex flex-col items-center gap-4">
      <div aria-hidden="true" className="w-full max-w-lg rounded-xl bg-[#0d1019] border border-white/14 overflow-hidden shadow-xl">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-white/10 text-sm">
          <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
          <span className="text-white/90">Rapto</span>
          <motion.span
            className="w-px h-4"
            style={{ background: ACCENT }}
            animate={loopOr(paused, { opacity: [1, 0, 1] })}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
        <div className="p-1.5 space-y-0.5">
          {commands.map((command, i) => {
            const Icon = command.icon;
            const active = selected === i;
            return (
              <motion.div
                key={command.title}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm"
                animate={{ background: active ? `${ACCENT}1c` : "rgba(0,0,0,0)" }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.07)", color: active ? ACCENT : "#cbd5e1" }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium text-white/95">{command.title}</span>
                <span className="text-xs text-[var(--foreground-muted)] truncate hidden sm:inline">{command.hint}</span>
                <span className="ml-auto text-[11px] font-mono text-[var(--foreground-muted)] shrink-0">
                  {active ? "↵" : "Command"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
      <a
        href={RAYCAST_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-lg text-sm font-medium hover:underline"
        style={{ color: ACCENT }}
      >
        Get it in the Raycast Store
        <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

// ============================================
// FEATURE CARD (Cached rect on hover — no layout thrash)
// ============================================
function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
  index = 0,
  wide = false,
  full = false,
  interactive = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
  index?: number;
  wide?: boolean;
  full?: boolean;
  interactive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const noHover = useNoHover();
  const onScreen = useInView(ref, { amount: 0.6 });
  const active = hovered || focused || (noHover && onScreen);

  return (
    <motion.div
      ref={ref}
      onPointerEnter={(e) => {
        rectRef.current = e.currentTarget.getBoundingClientRect();
        setHovered(true);
      }}
      onPointerLeave={() => {
        rectRef.current = null;
        setHovered(false);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className={`card spotlight p-6 flex flex-col justify-between ${wide ? "md:col-span-2" : ""} ${full ? "md:col-span-2 lg:col-span-3" : ""}`}
      onMouseMove={(e) => {
        const rect = rectRef.current;
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
        e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
      }}
    >
      <div className="flex items-start gap-3.5 mb-5 pr-6">
        <div className="feature-icon shrink-0">
          <Icon aria-hidden="true" className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{description}</p>
        </div>
      </div>

      {children && (
        <CardActiveContext.Provider value={active}>
          <div aria-hidden={interactive ? undefined : true}>{children}</div>
        </CardActiveContext.Provider>
      )}

      {children && !noHover && (
        <span
          aria-hidden="true"
          className="absolute top-5 right-5 flex items-center justify-center w-6 h-6 rounded-full border border-white/14 bg-white/[0.04] text-[var(--foreground-muted)] transition-opacity duration-200"
          style={{ opacity: active ? 0 : 0.85 }}
        >
          <Play className="w-2.5 h-2.5 translate-x-px" />
        </span>
      )}
    </motion.div>
  );
}

// ============================================
// CHAPTER 6: CURATED POWER-USER BENTO GRID
// ============================================
const ALSO_BUILT_IN = [
  "Window Swap",
  "Focus Window",
  "Snap Back",
  "Floating Windows",
  "Live Drag Hints",
  "Pause / Resume Rapto",
  "Searchable Settings (⌘F)",
  "Settings Export & Import",
];

function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="deferred-section-lg py-20 md:py-24 px-6 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-12">
          <SectionEyebrow label="Power-User Details" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="font-display heading-section font-bold mb-4"
          >
            Built for <span style={{ color: ACCENT }}>flow state</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Fast keyboard navigation, multi-monitor intelligence, app rules, and automation — without touching a config file.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={Search}
            title="Window Switcher"
            description="Type a few letters of any app or window title to filter and jump straight there across every Space and display."
            index={0}
            wide
            interactive
          >
            <div className="max-w-md mx-auto">
              <WindowSwitcherDemo />
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Keyboard}
            title="Keyboard First + Vim Preset"
            description="Focus, move, swap, and resize windows without leaving your keyboard — includes a built-in Vim preset."
            index={1}
          >
            <KeyboardDemo />
          </FeatureCard>

          <FeatureCard
            icon={Monitor}
            title="Multi-Monitor"
            description="Independent modes, limits, and layouts per display with one-shortcut window transfer between screens."
            index={2}
          >
            <MultiMonitorDemo />
          </FeatureCard>

          <FeatureCard
            icon={MoveHorizontal}
            title="Resize Adjacent"
            description="Drag or shortcut-resize one border and neighboring windows adjust together while honoring app minimum sizes."
            index={3}
          >
            <ResizeAdjacentDemo />
          </FeatureCard>

          <FeatureCard
            icon={ShieldCheck}
            title="App Rules & Smart Scanner"
            description="Ignore apps or pause hotkeys right from the Desktops Bar, or scan for terminals, IDEs, and VMs in Settings → Guide."
            index={4}
          >
            <AppExclusionsDemo />
          </FeatureCard>

          <FeatureCard
            icon={Command}
            title="Raycast Extension & AppleScript"
            description="Switch windows, apply layouts, change modes, and open workspaces from Raycast — or script your own macOS workflows via AppleScript."
            index={5}
            full
            interactive
          >
            <RaycastDemo />
          </FeatureCard>
        </div>

        {/* Concise "Also built in" strip — preserves full breadth without card fatigue */}
        <div className="mt-6 card px-5 py-4 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--foreground-muted)] mr-1">
            <Sliders aria-hidden="true" className="w-3.5 h-3.5 text-[var(--accent)]" />
            Also built in:
          </span>
          {ALSO_BUILT_IN.map((item) => (
            <span
              key={item}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.045] border border-white/10 text-[var(--foreground)]/85"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MotionScope({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export { WindowFlowSection, DesktopsBar, OperatingModes, Layouts, Workspaces, Features };
