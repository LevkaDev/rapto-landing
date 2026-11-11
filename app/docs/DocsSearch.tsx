"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

const ACCENT = "#BFFF00";
const MAX_RESULTS = 8;

type Entry = {
  element: HTMLElement;
  section: string;
  heading: boolean;
  text: string;
  lower: string;
};

// Every heading, paragraph and list item inside a docs section is one searchable entry
function buildIndex(): Entry[] {
  const entries: Entry[] = [];
  document.querySelectorAll<HTMLElement>("main section[id]").forEach((section) => {
    const sectionTitle = section.querySelector("h2")?.textContent?.trim() ?? "";
    section.querySelectorAll<HTMLElement>("h2, h3, h4, p, li").forEach((element) => {
      if (element.querySelector("p, li")) return;
      const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
      if (!text) return;
      entries.push({
        element,
        section: sectionTitle,
        heading: /^H[234]$/.test(element.tagName),
        text,
        lower: text.toLowerCase(),
      });
    });
  });
  return entries;
}

function snippet(text: string, word: string) {
  const at = text.toLowerCase().indexOf(word);
  if (at < 0 || text.length <= 140) return text;
  let start = Math.max(0, at - 50);
  if (start > 0) start = text.indexOf(" ", start) + 1 || start;
  let end = Math.min(text.length, start + 140);
  if (end < text.length) end = text.lastIndexOf(" ", end) > start ? text.lastIndexOf(" ", end) : end;
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

function Highlighted({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(pattern).map((part, i) =>
        words.includes(part.toLowerCase()) ? (
          <mark key={i} className="bg-transparent font-semibold" style={{ color: ACCENT }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function DocsSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<Entry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const words = useMemo(
    () => query.toLowerCase().split(/\s+/).filter((w) => w.length > 1 || /\d/.test(w)),
    [query]
  );

  const results = useMemo(() => {
    if (!words.length) return [];
    return index
      .filter((entry) => words.every((w) => entry.lower.includes(w) || entry.section.toLowerCase().includes(w)))
      .filter((entry) => words.some((w) => entry.lower.includes(w)))
      .sort((a, b) => Number(b.heading) - Number(a.heading))
      .slice(0, MAX_RESULTS);
  }, [index, words]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  const go = (entry: Entry) => {
    setOpen(false);
    inputRef.current?.blur();
    entry.element.scrollIntoView({ behavior: "smooth", block: "center" });
    entry.element.classList.remove("docs-search-hit");
    void entry.element.offsetWidth;
    entry.element.classList.add("docs-search-hit");
    window.setTimeout(() => entry.element.classList.remove("docs-search-hit"), 2000);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      go(results[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={boxRef} className="relative max-w-2xl mb-12">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] focus-within:border-[var(--accent)] transition-colors">
        <Search className="w-5 h-5 shrink-0 text-[var(--foreground-muted)]" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search the docs"
          aria-label="Search the docs"
          className="flex-1 bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] [&::-webkit-search-cancel-button]:hidden"
          onChange={(event) => {
            if (!index.length) setIndex(buildIndex());
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => {
            if (!index.length) setIndex(buildIndex());
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {query ? (
          <button
            aria-label="Clear search"
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <kbd className="hidden sm:inline px-2 py-0.5 rounded-md text-xs font-mono text-[var(--foreground-muted)] border border-[var(--card-border)]">
            ⌘K
          </kbd>
        )}
      </div>

      {open && words.length > 0 && (
        <div className="absolute z-40 left-0 right-0 mt-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] shadow-2xl overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[var(--foreground-muted)]">
              Nothing found. Try another word, or write to{" "}
              <a href="mailto:support@rapto.app" style={{ color: ACCENT }}>support@rapto.app</a>.
            </p>
          ) : (
            <ul role="listbox">
              {results.map((entry, i) => (
                <li key={i} role="option" aria-selected={i === active}>
                  <button
                    className={`w-full text-left px-4 py-3 transition-colors ${i === active ? "bg-[var(--card)]" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(entry)}
                  >
                    <span className="block text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
                      {entry.section}
                    </span>
                    <span className={`block text-sm ${entry.heading ? "font-semibold text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}>
                      <Highlighted text={snippet(entry.text, words[0])} words={words} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
