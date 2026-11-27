"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { isPaused, setPaused, usePaused } from "./motion-pause";

const ACCENT = "#BFFF00";

// ---------------------------------------------------------------------------
// Feature cards: a card's demo runs only while the card is "active"
// (hovered or focused; on touch screens, while it is on screen).
// ---------------------------------------------------------------------------

export const CardActiveContext = createContext(true);

export function useCardLoop(step: () => void, ms: number) {
  const active = useContext(CardActiveContext);
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });
  useEffect(() => {
    if (!active) return;
    const run = () => {
      if (!isPaused()) stepRef.current();
    };
    const first = setTimeout(run, 350);
    const interval = setInterval(run, ms);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [active, ms]);
}

const subscribeHover = (listener: () => void) => {
  const query = window.matchMedia("(hover: none)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};

export function useNoHover() {
  return useSyncExternalStore(
    subscribeHover,
    () => window.matchMedia("(hover: none)").matches,
    () => false,
  );
}

// ---------------------------------------------------------------------------
// Demo stage: scripted demo with caption, step controls and highlights.
// Supports both side-by-side (`left` / `right`) and centered (`bottom`) layouts
// so consecutive sections have varied visual rhythm.
// ---------------------------------------------------------------------------

type Highlight = { icon: React.ElementType; title: string; text: string };

export function DemoStage({
  stageRef,
  visible,
  side = "right",
  caption,
  total,
  index,
  manual,
  onStep,
  onToggle,
  highlights,
  children,
}: {
  stageRef: React.RefObject<HTMLDivElement | null>;
  visible: boolean;
  side?: "left" | "right" | "bottom";
  caption: string;
  total: number;
  index: number;
  manual: boolean;
  onStep: (delta: number) => void;
  onToggle: () => void;
  highlights: Highlight[];
  children: React.ReactNode;
}) {
  const stopped = usePaused();
  const playing = !manual && !stopped;
  const controlClass =
    "flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-xl border border-white/12 bg-white/[0.04] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-white/25 hover:bg-white/[0.08] transition-colors";

  const controls = (
    <>
      <div className="min-h-12 mt-5 flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="text-center text-sm sm:text-base text-[var(--foreground-muted)] max-w-xl"
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2.5 w-full max-w-md mt-1">
        <button type="button" className={controlClass} onClick={() => onStep(-1)} aria-label="Previous step">
          <ChevronLeft aria-hidden="true" className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className="flex-1 h-1 rounded-full transition-colors duration-200"
              style={{ background: i <= index ? ACCENT : "rgba(255,255,255,0.14)" }}
            />
          ))}
        </div>
        <span className="sr-only">
          Step {index + 1} of {total}
        </span>
        <button type="button" className={controlClass} onClick={() => onStep(1)} aria-label="Next step">
          <ChevronRight aria-hidden="true" className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={controlClass}
          onClick={() => {
            if (!playing && stopped) {
              setPaused(false);
              if (manual) onToggle();
            } else {
              onToggle();
            }
          }}
          aria-label={playing ? "Pause this demo" : "Play this demo"}
        >
          {playing ? <Pause aria-hidden="true" className="w-4 h-4" /> : <Play aria-hidden="true" className="w-4 h-4" />}
        </button>
      </div>
    </>
  );

  if (side === "bottom") {
    return (
      <motion.div
        ref={stageRef}
        initial={{ opacity: 0, y: 24 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="w-full flex flex-col items-center">
          {children}
          {controls}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-10">
          {highlights.map((h) => (
            <li key={h.title} className="card p-5 flex items-start gap-3.5">
              <div className="feature-icon shrink-0 !w-10 !h-10">
                <h.icon aria-hidden="true" className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold mb-1">{h.title}</h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{h.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={stageRef}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className={`grid gap-8 lg:gap-12 items-center ${
        side === "left" ? "lg:grid-cols-[310px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_310px]"
      }`}
    >
      <div className={`min-w-0 flex flex-col items-center ${side === "left" ? "lg:order-2" : ""}`}>
        {children}
        {controls}
      </div>

      <ul className={`grid gap-4 sm:grid-cols-3 lg:grid-cols-1 ${side === "left" ? "lg:order-1" : ""}`}>
        {highlights.map((h) => (
          <li key={h.title} className="card p-4 flex gap-3.5 sm:flex-col lg:flex-row">
            <div className="feature-icon shrink-0 !w-10 !h-10">
              <h.icon aria-hidden="true" className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold mb-1">{h.title}</h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{h.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Mode scenarios: four short scripted scenes (Auto-tiling, Manual, Drag to Snap, None)
// rendered with crisp macOS Tahoe obsidian-glass windows (no muddy colored washes).
// ---------------------------------------------------------------------------

type Box = { x: number; y: number; w: number; h: number };
type SceneWindow = Box & {
  id: string;
  label: string;
  accent: string;
  r?: number;
  lift?: boolean;
};
type SceneFrame = {
  wins: SceneWindow[];
  zones?: Box[];
  hot?: number;
  preview?: Box;
  picker?: { hot?: [number, number] };
  cursor?: [number, number];
  press?: boolean;
  note: string;
  ms: number;
};

const SKY = "#38BDF8";
const VIOLET = "#A78BFA";
const AMBER = "#FBBF24";

const FULL: Box = { x: 2.5, y: 3.5, w: 95, h: 93 };
const LEFT: Box = { x: 2.5, y: 3.5, w: 46.5, h: 93 };
const RIGHT: Box = { x: 51, y: 3.5, w: 46.5, h: 93 };
const MAIN: Box = { x: 2.5, y: 3.5, w: 56.5, h: 93 };
const SIDE_TOP: Box = { x: 61, y: 3.5, w: 36.5, h: 45 };
const SIDE_BOTTOM: Box = { x: 61, y: 51.5, w: 36.5, h: 45 };
const Q: Box[] = [
  { x: 2.5, y: 3.5, w: 46.5, h: 45 },
  { x: 51, y: 3.5, w: 46.5, h: 45 },
  { x: 2.5, y: 51.5, w: 46.5, h: 45 },
  { x: 51, y: 51.5, w: 46.5, h: 45 },
];

const win = (
  id: string,
  label: string,
  accent: string,
  box: Box,
  extra: Partial<SceneWindow> = {},
): SceneWindow => ({ id, label, accent, ...box, ...extra });

const AUTO_SCENE: SceneFrame[] = [
  { wins: [win("a", "Editor", ACCENT, FULL)], note: "One window fills the screen", ms: 1400 },
  { wins: [win("a", "Editor", ACCENT, LEFT), win("b", "Browser", SKY, RIGHT)], note: "Open another and they split automatically", ms: 1500 },
  {
    wins: [win("a", "Editor", ACCENT, SIDE_TOP), win("b", "Browser", SKY, SIDE_BOTTOM), win("c", "Terminal", VIOLET, MAIN)],
    note: "A third opens in the main slot",
    ms: 1500,
  },
  {
    wins: [
      win("a", "Editor", ACCENT, Q[1]),
      win("b", "Browser", SKY, Q[3]),
      win("c", "Terminal", VIOLET, Q[0]),
      win("d", "Notes", AMBER, Q[2]),
    ],
    note: "A fourth adapts the grid — extras group beyond your limit",
    ms: 1700,
  },
  {
    wins: [win("a", "Editor", ACCENT, SIDE_TOP), win("b", "Browser", SKY, SIDE_BOTTOM), win("c", "Terminal", VIOLET, MAIN)],
    note: "Close one and the remaining windows reclaim the space",
    ms: 1900,
  },
];

const LOOSE = {
  a: { x: 8, y: 10, w: 42, h: 46, r: -2.5 },
  b: { x: 40, y: 26, w: 42, h: 48, r: 2.5 },
  c: { x: 18, y: 48, w: 36, h: 40, r: -1.8 },
};
const MANUAL_ZONES = [MAIN, SIDE_TOP, SIDE_BOTTOM];

const MANUAL_SCENE: SceneFrame[] = [
  {
    wins: [
      win("a", "Editor", ACCENT, LOOSE.a, { r: -2.5 }),
      win("b", "Browser", SKY, LOOSE.b, { r: 2.5 }),
      win("c", "Terminal", VIOLET, LOOSE.c, { r: -1.8 }),
    ],
    note: "Pick a fixed grid for this desktop",
    ms: 1300,
  },
  {
    wins: [
      win("a", "Editor", ACCENT, LOOSE.a, { r: -2.5 }),
      win("b", "Browser", SKY, LOOSE.b, { r: 2.5 }),
      win("c", "Terminal", VIOLET, LOOSE.c, { r: -1.8 }),
    ],
    zones: MANUAL_ZONES,
    note: "Pick a fixed grid for this desktop",
    ms: 1000,
  },
  {
    wins: [win("a", "Editor", ACCENT, MAIN), win("b", "Browser", SKY, SIDE_TOP), win("c", "Terminal", VIOLET, SIDE_BOTTOM)],
    zones: MANUAL_ZONES,
    note: "Windows stay in slots, extras group automatically",
    ms: 1700,
  },
  {
    wins: [win("a", "Editor", ACCENT, MAIN), win("b", "Browser", SKY, SIDE_TOP), win("c", "Terminal", VIOLET, SIDE_BOTTOM)],
    cursor: [79, 8],
    note: "Drag a window onto another slot to swap",
    ms: 800,
  },
  {
    wins: [
      win("a", "Editor", ACCENT, MAIN),
      win("c", "Terminal", VIOLET, SIDE_BOTTOM),
      win("b", "Browser", SKY, { x: 58, y: 34, w: 36.5, h: 45 }, { lift: true }),
    ],
    zones: MANUAL_ZONES,
    hot: 2,
    cursor: [76, 39],
    press: true,
    note: "Drag a window onto another slot to swap",
    ms: 1000,
  },
  {
    wins: [win("a", "Editor", ACCENT, MAIN), win("c", "Terminal", VIOLET, SIDE_TOP), win("b", "Browser", SKY, SIDE_BOTTOM)],
    cursor: [79, 56],
    note: "Both windows lock neatly into their new slots",
    ms: 1900,
  },
];

const DRAG_A: Box = { x: 26, y: 16, w: 44, h: 52 };
const DRAG_B: Box = { x: 50, y: 40, w: 40, h: 48 };

const PICKER_LAYOUTS: Box[][] = [
  [{ x: 0, y: 0, w: 50, h: 100 }, { x: 50, y: 0, w: 50, h: 100 }],
  [{ x: 0, y: 0, w: 100, h: 50 }, { x: 0, y: 50, w: 100, h: 50 }],
  [{ x: 0, y: 0, w: 100 / 3, h: 100 }, { x: 100 / 3, y: 0, w: 100 / 3, h: 100 }, { x: 200 / 3, y: 0, w: 100 / 3, h: 100 }],
  [{ x: 0, y: 0, w: 200 / 3, h: 100 }, { x: 200 / 3, y: 0, w: 100 / 3, h: 100 }],
  [{ x: 0, y: 0, w: 50, h: 50 }, { x: 50, y: 0, w: 50, h: 50 }, { x: 0, y: 50, w: 50, h: 50 }, { x: 50, y: 50, w: 50, h: 50 }],
  [{ x: 0, y: 0, w: 100, h: 100 }],
];
const PICKER = { x: 14, y: 4, padX: 1.5, padY: 2.4, gap: 1.5, thumb: 10.25 };
const PICKER_W = PICKER.padX * 2 + PICKER_LAYOUTS.length * PICKER.thumb + (PICKER_LAYOUTS.length - 1) * PICKER.gap;
const PICKER_H = PICKER.padY * 2 + PICKER.thumb;

const pickerTile = (layout: number, tile: number): [number, number] => {
  const t = PICKER_LAYOUTS[layout][tile];
  const left = PICKER.x + PICKER.padX + layout * (PICKER.thumb + PICKER.gap);
  const top = PICKER.y + PICKER.padY;
  return [left + ((t.x + t.w / 2) / 100) * PICKER.thumb, top + ((t.y + t.h / 2) / 100) * PICKER.thumb];
};

const HALF_RIGHT_TILE = pickerTile(0, 1);

const DRAG_SCENE: SceneFrame[] = [
  { wins: [win("a", "Editor", ACCENT, DRAG_A), win("b", "Browser", SKY, DRAG_B)], cursor: [50, 90], note: "Drag a window to any screen edge", ms: 1100 },
  { wins: [win("a", "Editor", ACCENT, DRAG_A), win("b", "Browser", SKY, DRAG_B)], cursor: [48, 18], note: "Drag a window to any screen edge", ms: 750 },
  {
    wins: [win("b", "Browser", SKY, DRAG_B), win("a", "Editor", ACCENT, { x: 0, y: 38, w: 44, h: 52 }, { lift: true })],
    picker: {},
    preview: LEFT,
    cursor: [3, 40],
    press: true,
    note: "A live preview shows where it will land",
    ms: 1300,
  },
  { wins: [win("b", "Browser", SKY, DRAG_B), win("a", "Editor", ACCENT, LEFT)], cursor: [3, 40], note: "Release and it snaps cleanly into place", ms: 1200 },
  { wins: [win("a", "Editor", ACCENT, LEFT), win("b", "Browser", SKY, DRAG_B)], cursor: [70, 42], note: "Or drop it onto the top layout bar", ms: 800 },
  { wins: [win("a", "Editor", ACCENT, LEFT), win("b", "Browser", SKY, DRAG_B, { lift: true })], picker: {}, cursor: [70, 42], press: true, note: "Built-in & pinned custom layouts appear at the top", ms: 900 },
  {
    wins: [
      win("a", "Editor", ACCENT, LEFT),
      win("b", "Browser", SKY, { x: HALF_RIGHT_TILE[0] - 20, y: HALF_RIGHT_TILE[1] - 2, w: 40, h: 48 }, { lift: true }),
    ],
    picker: { hot: [0, 1] },
    preview: RIGHT,
    cursor: HALF_RIGHT_TILE,
    press: true,
    note: "Drop on any tile — or into an occupied zone to group",
    ms: 1400,
  },
  { wins: [win("a", "Editor", ACCENT, LEFT), win("b", "Browser", SKY, RIGHT)], cursor: HALF_RIGHT_TILE, note: "Drop on any tile — or into an occupied zone to group", ms: 1900 },
];

// Mode 4: None (Free Float) — windows move freely without snapping or grid interference
const NONE_SCENE: SceneFrame[] = [
  {
    wins: [
      win("a", "Figma", VIOLET, { x: 8, y: 10, w: 62, h: 72 }),
      win("b", "Preview", SKY, { x: 52, y: 30, w: 38, h: 50 }),
    ],
    cursor: [68, 34],
    note: "Windows stay completely free on this Space",
    ms: 1400,
  },
  {
    wins: [
      win("a", "Figma", VIOLET, { x: 8, y: 10, w: 62, h: 72 }),
      win("b", "Preview", SKY, { x: 34, y: 20, w: 38, h: 50 }, { lift: true }),
    ],
    cursor: [50, 24],
    press: true,
    note: "Move, overlap, or resize freely — zero interference",
    ms: 1200,
  },
  {
    wins: [
      win("a", "Figma", VIOLET, { x: 8, y: 10, w: 62, h: 72 }),
      win("b", "Preview", SKY, { x: 34, y: 20, w: 38, h: 50 }),
    ],
    cursor: [50, 24],
    note: "Ideal for design canvases, video editors, or full-screen games",
    ms: 2000,
  },
];

const MODE_SCENES: Record<string, SceneFrame[]> = {
  auto: AUTO_SCENE,
  manual: MANUAL_SCENE,
  drag: DRAG_SCENE,
  none: NONE_SCENE,
};

const SCENE_SPRING = { type: "spring" as const, stiffness: 320, damping: 30 };

export function ModeScenario({ mode, color, onLoop }: { mode: string; color: string; onLoop?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const stopped = usePaused();
  const [index, setIndex] = useState(0);
  const frames = MODE_SCENES[mode] ?? AUTO_SCENE;
  const frame = frames[index % frames.length];
  const loopRef = useRef(onLoop);
  useEffect(() => {
    loopRef.current = onLoop;
  });

  useEffect(() => {
    if (!inView || stopped) return;
    const timer = setTimeout(() => {
      if (index + 1 < frames.length) {
        setIndex(index + 1);
      } else {
        setIndex(0);
        loopRef.current?.();
      }
    }, frame.ms);
    return () => clearTimeout(timer);
  }, [inView, stopped, index, frames.length, frame.ms]);

  return (
    <div ref={ref}>
      <div
        aria-hidden="true"
        className="relative w-full aspect-[16/10] rounded-2xl border border-white/12 overflow-hidden tahoe-wallpaper shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        {/* Layout slots */}
        <AnimatePresence>
          {frame.zones?.map((z, i) => (
            <motion.div
              key={`zone-${i}`}
              className="absolute rounded-lg"
              style={{
                left: `${z.x}%`,
                top: `${z.y}%`,
                width: `${z.w}%`,
                height: `${z.h}%`,
                border: `1.5px dashed ${color}`,
                background: frame.hot === i ? `${color}28` : `${color}0c`,
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, delay: i * 0.05 }}
            />
          ))}
        </AnimatePresence>

        {/* Snap preview */}
        <AnimatePresence>
          {frame.preview && (
            <motion.div
              key={`preview-${frame.preview.x}`}
              className="absolute rounded-lg"
              style={{
                left: `${frame.preview.x}%`,
                top: `${frame.preview.y}%`,
                width: `${frame.preview.w}%`,
                height: `${frame.preview.h}%`,
                border: `1.5px solid ${color}`,
                background: `${color}22`,
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
          )}
        </AnimatePresence>

        {/* Tahoe Obsidian Glass Windows */}
        <AnimatePresence>
          {frame.wins.map((w, i) => (
            <motion.div
              key={w.id}
              className="absolute"
              style={{ zIndex: 10 + i }}
              initial={{ opacity: 0, scale: 0.88, left: `${w.x}%`, top: `${w.y}%`, width: `${w.w}%`, height: `${w.h}%` }}
              animate={{
                opacity: 1,
                scale: w.lift ? 1.03 : 1,
                rotate: w.r ?? 0,
                left: `${w.x}%`,
                top: `${w.y}%`,
                width: `${w.w}%`,
                height: `${w.h}%`,
              }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={SCENE_SPRING}
            >
              <div
                className="w-full h-full rounded-lg overflow-hidden flex flex-col bg-[#121622]/92 backdrop-blur-md"
                style={{
                  border: w.lift ? `1px solid ${color}b0` : "1px solid rgba(255,255,255,0.14)",
                  boxShadow: w.lift
                    ? "0 18px 34px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.14)"
                    : "0 8px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)",
                }}
              >
                <div className="h-[18%] min-h-[16px] max-h-[22px] flex items-center gap-1 px-2 border-b border-white/[0.07] bg-white/[0.03] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]/85" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E]/85" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]/85" />
                  <span className="ml-1.5 text-[9px] font-medium text-white/60 truncate">{w.label}</span>
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: w.accent }}
                  />
                </div>
                <div className="flex-1 p-2.5 flex flex-col gap-1.5 overflow-hidden">
                  <div className="h-1.5 w-2/5 rounded-full" style={{ background: `${w.accent}70` }} />
                  <div className="h-1.5 w-4/5 rounded-full bg-white/14" />
                  <div className="h-1.5 w-3/5 rounded-full bg-white/10" />
                  <div className="mt-auto grid grid-cols-2 gap-1.5">
                    <div className="h-4 rounded bg-white/[0.04] border border-white/[0.06]" />
                    <div className="h-4 rounded bg-white/[0.04] border border-white/[0.06]" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Top layout panel during Drag to Snap */}
        <AnimatePresence>
          {frame.picker && (
            <motion.div
              key="picker"
              className="absolute z-40 rounded-xl border border-white/15 backdrop-blur-xl"
              style={{
                left: `${PICKER.x}%`,
                top: `${PICKER.y}%`,
                width: `${PICKER_W}%`,
                height: `${PICKER_H}%`,
                background: "rgba(16, 20, 30, 0.92)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {PICKER_LAYOUTS.map((tiles, layout) => (
                <div
                  key={layout}
                  className="absolute"
                  style={{
                    left: `${((PICKER.padX + layout * (PICKER.thumb + PICKER.gap)) / PICKER_W) * 100}%`,
                    top: `${(PICKER.padY / PICKER_H) * 100}%`,
                    width: `${(PICKER.thumb / PICKER_W) * 100}%`,
                    height: `${(PICKER.thumb / PICKER_H) * 100}%`,
                  }}
                >
                  {tiles.map((t, tile) => {
                    const hot = frame.picker?.hot?.[0] === layout && frame.picker?.hot?.[1] === tile;
                    return (
                      <div
                        key={tile}
                        className="absolute rounded-[2px] transition-colors duration-150"
                        style={{
                          left: `calc(${t.x}% + 1px)`,
                          top: `calc(${t.y}% + 1px)`,
                          width: `calc(${t.w}% - 2px)`,
                          height: `calc(${t.h}% - 2px)`,
                          background: hot ? color : "rgba(255,255,255,0.22)",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pointer */}
        {frame.cursor && (
          <motion.div
            className="absolute z-50 pointer-events-none"
            initial={false}
            animate={{ left: `${frame.cursor[0]}%`, top: `${frame.cursor[1]}%`, scale: frame.press ? 0.85 : 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" aria-hidden="true">
              <path
                d="M1 1 L1 15 L5 11.5 L7.8 18 L10.2 17 L7.4 10.6 L13 10.4 Z"
                fill="#fff"
                stroke="#08090d"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="min-h-10 mt-3.5 flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={frame.note}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-center text-sm text-[var(--foreground-muted)]"
          >
            {frame.note}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
