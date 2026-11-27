"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Plus, Shuffle, Sparkles, X } from "lucide-react";
import { SwitcherAppIcon, type SwitcherApp } from "./AppIcons";
import { usePaused } from "./motion-pause";

// Interactive hero playground. Tells one clear story on its own: scattered windows,
// Rapto organizes them into a clean grid, a new window joins seamlessly, and a second
// desktop switches instantly from the menu bar. Visitors can click layouts, drag windows,
// or add/close a window right inside the preview.

const ACCENT = "#BFFF00";

type Rect = { x: number; y: number; w: number; h: number };
type Loose = Rect & { r: number };
type WinId = "code" | "safari" | "terminal" | "notes" | "mail";

const WINDOWS: Array<{ id: WinId; icon: SwitcherApp; title: string; dot: string }> = [
  { id: "code", icon: "vscode", title: "main.swift", dot: "#38BDF8" },
  { id: "safari", icon: "safari", title: "GitHub", dot: "#BFFF00" },
  { id: "terminal", icon: "terminal", title: "~/projects", dot: "#A78BFA" },
  { id: "notes", icon: "notes", title: "Release 6.3", dot: "#FBBF24" },
  { id: "mail", icon: "mail", title: "Inbox", dot: "#FB7185" },
];

const DEFAULT_ORDER: WinId[] = ["code", "safari", "terminal", "notes"];

const LAYOUTS: Array<{ name: string; short: string; zones: Rect[]; zones5: Rect[] }> = [
  {
    name: "Main + Stack",
    short: "Main",
    zones: [
      { x: 0, y: 0, w: 0.58, h: 1 },
      { x: 0.58, y: 0, w: 0.42, h: 0.4 },
      { x: 0.58, y: 0.4, w: 0.42, h: 0.3 },
      { x: 0.58, y: 0.7, w: 0.42, h: 0.3 },
    ],
    zones5: [
      { x: 0, y: 0, w: 0.5, h: 1 },
      { x: 0.5, y: 0, w: 0.25, h: 0.5 },
      { x: 0.75, y: 0, w: 0.25, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.25, h: 0.5 },
      { x: 0.75, y: 0.5, w: 0.25, h: 0.5 },
    ],
  },
  {
    name: "Quarters",
    short: "Quarters",
    zones: [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
    zones5: [
      { x: 0, y: 0, w: 0.5, h: 0.54 },
      { x: 0.5, y: 0, w: 0.5, h: 0.54 },
      { x: 0, y: 0.54, w: 1 / 3, h: 0.46 },
      { x: 1 / 3, y: 0.54, w: 1 / 3, h: 0.46 },
      { x: 2 / 3, y: 0.54, w: 1 / 3, h: 0.46 },
    ],
  },
  {
    name: "Wide + Row",
    short: "Wide",
    zones: [
      { x: 0, y: 0, w: 1, h: 0.56 },
      { x: 0, y: 0.56, w: 1 / 3, h: 0.44 },
      { x: 1 / 3, y: 0.56, w: 1 / 3, h: 0.44 },
      { x: 2 / 3, y: 0.56, w: 1 / 3, h: 0.44 },
    ],
    zones5: [
      { x: 0, y: 0, w: 1, h: 0.56 },
      { x: 0, y: 0.56, w: 0.25, h: 0.44 },
      { x: 0.25, y: 0.56, w: 0.25, h: 0.44 },
      { x: 0.5, y: 0.56, w: 0.25, h: 0.44 },
      { x: 0.75, y: 0.56, w: 0.25, h: 0.44 },
    ],
  },
  {
    name: "Thirds",
    short: "Thirds",
    zones: [
      { x: 0, y: 0, w: 0.36, h: 1 },
      { x: 0.36, y: 0, w: 0.32, h: 1 },
      { x: 0.68, y: 0, w: 0.32, h: 0.5 },
      { x: 0.68, y: 0.5, w: 0.32, h: 0.5 },
    ],
    zones5: [
      { x: 0, y: 0, w: 0.36, h: 1 },
      { x: 0.36, y: 0, w: 0.32, h: 0.5 },
      { x: 0.36, y: 0.5, w: 0.32, h: 0.5 },
      { x: 0.68, y: 0, w: 0.32, h: 0.5 },
      { x: 0.68, y: 0.5, w: 0.32, h: 0.5 },
    ],
  },
];

const CHAOS: Array<Record<WinId, Loose>> = [
  {
    code: { x: 0.06, y: 0.08, w: 0.52, h: 0.62, r: -2.6 },
    safari: { x: 0.36, y: 0.24, w: 0.5, h: 0.6, r: 2.2 },
    terminal: { x: 0.12, y: 0.5, w: 0.38, h: 0.42, r: 3.4 },
    notes: { x: 0.62, y: 0.05, w: 0.3, h: 0.42, r: -4 },
    mail: { x: 0.52, y: 0.46, w: 0.36, h: 0.44, r: 2.6 },
  },
  {
    code: { x: 0.34, y: 0.2, w: 0.54, h: 0.6, r: 2.6 },
    safari: { x: 0.05, y: 0.05, w: 0.48, h: 0.56, r: -3.2 },
    terminal: { x: 0.5, y: 0.52, w: 0.4, h: 0.4, r: -2.2 },
    notes: { x: 0.1, y: 0.48, w: 0.3, h: 0.44, r: 4 },
    mail: { x: 0.56, y: 0.06, w: 0.34, h: 0.42, r: -2.6 },
  },
];

const STORY: Array<{ caption: string; ms: number }> = [
  { caption: "Scattered windows across your desktop", ms: 2600 },
  { caption: "Turn on Rapto — every window snaps into its place", ms: 3500 },
  { caption: "Open another window and the layout adapts around it", ms: 3200 },
  { caption: "Switch desktops instantly from the menu bar, each with its own layout", ms: 3700 },
];

const DESK_TWO: Array<{ icon: SwitcherApp; title: string; dot: string; zone: Rect }> = [
  { icon: "music", title: "Focus mix", dot: "#FB7185", zone: { x: 0, y: 0, w: 0.56, h: 1 } },
  { icon: "files", title: "Design", dot: "#38BDF8", zone: { x: 0.56, y: 0, w: 0.44, h: 0.5 } },
  { icon: "telegram", title: "Team chat", dot: "#2AABEE", zone: { x: 0.56, y: 0.5, w: 0.44, h: 0.5 } },
];
const STORY_LAYOUT = 0;
const IDLE_BEFORE_AUTOPLAY = 8000;

const now = () => Date.now();
const SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.9 };

// ---------------------------------------------------------------------------
// Realistic macOS window contents (em-scaled with stage width)
// ---------------------------------------------------------------------------

const CODE_LINES: Array<{ indent: number; parts: Array<[number, string]> }> = [
  { indent: 0, parts: [[3, "#A78BFA"], [5, "#38BDF8"]] },
  { indent: 1, parts: [[2, "#A78BFA"], [4, "rgba(255,255,255,0.24)"], [3, "#BFFF00"]] },
  { indent: 1, parts: [[2, "#A78BFA"], [6, "rgba(255,255,255,0.24)"]] },
  { indent: 0, parts: [] },
  { indent: 1, parts: [[3, "#A78BFA"], [5, "#38BDF8"], [2, "rgba(255,255,255,0.24)"]] },
  { indent: 2, parts: [[4, "rgba(255,255,255,0.24)"], [3, "#FBBF24"]] },
  { indent: 2, parts: [[2, "#A78BFA"], [7, "rgba(255,255,255,0.24)"]] },
  { indent: 3, parts: [[5, "#38BDF8"], [4, "#BFFF00"]] },
  { indent: 2, parts: [[1, "rgba(255,255,255,0.24)"]] },
  { indent: 1, parts: [[1, "rgba(255,255,255,0.24)"]] },
  { indent: 0, parts: [] },
  { indent: 1, parts: [[3, "#A78BFA"], [6, "#38BDF8"]] },
  { indent: 2, parts: [[6, "rgba(255,255,255,0.24)"], [2, "#FBBF24"]] },
  { indent: 1, parts: [[1, "rgba(255,255,255,0.24)"]] },
  { indent: 0, parts: [[1, "rgba(255,255,255,0.24)"]] },
];

function CodeContent() {
  return (
    <div className="flex h-full font-mono">
      <div className="shrink-0 py-[0.7em] pl-[0.7em] pr-[0.6em] text-right text-white/35" style={{ fontSize: "0.8em" }}>
        {CODE_LINES.map((_, i) => (
          <div key={i} style={{ height: "1.75em", lineHeight: "1.75em" }}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="flex-1 min-w-0 py-[0.56em]">
        {CODE_LINES.map((line, i) => (
          <div key={i} className="flex items-center gap-[0.4em]" style={{ height: "1.4em", paddingLeft: `${line.indent * 1.2}em` }}>
            {line.parts.map(([width, color], j) => (
              <span key={j} className="rounded-full shrink-0" style={{ width: `${width}em`, height: "0.5em", background: color }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SafariContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-[0.5em] px-[0.7em] py-[0.5em] border-b border-white/[0.06]">
        <span className="text-white/40">‹ ›</span>
        <div className="flex-1 min-w-0 rounded-[0.5em] bg-white/[0.06] px-[0.7em] py-[0.25em] text-center text-white/60 truncate" style={{ fontSize: "0.9em" }}>
          github.com/LevkaDev/Rapto
        </div>
      </div>
      <div className="flex-1 min-h-0 p-[0.9em] flex flex-col gap-[0.8em]">
        <div className="flex items-center gap-[0.6em]">
          <span className="shrink-0 rounded-full bg-sky-400/25 border border-sky-300/40" style={{ width: "1.8em", height: "1.8em" }} />
          <div className="flex-1 min-w-0 flex flex-col gap-[0.4em]">
            <span className="rounded-full bg-white/30" style={{ width: "44%", height: "0.55em" }} />
            <span className="rounded-full bg-white/12" style={{ width: "68%", height: "0.45em" }} />
          </div>
          <span className="shrink-0 rounded-[0.4em] px-[0.6em] py-[0.15em] font-medium" style={{ background: `${ACCENT}20`, color: ACCENT, fontSize: "0.85em" }}>
            ★ Star
          </span>
        </div>
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-[0.6em]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[0.5em] border border-white/[0.08] bg-white/[0.03] p-[0.6em] flex flex-col gap-[0.4em] overflow-hidden">
              <span className="rounded-full bg-sky-300/60" style={{ width: "55%", height: "0.5em" }} />
              <span className="rounded-full bg-white/12" style={{ width: "90%", height: "0.4em" }} />
              <span className="rounded-full bg-white/12" style={{ width: "70%", height: "0.4em" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TerminalContent() {
  return (
    <div className="h-full p-[0.8em] font-mono leading-[1.7] whitespace-nowrap" style={{ fontSize: "0.9em" }}>
      <div>
        <span style={{ color: "#A78BFA" }}>❯</span> <span className="text-white/85">swift build -c release</span>
      </div>
      <div className="text-white/50">Compiling Rapto 6.3 (Swift)</div>
      <div style={{ color: ACCENT }}>✓ Build complete in 2.1s</div>
      <div>
        <span style={{ color: "#A78BFA" }}>❯</span> <span className="text-white/85">rapto --version</span>
      </div>
      <div className="text-white/55">Rapto 6.3 · macOS 26 Tahoe</div>
      <div className="flex items-center gap-[0.5em]">
        <span style={{ color: "#A78BFA" }}>❯</span>
        <span className="inline-block bg-white/75 animate-pulse" style={{ width: "0.55em", height: "1.1em" }} />
      </div>
    </div>
  );
}

const NOTES = [
  { text: "Pin custom layouts to bar", done: true },
  { text: "Snap edges in zone editor", done: true },
  { text: "Ship Rapto 6.3", done: true },
  { text: "Try Window Flow 3D", done: false },
  { text: "Record live Tahoe clips", done: false },
];

function NotesContent() {
  return (
    <div className="h-full p-[0.9em] flex flex-col gap-[0.55em] whitespace-nowrap">
      <div className="font-semibold text-white/90" style={{ fontSize: "1.1em" }}>
        Release 6.3
      </div>
      {NOTES.map((note) => (
        <div key={note.text} className="flex items-center gap-[0.55em]">
          <span
            className="shrink-0 rounded-full flex items-center justify-center"
            style={{
              width: "1em",
              height: "1em",
              border: `1px solid ${note.done ? "#FBBF24" : "rgba(255,255,255,0.3)"}`,
              background: note.done ? "#FBBF24" : "transparent",
              color: "#08090d",
              fontSize: "0.9em",
              lineHeight: 1,
            }}
          >
            {note.done ? "✓" : ""}
          </span>
          <span className={note.done ? "text-white/45 line-through" : "text-white/80"}>{note.text}</span>
        </div>
      ))}
    </div>
  );
}

const INBOX = [
  { from: "Anna", subject: "Window Flow feels instant", unread: true },
  { from: "Build bot", subject: "Release 6.3 notarized", unread: true },
  { from: "Sam", subject: "Re: custom layouts", unread: false },
  { from: "Newsletter", subject: "This week in Swift", unread: false },
];

function MailContent() {
  return (
    <div className="h-full py-[0.5em] whitespace-nowrap">
      {INBOX.map((mail) => (
        <div key={mail.subject} className="flex items-center gap-[0.6em] px-[0.9em] py-[0.45em] border-b border-white/[0.06]">
          <span className="shrink-0 rounded-full" style={{ width: "0.5em", height: "0.5em", background: mail.unread ? "#FB7185" : "transparent" }} />
          <span className={`shrink-0 ${mail.unread ? "font-semibold text-white/90" : "text-white/60"}`}>{mail.from}</span>
          <span className="min-w-0 truncate text-white/50">{mail.subject}</span>
        </div>
      ))}
    </div>
  );
}

function MusicContent() {
  return (
    <div className="h-full p-[1.2em] flex flex-col items-center justify-center gap-[0.9em]">
      <div
        className="rounded-[0.8em] aspect-square"
        style={{ width: "42%", background: "linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)", boxShadow: "0 1em 2.5em rgba(56,189,248,0.25)" }}
      />
      <div className="text-center whitespace-nowrap">
        <div className="font-semibold text-white/90" style={{ fontSize: "1.1em" }}>Deep Focus</div>
        <div className="text-white/50">Instrumental mix</div>
      </div>
      <div className="w-[70%] rounded-full bg-white/10 overflow-hidden" style={{ height: "0.35em" }}>
        <div className="h-full rounded-full" style={{ width: "42%", background: "#38BDF8" }} />
      </div>
    </div>
  );
}

function FilesContent({ iconSize }: { iconSize: number }) {
  return (
    <div className="h-full p-[0.9em] grid grid-cols-3 gap-[0.8em] content-start whitespace-nowrap">
      {["Icons", "Mockups", "Export", "Fonts", "Archive", "Notes"].map((name) => (
        <div key={name} className="flex flex-col items-center gap-[0.3em] min-w-0">
          <SwitcherAppIcon app="files" size={Math.round(iconSize * 1.6)} />
          <span className="max-w-full truncate text-white/65">{name}</span>
        </div>
      ))}
    </div>
  );
}

function ChatContent() {
  const bubbles = [
    { mine: false, text: "Notarization passed" },
    { mine: true, text: "Shipping 6.3 today" },
    { mine: false, text: "Window Flow looks crisp" },
  ];
  return (
    <div className="h-full p-[0.9em] flex flex-col gap-[0.5em] whitespace-nowrap">
      {bubbles.map((b) => (
        <div
          key={b.text}
          className={`rounded-[0.9em] px-[0.8em] py-[0.35em] max-w-[85%] truncate ${b.mine ? "self-end text-[#08090d] font-medium" : "self-start text-white/85 bg-white/10"}`}
          style={b.mine ? { background: "#38BDF8" } : undefined}
        >
          {b.text}
        </div>
      ))}
    </div>
  );
}

function WindowChrome({
  icon,
  title,
  dot,
  iconSize,
  dragging = false,
  children,
}: {
  icon: SwitcherApp;
  title: string;
  dot: string;
  iconSize: number;
  dragging?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden rounded-[0.85em] bg-[#111521]/92 backdrop-blur-md transition-[box-shadow,border-color] duration-200"
      style={{
        border: dragging ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.13)",
        boxShadow: dragging
          ? `0 1.8em 3.5em rgba(0,0,0,0.7), 0 0 0 1px ${ACCENT}80`
          : "inset 0 1px 0 rgba(255,255,255,0.09), 0 0.7em 2em rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="shrink-0 flex items-center gap-[0.55em] px-[0.8em] bg-white/[0.035] border-b border-white/[0.07]"
        style={{ height: "2.3em" }}
      >
        <span className="flex gap-[0.4em] shrink-0">
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} className="block rounded-full" style={{ width: "0.68em", height: "0.68em", background: c }} />
          ))}
        </span>
        <span className="shrink-0 flex ml-[0.3em]">
          <SwitcherAppIcon app={icon} size={iconSize} />
        </span>
        <span className="min-w-0 truncate text-white/75 font-medium">{title}</span>
        <span
          className="ml-auto shrink-0 rounded-full opacity-70"
          style={{ width: "0.45em", height: "0.45em", background: dot }}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden text-white/75">{children}</div>
    </div>
  );
}

const CONTENT: Record<WinId, () => React.ReactElement> = {
  mail: MailContent,
  code: CodeContent,
  safari: SafariContent,
  terminal: TerminalContent,
  notes: NotesContent,
};

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

function Keycap({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <span
      className="hidden md:inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-mono font-medium transition-[background-color,color,transform,box-shadow] duration-150"
      style={{
        background: active ? ACCENT : "rgba(255,255,255,0.08)",
        color: active ? "#08090d" : "rgba(255,255,255,0.65)",
        boxShadow: active ? `0 0 14px ${ACCENT}60` : "0 1.5px 0 rgba(0,0,0,0.45)",
        transform: active ? "translateY(1.5px)" : "none",
      }}
    >
      {children}
    </span>
  );
}

function LayoutGlyph({ zones, active }: { zones: Rect[]; active: boolean }) {
  return (
    <svg width="26" height="18" viewBox="0 0 30 20" aria-hidden="true" className="shrink-0">
      {zones.map((z, i) => (
        <rect
          key={i}
          x={z.x * 30 + 0.75}
          y={z.y * 20 + 0.75}
          width={z.w * 30 - 1.5}
          height={z.h * 20 - 1.5}
          rx="1.6"
          fill={active ? `${ACCENT}48` : "rgba(255,255,255,0.12)"}
          stroke={active ? ACCENT : "rgba(255,255,255,0.34)"}
          strokeWidth="0.9"
        />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

type Drag = { id: WinId; dx: number; dy: number; zone: number | null };

export function HeroPlayground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-80px" });
  const paused = usePaused();

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [layout, setLayout] = useState<number | null>(null);
  const [order, setOrder] = useState<WinId[]>(DEFAULT_ORDER);
  const [chaosIndex, setChaosIndex] = useState(0);
  const [nudged, setNudged] = useState<Partial<Record<WinId, { x: number; y: number }>>>({});
  const [stack, setStack] = useState<WinId[]>(["code", "safari", "terminal", "notes", "mail"]);
  const [extra, setExtra] = useState(false);
  const [hud, setHud] = useState<{ keys: string[]; label: string } | null>(null);
  const [userDriven, setUserDriven] = useState(false);
  const [desk, setDesk] = useState<1 | 2>(1);
  const [pointer, setPointer] = useState({ x: 0, y: 0, show: false, press: false });
  const stageRef = useRef<HTMLDivElement>(null);
  const deskTwoRef = useRef<HTMLButtonElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [flash, setFlash] = useState(0);
  const [pressed, setPressed] = useState<number | "mess" | null>(null);
  const [stagger, setStagger] = useState(true);
  const [step, setStep] = useState(0);
  const [retry, setRetry] = useState(0);
  const [engaged, setEngaged] = useState(false);

  const lastInteraction = useRef(0);
  const dragStart = useRef<{ id: WinId; x: number; y: number; pointerId: number } | null>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const { w: W, h: H } = size;
  const pad = Math.max(5, W * 0.012);
  const gap = Math.max(5, W * 0.01);

  const zoneRect = useCallback(
    (z: Rect): Rect => {
      const iw = W - pad * 2;
      const ih = H - pad * 2;
      const x0 = pad + z.x * iw + (z.x > 0.001 ? gap / 2 : 0);
      const y0 = pad + z.y * ih + (z.y > 0.001 ? gap / 2 : 0);
      const x1 = pad + (z.x + z.w) * iw - (z.x + z.w < 0.999 ? gap / 2 : 0);
      const y1 = pad + (z.y + z.h) * ih - (z.y + z.h < 0.999 ? gap / 2 : 0);
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    },
    [W, H, pad, gap],
  );

  const showHud = useCallback((keys: string[], label: string) => {
    setHud({ keys, label });
    later(() => setHud((h) => (h && h.label === label ? null : h)), 1300);
  }, []);

  const touched = useCallback(() => {
    lastInteraction.current = now();
    setUserDriven(true);
    setPointer((c) => ({ ...c, show: false }));
  }, []);

  const launch = useCallback(() => {
    showHud([], "Rapto is running");
    setDesk(1);
    setStagger(true);
    setLayout(STORY_LAYOUT);
    setFlash((f) => f + 1);
  }, [showHud]);

  const switchDesk = useCallback(
    (next: 1 | 2) => {
      touched();
      setDesk(next);
    },
    [touched],
  );

  const pointAtDeskTwo = useCallback(() => {
    const stage = stageRef.current;
    const target = deskTwoRef.current;
    if (!stage || !target) {
      setDesk(2);
      return;
    }
    const s = stage.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    setPointer({ x: s.width * 0.58, y: s.height * 0.42, show: true, press: false });
    later(() => setPointer((c) => ({ ...c, x: t.left - s.left + t.width * 0.25, y: t.top - s.top + t.height * 0.55 })), 80);
    later(() => {
      setPointer((c) => ({ ...c, press: true }));
      setDesk(2);
    }, 950);
    later(() => setPointer((c) => ({ ...c, press: false })), 1150);
    later(() => setPointer((c) => ({ ...c, show: false })), 2400);
  }, []);

  const applyLayout = useCallback(
    (index: number, fromAutoplay: boolean) => {
      if (!fromAutoplay) touched();
      setDesk(1);
      showHud([String(index + 1)], "Layout shortcut");
      setPressed(index);
      setStagger(true);
      later(() => {
        setLayout(index);
        setFlash((f) => f + 1);
      }, fromAutoplay ? 220 : 0);
      later(() => setPressed((p) => (p === index ? null : p)), fromAutoplay ? 520 : 300);
    },
    [showHud, touched],
  );

  const setFifth = useCallback(
    (open: boolean, fromAutoplay: boolean) => {
      if (!fromAutoplay) touched();
      if (open) showHud(["⌘", "N"], "New window");
      else showHud(["⌘", "W"], "Close window");
      setDesk(1);
      setStagger(false);
      setExtra(open);
      setOrder((o) => (open ? (o.includes("mail") ? o : [...o, "mail"]) : o.filter((id) => id !== "mail")));
      setStack((st) => [...st.filter((id) => id !== "mail"), "mail"]);
      setFlash((f) => f + 1);
    },
    [showHud, touched],
  );

  const messUp = useCallback(
    (fromAutoplay: boolean) => {
      if (!fromAutoplay) {
        touched();
        setChaosIndex((c) => (c + 1) % CHAOS.length);
      } else {
        setChaosIndex(0);
        setOrder(DEFAULT_ORDER);
        setExtra(false);
      }
      setDesk(1);
      setPressed("mess");
      setStagger(true);
      setNudged({});
      setLayout(null);
      later(() => setPressed((p) => (p === "mess" ? null : p)), 300);
    },
    [touched],
  );

  useEffect(() => {
    if (!inView || W === 0 || paused) return;
    const timer = setTimeout(() => {
      if (now() - lastInteraction.current < IDLE_BEFORE_AUTOPLAY || dragStart.current) {
        setRetry((r) => r + 1);
        return;
      }
      const next = userDriven ? 0 : (step + 1) % STORY.length;
      if (next === 0) messUp(true);
      else if (next === 1) launch();
      else if (next === 2) setFifth(true, true);
      else pointAtDeskTwo();
      setUserDriven(false);
      setStep(next);
    }, userDriven ? 1500 : STORY[step].ms);
    return () => clearTimeout(timer);
  }, [inView, W, paused, step, retry, userDriven, messUp, setFifth, launch, pointAtDeskTwo]);

  useEffect(() => {
    if (!engaged) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const digit = /^Digit([1-4])$/.exec(e.code);
      if (digit) {
        e.preventDefault();
        applyLayout(Number(digit[1]) - 1, false);
      } else if (e.code === "Escape" || e.code === "Digit0") {
        messUp(false);
      } else if (e.code === "KeyN" && !e.ctrlKey && !e.altKey) {
        setFifth(!extra, false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [engaged, extra, applyLayout, messUp, setFifth]);

  const raptoOn = layout !== null;
  const zonesOf = (index: number) => (extra ? LAYOUTS[index].zones5 : LAYOUTS[index].zones);
  const present = extra ? WINDOWS : WINDOWS.filter((w) => w.id !== "mail");

  const zoneAt = (clientX: number, clientY: number): number | null => {
    const el = areaRef.current;
    if (!el || layout === null) return null;
    const box = el.getBoundingClientRect();
    const px = clientX - box.left;
    const py = clientY - box.top;
    const index = zonesOf(layout).findIndex((z) => {
      const r = zoneRect(z);
      return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
    });
    return index === -1 ? null : index;
  };

  const onPointerDown = (id: WinId) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { id, x: e.clientX, y: e.clientY, pointerId: e.pointerId };
    touched();
    setStagger(false);
    setStack((s) => [...s.filter((w) => w !== id), id]);
    setDrag({ id, dx: 0, dy: 0, zone: zoneAt(e.clientX, e.clientY) });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== e.pointerId) return;
    setDrag({ id: start.id, dx: e.clientX - start.x, dy: e.clientY - start.y, zone: zoneAt(e.clientX, e.clientY) });
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== e.pointerId) return;
    dragStart.current = null;
    touched();
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (layout === null) {
      setNudged((n) => {
        const prev = n[start.id] ?? { x: 0, y: 0 };
        return { ...n, [start.id]: { x: prev.x + dx / W, y: prev.y + dy / H } };
      });
    } else {
      const zone = zoneAt(e.clientX, e.clientY);
      const from = order.indexOf(start.id);
      if (zone !== null && zone !== from) {
        setOrder((o) => {
          const next = [...o];
          [next[from], next[zone]] = [next[zone], next[from]];
          return next;
        });
      }
    }
    setDrag(null);
  };

  const onWindowKeyDown = (id: WinId) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (layout === null) return;
    const direction =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (direction === 0) return;
    e.preventDefault();
    touched();
    setStagger(false);
    setStack((s) => [...s.filter((w) => w !== id), id]);
    setOrder((o) => {
      const from = o.indexOf(id);
      const to = (from + direction + o.length) % o.length;
      const next = [...o];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const fontSize = Math.min(12, Math.max(6.5, W * 0.0118));
  const iconSize = Math.round(Math.min(15, Math.max(9, W * 0.0155)));
  const ready = W > 0;

  const frameOf = (id: WinId): Loose => {
    if (layout !== null) {
      return { ...zoneRect(zonesOf(layout)[Math.max(0, order.indexOf(id))]), r: 0 };
    }
    const c = CHAOS[chaosIndex][id];
    const n = nudged[id] ?? { x: 0, y: 0 };
    return { x: (c.x + n.x) * W, y: (c.y + n.y) * H, w: c.w * W, h: c.h * H, r: c.r };
  };

  const hint =
    desk === 2 ? (
      <>Desktop 2 has its own apps and layout. Click 1 in the menu bar to go back.</>
    ) : layout === null ? (
      <>
        Pick a layout below<span className="hidden md:inline">, or press 1–4</span>.
      </>
    ) : (
      <>
        {LAYOUTS[layout].name}
        <span className="hidden md:inline"> · drag any window onto another slot, or use arrow keys</span>
      </>
    );

  return (
    <div
      ref={rootRef}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
    >
      {/* Tahoe macOS Desktop Stage */}
      <div
        ref={stageRef}
        className="relative rounded-2xl overflow-hidden border border-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_30px_70px_-15px_rgba(0,0,0,0.8)] tahoe-wallpaper aspect-[4/3] sm:aspect-[16/9] select-none"
        style={{ fontSize }}
        role="group"
        aria-label="Interactive macOS desktop preview showing Rapto arranging windows into layouts"
      >
        {/* Menu bar */}
        <div
          className="absolute inset-x-0 top-0 flex items-center gap-[1.2em] px-[1em] bg-black/55 backdrop-blur-md border-b border-white/[0.08] text-white/65 z-20"
          style={{ height: "2.4em" }}
        >
          <span aria-hidden="true" className="font-semibold text-white/90">Finder</span>
          <span aria-hidden="true" className="hidden sm:inline">File</span>
          <span aria-hidden="true" className="hidden sm:inline">Edit</span>
          <span aria-hidden="true" className="hidden sm:inline">View</span>
          <span aria-hidden="true" className="hidden sm:inline">Window</span>

          {/* Rapto 6.3 Desktops Bar with circular Window Flow button on the left */}
          <AnimatePresence>
            {raptoOn && (
              <motion.div
                key="desktops-bar"
                className="absolute left-1/2 top-1/2 flex items-center gap-[0.25em] rounded-full border border-white/15 bg-white/[0.11] backdrop-blur-xl px-[0.28em]"
                style={{ height: "1.9em" }}
                initial={{ opacity: 0, x: "-50%", y: "-190%", boxShadow: `0 0 0 0px ${ACCENT}00` }}
                animate={{
                  opacity: 1,
                  x: "-50%",
                  y: "-50%",
                  boxShadow: [`0 0 0 1.5px ${ACCENT}`, `0 0 16px 2px ${ACCENT}70`, `0 0 0 0px ${ACCENT}00`],
                }}
                exit={{ opacity: 0, x: "-50%", y: "-190%", transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 300, damping: 24, boxShadow: { duration: 1.5, times: [0, 0.35, 1] } }}
              >
                {/* Circular Window Flow button (shipped in 6.2) */}
                <span
                  aria-hidden="true"
                  title="Window Flow"
                  className="inline-flex items-center justify-center rounded-full shrink-0 border border-sky-300/40"
                  style={{
                    width: "1.4em",
                    height: "1.4em",
                    background: "radial-gradient(circle at 35% 30%, #93c5fd, #2563eb)",
                  }}
                >
                  <Sparkles className="w-[0.75em] h-[0.75em] text-white" />
                </span>

                {([1, 2] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    ref={d === 2 ? deskTwoRef : undefined}
                    onClick={() => switchDesk(d)}
                    aria-pressed={desk === d}
                    aria-label={`Switch preview to Desktop ${d}`}
                    className="flex items-center gap-[0.3em] rounded-full px-[0.52em] transition-colors duration-150"
                    style={{ height: "1.5em", background: desk === d ? "rgba(255,255,255,0.24)" : "transparent" }}
                  >
                    <span className={`font-semibold ${desk === d ? "text-white" : "text-white/60"}`}>{d}</span>
                    {(d === 1 ? present.map((w) => w.icon) : DESK_TWO.map((w) => w.icon)).map((icon) => (
                      <span key={icon} className="flex" aria-hidden="true">
                        <SwitcherAppIcon app={icon} size={Math.max(7, Math.round(iconSize * 0.92))} />
                      </span>
                    ))}
                  </button>
                ))}
                <span aria-hidden="true" className="px-[0.35em] text-white/55">+</span>
              </motion.div>
            )}
          </AnimatePresence>

          <span aria-hidden="true" className="ml-auto flex items-center gap-[1em]">
            <AnimatePresence>
              {raptoOn && (
                <motion.span
                  key="rapto-icon"
                  className="grid grid-cols-2 gap-[0.14em]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                  title="Rapto"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="block rounded-[0.1em]" style={{ width: "0.42em", height: "0.42em", background: ACCENT }} />
                  ))}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="font-mono text-white/70">Mon 10:27</span>
          </span>
        </div>

        {/* Work area */}
        <div ref={areaRef} className="absolute inset-x-0 bottom-0" style={{ top: "2.4em" }}>
          {/* Desktop 2 */}
          {ready && desk === 2 && (
            <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }} aria-hidden="true">
              {DESK_TWO.map((w) => {
                const r = zoneRect(w.zone);
                return (
                  <div key={w.title} className="absolute" style={{ left: r.x, top: r.y, width: r.w, height: r.h }}>
                    <WindowChrome icon={w.icon} title={w.title} dot={w.dot} iconSize={iconSize}>
                      {w.icon === "music" ? <MusicContent /> : w.icon === "files" ? <FilesContent iconSize={iconSize} /> : <ChatContent />}
                    </WindowChrome>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Desktop 1 */}
          <div className="absolute inset-0" style={{ visibility: desk === 1 ? "visible" : "hidden" }}>
            {/* Layout slot flash / drag targets */}
            {ready &&
              layout !== null &&
              zonesOf(layout).map((z, i) => {
                const r = zoneRect(z);
                const hovered = drag?.zone === i;
                return (
                  <motion.div
                    key={`${layout}-${extra}-${flash}-${i}`}
                    className="absolute rounded-xl pointer-events-none"
                    style={{
                      left: r.x,
                      top: r.y,
                      width: r.w,
                      height: r.h,
                      border: `1.5px dashed ${ACCENT}`,
                      background: hovered ? `${ACCENT}24` : `${ACCENT}0e`,
                      zIndex: drag ? 40 : 0,
                    }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={drag ? { opacity: hovered ? 1 : 0.45, scale: 1 } : { opacity: [0, 0.9, 0.9, 0], scale: 1 }}
                    transition={drag ? { duration: 0.12 } : { duration: 0.85, times: [0, 0.15, 0.6, 1], delay: i * 0.04 }}
                  />
                );
              })}

            {/* Windows */}
            <AnimatePresence>
              {present.map((win) => {
                const f = frameOf(win.id);
                const dragging = drag?.id === win.id;
                const Content = CONTENT[win.id];
                const slot = layout !== null ? Math.max(0, order.indexOf(win.id)) : WINDOWS.findIndex((w) => w.id === win.id);
                return (
                  <motion.div
                    key={win.id}
                    className={`absolute left-0 top-0 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                    style={{ zIndex: dragging ? 50 : 10 + stack.indexOf(win.id), touchAction: "pan-y" }}
                    initial={win.id === "mail" ? { x: f.x, y: f.y, width: f.w, height: f.h, rotate: f.r, scale: 0.65, opacity: 0 } : false}
                    exit={{ scale: 0.65, opacity: 0, transition: { duration: 0.2 } }}
                    animate={{
                      x: f.x + (dragging ? drag.dx : 0),
                      y: f.y + (dragging ? drag.dy : 0),
                      width: f.w,
                      height: f.h,
                      rotate: f.r,
                      scale: dragging ? 1.025 : 1,
                      opacity: ready ? 1 : 0,
                    }}
                    transition={
                      dragging
                        ? { x: { duration: 0 }, y: { duration: 0 }, default: SPRING }
                        : { ...SPRING, delay: stagger ? slot * 0.045 : 0, opacity: { duration: 0.25 } }
                    }
                    tabIndex={0}
                    role="button"
                    aria-roledescription="window"
                    aria-label={
                      layout !== null
                        ? `${win.title}, zone ${slot + 1} of ${present.length}. Arrow keys move it to another zone`
                        : `${win.title}. Pick a layout to arrange the windows`
                    }
                    onKeyDown={onWindowKeyDown(win.id)}
                    onPointerDown={onPointerDown(win.id)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerEnd}
                    onPointerCancel={onPointerEnd}
                  >
                    <div aria-hidden="true" className="w-full h-full">
                      <WindowChrome icon={win.icon} title={win.title} dot={win.dot} iconSize={iconSize} dragging={dragging}>
                        <Content />
                      </WindowChrome>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Story pointer */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-0 z-[70] pointer-events-none"
          initial={false}
          animate={{ x: pointer.x, y: pointer.y, opacity: pointer.show ? 1 : 0, scale: pointer.press ? 0.82 : 1 }}
          transition={{ x: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }, y: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }, default: { duration: 0.15 } }}
        >
          <svg width="18" height="22" viewBox="0 0 16 20">
            <path d="M1 1 L1 15 L5 11.5 L7.8 18 L10.2 17 L7.4 10.6 L13 10.4 Z" fill="#fff" stroke="#08090d" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* Keystroke HUD */}
        <AnimatePresence>
          {hud && (
            <motion.div
              key={hud.label}
              aria-hidden="true"
              className="absolute left-1/2 bottom-[4%] z-[60] flex items-center gap-[0.6em] rounded-full border border-white/15 bg-[#0b0e17]/85 backdrop-blur-xl px-[1em] py-[0.5em] pointer-events-none shadow-xl"
              style={{ x: "-50%", fontSize: "1.1em" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              {hud.keys.length === 0 && (
                <span className="grid grid-cols-2 gap-[0.16em]">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="block rounded-[0.12em]" style={{ width: "0.52em", height: "0.52em", background: ACCENT }} />
                  ))}
                </span>
              )}
              {hud.keys.map((k) => (
                <span
                  key={k}
                  className="inline-flex items-center justify-center rounded-[0.4em] font-mono font-semibold"
                  style={{ minWidth: "1.9em", height: "1.9em", padding: "0 0.4em", background: ACCENT, color: "#08090d" }}
                >
                  {k}
                </span>
              ))}
              <span className="text-white/90 whitespace-nowrap font-medium">{hud.label}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Story caption + Interactive toolbar compactly docked right below stage */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="min-h-[1.75rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {userDriven ? (
              <motion.p
                key="hint"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="text-center text-sm text-[var(--foreground-muted)]"
              >
                {hint}
              </motion.p>
            ) : (
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="text-center font-display text-base sm:text-lg font-semibold text-[var(--foreground)]"
              >
                {STORY[step].caption}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive layout picker — readable labels on mobile, keyboard keycaps on desktop */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--foreground-muted)] mr-1">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Try it
          </span>
          {LAYOUTS.map((l, i) => {
            const active = layout === i;
            return (
              <button
                key={l.name}
                type="button"
                onClick={() => applyLayout(i, false)}
                aria-pressed={active}
                aria-label={`Apply the ${l.name} layout`}
                className="flex items-center gap-2 px-2.5 py-1.5 min-h-10 rounded-xl border transition-[background-color,border-color,color] duration-150 hover:bg-white/[0.06]"
                style={{
                  borderColor: active ? `${ACCENT}88` : "rgba(255,255,255,0.12)",
                  background: active ? `${ACCENT}14` : "rgba(255,255,255,0.03)",
                }}
              >
                <LayoutGlyph zones={l.zones} active={active} />
                <span className={`text-xs sm:text-sm font-medium ${active ? "text-white" : "text-[var(--foreground-muted)]"}`}>
                  <span className="md:hidden">{l.short}</span>
                  <span className="hidden md:inline">{l.name}</span>
                </span>
                <Keycap active={pressed === i}>{i + 1}</Keycap>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => messUp(false)}
            aria-label="Scatter the windows again"
            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-10 rounded-xl border border-white/12 bg-white/[0.03] text-[var(--foreground-muted)] hover:text-white hover:border-white/25 hover:bg-white/[0.06] transition-[background-color,border-color,color] duration-150"
          >
            <Shuffle aria-hidden="true" className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm font-medium">Shuffle</span>
            <Keycap active={pressed === "mess"}>esc</Keycap>
          </button>
          <button
            type="button"
            onClick={() => setFifth(!extra, false)}
            aria-label={extra ? "Close the fifth window" : "Open a fifth window"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 min-h-10 rounded-xl border border-white/12 bg-white/[0.03] text-[var(--foreground-muted)] hover:text-white hover:border-white/25 hover:bg-white/[0.06] transition-[background-color,border-color,color] duration-150"
          >
            {extra ? <X aria-hidden="true" className="w-3.5 h-3.5" /> : <Plus aria-hidden="true" className="w-3.5 h-3.5" />}
            <span className="text-xs sm:text-sm font-medium">{extra ? "Close 5th" : "New window"}</span>
            <Keycap active={false}>N</Keycap>
          </button>
        </div>
      </div>
    </div>
  );
}
