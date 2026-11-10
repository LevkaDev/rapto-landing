"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Plus, Shuffle, X } from "lucide-react";
import { SwitcherAppIcon, type SwitcherApp } from "./AppIcons";
import { usePaused } from "./motion-pause";

// Interactive hero. On its own it tells one story: windows everywhere, one shortcut,
// every window in its place, and a new window that finds its spot.
// Anyone who touches it can then try layouts, drag windows and add one themselves.

const ACCENT = "#BFFF00";

type Rect = { x: number; y: number; w: number; h: number };
type Loose = Rect & { r: number };
type WinId = "code" | "safari" | "terminal" | "notes" | "mail";

const WINDOWS: Array<{ id: WinId; icon: SwitcherApp; title: string; color: string }> = [
  { id: "code", icon: "vscode", title: "main.swift", color: "#00FFE5" },
  { id: "safari", icon: "safari", title: "GitHub", color: "#BFFF00" },
  { id: "terminal", icon: "terminal", title: "~/projects", color: "#A855F7" },
  { id: "notes", icon: "notes", title: "Launch list", color: "#FFB800" },
  // The fifth window: it opens later, and the layout makes room for it
  { id: "mail", icon: "mail", title: "Inbox", color: "#FF6B6B" },
];

const DEFAULT_ORDER: WinId[] = ["code", "safari", "terminal", "notes"];

// Zones are fractions of the work area; windows fill them in order.
// zones5 is the same layout after a fifth window has joined.
const LAYOUTS: Array<{ name: string; zones: Rect[]; zones5: Rect[] }> = [
  {
    name: "Main + Stack",
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

// Two messy arrangements, so "Mess up" visibly changes something every time.
const CHAOS: Array<Record<WinId, Loose>> = [
  {
    code: { x: 0.06, y: 0.08, w: 0.52, h: 0.62, r: -3 },
    safari: { x: 0.36, y: 0.24, w: 0.5, h: 0.6, r: 2.5 },
    terminal: { x: 0.12, y: 0.5, w: 0.38, h: 0.42, r: 4 },
    notes: { x: 0.62, y: 0.05, w: 0.3, h: 0.42, r: -5 },
    mail: { x: 0.52, y: 0.46, w: 0.36, h: 0.44, r: 3 },
  },
  {
    code: { x: 0.34, y: 0.2, w: 0.54, h: 0.6, r: 3 },
    safari: { x: 0.05, y: 0.05, w: 0.48, h: 0.56, r: -4 },
    terminal: { x: 0.5, y: 0.52, w: 0.4, h: 0.4, r: -2.5 },
    notes: { x: 0.1, y: 0.48, w: 0.3, h: 0.44, r: 5 },
    mail: { x: 0.56, y: 0.06, w: 0.34, h: 0.42, r: -3 },
  },
];

// The story the hero tells on its own, one beat at a time
const STORY: Array<{ caption: string; ms: number }> = [
  { caption: "Windows everywhere", ms: 2800 },
  { caption: "Turn on Rapto, and every window is in its place", ms: 3600 },
  { caption: "Open another, and the layout makes room for it", ms: 3200 },
  { caption: "Your desktops live in the menu bar, each with its own layout", ms: 3800 },
];

// The second desktop: another task, already arranged
const DESK_TWO: Array<{ icon: SwitcherApp; title: string; color: string; zone: Rect }> = [
  { icon: "music", title: "Focus mix", color: "#FF6B6B", zone: { x: 0, y: 0, w: 0.56, h: 1 } },
  { icon: "files", title: "Design", color: "#3B9BFF", zone: { x: 0.56, y: 0, w: 0.44, h: 0.5 } },
  { icon: "telegram", title: "Team chat", color: "#2AABEE", zone: { x: 0.56, y: 0.5, w: 0.44, h: 0.5 } },
];
const STORY_LAYOUT = 0;
const IDLE_BEFORE_AUTOPLAY = 8000;

const now = () => Date.now();

const SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.9 };

// ---------------------------------------------------------------------------
// Window contents. Sizes are in em so they scale with the stage.
// ---------------------------------------------------------------------------

const CODE_LINES: Array<{ indent: number; parts: Array<[number, string]> }> = [
  { indent: 0, parts: [[3, "#A855F7"], [5, "#00FFE5"]] },
  { indent: 1, parts: [[2, "#A855F7"], [4, "#ffffff40"], [3, "#BFFF00"]] },
  { indent: 1, parts: [[2, "#A855F7"], [6, "#ffffff40"]] },
  { indent: 0, parts: [] },
  { indent: 1, parts: [[3, "#A855F7"], [5, "#00FFE5"], [2, "#ffffff40"]] },
  { indent: 2, parts: [[4, "#ffffff40"], [3, "#FFB800"]] },
  { indent: 2, parts: [[2, "#A855F7"], [7, "#ffffff40"]] },
  { indent: 3, parts: [[5, "#00FFE5"], [4, "#BFFF00"]] },
  { indent: 2, parts: [[1, "#ffffff40"]] },
  { indent: 1, parts: [[1, "#ffffff40"]] },
  { indent: 0, parts: [] },
  { indent: 1, parts: [[3, "#A855F7"], [6, "#00FFE5"]] },
  { indent: 2, parts: [[6, "#ffffff40"], [2, "#FFB800"]] },
  { indent: 1, parts: [[1, "#ffffff40"]] },
  { indent: 0, parts: [[1, "#ffffff40"]] },
];

function CodeContent() {
  return (
    <div className="flex h-full font-mono">
      <div className="shrink-0 py-[0.7em] pl-[0.7em] pr-[0.6em] text-right text-white/50" style={{ fontSize: "0.8em" }}>
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
      <div className="flex items-center gap-[0.5em] px-[0.7em] py-[0.5em] border-b border-white/5">
        <span className="text-white/50">‹ ›</span>
        <div className="flex-1 min-w-0 rounded-[0.5em] bg-white/[0.07] px-[0.7em] py-[0.25em] text-center text-white/55 truncate" style={{ fontSize: "0.9em" }}>
          github.com/rapto/rapto
        </div>
      </div>
      <div className="flex-1 min-h-0 p-[0.9em] flex flex-col gap-[0.8em]">
        <div className="flex items-center gap-[0.6em]">
          <span className="shrink-0 rounded-full" style={{ width: "1.8em", height: "1.8em", background: `${ACCENT}35`, border: `1px solid ${ACCENT}70` }} />
          <div className="flex-1 min-w-0 flex flex-col gap-[0.4em]">
            <span className="rounded-full bg-white/30" style={{ width: "42%", height: "0.55em" }} />
            <span className="rounded-full bg-white/12" style={{ width: "68%", height: "0.45em" }} />
          </div>
          <span className="shrink-0 rounded-[0.4em] px-[0.6em] py-[0.15em] font-medium" style={{ background: `${ACCENT}25`, color: ACCENT, fontSize: "0.85em" }}>
            ★ Star
          </span>
        </div>
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-[0.6em]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[0.5em] border border-white/[0.07] bg-white/[0.03] p-[0.6em] flex flex-col gap-[0.4em] overflow-hidden">
              <span className="rounded-full" style={{ width: "55%", height: "0.5em", background: `${ACCENT}80` }} />
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
        <span style={{ color: "#A855F7" }}>❯</span> <span className="text-white/80">swift build -c release</span>
      </div>
      <div className="text-white/55">Compiling Rapto (42 files)</div>
      <div style={{ color: ACCENT }}>✓ Build complete in 2.1s</div>
      <div>
        <span style={{ color: "#A855F7" }}>❯</span> <span className="text-white/80">git push</span>
      </div>
      <div className="text-white/55">main → origin/main</div>
      <div className="flex items-center gap-[0.5em]">
        <span style={{ color: "#A855F7" }}>❯</span>
        <span className="inline-block bg-white/70 animate-pulse" style={{ width: "0.55em", height: "1.1em" }} />
      </div>
    </div>
  );
}

const NOTES = [
  { text: "Record the demo", done: true },
  { text: "Update the landing", done: true },
  { text: "Ship 5.64", done: false },
  { text: "Post on Product Hunt", done: false },
  { text: "Reply to feedback", done: false },
];

function NotesContent() {
  return (
    <div className="h-full p-[0.9em] flex flex-col gap-[0.55em] whitespace-nowrap">
      <div className="font-semibold text-white/90" style={{ fontSize: "1.1em" }}>
        Launch list
      </div>
      {NOTES.map((note) => (
        <div key={note.text} className="flex items-center gap-[0.55em]">
          <span
            className="shrink-0 rounded-full flex items-center justify-center"
            style={{
              width: "1em",
              height: "1em",
              border: `1px solid ${note.done ? "#FFB800" : "rgba(255,255,255,0.3)"}`,
              background: note.done ? "#FFB800" : "transparent",
              color: "#0a0a0c",
              fontSize: "0.9em",
              lineHeight: 1,
            }}
          >
            {note.done ? "✓" : ""}
          </span>
          <span className={note.done ? "text-white/50 line-through" : "text-white/75"}>{note.text}</span>
        </div>
      ))}
    </div>
  );
}

const INBOX = [
  { from: "Anna", subject: "Launch plan", unread: true },
  { from: "Build bot", subject: "Release 5.64 is ready", unread: true },
  { from: "Sam", subject: "Re: screenshots", unread: false },
  { from: "Newsletter", subject: "This week in Swift", unread: false },
];

function MailContent() {
  return (
    <div className="h-full py-[0.5em] whitespace-nowrap">
      {INBOX.map((mail) => (
        <div key={mail.subject} className="flex items-center gap-[0.6em] px-[0.9em] py-[0.45em] border-b border-white/5">
          <span className="shrink-0 rounded-full" style={{ width: "0.5em", height: "0.5em", background: mail.unread ? "#FF6B6B" : "transparent" }} />
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
        style={{ width: "42%", background: "linear-gradient(135deg, #FF6B6B 0%, #A855F7 100%)", boxShadow: "0 1em 2.5em rgba(255,107,107,0.25)" }}
      />
      <div className="text-center whitespace-nowrap">
        <div className="font-semibold text-white/90" style={{ fontSize: "1.1em" }}>Deep Focus</div>
        <div className="text-white/50">Instrumental mix</div>
      </div>
      <div className="w-[70%] rounded-full bg-white/10 overflow-hidden" style={{ height: "0.35em" }}>
        <div className="h-full rounded-full" style={{ width: "38%", background: "#FF6B6B" }} />
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
          <span className="max-w-full truncate text-white/60">{name}</span>
        </div>
      ))}
    </div>
  );
}

function ChatContent() {
  const bubbles = [
    { mine: false, text: "Build is green" },
    { mine: true, text: "Shipping it today" },
    { mine: false, text: "Landing looks great" },
  ];
  return (
    <div className="h-full p-[0.9em] flex flex-col gap-[0.5em] whitespace-nowrap">
      {bubbles.map((b) => (
        <div
          key={b.text}
          className={`rounded-[0.9em] px-[0.8em] py-[0.35em] max-w-[85%] truncate ${b.mine ? "self-end text-[#0a0a0c]" : "self-start text-white/80 bg-white/10"}`}
          style={b.mine ? { background: "#2AABEE" } : undefined}
        >
          {b.text}
        </div>
      ))}
    </div>
  );
}

function WindowChrome({ icon, title, color, iconSize, children }: { icon: SwitcherApp; title: string; color: string; iconSize: number; children: React.ReactNode }) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden rounded-[0.8em] bg-[#131317]"
      style={{ border: `1px solid ${color}55`, boxShadow: "0 0.6em 1.8em rgba(0,0,0,0.45)" }}
    >
      <div className="shrink-0 flex items-center gap-[0.55em] px-[0.8em] bg-[#1b1b21]" style={{ height: "2.3em" }}>
        <span className="flex gap-[0.4em] shrink-0">
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} className="block rounded-full" style={{ width: "0.68em", height: "0.68em", background: c }} />
          ))}
        </span>
        <span className="shrink-0 flex ml-[0.3em]">
          <SwitcherAppIcon app={icon} size={iconSize} />
        </span>
        <span className="min-w-0 truncate text-white/70 font-medium">{title}</span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden text-white/70">{children}</div>
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
      className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md text-[11px] font-mono font-medium transition-all duration-150"
      style={{
        background: active ? ACCENT : "rgba(255,255,255,0.07)",
        color: active ? "#0a0a0c" : "rgba(255,255,255,0.6)",
        boxShadow: active ? `0 0 16px ${ACCENT}70` : "0 1.5px 0 rgba(0,0,0,0.5)",
        transform: active ? "translateY(1.5px)" : "none",
      }}
    >
      {children}
    </span>
  );
}

function LayoutGlyph({ zones, active }: { zones: Rect[]; active: boolean }) {
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" aria-hidden className="shrink-0">
      {zones.map((z, i) => (
        <rect
          key={i}
          x={z.x * 30 + 0.75}
          y={z.y * 20 + 0.75}
          width={z.w * 30 - 1.5}
          height={z.h * 20 - 1.5}
          rx="1.5"
          fill={active ? `${ACCENT}55` : "rgba(255,255,255,0.12)"}
          stroke={active ? ACCENT : "rgba(255,255,255,0.3)"}
          strokeWidth="0.8"
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
  // Whether the fifth window is open
  const [extra, setExtra] = useState(false);
  // The keystroke shown on the desktop, so every change has a visible cause
  const [hud, setHud] = useState<{ keys: string[]; label: string } | null>(null);
  // True once the visitor takes over; the story captions give way to hints
  const [userDriven, setUserDriven] = useState(false);
  const [desk, setDesk] = useState<1 | 2>(1);
  const [pointer, setPointer] = useState({ x: 0, y: 0, show: false, press: false });
  const stageRef = useRef<HTMLDivElement>(null);
  const deskTwoRef = useRef<HTMLSpanElement>(null);
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
  const pad = Math.max(4, W * 0.012);
  const gap = Math.max(4, W * 0.01);

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

  // Rapto starts: the windows snap into a layout and the desktops bar arrives in the same moment
  const launch = useCallback(() => {
    showHud([], "Rapto is running");
    setDesk(1);
    setStagger(true);
    setLayout(STORY_LAYOUT);
    setFlash((f) => f + 1);
  }, [showHud]);

  const switchDesk = useCallback((next: 1 | 2) => {
    touched();
    setDesk(next);
  }, [touched]);

  // In the story a pointer clicks "2" in the desktops bar
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

  const applyLayout = useCallback((index: number, fromAutoplay: boolean) => {
    if (!fromAutoplay) touched();
    setDesk(1);
    showHud([String(index + 1)], "Layout shortcut");
    setPressed(index);
    setStagger(true);
    // In autoplay the key goes down first, so the cause is seen before the effect
    later(() => {
      setLayout(index);
      setFlash((f) => f + 1);
    }, fromAutoplay ? 220 : 0);
    later(() => setPressed((p) => (p === index ? null : p)), fromAutoplay ? 520 : 300);
  }, [showHud, touched]);

  // Opens or closes the fifth window; the layout re-flows around it
  const setFifth = useCallback((open: boolean, fromAutoplay: boolean) => {
    if (!fromAutoplay) touched();
    if (open) showHud(["⌘", "N"], "New window");
    else showHud(["⌘", "W"], "Close window");
    setDesk(1);
    setStagger(false);
    setExtra(open);
    setOrder((o) => (open ? (o.includes("mail") ? o : [...o, "mail"]) : o.filter((id) => id !== "mail")));
    setStack((st) => [...st.filter((id) => id !== "mail"), "mail"]);
    setFlash((f) => f + 1);
  }, [showHud, touched]);

  const messUp = useCallback((fromAutoplay: boolean) => {
    if (!fromAutoplay) {
      touched();
      setChaosIndex((c) => (c + 1) % CHAOS.length);
    } else {
      // The story starts over: four windows, the first mess
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
  }, [touched]);

  // The story, paused for a while after any interaction
  useEffect(() => {
    if (!inView || W === 0 || paused) return;
    const timer = setTimeout(() => {
      if (now() - lastInteraction.current < IDLE_BEFORE_AUTOPLAY || dragStart.current) {
        setRetry((r) => r + 1);
        return;
      }
      // After the visitor has played with it, the story restarts from the mess
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

  // Keys 1-4 and Esc work while the pointer is over the demo or it has focus
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

  // Rapto is running exactly when the windows are in a layout: its menu bar icon and the
  // desktops bar never show over a mess
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
    // Touch keeps scrolling the page; layouts are still one tap away
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
      // No layout yet: the window just stays where it was dropped
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

  // Keyboard equivalent of dragging: arrow keys move the focused window to the neighbouring zone
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

  const fontSize = Math.min(12.5, Math.max(6.5, W * 0.0118));
  const iconSize = Math.round(Math.min(16, Math.max(9, W * 0.016)));
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
      <>Desktop 2 has its own apps and layout. Click 1 in the menu bar to go back</>
    ) : layout === null ? (
      <>
        Pick a layout below<span className="hidden md:inline">, or press 1–4</span>
      </>
    ) : (
      <>
        {LAYOUTS[layout].name}
        <span className="hidden md:inline"> · drag a window onto another zone, or focus it and use the arrow keys</span>
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
      {/* Desktop */}
      <div
        ref={stageRef}
        className="relative rounded-xl md:rounded-2xl overflow-hidden border border-[var(--card-border-hover)] shadow-2xl bg-[#0c0c0f] aspect-[4/3] sm:aspect-[16/9] select-none"
        style={{ fontSize }}
        role="group"
        aria-label="A desktop with scattered windows that Rapto arranges into a layout with one shortcut"
      >
        {/* Menu bar */}
        <div aria-hidden className="absolute inset-x-0 top-0 flex items-center gap-[1.2em] px-[1em] bg-black/50 border-b border-white/5 text-white/60" style={{ height: "2.4em" }}>
          <span className="font-semibold text-white/85">Finder</span>
          <span className="hidden sm:inline">File</span>
          <span className="hidden sm:inline">Edit</span>
          <span className="hidden sm:inline">View</span>
          <span className="hidden sm:inline">Window</span>
          {/* Desktops bar: drops into the menu bar when Rapto starts */}
          <AnimatePresence>
            {raptoOn && (
              <motion.div
                key="desktops-bar"
                className="absolute left-1/2 top-1/2 flex items-center gap-[0.25em] rounded-full border border-white/15 bg-white/10 px-[0.3em]"
                style={{ height: "1.9em" }}
                initial={{ opacity: 0, x: "-50%", y: "-190%", boxShadow: `0 0 0 0px ${ACCENT}00` }}
                // A lime ring marks the moment the bar arrives
                animate={{ opacity: 1, x: "-50%", y: "-50%", boxShadow: [`0 0 0 2px ${ACCENT}`, `0 0 18px 3px ${ACCENT}90`, `0 0 0 0px ${ACCENT}00`] }}
                exit={{ opacity: 0, x: "-50%", y: "-190%", transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 300, damping: 24, boxShadow: { duration: 1.6, times: [0, 0.35, 1] } }}
              >
                {([1, 2] as const).map((d) => (
                  <span
                    key={d}
                    ref={d === 2 ? deskTwoRef : undefined}
                    onClick={() => switchDesk(d)}
                    className="flex items-center gap-[0.3em] rounded-full px-[0.55em] cursor-pointer transition-colors duration-150"
                    style={{ height: "1.5em", background: desk === d ? "rgba(255,255,255,0.24)" : "transparent" }}
                  >
                    <span className={`font-semibold ${desk === d ? "text-white" : "text-white/60"}`}>{d}</span>
                    {(d === 1 ? present.map((w) => w.icon) : DESK_TWO.map((w) => w.icon)).map((icon) => (
                      <span key={icon} className="flex">
                        <SwitcherAppIcon app={icon} size={Math.max(7, Math.round(iconSize * 0.95))} />
                      </span>
                    ))}
                  </span>
                ))}
                <span className="px-[0.35em] text-white/50">+</span>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="ml-auto flex items-center gap-[1em]">
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
            <span className="font-mono">Mon 10:27</span>
          </span>
        </div>

        {/* Work area */}
        <div ref={areaRef} className="absolute inset-x-0 bottom-0" style={{ top: "2.4em" }}>
          {/* Desktop 2: a different task with its own layout. Switching is instant, as in Rapto */}
          {ready && desk === 2 && (
            <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }} aria-hidden>
              {DESK_TWO.map((w) => {
                const r = zoneRect(w.zone);
                return (
                  <div key={w.title} className="absolute" style={{ left: r.x, top: r.y, width: r.w, height: r.h }}>
                    <WindowChrome icon={w.icon} title={w.title} color={w.color} iconSize={iconSize}>
                      {w.icon === "music" ? <MusicContent /> : w.icon === "files" ? <FilesContent iconSize={iconSize} /> : <ChatContent />}
                    </WindowChrome>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Desktop 1 */}
          <div className="absolute inset-0" style={{ visibility: desk === 1 ? "visible" : "hidden" }}>
          {/* Layout zones: flash when a layout is applied, stay visible while dragging */}
          {ready &&
            layout !== null &&
            zonesOf(layout).map((z, i) => {
              const r = zoneRect(z);
              const hovered = drag?.zone === i;
              return (
                <motion.div
                  key={`${layout}-${extra}-${flash}-${i}`}
                  className="absolute rounded-lg pointer-events-none"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: r.w,
                    height: r.h,
                    border: `1.5px dashed ${ACCENT}`,
                    background: hovered ? `${ACCENT}30` : `${ACCENT}14`,
                    zIndex: drag ? 40 : 0,
                  }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={drag ? { opacity: hovered ? 1 : 0.45, scale: 1 } : { opacity: [0, 1, 1, 0], scale: 1 }}
                  transition={drag ? { duration: 0.12 } : { duration: 0.9, times: [0, 0.15, 0.6, 1], delay: i * 0.04 }}
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
                initial={win.id === "mail" ? { x: f.x, y: f.y, width: f.w, height: f.h, rotate: f.r, scale: 0.6, opacity: 0 } : false}
                exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.2 } }}
                animate={{
                  x: f.x + (dragging ? drag.dx : 0),
                  y: f.y + (dragging ? drag.dy : 0),
                  width: f.w,
                  height: f.h,
                  rotate: f.r,
                  scale: dragging ? 1.03 : 1,
                  opacity: ready ? 1 : 0,
                }}
                transition={
                  dragging
                    ? { x: { duration: 0 }, y: { duration: 0 }, default: SPRING }
                    : { ...SPRING, delay: stagger ? slot * 0.045 : 0, opacity: { duration: 0.3 } }
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
                <div
                  aria-hidden
                  className="w-full h-full flex flex-col overflow-hidden rounded-[0.8em] bg-[#131317] transition-shadow duration-200"
                  style={{
                    border: `1px solid ${win.color}55`,
                    boxShadow: dragging
                      ? `0 1.8em 3.5em rgba(0,0,0,0.65), 0 0 0 1px ${win.color}`
                      : "0 0.6em 1.8em rgba(0,0,0,0.45)",
                  }}
                >
                  <div className="shrink-0 flex items-center gap-[0.55em] px-[0.8em] bg-[#1b1b21]" style={{ height: "2.3em" }}>
                    <span className="flex gap-[0.4em] shrink-0">
                      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                        <span key={c} className="block rounded-full" style={{ width: "0.68em", height: "0.68em", background: c }} />
                      ))}
                    </span>
                    <span className="shrink-0 flex ml-[0.3em]">
                      <SwitcherAppIcon app={win.icon} size={iconSize} />
                    </span>
                    <span className="min-w-0 truncate text-white/70 font-medium">{win.title}</span>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden text-white/70">
                    <Content />
                  </div>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
          </div>
        </div>

        {/* The story's pointer */}
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 z-[70] pointer-events-none"
          initial={false}
          animate={{ x: pointer.x, y: pointer.y, opacity: pointer.show ? 1 : 0, scale: pointer.press ? 0.82 : 1 }}
          transition={{ x: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }, y: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }, default: { duration: 0.15 } }}
        >
          <svg width="18" height="22" viewBox="0 0 16 20">
            <path d="M1 1 L1 15 L5 11.5 L7.8 18 L10.2 17 L7.4 10.6 L13 10.4 Z" fill="#fff" stroke="#0a0a0c" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* The keystroke behind the last change */}
        <AnimatePresence>
          {hud && (
            <motion.div
              key={hud.label}
              aria-hidden
              className="absolute left-1/2 bottom-[4%] z-[60] flex items-center gap-[0.6em] rounded-full border border-white/15 bg-black/75 backdrop-blur px-[1em] py-[0.5em] pointer-events-none"
              style={{ x: "-50%", fontSize: "1.15em" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              {hud.keys.length === 0 && (
                <span className="grid grid-cols-2 gap-[0.16em]">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="block rounded-[0.12em]" style={{ width: "0.55em", height: "0.55em", background: ACCENT }} />
                  ))}
                </span>
              )}
              {hud.keys.map((k) => (
                <span
                  key={k}
                  className="inline-flex items-center justify-center rounded-[0.4em] font-mono font-semibold"
                  style={{ minWidth: "1.9em", height: "1.9em", padding: "0 0.4em", background: ACCENT, color: "#0a0a0c" }}
                >
                  {k}
                </span>
              ))}
              <span className="text-white/80 whitespace-nowrap">{hud.label}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* What is happening, in one line */}
      <div className="mt-5 min-h-[3.5rem] sm:min-h-[2rem] flex items-start justify-center">
        <AnimatePresence mode="wait">
          {userDriven ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
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
              transition={{ duration: 0.2 }}
              className="text-center font-display text-lg md:text-xl font-semibold text-[var(--foreground)]"
            >
              {STORY[step].caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Try it yourself: secondary to the story above */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="w-full text-center text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">Try it yourself</span>
        {LAYOUTS.map((l, i) => {
          const active = layout === i;
          return (
            <button
              key={l.name}
              type="button"
              onClick={() => applyLayout(i, false)}
              aria-pressed={active}
              aria-label={`Apply the ${l.name} layout`}
              className="flex items-center gap-2 pl-2 pr-2 py-1.5 min-h-11 sm:min-h-0 rounded-xl border transition-colors duration-200 hover:bg-white/5"
              style={{
                borderColor: active ? `${ACCENT}90` : "var(--card-border-hover)",
                background: active ? `${ACCENT}12` : undefined,
              }}
            >
              <LayoutGlyph zones={l.zones} active={active} />
              <span className={`hidden md:inline text-sm ${active ? "text-white" : "text-[var(--foreground-muted)]"}`}>{l.name}</span>
              <Keycap active={pressed === i}>{i + 1}</Keycap>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => messUp(false)}
          aria-label="Scatter the windows again"
          className="flex items-center gap-2 px-2.5 py-1.5 min-h-11 sm:min-h-0 rounded-xl border border-[var(--card-border-hover)] text-[var(--foreground-muted)] hover:text-white hover:bg-white/5 transition-colors duration-200"
        >
          <Shuffle className="w-4 h-4" />
          <span className="hidden md:inline text-sm">Mess up</span>
          <Keycap active={pressed === "mess"}>esc</Keycap>
        </button>
        <button
          type="button"
          onClick={() => setFifth(!extra, false)}
          aria-label={extra ? "Close the fifth window" : "Open a fifth window"}
          className="flex items-center gap-2 px-2.5 py-1.5 min-h-11 sm:min-h-0 rounded-xl border border-[var(--card-border-hover)] text-[var(--foreground-muted)] hover:text-white hover:bg-white/5 transition-colors duration-200"
        >
          {extra ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span className="hidden md:inline text-sm">{extra ? "Close window" : "New window"}</span>
          <Keycap active={false}>N</Keycap>
        </button>
      </div>
    </div>
  );
}
