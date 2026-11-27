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

// Compact toggle embedded in the sticky navigation bar so it is always reachable
// without floating over interactive demos or mobile screens.
// Per Modern Web Guidance (`motion`): when the label switches between "Pause" and "Play",
// omit `aria-pressed` so screen readers do not announce a contradictory "Play, pressed".
export function HeaderPauseButton({ className = "" }: { className?: string }) {
  const stopped = usePaused();
  const label = stopped ? "Play animations" : "Pause animations";

  return (
    <button
      type="button"
      onClick={() => setPaused(!stopped)}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center min-w-9 min-h-9 px-2.5 rounded-xl border border-white/12 bg-white/[0.04] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-white/25 transition-colors ${className}`}
    >
      {stopped ? <Play aria-hidden="true" className="w-3.5 h-3.5" /> : <Pause aria-hidden="true" className="w-3.5 h-3.5" />}
    </button>
  );
}

// Kept exported for backwards compatibility if referenced elsewhere.
export function PauseToggle() {
  return <HeaderPauseButton />;
}
