"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useInView,
} from "framer-motion";
import {
  Grid3X3,
  LayoutGrid,
  Monitor,
  Layers,
  Focus,
  MousePointerClick,
  Keyboard,
  Download,
  Command,
  Zap,
  PinOff,
  LayoutDashboard,
  ArrowRight,
  ArrowLeftRight,
  Grip,
  ChevronDown,
  ChevronUp,
  Check,
  Square,
  Terminal,
  Cpu,
  Maximize2,
  Undo2,
  MoveHorizontal,
  Palette,
  ShieldCheck,
  Mail,
  Menu,
  X,
  Ban,
} from "lucide-react";

// ============================================
// UTILITIES & CONSTANTS
// ============================================

const ACCENT = "#BFFF00";
const stagger = (index: number, base: number = 0.08) => index * base;

// ============================================
// NAVIGATION
// ============================================
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#faq", label: "FAQ" },
    { href: "#download", label: "Download" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--card-border)]"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <Image src="/app-icon.png" alt="Rapto" width={36} height={36} />
          <span className="font-display font-bold text-xl">Rapto</span>
        </motion.a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors text-sm font-medium"
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="#download"
            className="btn-primary !py-2 !px-4 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Try Free
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[var(--foreground-muted)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--card-border)]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ============================================
// SCROLL PROGRESS
// ============================================
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

// ============================================
// CURSOR GLOW
// ============================================
function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="cursor-glow hidden lg:block"
      animate={{
        x: position.x,
        y: position.y,
        opacity: isVisible ? 0.15 : 0,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    />
  );
}

// ============================================
// MEASUREMENT LINE (Decorative)
// ============================================
function MeasurementLine({ width = 100, label }: { width?: number; label?: string }) {
  return (
    <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
      <div className="h-2 w-px bg-current" />
      <div className="h-px bg-current" style={{ width }} />
      <div className="h-2 w-px bg-current" />
      {label && <span className="text-xs font-mono ml-2">{label}</span>}
    </div>
  );
}

// ============================================
// ANIMATED COUNTER
// ============================================
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      className="font-display text-5xl md:text-6xl font-bold"
      style={{ color: ACCENT }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {value}{suffix}
    </motion.span>
  );
}

// ============================================
// WINDOW CONTENT COMPONENTS
// ============================================

// Browser window content
function BrowserContent({ color }: { color: string }) {
  return (
    <div className="flex flex-col h-full">
      {/* URL bar */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-black/20 mx-2 mt-1 rounded-md">
        <div className="w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-[6px]">🔒</span>
        </div>
        <div className="flex-1 h-3 bg-white/10 rounded text-[7px] text-white/40 flex items-center px-1.5">
          rapto.app/features
        </div>
      </div>
      {/* Page content */}
      <div className="flex-1 p-2 space-y-2">
        <div className="h-4 bg-white/8 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-white/6 rounded" />
          <div className="flex-1 space-y-1">
            <div className="h-2 bg-white/10 rounded w-full" />
            <div className="h-2 bg-white/6 rounded w-4/5" />
            <div className="h-2 bg-white/6 rounded w-3/5" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-white/6 rounded w-full" />
          <div className="h-2 bg-white/6 rounded w-11/12" />
          <div className="h-2 bg-white/6 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}

// Code editor content
function CodeContent({ color }: { color: string }) {
  const lines = [
    { indent: 0, width: "60%", keyword: true },
    { indent: 1, width: "75%", keyword: false },
    { indent: 1, width: "50%", keyword: false },
    { indent: 2, width: "85%", keyword: false },
    { indent: 2, width: "40%", keyword: false },
    { indent: 1, width: "30%", keyword: true },
    { indent: 0, width: "20%", keyword: true },
    { indent: 0, width: "0%", keyword: false },
    { indent: 0, width: "55%", keyword: true },
    { indent: 1, width: "70%", keyword: false },
  ];
  
  return (
    <div className="flex h-full text-[7px] font-mono">
      {/* Line numbers */}
      <div className="w-5 bg-black/20 flex flex-col items-end pr-1 py-1 text-white/20">
        {lines.map((_, i) => (
          <div key={i} className="leading-[10px]">{i + 1}</div>
        ))}
      </div>
      {/* Code */}
      <div className="flex-1 p-1 space-y-[2px]">
        {lines.map((line, i) => (
          <div 
          key={i}
            className="h-[8px] rounded-sm flex items-center"
            style={{ paddingLeft: line.indent * 8 }}
          >
            {line.width !== "0%" && (
              <div 
                className="h-[6px] rounded-sm"
                style={{ 
                  width: line.width, 
                  background: line.keyword ? `${color}40` : 'rgba(255,255,255,0.12)'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Terminal content
function TerminalContent({ color }: { color: string }) {
  return (
    <div className="p-2 font-mono text-[7px] space-y-1">
      <div className="flex gap-1">
        <span style={{ color }}>❯</span>
        <span className="text-white/70">npm run build</span>
      </div>
      <div className="text-white/40 pl-2">✓ Compiled successfully</div>
      <div className="text-white/40 pl-2">✓ 42 modules transformed</div>
      <div className="flex gap-1">
        <span style={{ color }}>❯</span>
        <span className="text-white/70">rapto --version</span>
      </div>
      <div className="text-white/50 pl-2">v2.1.0</div>
      <div className="flex gap-1 items-center">
        <span style={{ color }}>❯</span>
        <div className="w-1 h-2.5 bg-white/60 animate-pulse" />
      </div>
    </div>
  );
}

// Notes content
function NotesContent({ color }: { color: string }) {
  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded" style={{ background: color }} />
        <div className="h-2.5 bg-white/15 rounded w-20 text-[7px] text-white/60 flex items-center px-1">
          Project Ideas
        </div>
      </div>
      <div className="space-y-1 pl-3">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-sm border border-white/30" />
          <div className="h-2 bg-white/8 rounded w-16" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-sm bg-white/30" />
          <div className="h-2 bg-white/6 rounded w-20 line-through opacity-50" />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-sm border border-white/30" />
          <div className="h-2 bg-white/8 rounded w-14" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// INTERACTIVE WINDOW DEMO
// ============================================
function InteractiveWindowDemo() {
  // Larger container: 580x420
  const [windows, setWindows] = useState([
    { id: 1, x: 25, y: 25, w: 260, h: 175, color: ACCENT, title: "Browser", icon: "🌐", content: "browser" },
    { id: 2, x: 300, y: 20, w: 250, h: 220, color: "#00FFE5", title: "Code", icon: "💻", content: "code" },
    { id: 3, x: 30, y: 215, w: 255, h: 175, color: "#A855F7", title: "Terminal", icon: "⌨️", content: "terminal" },
    { id: 4, x: 310, y: 260, w: 240, h: 130, color: "#FFB800", title: "Notes", icon: "📝", content: "notes" },
  ]);
  const [activeWindow, setActiveWindow] = useState<number | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);

  const snapToGrid = () => {
    setIsSnapping(true);
    setIsSnapped(true);
    setWindows([
      { id: 1, x: 8, y: 8, w: 278, h: 193, color: ACCENT, title: "Browser", icon: "🌐", content: "browser" },
      { id: 2, x: 294, y: 8, w: 278, h: 193, color: "#00FFE5", title: "Code", icon: "💻", content: "code" },
      { id: 3, x: 8, y: 209, w: 278, h: 180, color: "#A855F7", title: "Terminal", icon: "⌨️", content: "terminal" },
      { id: 4, x: 294, y: 209, w: 278, h: 180, color: "#FFB800", title: "Notes", icon: "📝", content: "notes" },
    ]);
    setTimeout(() => setIsSnapping(false), 600);
  };

  const scatterWindows = () => {
    setIsSnapped(false);
    setWindows([
      { id: 1, x: 40, y: 50, w: 260, h: 170, color: ACCENT, title: "Browser", icon: "🌐", content: "browser" },
      { id: 2, x: 260, y: 15, w: 250, h: 230, color: "#00FFE5", title: "Code", icon: "💻", content: "code" },
      { id: 3, x: 60, y: 230, w: 255, h: 165, color: "#A855F7", title: "Terminal", icon: "⌨️", content: "terminal" },
      { id: 4, x: 330, y: 270, w: 230, h: 120, color: "#FFB800", title: "Notes", icon: "📝", content: "notes" },
    ]);
  };

  const renderContent = (content: string, color: string) => {
    switch (content) {
      case "browser": return <BrowserContent color={color} />;
      case "code": return <CodeContent color={color} />;
      case "terminal": return <TerminalContent color={color} />;
      case "notes": return <NotesContent color={color} />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Glow behind demo */}
      <div 
        className="absolute -inset-16 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT}40 0%, transparent 70%)` }}
      />
      
      {/* Corner brackets */}
      <div className="absolute -inset-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: ACCENT }} />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: ACCENT }} />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: ACCENT }} />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: ACCENT }} />
      </div>

      <div
        className="relative w-[580px] h-[400px] rounded-2xl overflow-hidden demo-window"
        style={{
          background: "linear-gradient(180deg, #111114 0%, #0a0a0c 100%)",
        }}
      >
        {/* Menu bar */}
        <div className="demo-window-bar h-7">
          <div className="demo-window-dot red" />
          <div className="demo-window-dot yellow" />
          <div className="demo-window-dot green" />
          <span className="text-[11px] text-[var(--foreground-muted)] ml-4 font-mono">Desktop 1</span>
        </div>

        {/* Grid overlay when snapping */}
        <AnimatePresence>
          {isSnapping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-20"
            >
              <svg className="w-full h-full">
                <motion.line
                  x1="290" y1="28" x2="290" y2="400"
                  stroke={ACCENT}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.line
                  x1="0" y1="205" x2="580" y2="205"
                  stroke={ACCENT}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Windows */}
        {windows.map((win, index) => (
          <motion.div
            key={win.id}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ zIndex: activeWindow === win.id ? 10 : win.id }}
            initial={false}
            animate={{ x: win.x, y: win.y, width: win.w, height: win.h }}
            transition={{
              type: "spring",
              stiffness: isSnapping ? 400 : 500,
              damping: isSnapping ? 30 : 35,
              delay: isSnapping ? index * 0.05 : 0,
            }}
            onMouseDown={() => setActiveWindow(win.id)}
            whileHover={{ scale: 1.01, zIndex: 20 }}
          >
            <motion.div
              className="w-full h-full rounded-xl overflow-hidden flex flex-col"
              style={{
                background: `linear-gradient(160deg, ${win.color}18 0%, ${win.color}05 100%)`,
                border: `1px solid ${win.color}35`,
                boxShadow: `0 12px 40px ${win.color}15, inset 0 1px 0 ${win.color}20`,
              }}
            >
              {/* Window title bar */}
              <div
                className="h-7 flex items-center gap-2 px-3 shrink-0"
                style={{ background: `${win.color}20` }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/15 hover:bg-red-400/80 transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/15 hover:bg-yellow-400/80 transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/15 hover:bg-green-400/80 transition-colors" />
                </div>
                <span className="text-[11px] text-white/70 ml-1 font-medium">
                  {win.icon} {win.title}
                </span>
              </div>
              {/* Window content */}
              <div className="flex-1 overflow-hidden">
                {renderContent(win.content, win.color)}
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Dock */}
        <motion.div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {["🔍", "📁", "🌐", "💻", "🎵", "⚙️"].map((emoji, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 flex items-center justify-center text-base rounded-xl hover:bg-white/10 cursor-pointer"
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.9 }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 mt-10 justify-center">
        <motion.button
          onClick={scatterWindows}
          className="btn-secondary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Scatter
        </motion.button>
        <motion.button
          onClick={snapToGrid}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Grip className="w-5 h-5" />
          Snap to Grid
          {isSnapped && <Check className="w-5 h-5 ml-1" />}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================
// MINI WINDOW
// ============================================
function MiniWindow({
  color,
  className = "",
  style = {},
}: {
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background: `linear-gradient(145deg, ${color}30 0%, ${color}10 100%)`,
        border: `1px solid ${color}40`,
        boxShadow: `0 4px 20px ${color}10`,
        ...style,
      }}
    >
      <div
        className="h-3 flex items-center gap-0.5 px-1.5 rounded-t-lg"
        style={{ background: `${color}30` }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
    </div>
  );
}

// ============================================
// FEATURE DEMOS
// ============================================

function AutoTilingDemo() {
  const [windowCount, setWindowCount] = useState(1);
  
  // Progressive layouts as windows are added
  const getLayout = (count: number) => {
    switch (count) {
      case 1:
        // 1 window: centered, large but not fullscreen
        return [
          { x: 15, y: 10, w: 70, h: 80, visible: true },
        ];
      case 2:
        // 2 windows: split vertically (halves)
        return [
          { x: 0, y: 0, w: 50, h: 100, visible: true },
          { x: 50, y: 0, w: 50, h: 100, visible: true },
        ];
      case 3:
        // 3 windows: one large left, two stacked on right
        return [
          { x: 0, y: 0, w: 60, h: 100, visible: true },
          { x: 60, y: 0, w: 40, h: 50, visible: true },
          { x: 60, y: 50, w: 40, h: 50, visible: true },
        ];
      case 4:
        // 4 windows: quarters
        return [
          { x: 0, y: 0, w: 50, h: 50, visible: true },
          { x: 50, y: 0, w: 50, h: 50, visible: true },
          { x: 0, y: 50, w: 50, h: 50, visible: true },
          { x: 50, y: 50, w: 50, h: 50, visible: true },
        ];
      case 5:
        // 5 windows: center large + 2 stacked on each side
        return [
          { x: 0, y: 0, w: 20, h: 50, visible: true },
          { x: 0, y: 50, w: 20, h: 50, visible: true },
          { x: 20, y: 0, w: 60, h: 100, visible: true },
          { x: 80, y: 0, w: 20, h: 50, visible: true },
          { x: 80, y: 50, w: 20, h: 50, visible: true },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    const sequence = async () => {
      // Reset to 1 window
      setWindowCount(1);
      await new Promise(r => setTimeout(r, 2000));
      
      // Add windows one by one
      for (let i = 2; i <= 5; i++) {
        setWindowCount(i);
        await new Promise(r => setTimeout(r, 2000));
      }
      
      // Hold final state
      await new Promise(r => setTimeout(r, 2500));
    };

    sequence();
    const interval = setInterval(sequence, 12500);
    return () => clearInterval(interval);
  }, []);

  const colors = [ACCENT, "#00FFE5", "#A855F7", "#FFB800", "#FF6B6B"];
  const layout = getLayout(windowCount);

  return (
    <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden bg-[var(--card-solid)] border border-[var(--card-border)]">
      <div className="absolute inset-0 dot-grid opacity-50" />
      
      {/* Render windows */}
      <AnimatePresence>
        {layout.map((win, i) => (
        <motion.div
          key={i}
            className="absolute"
            style={{ padding: "3px", zIndex: i === 2 && windowCount === 5 ? 10 : i }}
            initial={{ opacity: 0, scale: 0.8 }}
          animate={{
              opacity: 1,
              scale: 1,
            left: `${win.x}%`,
            top: `${win.y}%`,
            width: `${win.w}%`,
            height: `${win.h}%`,
          }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: i === windowCount - 1 ? 0.1 : 0 }}
        >
          <MiniWindow color={colors[i]} className="w-full h-full" />
        </motion.div>
      ))}
      </AnimatePresence>
      
      {/* Window count indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[1, 2, 3, 4, 5].map((count) => (
          <motion.div
            key={count}
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: windowCount >= count ? colors[count - 1] : "rgba(255,255,255,0.15)",
              scale: windowCount === count ? 1.4 : 1,
            }}
          />
        ))}
      </div>
      
      {/* Window count label */}
      <motion.div 
        className="absolute top-3 right-3 z-20 px-2 py-1 rounded-md text-xs font-mono"
        style={{ background: "rgba(0,0,0,0.6)", color: ACCENT }}
        key={windowCount}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {windowCount} {windowCount === 1 ? "window" : "windows"}
      </motion.div>
    </div>
  );
}

function KeyboardDemo() {
  const [position, setPosition] = useState<"left" | "right" | "full">("left");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const sequence = ["left", "right", "full"] as const;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % sequence.length;
      setPosition(sequence[idx]);
      setActiveKey(sequence[idx] === "left" ? "←" : sequence[idx] === "right" ? "→" : "M");
      setTimeout(() => setActiveKey(null), 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getWindowStyle = () => {
    switch (position) {
      case "left": return { left: "2%", width: "46%" };
      case "right": return { left: "52%", width: "46%" };
      case "full": return { left: "2%", width: "96%" };
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-20 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <motion.div
          className="absolute top-2 h-[calc(100%-16px)]"
          animate={getWindowStyle()}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <MiniWindow color={ACCENT} className="w-full h-full" />
        </motion.div>
      </div>

      <div className="flex justify-center gap-1.5">
        {[
          { key: "⌃", label: "ctrl" },
          { key: "⌥", label: "opt" },
          { key: "←", label: "left" },
          { key: "→", label: "right" },
          { key: "M", label: "max" },
        ].map(({ key }) => (
          <motion.div
            key={key}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium"
            style={{
              background: activeKey === key ? ACCENT : "rgba(255,255,255,0.05)",
              color: activeKey === key ? "#0a0a0c" : "rgba(255,255,255,0.5)",
              boxShadow: activeKey === key
                ? `0 0 20px ${ACCENT}60`
                : "0 2px 0 rgba(0,0,0,0.3)",
            }}
            animate={{
              y: activeKey === key ? 2 : 0,
              scale: activeKey === key ? 0.95 : 1,
            }}
          >
            {key}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MultiMonitorDemo() {
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveScreen((s) => (s + 1) % 3), 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2 justify-center items-end py-2">
      {[0, 1, 2].map((screen) => (
        <motion.div
          key={screen}
          className="relative rounded-lg overflow-hidden border-2"
          style={{
            width: screen === 1 ? 56 : 44,
            height: screen === 1 ? 40 : 32,
            background: "var(--card-solid)",
            borderColor: activeScreen === screen ? ACCENT : "var(--card-border)",
            boxShadow: activeScreen === screen ? `0 0 20px ${ACCENT}40` : "none",
          }}
        >
          <AnimatePresence mode="wait">
            {activeScreen === screen && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-1"
              >
                <MiniWindow color={ACCENT} className="w-full h-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function WindowGroupsDemo() {
  const [active, setActive] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      setShowIndicator(true);
      await new Promise((r) => setTimeout(r, 600));
      setActive(1);
      await new Promise((r) => setTimeout(r, 900));
      setActive(2);
      await new Promise((r) => setTimeout(r, 900));
      setActive(0);
      await new Promise((r) => setTimeout(r, 900));
      setShowIndicator(false);
      await new Promise((r) => setTimeout(r, 1200));
    };

    sequence();
    const interval = setInterval(sequence, 5200);
    return () => clearInterval(interval);
  }, []);

  const windows = [
    { color: ACCENT, icon: "🌐" },
    { color: "#00FFE5", icon: "💻" },
    { color: "#A855F7", icon: "📁" },
  ];

  return (
    <div className="relative h-24">
      <div className="absolute left-4 top-3 w-28 h-20">
        {windows.map((win, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{
              opacity: i === active ? 1 : 0,
              scale: i === active ? 1 : 0.92,
              y: i === active ? 0 : 5,
            }}
          >
            <MiniWindow color={win.color} className="w-full h-full" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="absolute right-3 top-2 flex gap-1 px-2 py-1.5 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)]"
          >
            {windows.map((win, i) => (
              <motion.div
                key={i}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs cursor-pointer"
                style={{
                  background: i === active ? `${win.color}40` : "transparent",
                  border: i === active ? `1px solid ${win.color}` : "1px solid transparent",
                }}
                animate={{ scale: i === active ? 1.15 : 1 }}
              >
                {win.icon}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SwapDemo() {
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setSwapped((s) => !s), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-20 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden">
      <motion.div
        className="absolute"
        style={{ width: "44%", height: "calc(100% - 12px)", top: 6 }}
        animate={{ left: swapped ? "52%" : "2%" }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        <MiniWindow color={ACCENT} className="w-full h-full" />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ width: "44%", height: "calc(100% - 12px)", top: 6 }}
        animate={{ left: swapped ? "2%" : "52%" }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        <MiniWindow color="#00FFE5" className="w-full h-full" />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[var(--accent-subtle)]"
        animate={{
          scale: swapped ? [1, 1.3, 1] : 1,
          rotate: swapped ? 180 : 0,
        }}
      >
        <ArrowLeftRight className="w-4 h-4" style={{ color: ACCENT }} />
      </motion.div>
    </div>
  );
}

// Focus Window Demo - expands window to full screen
function FocusWindowDemo() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      setExpanded(true);
      await new Promise((r) => setTimeout(r, 2000));
      setExpanded(false);
      await new Promise((r) => setTimeout(r, 1500));
    };

    sequence();
    const interval = setInterval(sequence, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden">
      {/* Background windows (dimmed when focus active) */}
      <motion.div
        className="absolute"
        style={{ width: "40%", height: "55%", top: 6, left: "2%" }}
        animate={{ opacity: expanded ? 0.15 : 1 }}
      >
        <MiniWindow color="#00FFE5" className="w-full h-full" />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ width: "30%", height: "40%", bottom: 6, left: "2%" }}
        animate={{ opacity: expanded ? 0.15 : 1 }}
      >
        <MiniWindow color="#A855F7" className="w-full h-full" />
      </motion.div>

      {/* Focus window - expands to full */}
      <motion.div
        className="absolute z-10"
        animate={{
          width: expanded ? "96%" : "52%",
          height: expanded ? "calc(100% - 12px)" : "calc(100% - 12px)",
          left: expanded ? "2%" : "44%",
          top: 6,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <MiniWindow color={ACCENT} className="w-full h-full" />
        {/* Focus glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-lg"
          style={{ border: `2px solid ${ACCENT}` }}
          animate={{
            opacity: expanded ? [0.8, 0.4, 0.8] : 0,
            boxShadow: expanded ? `0 0 20px ${ACCENT}60` : "none",
          }}
          transition={{ duration: 1, repeat: expanded ? Infinity : 0 }}
        />
      </motion.div>

      {/* Focus indicator */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-2 right-2 z-20 px-2 py-1 rounded-md text-xs font-mono"
            style={{ background: `${ACCENT}30`, color: ACCENT }}
          >
            FOCUS
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Drag to Snap Demo - shows dragging window to edge
function DragSnapDemo() {
  const [phase, setPhase] = useState<"idle" | "dragging" | "snapped">("idle");

  useEffect(() => {
    const sequence = async () => {
      setPhase("idle");
      await new Promise((r) => setTimeout(r, 800));
      setPhase("dragging");
      await new Promise((r) => setTimeout(r, 1200));
      setPhase("snapped");
      await new Promise((r) => setTimeout(r, 2000));
    };

    sequence();
    const interval = setInterval(sequence, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden">
      {/* Snap zone preview */}
      <AnimatePresence>
        {phase === "dragging" && (
      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1 top-1 bottom-1 w-[48%] rounded-lg"
            style={{ 
              background: `${ACCENT}15`, 
              border: `2px dashed ${ACCENT}60` 
            }}
          />
        )}
      </AnimatePresence>

      {/* Dragged window */}
      <motion.div
        className="absolute z-10"
        style={{ 
          width: phase === "snapped" ? "48%" : "40%", 
          height: phase === "snapped" ? "calc(100% - 8px)" : "60%",
        }}
        animate={{
          left: phase === "idle" ? "45%" : phase === "dragging" ? "15%" : "1%",
          top: phase === "snapped" ? 4 : 20,
          width: phase === "snapped" ? "48%" : "40%",
          height: phase === "snapped" ? "calc(100% - 8px)" : "60%",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        <MiniWindow color={ACCENT} className="w-full h-full" />
      </motion.div>

      {/* Cursor */}
      <AnimatePresence>
        {phase === "dragging" && (
      <motion.div
            initial={{ opacity: 0 }}
        animate={{
              opacity: 1,
              x: [0, -30, -60],
        }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute z-20"
            style={{ left: "60%", top: "35%" }}
      >
            <MousePointerClick className="w-4 h-4" style={{ color: ACCENT }} />
      </motion.div>
        )}
      </AnimatePresence>

      {/* Edge indicator */}
      <motion.div
        className="absolute left-0 top-1 bottom-1 w-1 rounded-r-sm"
        style={{ background: ACCENT }}
        animate={{
          opacity: phase === "dragging" ? [0.5, 1, 0.5] : phase === "snapped" ? 1 : 0.2,
        }}
        transition={{ duration: 0.5, repeat: phase === "dragging" ? Infinity : 0 }}
      />
    </div>
  );
}

// Snap Back Demo - shows window returning to its slot
function SnapBackDemo() {
  const [phase, setPhase] = useState<"placed" | "dragged" | "snapping">("placed");

  useEffect(() => {
    const sequence = async () => {
      setPhase("placed");
      await new Promise((r) => setTimeout(r, 1000));
      setPhase("dragged");
      await new Promise((r) => setTimeout(r, 1200));
      setPhase("snapping");
      await new Promise((r) => setTimeout(r, 1500));
    };

    sequence();
    const interval = setInterval(sequence, 3700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden">
      {/* Slot outline (always visible) */}
      <div
        className="absolute left-1 top-1 bottom-1 w-[48%] rounded-lg"
        style={{ 
          border: `1px dashed var(--card-border)`,
        }}
      />

      {/* Static window */}
      <div
        className="absolute"
        style={{ width: "48%", height: "calc(100% - 8px)", right: "1%", top: 4 }}
      >
        <MiniWindow color="#00FFE5" className="w-full h-full" />
      </div>

      {/* Window that snaps back */}
      <motion.div
        className="absolute z-10"
        animate={{
          left: phase === "placed" || phase === "snapping" ? "1%" : "30%",
          top: phase === "dragged" ? 25 : 4,
          rotate: phase === "dragged" ? 8 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: phase === "snapping" ? 400 : 200, 
          damping: phase === "snapping" ? 20 : 25 
        }}
        style={{ width: "48%", height: "calc(100% - 8px)" }}
      >
        <MiniWindow color={ACCENT} className="w-full h-full" />
      </motion.div>

      {/* Snap back animation */}
      <AnimatePresence>
        {phase === "snapping" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0.8, 0], scale: [1, 1.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute left-[24%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full"
            style={{ background: `${ACCENT}40`, border: `2px solid ${ACCENT}` }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Resize Adjacent Demo - shows resizing affecting neighbors
function ResizeAdjacentDemo() {
  const [resized, setResized] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setResized((r) => !r), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden flex p-1 gap-1">
      {/* Left window - resizes larger */}
          <motion.div
        className="relative rounded-lg overflow-hidden"
        animate={{ flex: resized ? 2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <MiniWindow color={ACCENT} className="w-full h-full" />
        {/* Resize handle indicator */}
        <motion.div
          className="absolute right-0 top-2 bottom-2 w-1.5 rounded-full cursor-ew-resize"
          style={{ background: `${ACCENT}80` }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            x: resized ? [0, 2, 0] : 0,
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
          </motion.div>

      {/* Right window - shrinks */}
            <motion.div
        className="relative rounded-lg overflow-hidden"
        animate={{ flex: resized ? 0.5 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <MiniWindow color="#00FFE5" className="w-full h-full" />
            </motion.div>
    </div>
  );
}

// Template Hotkeys Demo - shows switching templates with keyboard
function TemplateHotkeysDemo() {
  const [active, setActive] = useState(0);
  const templates = [
    { name: "Halves", layout: [1, 1] },
    { name: "Thirds", layout: [1, 1, 1] },
    { name: "Main+Side", layout: [2, 1] },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((a) => (a + 1) % templates.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-20">
      {/* Layout preview */}
      <div className="absolute left-2 top-2 bottom-2 right-[90px] rounded-lg bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden flex p-1 gap-0.5">
        <AnimatePresence mode="wait">
          {templates[active].layout.map((flex, i) => (
          <motion.div
              key={`${active}-${i}`}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              className="rounded-sm"
            style={{
                flex, 
                background: i === 0 ? `${ACCENT}60` : i === 1 ? "#00FFE540" : "#A855F740",
                border: `1px solid ${i === 0 ? ACCENT : i === 1 ? "#00FFE5" : "#A855F7"}50`
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Hotkey indicators */}
      <div className="absolute right-2 top-2 bottom-2 flex flex-col justify-center gap-1">
        {["⌘1", "⌘2", "⌘3"].map((key, i) => (
            <motion.div
            key={i}
            className="px-2 py-0.5 rounded text-xs font-mono"
            animate={{
              background: active === i ? `${ACCENT}40` : "var(--card-solid)",
              color: active === i ? ACCENT : "var(--foreground-muted)",
              scale: active === i ? 1.1 : 1,
            }}
          >
            {key}
            </motion.div>
          ))}
      </div>
    </div>
  );
}

// Custom Templates Demo - shows visual zone editor
function CustomTemplatesDemo() {
  const [zones, setZones] = useState([
    { x: 0, y: 0, w: 50, h: 100 },
    { x: 50, y: 0, w: 50, h: 50 },
    { x: 50, y: 50, w: 50, h: 50 },
  ]);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const layouts = [
      [{ x: 0, y: 0, w: 50, h: 100 }, { x: 50, y: 0, w: 50, h: 50 }, { x: 50, y: 50, w: 50, h: 50 }],
      [{ x: 0, y: 0, w: 60, h: 100 }, { x: 60, y: 0, w: 40, h: 100 }],
      [{ x: 0, y: 0, w: 33, h: 100 }, { x: 33, y: 0, w: 34, h: 100 }, { x: 67, y: 0, w: 33, h: 100 }],
    ];

    const interval = setInterval(() => {
      setPhase((p) => {
        const next = (p + 1) % layouts.length;
        setZones(layouts[next]);
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const colors = [ACCENT, "#00FFE5", "#A855F7"];

  return (
    <div className="relative h-20 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden p-2">
      {/* Grid background */}
      <div className="absolute inset-2 grid grid-cols-6 grid-rows-4 gap-px opacity-20">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="border border-[var(--card-border)]" />
        ))}
      </div>

      {/* Zones */}
      <div className="relative w-full h-full">
        {zones.map((zone, i) => (
      <motion.div
            key={i}
            className="absolute rounded-md"
            initial={false}
            animate={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.w}%`,
              height: `${zone.h}%`,
            }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
              background: `${colors[i % colors.length]}30`,
              border: `2px solid ${colors[i % colors.length]}`,
            }}
          />
        ))}
        </div>

      {/* Plus indicator */}
      <motion.div
        className="absolute bottom-1 right-1 w-5 h-5 rounded-md flex items-center justify-center text-xs"
        style={{ background: `${ACCENT}30`, color: ACCENT }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        +
      </motion.div>
    </div>
  );
}

// Floating Windows Demo - shows window being excluded from tiling
function FloatingWindowsDemo() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      setIsFloating(false);
      await new Promise((r) => setTimeout(r, 1500));
      setIsFloating(true);
      await new Promise((r) => setTimeout(r, 2500));
    };

    sequence();
    const interval = setInterval(sequence, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-20 rounded-xl bg-[var(--card-solid)] border border-[var(--card-border)] overflow-hidden">
      {/* Tiled windows grid */}
      <div className="absolute inset-1 flex gap-1">
        <div className="flex-1 rounded-md" style={{ background: "#00FFE530", border: "1px solid #00FFE560" }} />
        <div className="flex-1 rounded-md" style={{ background: "#A855F730", border: "1px solid #A855F760" }} />
      </div>

      {/* Floating window */}
        <motion.div
        className="absolute z-10"
            animate={{
          left: isFloating ? "20%" : "2%",
          top: isFloating ? "10%" : "4px",
          width: isFloating ? "55%" : "48%",
          height: isFloating ? "70%" : "calc(100% - 8px)",
          rotate: isFloating ? -3 : 0,
          boxShadow: isFloating ? "0 10px 40px rgba(0,0,0,0.5)" : "none",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        <MiniWindow color={ACCENT} className="w-full h-full" />
        </motion.div>

      {/* Float indicator */}
      <AnimatePresence>
        {isFloating && (
      <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            className="absolute bottom-1 right-1 z-20 px-2 py-0.5 rounded-md text-xs font-mono flex items-center gap-1"
            style={{ background: `${ACCENT}30`, color: ACCENT }}
          >
            <PinOff className="w-3 h-3" />
            Float
      </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// FEATURE CARD
// ============================================
function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
  index = 0,
  large = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
  index?: number;
  large?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
      <motion.div
        ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`card spotlight p-6 flex flex-col ${large ? 'md:col-span-2 md:row-span-2' : ''}`}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
          e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
        }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="feature-icon">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
        </div>
      </div>
      {children && <div className={`mt-4 ${large ? 'flex-1' : ''}`}>{children}</div>}
    </motion.div>
  );
}

// ============================================
// HERO SECTION
// ============================================
function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 atmosphere" />
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      
      {/* Accent glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${ACCENT} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div className="relative z-10 max-w-7xl mx-auto px-6 py-20" style={{ opacity, y }}>
        {/* Top tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="tag">
            <Terminal className="w-4 h-4" />
            Ultimate Window Management for macOS
          </div>
            </motion.div>

        {/* Main heading - asymmetric layout */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center justify-center gap-6 mb-6"
          >
            {/* Icon with glow */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                className="absolute -inset-4 rounded-3xl blur-xl"
                style={{ background: ACCENT }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <Image
                  src="/app-icon.png"
                  alt="Rapto"
                  width={80}
                  height={80}
                  className="relative drop-shadow-2xl"
                />
              </motion.div>

            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight gradient-text">
              Rapto
                </h1>
          </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed"
          >
            Stop wrestling with windows. Organize your workspace with{" "}
            <span style={{ color: ACCENT }}>customizable layouts</span>,{" "}
            <span style={{ color: "#00FFE5" }}>keyboard shortcuts</span>, and{" "}
            <span style={{ color: "#A855F7" }}>intelligent tiling</span>.
            </motion.p>
        </div>

        {/* Interactive Demo - Center stage */}
        <div className="flex justify-center mb-16">
          <InteractiveWindowDemo />
        </div>

        {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center mb-20"
            >
              <motion.a
                href="#download"
            className="btn-primary text-lg"
            whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
            <Download className="w-5 h-5" />
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
              </motion.a>

              <motion.a
                href="#features"
            className="btn-secondary text-lg"
            whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
            Explore Features
              </motion.a>
            </motion.div>

        {/* Stats with measurement aesthetic */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-8 md:gap-16 px-8 py-6 rounded-2xl bg-[var(--card)] border border-[var(--card-border)]">
            {[
              { value: "3", label: "Powerful Modes" },
              { value: "∞", label: "Custom Templates" },
              { value: "100%", label: "Keyboard Driven" },
              ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold" style={{ color: ACCENT }}>
                    {stat.value}
                  </div>
                <div className="text-sm text-[var(--foreground-muted)] mt-1">{stat.label}</div>
              </div>
              ))}
          </div>
          </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="text-xs text-[var(--foreground-muted)] font-mono">scroll</span>
          <ChevronDown className="w-5 h-5 text-[var(--foreground-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// OPERATING MODES SECTION
// ============================================
function OperatingModes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeMode, setActiveMode] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  const modes = [
    {
      id: "auto",
      title: "Auto Tiling",
      subtitle: "Automatic window arrangement",
      description: "Windows automatically arrange into your chosen layout as they open. Set maximum tiling depth (2-8 windows) per screen.",
      color: ACCENT,
      features: ["Configurable max depth", "Smart window insertion", "Automatic reflow on close"],
    },
    {
      id: "manual",
      title: "Manual Mode",
      subtitle: "Full control with smart assistance",
      description: "Assign windows to zones manually via overlay. Auto window grouping stacks multiple windows in the same slot.",
      color: "#00FFE5",
      features: ["Visual zone picker", "Auto window groups", "One-click layout apply"],
    },
    {
      id: "drag",
      title: "Drag to Snap",
      subtitle: "Intuitive drag and drop",
      description: "Drag windows to screen edges or zones. Preview appears before you release. Works alongside other modes.",
      color: "#A855F7",
      features: ["Edge snapping", "Zone preview on drag", "Modifier key zones"],
    },
  ];

  // Auto-cycle through modes (stop if user interacted)
  useEffect(() => {
    if (userInteracted) return;
    const interval = setInterval(() => {
      setActiveMode((m) => (m + 1) % modes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [userInteracted]);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-subtle)] to-transparent opacity-50" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-block mb-4"
          >
            <MeasurementLine width={60} label="01" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold mb-6"
          >
            Three powerful <span style={{ color: ACCENT }}>modes</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Choose independently for each monitor and each Space
          </motion.p>
        </motion.div>

        {/* Mode selector tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2 mb-12"
        >
          {modes.map((mode, i) => (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(i);
                setUserInteracted(true);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeMode === i
                  ? "text-[var(--background)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--card-border)]"
              }`}
              style={{
                backgroundColor: activeMode === i ? mode.color : undefined,
              }}
            >
              {mode.title}
            </button>
          ))}
        </motion.div>

        {/* Mode content */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Mode description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
              <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: modes[activeMode].color }}
                  />
                  <span className="text-sm font-mono text-[var(--foreground-muted)]">
                    {modes[activeMode].subtitle}
                  </span>
                </div>
                
                <h3
                  className="font-display text-3xl font-bold mb-4"
                  style={{ color: modes[activeMode].color }}
                >
                  {modes[activeMode].title}
                </h3>
                
                <p className="text-[var(--foreground-muted)] text-lg mb-6">
                  {modes[activeMode].description}
                </p>
                
                <ul className="space-y-3">
                  {modes[activeMode].features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <Check
                        className="w-5 h-5"
                        style={{ color: modes[activeMode].color }}
                      />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: Visual demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="card p-6">
              {/* Multi-monitor mockup */}
              <div className="flex gap-4 items-end justify-center">
                {/* Monitor 1 */}
                <div className="relative">
                  <div
                    className="w-40 h-28 rounded-lg border-2 p-2 transition-colors duration-500"
                    style={{ borderColor: modes[activeMode].color }}
                  >
                    <div className="w-full h-full rounded bg-[var(--background)] relative overflow-hidden">
                      <ModePreview mode={modes[activeMode].id} color={modes[activeMode].color} />
                </div>
              </div>
                  <div className="w-8 h-1 bg-[var(--card-border)] mx-auto mt-1 rounded" />
                  <div className="w-16 h-1 bg-[var(--card-border)] mx-auto rounded" />
                  <div className="text-center mt-2 text-xs text-[var(--foreground-muted)]">
                    Main Display
              </div>
                  <div
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded text-[10px] font-mono"
                    style={{ backgroundColor: modes[activeMode].color, color: "#000" }}
                  >
                    {modes[activeMode].id}
            </div>
                </div>

                {/* Monitor 2 */}
                <div className="relative">
                  <div className="w-32 h-24 rounded-lg border-2 border-[var(--card-border)] p-2">
                    <div className="w-full h-full rounded bg-[var(--background)] relative overflow-hidden">
                      <ModePreview mode="manual" color="#00FFE5" small />
                </div>
              </div>
                  <div className="w-6 h-1 bg-[var(--card-border)] mx-auto mt-1 rounded" />
                  <div className="w-12 h-1 bg-[var(--card-border)] mx-auto rounded" />
                  <div className="text-center mt-2 text-xs text-[var(--foreground-muted)]">
                    External
              </div>
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-[#00FFE5] text-black">
                    manual
            </div>
              </div>
            </div>

              {/* Independent badge */}
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-[var(--foreground-muted)]">
                <Monitor className="w-4 h-4" />
                <span>Independent mode per monitor & Space</span>
              </div>
            </div>
          </motion.div>
              </div>
            </div>
    </section>
  );
}

// Mode preview for the monitor mockup
function ModePreview({ mode, color, small = false }: { mode: string; color: string; small?: boolean }) {
  const size = small ? 0.7 : 1;
  
  if (mode === "auto") {
    // Auto tiling - windows arranging
    return (
      <div className="w-full h-full p-1 flex gap-0.5">
        <motion.div
          className="rounded-sm"
          style={{ backgroundColor: color, width: "50%", height: "100%" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="flex flex-col gap-0.5" style={{ width: "50%" }}>
          <motion.div
            className="rounded-sm flex-1"
            style={{ backgroundColor: "#00FFE5" }}
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            className="rounded-sm flex-1"
            style={{ backgroundColor: "#A855F7" }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
              </div>
            </div>
    );
  }
  
  if (mode === "manual") {
    // Manual mode - zones with overlay feel
    return (
      <div className="w-full h-full p-1 grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="rounded-sm border border-dashed"
            style={{ borderColor: color }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
              </div>
    );
  }
  
  // Drag to snap - window being dragged
  return (
    <div className="w-full h-full p-1 relative">
      <motion.div
        className="absolute rounded-sm"
        style={{
          backgroundColor: color,
          width: "40%",
          height: "50%",
        }}
        animate={{
          left: ["10%", "50%", "10%"],
          top: ["20%", "40%", "20%"],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-sm border-2"
        style={{
          borderColor: color,
          width: "48%",
          height: "100%",
          right: 0,
          top: 0,
        }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
              </div>
  );
}

// ============================================
// FEATURES SECTION
// ============================================
function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="absolute inset-0 radial-glow" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <motion.div ref={ref} className="text-center mb-20">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-block mb-4"
          >
            <MeasurementLine width={60} label="02" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold mb-6"
          >
            Built for <span style={{ color: ACCENT }}>power users</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Every feature designed with ultimate precision and efficiency in mind
          </motion.p>
        </motion.div>

        {/* Feature grid - asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Auto Tiling - Large */}
          <FeatureCard
            icon={LayoutGrid}
            title="Auto Tiling"
            description="Windows automatically arrange themselves into your chosen layout"
            index={0}
            large
          >
            <AutoTilingDemo />
          </FeatureCard>

          {/* Keyboard First */}
          <FeatureCard
            icon={Keyboard}
            title="Keyboard First"
            description="Control everything without touching your mouse"
            index={1}
          >
            <KeyboardDemo />
          </FeatureCard>

          {/* Multi-Monitor */}
          <FeatureCard
            icon={Monitor}
            title="Multi-Monitor"
            description="Independent layouts for each display with smart window transfer"
            index={2}
          >
            <MultiMonitorDemo />
          </FeatureCard>

          {/* Window Groups */}
          <FeatureCard
            icon={Layers}
            title="Window Groups"
            description="Stack multiple windows in one slot and cycle through them"
            index={3}
          >
            <WindowGroupsDemo />
          </FeatureCard>

          {/* Window Swap */}
          <FeatureCard
            icon={ArrowLeftRight}
            title="Window Swap"
            description="Instantly swap window positions with keyboard shortcuts"
            index={4}
          >
            <SwapDemo />
          </FeatureCard>

          {/* Focus Window */}
          <FeatureCard
            icon={Maximize2}
            title="Focus Window"
            description="Expand any window to fullscreen or predefined zone, toggle back instantly"
            index={5}
          >
            <FocusWindowDemo />
          </FeatureCard>

          {/* Drag to Snap */}
          <FeatureCard
            icon={MousePointerClick}
            title="Drag to Snap"
            description="Drag windows to screen edges to snap them into zones"
            index={6}
          >
            <DragSnapDemo />
          </FeatureCard>

          {/* Snap Back */}
          <FeatureCard
            icon={Undo2}
            title="Snap Back"
            description="Windows return to their assigned slots when accidentally moved"
            index={7}
          >
            <SnapBackDemo />
          </FeatureCard>

          {/* Resize Adjacent */}
          <FeatureCard
            icon={MoveHorizontal}
            title="Resize Adjacent"
            description="Resize one window and neighbors automatically adjust"
            index={8}
          >
            <ResizeAdjacentDemo />
          </FeatureCard>

          {/* Per-Desktop Layouts */}
          <FeatureCard
            icon={LayoutDashboard}
            title="Per-Space Layouts"
            description="Different layouts for each macOS Space, automatically restored"
            index={9}
          >
            <TemplateHotkeysDemo />
          </FeatureCard>

          {/* Custom Templates */}
          <FeatureCard
            icon={Grid3X3}
            title="Custom Templates"
            description="Create your own layouts with the visual zone editor"
            index={10}
          >
            <CustomTemplatesDemo />
          </FeatureCard>

          {/* Floating Windows */}
          <FeatureCard
            icon={PinOff}
            title="Floating Windows"
            description="Exclude specific windows from tiling with one click"
            index={11}
          >
            <FloatingWindowsDemo />
          </FeatureCard>

          {/* App Exclusions */}
          <FeatureCard
            icon={ShieldCheck}
            title="App Exclusions"
            description="Manually exclude apps from tiling with a blacklist. Apps in the blacklist won't be tiled or managed by Rapto."
            index={12}
          />
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ SECTION
// ============================================
function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: "Why does Rapto need Accessibility permission?",
      a: "Rapto uses macOS Accessibility APIs to move and resize windows, focus/raise them, and apply layouts. Without it, Rapto can’t control windows.",
    },
    {
      q: "Why does Rapto ask for Screen Recording permission?",
      a: "macOS protects on-screen window metadata. Screen Recording permission helps Rapto reliably detect windows and their titles for features like window detection and previews.",
    },
    {
      q: "Does Rapto work per monitor and per Space?",
      a: "Yes. You can set a different mode (and layout) for each display and each macOS Space. Rapto will follow your current Space on each display.",
    },
    {
      q: "What’s the difference between Manual, Auto-tiling, and Drag to Snap?",
      a: "Manual uses an overlay to assign windows into zones and apply a layout. Auto-tiling arranges windows automatically as they open/close. Drag to Snap lets you drag a window to edges/zones with a preview before snapping.",
    },
    {
      q: "Can I create my own layouts (templates)?",
      a: "Yes. Open the overlay in Manual mode, press “Custom”, and draw zones visually. You can rename or delete custom templates from the template picker.",
    },
    {
      q: "How do I exclude apps or disable hotkeys in some apps?",
      a: "Use Settings → Apps. “Ignored Apps” are never managed. “Passthrough Apps” keep Rapto’s hotkeys disabled while that app is focused.",
    },
    {
      q: "Is Rapto safe? Does it record or upload my screen?",
      a: "Rapto controls windows locally on your Mac. Screen Recording permission is used for window detection. Rapto doesn’t need to upload your screen for core features.",
    },
    {
      q: "How do updates work?",
      a: "Use “Check for Updates…” from the menu bar. Rapto supports automatic update checks (depending on your build/config).",
    },
    {
      q: "How do I troubleshoot issues?",
      a: "Enable Debug Logging in Settings → About → Troubleshooting, reproduce the issue, then open the log folder and share logs with your report.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6 relative">
      <div className="max-w-4xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-block mb-4"
          >
            <MeasurementLine width={60} label="03" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold mb-6"
          >
            Frequently asked <span style={{ color: ACCENT }}>questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Quick answers about permissions, modes, and everyday usage.
          </motion.p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-item-${idx}`;

            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: Math.min(0.18, idx * 0.03) }}
                className="card overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => setOpenIndex((cur) => (cur === idx ? null : idx))}
                >
                  <span className="font-display text-lg font-semibold">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                    style={{ color: ACCENT }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      key={contentId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="px-6 pb-6"
                      style={{ overflow: "hidden" }}
                    >
                      <p className="text-[var(--foreground-muted)] leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

        {/* Support contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <p className="text-[var(--foreground-muted)]">
            Still have questions?{" "}
            <a 
              href="mailto:support@rapto.app" 
              className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
              style={{ color: ACCENT }}
            >
              <Mail className="w-4 h-4" />
              support@rapto.app
            </a>
          </p>
        </motion.div>
    </section>
  );
}

// ============================================
// DOWNLOAD SECTION
// ============================================
function DownloadSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="download" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 atmosphere" />
      <div className="absolute inset-0 blueprint-grid opacity-20" />
      
      {/* Animated glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: `radial-gradient(circle, ${ACCENT}30 0%, transparent 60%)`, filter: "blur(80px)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div ref={ref} className="relative max-w-3xl mx-auto text-center">
        {/* Icon with rings */}
      <motion.div
          className="mb-12 inline-block relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.div
            className="absolute -inset-8 rounded-[40px] border-2"
            style={{ borderColor: `${ACCENT}40` }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-16 rounded-[50px] border"
            style={{ borderColor: `${ACCENT}20` }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
            <Image
              src="/app-icon.png"
              alt="Rapto"
              width={120}
              height={120}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="font-display text-5xl md:text-6xl font-bold mb-6"
        >
          Ready to get <span style={{ color: ACCENT }}>organized</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="text-xl text-[var(--foreground-muted)] mb-6"
        >
          Download Rapto and transform your workflow today.
        </motion.p>

        {/* Pricing info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl border-2"
            style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}05` }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold" style={{ color: ACCENT }}>$14.99</span>
              <span className="text-lg text-[var(--foreground-muted)]">one-time</span>
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">
              14-day free trial • No subscription • Lifetime license
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="https://github.com/LevkaDev/rapto-releases/releases/download/v2.0.5/Rapto.dmg"
            className="btn-primary text-xl animate-pulse-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-6 h-6" />
            Start Free Trial
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-6 mt-10 text-sm text-[var(--foreground-muted)]"
        >
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Apple Silicon & Intel
          </span>
          <span>•</span>
          <span>macOS 13+</span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: ACCENT }} />
            Built with Swift
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--card-border)] relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Image src="/app-icon.png" alt="Rapto" width={32} height={32} />
          <span className="font-display font-semibold text-lg">Rapto</span>
          <span className="text-[var(--foreground-muted)] text-sm">© {new Date().getFullYear()}</span>
        </motion.div>

        <motion.div
          className="flex items-center gap-6 md:gap-8 text-sm flex-wrap justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {["Features", "FAQ", "Download"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
          <motion.a
            href="/privacy"
            className="text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
            whileHover={{ y: -2 }}
          >
            Privacy
          </motion.a>
        </motion.div>

        <motion.a
          href="mailto:support@rapto.app"
          className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -2 }}
        >
          <Mail className="w-4 h-4" />
          support@rapto.app
        </motion.a>
      </div>
    </footer>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function Home() {
  return (
    <main className="overflow-hidden bg-[var(--background)]">
      <Navigation />
      <ScrollProgress />
      <CursorGlow />
      <div className="noise-overlay" />
      <Hero />
      <OperatingModes />
      <Features />
      <FAQSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
