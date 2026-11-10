"use client";

import { useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";

// One switch that stops every self-playing demo and looping effect on the page
// (WCAG 2.2.2: anything that moves on its own for more than five seconds can be paused).

let paused = false;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const isPaused = () => paused;

export function setPaused(next: boolean) {
  paused = next;
  // CSS animations are stopped from the stylesheet through this attribute
  document.documentElement.dataset.motion = next ? "paused" : "playing";
  listeners.forEach((listener) => listener());
}

export function usePaused() {
  return useSyncExternalStore(subscribe, isPaused, () => false);
}

// For looping framer-motion targets: while paused, each keyframe list collapses to its resting value.
export function loopOr<T extends Record<string, unknown>>(stopped: boolean, target: T): T {
  if (!stopped) return target;
  const still: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(target)) {
    still[key] = Array.isArray(value) ? value[value.length - 1] : value;
  }
  return still as T;
}

export function PauseToggle() {
  const stopped = usePaused();
  return (
    <button
      type="button"
      onClick={() => setPaused(!stopped)}
      aria-pressed={stopped}
      className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 h-11 px-3.5 rounded-full border border-white/20 bg-[var(--background-elevated)]/90 backdrop-blur text-sm text-[var(--foreground)] shadow-lg hover:border-[var(--accent)] transition-colors"
    >
      {stopped ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      <span className="hidden sm:inline">{stopped ? "Play animations" : "Pause animations"}</span>
      <span className="sm:hidden sr-only">{stopped ? "Play animations" : "Pause animations"}</span>
    </button>
  );
}
