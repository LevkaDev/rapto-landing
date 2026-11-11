import { readFileSync } from "fs";
import path from "path";
import releaseDates from "@/content/release-dates.json";

export type ReleaseNote = {
  version: string;
  date?: string;
  sections: { title: string; items: string[] }[];
};

const dates: Record<string, string> = releaseDates;

function compareVersions(a: string, b: string) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Same rules as the app's What's New: `## Version X`, `### Section`, `- item`; placeholder items and
// empty sections are skipped, and a line without a dash continues the previous item
export function parseReleaseNotes(text: string): ReleaseNote[] {
  const notes: ReleaseNote[] = [];
  let version: string | undefined;
  let sections: ReleaseNote["sections"] = [];
  let sectionTitle: string | undefined;
  let items: string[] = [];

  const closeSection = () => {
    if (sectionTitle && items.length) sections.push({ title: sectionTitle, items });
    sectionTitle = undefined;
    items = [];
  };
  const closeVersion = () => {
    closeSection();
    if (version && sections.length) notes.push({ version, sections });
    version = undefined;
    sections = [];
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      closeVersion();
      const title = line.slice(3).trim();
      version = title.startsWith("Version ") ? title.slice(8) : title;
    } else if (line.startsWith("### ")) {
      closeSection();
      sectionTitle = line.slice(4).trim();
    } else if (line.startsWith("- ") || line === "-") {
      const item = line.slice(1).trim();
      if (item && sectionTitle) items.push(item);
    } else if (line === "---") {
      closeVersion();
    } else if (line && sectionTitle && items.length) {
      items[items.length - 1] += " " + line;
    }
  }
  closeVersion();
  return notes;
}

// Only released versions: the top block may already describe the next version
export function getReleaseNotes(): ReleaseNote[] {
  const text = readFileSync(path.join(process.cwd(), "content", "release-notes.md"), "utf8");
  const latest = Object.keys(dates).sort(compareVersions).at(-1) ?? "0";
  return parseReleaseNotes(text)
    .filter((note) => compareVersions(note.version, latest) <= 0)
    .map((note) => ({ ...note, date: dates[note.version] }));
}
