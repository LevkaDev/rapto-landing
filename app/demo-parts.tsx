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
    // The first step comes quickly, so hovering a card gets an immediate answer
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
// Demo stage: a scripted demo with its caption, step controls and three
// highlights beside it. Used by the Desktops Bar, Layouts and Workspaces sections.
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
  side?: "left" | "right";
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
    "flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 rounded-lg border border-[var(--card-border-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors";

  return (
    <motion.div
      ref={stageRef}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.4 }}
      className={`grid gap-10 lg:gap-12 items-center ${
        side === "left" ? "lg:grid-cols-[300px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_300px]"
      }`}
    >
      <div className={`min-w-0 flex flex-col items-center ${side === "left" ? "lg:order-2" : ""}`}>
        {children}

        <div className="h-14 mt-5 flex items-start justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={caption}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-center text-[var(--foreground-muted)] max-w-xl"
            >
              {caption}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Step controls */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <button type="button" className={controlClass} onClick={() => onStep(-1)} aria-label="Previous step">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center gap-1" aria-hidden>
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
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            className={controlClass}
            onClick={() => {
              // Playing one demo also lifts the page-wide pause
              if (!playing && stopped) {
                setPaused(false);
                if (manual) onToggle();
              } else {
                onToggle();
              }
            }}
            aria-label={playing ? "Pause this demo" : "Play this demo"}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <ul className={`grid gap-6 sm:grid-cols-3 lg:grid-cols-1 ${side === "left" ? "lg:order-1" : ""}`}>
        {highlights.map((h) => (
          <li key={h.title} className="flex gap-4 lg:gap-4 sm:flex-col lg:flex-row">
            <div className="feature-icon shrink-0">
              <h.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold mb-1">{h.title}</h3>
              <p className="text-sm text-[var(--foreground-muted)]">{h.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Mode scenarios: one short scripted scene per operating mode.
// Coordinates are percentages of the screen.
// ---------------------------------------------------------------------------

type Box = { x: number; y: number; w: number; h: number };
type SceneWindow = Box & { id: string; color: string; r?: number; lift?: boolean };
type SceneFrame = {
  wins: SceneWindow[];
  zones?: Box[];
  hot?: number;
  preview?: Box;
  cursor?: [number, number];
  press?: boolean;
  note: string;
  ms: number;
};

const CYAN = "#00FFE5";
const VIOLET = "#A855F7";
const AMBER = "#FFB800";

const FULL: Box = { x: 2, y: 3, w: 96, h: 94 };
const LEFT: Box = { x: 2, y: 3, w: 47, h: 94 };
const RIGHT: Box = { x: 51, y: 3, w: 47, h: 94 };
const MAIN: Box = { x: 2, y: 3, w: 57, h: 94 };
const SIDE_TOP: Box = { x: 61, y: 3, w: 37, h: 46 };
const SIDE_BOTTOM: Box = { x: 61, y: 51, w: 37, h: 46 };
const Q: Box[] = [
  { x: 2, y: 3, w: 47, h: 46 },
  { x: 51, y: 3, w: 47, h: 46 },
  { x: 2, y: 51, w: 47, h: 46 },
  { x: 51, y: 51, w: 47, h: 46 },
];

const win = (id: string, color: string, box: Box, extra: Partial<SceneWindow> = {}): SceneWindow => ({ id, color, ...box, ...extra });

const AUTO_SCENE: SceneFrame[] = [
  { wins: [win("a", ACCENT, FULL)], note: "One window takes the whole screen", ms: 1400 },
  { wins: [win("a", ACCENT, LEFT), win("b", CYAN, RIGHT)], note: "Open another and they split it", ms: 1500 },
  { wins: [win("a", ACCENT, MAIN), win("b", CYAN, SIDE_TOP), win("c", VIOLET, SIDE_BOTTOM)], note: "A third one joins on the side", ms: 1500 },
  { wins: [win("a", ACCENT, Q[0]), win("b", CYAN, Q[1]), win("c", VIOLET, Q[2]), win("d", AMBER, Q[3])], note: "A fourth, and the layout changes again", ms: 1600 },
  { wins: [win("a", ACCENT, MAIN), win("b", CYAN, SIDE_TOP), win("c", VIOLET, SIDE_BOTTOM)], note: "Close one and the rest fill the gap", ms: 1900 },
];

const LOOSE = {
  a: { x: 8, y: 10, w: 42, h: 46, r: -3 },
  b: { x: 40, y: 28, w: 42, h: 48, r: 3 },
  c: { x: 18, y: 48, w: 36, h: 40, r: -2 },
};
const MANUAL_ZONES = [MAIN, SIDE_TOP, SIDE_BOTTOM];

const MANUAL_SCENE: SceneFrame[] = [
  { wins: [win("a", ACCENT, LOOSE.a, { r: -3 }), win("b", CYAN, LOOSE.b, { r: 3 }), win("c", VIOLET, LOOSE.c, { r: -2 })], note: "Pick a layout for this desktop", ms: 1300 },
  { wins: [win("a", ACCENT, LOOSE.a, { r: -3 }), win("b", CYAN, LOOSE.b, { r: 3 }), win("c", VIOLET, LOOSE.c, { r: -2 })], zones: MANUAL_ZONES, note: "Pick a layout for this desktop", ms: 1000 },
  { wins: [win("a", ACCENT, MAIN), win("b", CYAN, SIDE_TOP), win("c", VIOLET, SIDE_BOTTOM)], zones: MANUAL_ZONES, note: "Rapto puts the windows into its slots", ms: 1700 },
  { wins: [win("a", ACCENT, MAIN), win("b", CYAN, SIDE_TOP), win("c", VIOLET, SIDE_BOTTOM)], cursor: [79, 8], note: "To move a window, drag it to another slot", ms: 800 },
  { wins: [win("a", ACCENT, MAIN), win("c", VIOLET, SIDE_BOTTOM), win("b", CYAN, { x: 58, y: 34, w: 37, h: 46 }, { lift: true })], zones: MANUAL_ZONES, hot: 2, cursor: [76, 39], press: true, note: "To move a window, drag it to another slot", ms: 1000 },
  { wins: [win("a", ACCENT, MAIN), win("c", VIOLET, SIDE_TOP), win("b", CYAN, SIDE_BOTTOM)], cursor: [79, 56], note: "The two windows swap places", ms: 1900 },
];

const DRAG_A: Box = { x: 26, y: 16, w: 44, h: 52 };
const DRAG_B: Box = { x: 50, y: 40, w: 40, h: 48 };

const DRAG_SCENE: SceneFrame[] = [
  { wins: [win("a", ACCENT, DRAG_A), win("b", VIOLET, DRAG_B)], cursor: [50, 92], note: "Drag a window to a screen edge", ms: 1100 },
  { wins: [win("a", ACCENT, DRAG_A), win("b", VIOLET, DRAG_B)], cursor: [48, 21], note: "Drag a window to a screen edge", ms: 750 },
  { wins: [win("b", VIOLET, DRAG_B), win("a", ACCENT, { x: 0, y: 14, w: 44, h: 52 }, { lift: true })], preview: LEFT, cursor: [22, 19], press: true, note: "A preview shows where it will land", ms: 1300 },
  { wins: [win("b", VIOLET, DRAG_B), win("a", ACCENT, LEFT)], cursor: [22, 19], note: "Let go and it snaps into place", ms: 1300 },
  { wins: [win("a", ACCENT, LEFT), win("b", VIOLET, DRAG_B)], cursor: [70, 45], note: "Let go and it snaps into place", ms: 750 },
  { wins: [win("a", ACCENT, LEFT), win("b", VIOLET, { x: 58, y: 34, w: 40, h: 48 }, { lift: true })], preview: RIGHT, cursor: [78, 39], press: true, note: "A preview shows where it will land", ms: 1300 },
  { wins: [win("a", ACCENT, LEFT), win("b", VIOLET, RIGHT)], cursor: [78, 39], note: "Two drags, two halves", ms: 1900 },
];

const MODE_SCENES: Record<string, SceneFrame[]> = { auto: AUTO_SCENE, manual: MANUAL_SCENE, drag: DRAG_SCENE };

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
        aria-hidden
        className="relative w-full aspect-[16/10] rounded-xl border-2 overflow-hidden bg-[var(--background)] transition-colors duration-500"
        style={{ borderColor: `${color}90` }}
      >
        <div className="absolute inset-0 dot-grid opacity-20" />

        {/* Layout slots */}
        <AnimatePresence>
          {frame.zones?.map((z, i) => (
            <motion.div
              key={`zone-${i}`}
              className="absolute rounded-md"
              style={{
                left: `${z.x}%`,
                top: `${z.y}%`,
                width: `${z.w}%`,
                height: `${z.h}%`,
                border: `1.5px dashed ${color}`,
                background: frame.hot === i ? `${color}35` : `${color}10`,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
            />
          ))}
        </AnimatePresence>

        {/* Snap preview */}
        <AnimatePresence>
          {frame.preview && (
            <motion.div
              key={`preview-${frame.preview.x}`}
              className="absolute rounded-md"
              style={{
                left: `${frame.preview.x}%`,
                top: `${frame.preview.y}%`,
                width: `${frame.preview.w}%`,
                height: `${frame.preview.h}%`,
                border: `1.5px solid ${color}`,
                background: `${color}30`,
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Windows */}
        <AnimatePresence>
          {frame.wins.map((w, i) => (
            <motion.div
              key={w.id}
              className="absolute"
              style={{ zIndex: 10 + i }}
              initial={{ opacity: 0, scale: 0.8, left: `${w.x}%`, top: `${w.y}%`, width: `${w.w}%`, height: `${w.h}%` }}
              animate={{
                opacity: 1,
                scale: w.lift ? 1.04 : 1,
                rotate: w.r ?? 0,
                left: `${w.x}%`,
                top: `${w.y}%`,
                width: `${w.w}%`,
                height: `${w.h}%`,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={SCENE_SPRING}
            >
              <div
                className="w-full h-full rounded-md overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${w.color}38 0%, ${w.color}14 100%)`,
                  border: `1px solid ${w.color}70`,
                  boxShadow: w.lift ? "0 14px 30px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.35)",
                }}
              >
                <div className="h-[14%] min-h-[8px] max-h-[14px] flex items-center gap-[3px] px-1.5" style={{ background: `${w.color}35` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pointer */}
        {frame.cursor && (
          <motion.div
            className="absolute z-50 pointer-events-none"
            initial={false}
            animate={{ left: `${frame.cursor[0]}%`, top: `${frame.cursor[1]}%`, scale: frame.press ? 0.85 : 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" aria-hidden>
              <path d="M1 1 L1 15 L5 11.5 L7.8 18 L10.2 17 L7.4 10.6 L13 10.4 Z" fill="#fff" stroke="#0a0a0c" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="h-12 mt-4 flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={frame.note}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-center text-sm text-[var(--foreground-muted)]"
          >
            {frame.note}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
