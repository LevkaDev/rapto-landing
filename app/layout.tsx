import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://rapto.app"),
  title: "Rapto — Window Manager for macOS",
  description: "A free, native macOS tiling window manager. Organize your windows with customizable layouts, keyboard shortcuts, and seamless multi-monitor support.",
  keywords: ["macOS", "window manager", "tiling", "productivity", "window snapping", "Rapto"],
  authors: [{ name: "Levan Karamanishvili" }],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Rapto — Window Manager for macOS",
    description: "A free, native macOS tiling window manager with customizable layouts and keyboard shortcuts.",
    type: "website",
    url: "https://rapto.app",
    siteName: "Rapto",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Rapto arranging macOS windows into a layout" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rapto — Window Manager for macOS",
    description: "A free, native macOS tiling window manager with customizable layouts and keyboard shortcuts.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
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
