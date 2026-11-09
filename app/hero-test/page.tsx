import Image from "next/image";
import { HeroAnimation } from "../HeroAnimation";

const ACCENT = "#BFFF00";

export const metadata = { title: "Rapto — Hero test (Clayzo)", robots: { index: false } };

export default function HeroTest() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 atmosphere" />
      <div className="absolute inset-0 blueprint-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <Image src="/app-icon.png" alt="Rapto" width={80} height={80} className="relative drop-shadow-2xl" />
            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight gradient-text">Rapto</h1>
          </div>
          <p className="text-xl md:text-2xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
            Stop wrestling with windows. Organize your workspace with{" "}
            <span style={{ color: ACCENT }}>customizable layouts</span>,{" "}
            <span style={{ color: "#00FFE5" }}>keyboard shortcuts</span>, and{" "}
            <span style={{ color: "#A855F7" }}>intelligent tiling</span>.
          </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-2xl">
          <HeroAnimation />
        </div>
      </div>
    </section>
  );
}
