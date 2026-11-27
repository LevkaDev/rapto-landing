"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { usePaused } from "../motion-pause";

interface DemoVideoProps {
  mp4: string;
  webm?: string;
  poster: string;
  width: number;
  height: number;
  label: string;
  caption?: string;
  className?: string;
}

/**
 * Reusable live-macOS recording stage.
 * - Zero layout shift (explicit width/height + matching aspect-ratio)
 * - Loads & plays only when near/inside the viewport, auto-pauses offscreen
 * - Respects the global header Pause toggle & prefers-reduced-motion
 * - Includes an unobtrusive corner Play/Pause button for manual control
 */
export function DemoVideo({
  mp4,
  webm,
  poster,
  width,
  height,
  label,
  caption,
  className = "",
}: DemoVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const globalPaused = usePaused();
  const [inView, setInView] = useState(false);
  const [nearView, setNearView] = useState(false);
  const [userOverride, setUserOverride] = useState<"play" | "pause" | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearView(true);
          preloadObserver.disconnect();
        }
      },
      { rootMargin: "320px 0px" }
    );
    preloadObserver.observe(el);

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    playObserver.observe(el);

    return () => {
      preloadObserver.disconnect();
      playObserver.disconnect();
    };
  }, []);

  const shouldPlay =
    inView && (userOverride === "play" || (userOverride !== "pause" && !globalPaused));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Ignore autoplay rejections in restricted environments
        });
      }
    } else if (!video.paused) {
      video.pause();
    }
  }, [shouldPlay]);

  const togglePlayback = () => {
    setUserOverride(shouldPlay ? "pause" : "play");
  };

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div className="relative w-full rounded-2xl overflow-hidden demo-window bg-[#070a12] group">
        <div style={{ aspectRatio: `${width} / ${height}` }} className="relative w-full">
          <video
            ref={videoRef}
            width={width}
            height={height}
            poster={poster}
            muted
            loop
            playsInline
            preload={nearView ? "auto" : "none"}
            aria-label={label}
            className="w-full h-full object-cover block"
          >
            <source src={mp4} type="video/mp4" />
            {webm && <source src={webm} type="video/webm" />}
          </video>

          {/* Subtle frosted corner playback toggle */}
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={shouldPlay ? `Pause ${label}` : `Play ${label}`}
            className="absolute right-3 bottom-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#080b14]/75 hover:bg-[#080b14]/92 border border-white/18 text-white/90 hover:text-[var(--accent)] backdrop-blur-md shadow-lg transition-[opacity,color,background-color,border-color] duration-200 opacity-85 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
          >
            {shouldPlay ? (
              <Pause aria-hidden="true" className="w-4 h-4" />
            ) : (
              <Play aria-hidden="true" className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {caption && (
        <p className="mt-3 text-center text-xs sm:text-sm text-[var(--foreground-muted)]">
          {caption}
        </p>
      )}
    </div>
  );
}
