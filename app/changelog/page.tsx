import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, History, Sparkles, Zap, Wrench } from "lucide-react";
import { getReleaseNotes } from "@/lib/release-notes";

const ACCENT = "#BFFF00";

export const metadata: Metadata = {
  title: "Changelog — Rapto",
  description: "What's new in every version of Rapto, the window manager for macOS.",
  alternates: { canonical: "/changelog" },
};

const sectionIcons: Record<string, typeof Sparkles> = {
  New: Sparkles,
  Improvements: Zap,
  Fixes: Wrench,
};

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function Item({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-[var(--foreground)]">{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function ChangelogPage() {
  const notes = getReleaseNotes();

  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <div className="absolute inset-0 atmosphere" />
      <div className="absolute inset-0 blueprint-grid opacity-10" />

      <div className="relative max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl" style={{ background: `${ACCENT}20` }}>
              <History className="w-8 h-8" style={{ color: ACCENT }} />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold">Changelog</h1>
          </div>
          <p className="text-xl text-[var(--foreground-muted)]">
            What&apos;s new in every version of Rapto. Rapto updates itself, so you always get the latest one.
          </p>
        </div>

        <div className="space-y-12">
          {notes.map((note) => (
            <section key={note.version} id={`v${note.version}`} className="scroll-mt-20">
              <div className="flex items-baseline gap-4 mb-4">
                <h2 className="font-display text-3xl font-bold">
                  <a href={`#v${note.version}`} className="hover:text-[var(--accent)] transition-colors">
                    {note.version}
                  </a>
                </h2>
                {note.date && (
                  <time dateTime={note.date} className="text-sm text-[var(--foreground-muted)]">
                    {formatDate(note.date)}
                  </time>
                )}
              </div>
              <div className="card p-6 space-y-5">
                {note.sections.map((section) => {
                  const Icon = sectionIcons[section.title] ?? Sparkles;
                  return (
                    <div key={section.title}>
                      <h3 className="flex items-center gap-2 font-semibold mb-2">
                        <Icon className="w-4 h-4" style={{ color: ACCENT }} />
                        {section.title}
                      </h3>
                      <ul className="list-disc list-outside ml-5 space-y-1.5 text-[var(--foreground-muted)]">
                        {section.items.map((item, i) => (
                          <li key={i}>
                            <Item text={item} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
