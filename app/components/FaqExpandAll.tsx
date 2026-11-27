"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from "lucide-react";

type FaqItem = { q: string; a: string };

// Progressive "Expand all / Collapse all" + compact initial 6-item FAQ view.
// Remaining items stay in the DOM with `hidden="until-found"` when collapsed, so Cmd+F
// find-in-page still locates and automatically reveals them in supported browsers.
export function FaqAccordionList({
  primary,
  secondary,
}: {
  primary: FaqItem[];
  secondary: FaqItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const extraRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);

  // Sync Expand-all button state whenever any <details> toggles (capture phase, since `toggle` does not bubble)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sync = () => {
      const items = container.querySelectorAll<HTMLDetailsElement>("details.faq-item");
      if (items.length === 0) return;
      const visibleItems = Array.from(items).filter((d) => !d.closest("[hidden]"));
      if (visibleItems.length === 0) return;
      setAllExpanded(visibleItems.every((d) => d.open));
    };

    container.addEventListener("toggle", sync, { capture: true });
    sync();
    return () => container.removeEventListener("toggle", sync, { capture: true });
  }, [showMore]);

  // Set hidden="until-found" imperatively when collapsed and auto-open on `beforematch` (Cmd+F)
  useEffect(() => {
    const el = extraRef.current;
    if (!el) return;
    if (showMore) {
      el.removeAttribute("hidden");
    } else {
      el.setAttribute("hidden", "until-found");
    }
    const onBeforeMatch = () => setShowMore(true);
    el.addEventListener("beforematch", onBeforeMatch);
    return () => el.removeEventListener("beforematch", onBeforeMatch);
  }, [showMore]);

  const toggleAll = () => {
    const container = containerRef.current;
    if (!container) return;
    const next = !allExpanded;
    if (next && !showMore) {
      setShowMore(true);
      extraRef.current?.removeAttribute("hidden");
    }
    container.querySelectorAll<HTMLDetailsElement>("details.faq-item").forEach((d) => {
      d.open = next;
    });
    setAllExpanded(next);
  };

  const renderItem = (item: FaqItem) => (
    <details key={item.q} className="card faq-item">
      <summary>
        <ChevronDown aria-hidden="true" className="w-5 h-5 faq-chevron" />
        <span className="font-display text-base sm:text-lg font-semibold text-[var(--foreground)]">
          {item.q}
        </span>
      </summary>
      <div className="px-6 pb-5 pl-[54px]">
        <p className="text-[var(--foreground-muted)] leading-relaxed text-[15px]">{item.a}</p>
      </div>
    </details>
  );

  return (
    <div ref={containerRef}>
      <div className="flex justify-center mb-8">
        <button
          type="button"
          aria-expanded={allExpanded}
          onClick={toggleAll}
          className="inline-flex items-center gap-2 px-4 py-2 min-h-10 rounded-xl border border-white/12 bg-white/[0.04] text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-white/25 transition-colors"
        >
          {allExpanded ? (
            <>
              <ChevronsDownUp aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" />
              <span>Collapse all</span>
            </>
          ) : (
            <>
              <ChevronsUpDown aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" />
              <span>Expand all ({primary.length + secondary.length})</span>
            </>
          )}
        </button>
      </div>

      <div id="faq-list" className="space-y-3">
        {primary.map(renderItem)}

        <div ref={extraRef} className="space-y-3">
          {secondary.map(renderItem)}
        </div>
      </div>

      {secondary.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            aria-expanded={showMore}
            onClick={() => setShowMore((s) => !s)}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-11 rounded-xl border border-white/12 bg-white/[0.04] text-sm font-medium text-[var(--foreground)] hover:border-white/25 hover:bg-white/[0.07] transition-colors"
          >
            <ChevronDown
              aria-hidden="true"
              className={`w-4 h-4 text-[var(--accent)] transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
            />
            <span>
              {showMore
                ? "Show fewer questions"
                : `Show ${secondary.length} more technical questions`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// Legacy named export kept in case referenced elsewhere
export function FaqExpandAll({ containerId }: { containerId: string }) {
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const sync = () => {
      const items = container.querySelectorAll<HTMLDetailsElement>("details.faq-item");
      if (items.length === 0) return;
      setAllExpanded(Array.from(items).every((d) => d.open));
    };
    container.addEventListener("toggle", sync, { capture: true });
    sync();
    return () => container.removeEventListener("toggle", sync, { capture: true });
  }, [containerId]);

  const toggleAll = () => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const next = !allExpanded;
    container.querySelectorAll<HTMLDetailsElement>("details.faq-item").forEach((d) => {
      d.open = next;
    });
    setAllExpanded(next);
  };

  return (
    <button
      type="button"
      aria-expanded={allExpanded}
      onClick={toggleAll}
      className="inline-flex items-center gap-2 px-4 py-2 min-h-10 rounded-xl border border-white/12 bg-white/[0.04] text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-white/25 transition-colors"
    >
      {allExpanded ? "Collapse all" : "Expand all"}
    </button>
  );
}
