import type { Metadata, Viewport } from "next";
import { DM_Sans, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Display font - distinctive, geometric, memorable
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Body font - clean, readable, modern
const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#08090d",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rapto.app"),
  title: {
    default: "Rapto — Free & Open-Source Window Manager for macOS",
    template: "%s — Rapto",
  },
  description:
    "A free, open-source native macOS tiling window manager. Auto tiling, custom layouts, Desktops Bar, window groups, workspaces, and Vim-ready shortcuts per display and Space.",
  keywords: [
    "macOS",
    "window manager",
    "tiling window manager",
    "open source",
    "macOS Tahoe",
    "productivity",
    "window snapping",
    "Desktops Bar",
    "Rapto",
  ],
  authors: [{ name: "Levan Karamanishvili" }],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Rapto — Free & Open-Source Window Manager for macOS",
    description:
      "Auto tiling, custom layouts, Desktops Bar, window groups, and one-click workspaces for macOS 26 Tahoe+.",
    type: "website",
    url: "https://rapto.app",
    siteName: "Rapto",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Rapto arranging macOS windows into a layout",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rapto — Free & Open-Source Window Manager for macOS",
    description:
      "Auto tiling, custom layouts, Desktops Bar, window groups, and one-click workspaces for macOS 26 Tahoe+.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Umami Analytics - privacy-friendly, no cookies. Proxied through /s (app/s) so blockers don't drop it */}
        <Script
          defer
          src="/s/v.js"
          data-host-url="/s"
          data-website-id="c968e5a0-15f4-4e66-bf81-8b8af46c7c89"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${bricolage.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
