"use client";

import { useEffect, useState } from "react";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

// Progressive "Expand all / Collapse all" button synced with native <details> items
// per Modern Web Guidance (`accordion` guide: aria-expanded is true only when every item is open,
// and listens to `toggle` in capture phase because `toggle` does not bubble).
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
      className="inline-flex items-center gap-2 px-4 py-2 min-h-10 rounded-xl border border-[var(--card-border-hover)] bg-[var(--card)] text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
    >
      {allExpanded ? (
        <>
          <ChevronsDownUp aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" />
          <span>Collapse all</span>
        </>
      ) : (
        <>
          <ChevronsUpDown aria-hidden="true" className="w-4 h-4 text-[var(--accent)]" />
          <span>Expand all</span>
        </>
      )}
    </button>
  );
}
