import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Complete guide to Rapto for macOS: operating modes (Auto Tiling, Manual, Drag to Snap, None), Desktops Bar, Workspaces, keyboard shortcuts, custom layouts, and troubleshooting.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
