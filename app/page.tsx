"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useInView,
  useDragControls,
  animate as animateValue,
} from "framer-motion";
import {
  Briefcase,
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
  Plus,
  Laptop,
  Sparkles,
  Wifi,
  BatteryFull,
  Search,
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
    { href: "#desktops-bar", label: "Desktops Bar" },
    { href: "#layouts", label: "Layouts" },
    { href: "#workspaces", label: "Workspaces" },
    { href: "#features", label: "Features" },
    { href: "/docs", label: "Docs" },
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
            Download
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

type SwitcherApp = "tradingview" | "safari" | "telegram" | "terminal" | "vscode" | "notes";

const SWITCHER_WINDOWS: Array<{ app: string; title: string; icon: SwitcherApp; desktop: number }> = [
  { app: "TradingView", title: "BTCUSD", icon: "tradingview", desktop: 1 },
  { app: "Safari", title: "GitHub", icon: "safari", desktop: 1 },
  { app: "Telegram", title: "Chats", icon: "telegram", desktop: 2 },
  { app: "Terminal", title: "~/projects", icon: "terminal", desktop: 1 },
  { app: "Visual Studio Code", title: "main.swift", icon: "vscode", desktop: 3 },
  { app: "Notes", title: "Shopping list", icon: "notes", desktop: 2 },
];

function SwitcherAppIcon({ app, size = 18 }: { app: SwitcherApp; size?: number }) {
  switch (app) {
    case "tradingview":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5.5" fill="#000" />
          <g transform="translate(3.6 3.6) scale(0.7)">
            <path
              fill="#fff"
              d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.354 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z"
            />
          </g>
        </svg>
      );
    case "telegram":
      return (
        <svg width={size} height={size} viewBox="0 0 240 240" aria-hidden>
          <defs>
            <linearGradient id="switcher-tg" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#2AABEE" />
              <stop offset="1" stopColor="#229ED9" />
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="120" fill="url(#switcher-tg)" />
          <path
            fill="#fff"
            d="M54.3 118.8c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.3-16.3 44.8-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3s.4 3.1.2 4.7c-1.8 19-9.6 65.1-13.6 86.3-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.5-29.8 33.1-32.3.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1.1.2-17.9 11.4-50.6 33.5-4.8 3.3-9.1 4.9-13 4.8-4.3-.1-12.5-2.4-18.7-4.4-7.5-2.4-13.5-3.7-13-7.9.3-2.2 3.3-4.4 8.9-6.7z"
          />
        </svg>
      );
    case "vscode":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#2F9AF2"
            d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
          />
        </svg>
      );
    case "safari":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <defs>
            <linearGradient id="switcher-safari" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#1AD6FD" />
              <stop offset="1" stopColor="#1D62F0" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5.5" fill="#fff" />
          <circle cx="12" cy="12" r="10" fill="url(#switcher-safari)" />
          <g stroke="#fff" strokeOpacity="0.7" strokeWidth="0.6">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="12" y1="2.8" x2="12" y2="4" transform={`rotate(${i * 30} 12 12)`} />
            ))}
          </g>
          <g transform="rotate(45 12 12)">
            <path d="M12 4.5 L14 12 L10 12 Z" fill="#FF3B30" />
            <path d="M12 19.5 L10 12 L14 12 Z" fill="#fff" />
          </g>
        </svg>
      );
    case "terminal":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <rect x="0.5" y="0.5" width="23" height="23" rx="5.5" fill="#D9D9DE" />
          <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" fill="#1C1C1E" />
          <path d="M6 8.5 L9.5 11.5 L6 14.5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 15 H16.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "notes":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <clipPath id="switcher-notes">
            <rect width="24" height="24" rx="5.5" />
          </clipPath>
          <g clipPath="url(#switcher-notes)">
            <rect width="24" height="24" fill="#FFFFFF" />
            <rect width="24" height="7" fill="#FFCC33" />
            <g stroke="#C7C7CC" strokeWidth="0.8">
              <line x1="3" y1="11" x2="21" y2="11" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="3" y1="19" x2="21" y2="19" />
            </g>
          </g>
        </svg>
      );
  }
}
const SWITCHER_AUTOPLAY = ["", "t", "te", "tel", "tel", "", "v", "vs", "vsc", "vsc"];
const SWITCHER_AUTOPLAY_INTERVAL = 650;
const SWITCHER_PAUSE_AFTER_INTERACTION = 6000;
const SWITCHER_VISIBLE_ROWS = 3;

// Same ranking as the app: app name, then words and initials, then the window title
function switcherScore(query: string, app: string, title: string): number | null {
  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;
  const a = normalize(app);
  const t = normalize(title);
  const appWords = a.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const titleWords = t.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const appInitials = appWords.map((w) => w[0]).join("");
  const titleInitials = titleWords.map((w) => w[0]).join("");
  const isSubsequence = (needle: string, hay: string) => {
    let i = 0;
    for (const c of hay) if (c === needle[i]) i++;
    return i === needle.length;
  };
  let total = 0;
  for (const token of tokens) {
    const long = token.length > 1;
    let best: number;
    if (a.startsWith(token)) best = 1000;
    else if (appWords.some((w) => w.startsWith(token))) best = 900;
    else if (long && appInitials.startsWith(token)) best = 800;
    else if (titleWords.some((w) => w.startsWith(token))) best = 700;
    else if (long && a.includes(token)) best = 600;
    else if (long && t.includes(token)) best = 500;
    else if (long && titleInitials.startsWith(token)) best = 400;
    else if (long && a[0] === token[0] && isSubsequence(token, a)) best = 300;
    else return null;
    total += best;
  }
  return total;
}

function WindowSwitcherDemo() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [switchedTo, setSwitchedTo] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const lastInteraction = useRef(0);
  const step = useRef(0);
  const queryIsAutoplay = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const switchedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = SWITCHER_WINDOWS.map((w, index) => ({ w, index, score: switcherScore(query, w.app, w.title) }))
    .filter((r): r is { w: (typeof SWITCHER_WINDOWS)[number]; index: number; score: number } => r.score !== null)
    .sort((x, y) => y.score - x.score || x.index - y.index)
    .map((r) => r.w);
  const selection = Math.min(selected, Math.max(0, results.length - 1));

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFocused || document.activeElement === inputRef.current) return;
      if (Date.now() - lastInteraction.current < SWITCHER_PAUSE_AFTER_INTERACTION) return;
      step.current = (step.current + 1) % SWITCHER_AUTOPLAY.length;
      queryIsAutoplay.current = true;
      setQuery(SWITCHER_AUTOPLAY[step.current]);
      setSelected(0);
    }, SWITCHER_AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isFocused]);

  useEffect(() => () => {
    if (switchedTimer.current) clearTimeout(switchedTimer.current);
  }, []);

  const markInteraction = () => {
    lastInteraction.current = Date.now();
  };

  const switchTo = (win: (typeof SWITCHER_WINDOWS)[number]) => {
    markInteraction();
    setSwitchedTo(`${win.app} · Desktop ${win.desktop}`);
    if (switchedTimer.current) clearTimeout(switchedTimer.current);
    switchedTimer.current = setTimeout(() => setSwitchedTo(null), 1400);
  };

  return (
    <div className="relative select-none">
      <div className="rounded-xl bg-[var(--card-solid)] border border-white/15 shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 px-3 h-9 border-b border-white/10">
          <Search className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              markInteraction();
              let next = e.target.value;
              // Typing over the autoplay text starts a new query instead of adding to it
              if (queryIsAutoplay.current && next.startsWith(query)) next = next.slice(query.length);
              queryIsAutoplay.current = false;
              setQuery(next);
              setSelected(0);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (queryIsAutoplay.current) {
                queryIsAutoplay.current = false;
                setQuery("");
                setSelected(0);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              markInteraction();
            }}
            onKeyDown={(e) => {
              if (results.length === 0) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((selection + 1) % results.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((selection - 1 + results.length) % results.length);
              } else if (e.key === "Enter") {
                e.preventDefault();
                switchTo(results[selection]);
              }
            }}
            placeholder="Type to search, try “t”"
            aria-label="Try the window switcher: type an app or window name"
            className="flex-1 bg-transparent text-xs text-white placeholder:text-[var(--foreground-muted)] outline-none"
          />
        </div>
        <div className="p-1" style={{ height: SWITCHER_VISIBLE_ROWS * 28 + 8 }}>
          {results.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[11px] text-[var(--foreground-muted)]">
              No matching windows
            </div>
          ) : (
            results.slice(0, SWITCHER_VISIBLE_ROWS).map((win, i) => (
              <button
                key={win.app}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSelected(i);
                  switchTo(win);
                }}
                className="w-full h-7 flex items-center gap-2 px-2 rounded-md text-left transition-colors"
                style={{ background: i === selection ? `${ACCENT}26` : "transparent" }}
              >
                <span className="shrink-0 flex">
                  <SwitcherAppIcon app={win.icon} />
                </span>
                <span className="flex-1 min-w-0 truncate text-[11px]">
                  <span className="text-white font-medium">{win.title}</span>
                  <span className="text-[var(--foreground-muted)]"> · {win.app} · Desktop {win.desktop}</span>
                </span>
                <span className="text-[10px] text-[var(--foreground-muted)]">⌘{i + 1}</span>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="mt-2 h-4 text-[11px] text-center text-[var(--foreground-muted)]">
        <AnimatePresence mode="wait">
          <motion.span
            key={switchedTo ?? "hint"}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
            style={switchedTo ? { color: ACCENT } : undefined}
          >
            {switchedTo ? `Switched to ${switchedTo}` : "⌃⌥W in Rapto · ↑↓ and Return to pick"}
          </motion.span>
        </AnimatePresence>
      </div>
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

const GROUP_AUTOPLAY_INTERVAL = 1800;
const GROUP_AUTOPLAY_PAUSE_AFTER_INTERACTION = 6000;
const GROUP_BADGE_RETURN_DELAY = 2000;

function WindowGroupsDemo() {
  const [active, setActive] = useState(0);
  const [isDisplaced, setIsDisplaced] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastInteraction = useRef(0);
  const pointerDownAt = useRef<{ x: number; y: number } | null>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const badgeX = useMotionValue(0);
  const badgeY = useMotionValue(0);
  const dragControls = useDragControls();

  const windows = [
    { color: ACCENT, icon: "🌐", name: "Browser" },
    { color: "#00FFE5", icon: "💻", name: "Terminal" },
    { color: "#A855F7", icon: "📁", name: "Files" },
  ];

  const markInteraction = () => {
    lastInteraction.current = Date.now();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current < GROUP_AUTOPLAY_PAUSE_AFTER_INTERACTION) return;
      setActive((a) => (a + 1) % windows.length);
    }, GROUP_AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [windows.length]);

  const cancelReturn = () => {
    if (returnTimer.current) clearTimeout(returnTimer.current);
    returnTimer.current = null;
  };

  // Like the app: the badge slides back once the pointer has been away from it for a moment
  const scheduleReturn = () => {
    cancelReturn();
    returnTimer.current = setTimeout(() => {
      const spring = { type: "spring" as const, stiffness: 260, damping: 26 };
      animateValue(badgeX, 0, spring);
      animateValue(badgeY, 0, spring);
      setIsDisplaced(false);
    }, GROUP_BADGE_RETURN_DELAY);
  };

  useEffect(() => cancelReturn, []);

  return (
    <div className="relative h-28 select-none">
      <div ref={containerRef} className="absolute inset-x-3 top-2 bottom-6">
        {windows.map((win, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{
              opacity: i === active ? 1 : 0,
              scale: i === active ? 1 : 0.96,
              y: i === active ? 0 : 4,
            }}
            transition={{ duration: 0.25 }}
          >
            <MiniWindow color={win.color} className="w-full h-full" />
            {/* Window toolbar buttons that the badge covers until it is dragged aside */}
            <div className="absolute right-2 top-4 flex gap-1">
              {[0, 1, 2].map((b) => (
                <div
                  key={b}
                  className="w-6 h-4 rounded"
                  style={{ background: `${win.color}35`, border: `1px solid ${win.color}50` }}
                />
              ))}
            </div>
            <div className="absolute left-2 bottom-2 text-[10px] font-medium text-white/60">
              {win.name}
            </div>
          </motion.div>
        ))}

        <motion.div
          drag
          // The built-in listener ignores presses that start on a <button>, i.e. on the icons
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={containerRef}
          dragElastic={0.08}
          dragMomentum={false}
          style={{ x: badgeX, y: badgeY, touchAction: "none" }}
          onPointerDown={(e) => {
            pointerDownAt.current = { x: e.clientX, y: e.clientY };
            dragControls.start(e);
          }}
          onDragStart={() => {
            cancelReturn();
            markInteraction();
            setIsDragging(true);
            setIsDisplaced(true);
          }}
          onDragEnd={() => {
            setIsDragging(false);
            scheduleReturn();
          }}
          onPointerEnter={() => {
            if (isDisplaced && !isDragging) cancelReturn();
          }}
          onPointerLeave={() => {
            if (isDisplaced && !isDragging) scheduleReturn();
          }}
          whileDrag={{ scale: 1.06 }}
          className={`absolute right-1 top-3.5 z-10 flex gap-1 px-1.5 py-1 rounded-full bg-[var(--card-solid)]/90 backdrop-blur border border-white/20 shadow-lg ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          aria-label="Window group badge. Click an icon to switch windows, drag to move it aside"
        >
          {windows.map((win, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={(e) => {
                const down = pointerDownAt.current;
                // A click that ends a drag is not a selection
                // (detail is 0 for keyboard activation, which has no pointer position)
                if (e.detail !== 0 && down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4) return;
                markInteraction();
                setActive(i);
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer"
              style={{
                background: i === active ? `${win.color}40` : "transparent",
                border: i === active ? `1px solid ${win.color}` : "1px solid transparent",
              }}
              animate={{ opacity: i === active ? 1 : 0.5, scale: i === active ? 1.1 : 1 }}
              aria-label={`Switch to ${win.name}`}
              aria-pressed={i === active}
            >
              {win.icon}
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-x-3 bottom-0 text-[11px] text-[var(--foreground-muted)] text-center">
        Click an icon to switch · drag the badge aside
      </div>
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
            Download for Mac
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
              { value: "40+", label: "Hotkey Actions" },
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
// DESKTOPS BAR SECTION
// ============================================
type BarApp = { id: string; icon: string; title: string; color: string };
type BarDesk = { id: number; apps: BarApp[] };
type BarFrame = {
  desks: BarDesk[];
  active: number;
  cursor: string;
  drag?: string;
  hover?: string;
  press?: boolean;
  notch?: boolean;
  barHidden?: boolean;
  menu?: boolean;
  caption: string;
  ms: number;
};

const BAR_APPS: Record<string, BarApp> = {
  browser: { id: "browser", icon: "🌐", title: "Browser", color: ACCENT },
  code: { id: "code", icon: "💻", title: "Code", color: "#00FFE5" },
  mail: { id: "mail", icon: "✉️", title: "Mail", color: "#A855F7" },
  music: { id: "music", icon: "🎵", title: "Music", color: "#FF6B6B" },
  files: { id: "files", icon: "📁", title: "Files", color: "#FFB800" },
};

const desks = (...lists: string[][]): BarDesk[] =>
  lists.map((apps, i) => ({ id: i + 1, apps: apps.map((a) => BAR_APPS[a]) }));

const BASE_DESKS = desks(["browser", "code", "mail"], ["music"], ["files"]);

const BAR_SCENES: Array<{ id: string; label: string; frames: BarFrame[] }> = [
  {
    id: "switch",
    label: "Switch",
    frames: [
      { desks: BASE_DESKS, active: 1, cursor: "rest", caption: "Every desktop and the apps on it, right in the menu bar", ms: 1500 },
      { desks: BASE_DESKS, active: 1, cursor: "d-3", caption: "Click a number…", ms: 750 },
      { desks: BASE_DESKS, active: 3, cursor: "d-3", press: true, caption: "…and you're there instantly. No slide animation", ms: 1500 },
      { desks: BASE_DESKS, active: 3, cursor: "d-2", caption: "…and you're there instantly. No slide animation", ms: 650 },
      { desks: BASE_DESKS, active: 2, cursor: "d-2", press: true, caption: "…and you're there instantly. No slide animation", ms: 1300 },
      { desks: BASE_DESKS, active: 2, cursor: "d-1", caption: "…and you're there instantly. No slide animation", ms: 650 },
      { desks: BASE_DESKS, active: 1, cursor: "d-1", press: true, caption: "…and you're there instantly. No slide animation", ms: 1300 },
    ],
  },
  {
    id: "move",
    label: "Move a window",
    frames: [
      { desks: BASE_DESKS, active: 1, cursor: "rest", caption: "Drag an app icon onto another desktop", ms: 1000 },
      { desks: BASE_DESKS, active: 1, cursor: "app-mail", caption: "Drag an app icon onto another desktop", ms: 800 },
      { desks: BASE_DESKS, active: 1, cursor: "d-2", drag: "mail", hover: "d-2", caption: "Drag an app icon onto another desktop", ms: 1000 },
      { desks: desks(["browser", "code"], ["music", "mail"], ["files"]), active: 1, cursor: "d-2", caption: "The window moves there, and you stay where you were", ms: 2000 },
      { desks: desks(["browser", "code"], ["music", "mail"], ["files"]), active: 1, cursor: "rest", caption: "Hold ⌥ Option when you let go to go along with it", ms: 2200 },
    ],
  },
  {
    id: "add",
    label: "New desktop",
    frames: [
      { desks: BASE_DESKS, active: 1, cursor: "rest", caption: "Drop an app on + to give it a desktop of its own", ms: 1000 },
      { desks: BASE_DESKS, active: 1, cursor: "app-code", caption: "Drop an app on + to give it a desktop of its own", ms: 800 },
      { desks: BASE_DESKS, active: 1, cursor: "plus", drag: "code", hover: "plus", caption: "Drop an app on + to give it a desktop of its own", ms: 1100 },
      { desks: desks(["browser", "mail"], ["music"], ["files"], ["code"]), active: 1, cursor: "d-4", caption: "A new desktop appears, with that window already on it", ms: 2200 },
      { desks: desks(["browser", "mail"], ["music"], ["files"], ["code"]), active: 1, cursor: "plus", caption: "Or just click + to add an empty one", ms: 1800 },
    ],
  },
  {
    id: "menu",
    label: "Right-click",
    frames: [
      { desks: BASE_DESKS, active: 1, cursor: "rest", caption: "Right-click a desktop for its own mode and layout", ms: 900 },
      { desks: BASE_DESKS, active: 1, cursor: "d-1", caption: "Right-click a desktop for its own mode and layout", ms: 700 },
      { desks: BASE_DESKS, active: 1, cursor: "d-1", menu: true, caption: "Set the mode and layout, open the overlay or restore the layout", ms: 2800 },
      { desks: BASE_DESKS, active: 1, cursor: "rest", caption: "Set the mode and layout, open the overlay or restore the layout", ms: 700 },
    ],
  },
  {
    id: "notch",
    label: "MacBook notch",
    frames: [
      { desks: BASE_DESKS, active: 1, cursor: "rest", notch: true, barHidden: true, caption: "On a MacBook with a notch, the bar stays out of the way", ms: 1800 },
      { desks: BASE_DESKS, active: 1, cursor: "notch", notch: true, caption: "Point at the notch and it drops down", ms: 1300 },
      { desks: BASE_DESKS, active: 1, cursor: "d-2", notch: true, caption: "Point at the notch and it drops down", ms: 650 },
      { desks: BASE_DESKS, active: 2, cursor: "d-2", notch: true, press: true, caption: "Use it as usual", ms: 1300 },
      { desks: BASE_DESKS, active: 2, cursor: "rest", notch: true, barHidden: true, caption: "Move away and it hides again. It also shows for a moment when you switch desktops", ms: 2400 },
    ],
  },
];

function DesktopsBarDemo({ frame, frameKey }: { frame: BarFrame; frameKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targets = useRef<Record<string, HTMLElement | null>>({});
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const register = (key: string) => (el: HTMLElement | null) => {
    targets.current[key] = el;
  };

  useEffect(() => {
    const measure = () => {
      const box = containerRef.current?.getBoundingClientRect();
      if (!box) return;
      const el = targets.current[frame.cursor];
      if (!el || frame.cursor === "rest") {
        setCursor({ x: box.width * 0.72, y: box.height * 0.7 });
        return;
      }
      const r = el.getBoundingClientRect();
      setCursor({ x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 + 2 });
    };
    // Bar segments animate their layout, so measure again once they settle.
    const frameID = requestAnimationFrame(measure);
    const late = setTimeout(measure, 380);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frameID);
      clearTimeout(late);
      window.removeEventListener("resize", measure);
    };
  }, [frame.cursor, frameKey]);

  const activeDesk = frame.desks.find((d) => d.id === frame.active) ?? frame.desks[0];
  const dragged = frame.drag ? BAR_APPS[frame.drag] : undefined;
  const barShown = !frame.barHidden;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[760px] h-[360px] sm:h-[420px] rounded-2xl overflow-hidden demo-window select-none"
      style={{ background: "linear-gradient(180deg, #15151a 0%, #0a0a0c 100%)" }}
    >
      {/* Menu bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-4 text-[12px] text-white/70 bg-white/[0.04] border-b border-white/[0.05] backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white/90">Finder</span>
          <span className="hidden sm:inline">File</span>
          <span className="hidden sm:inline">Edit</span>
          <span className="hidden md:inline">View</span>
          <span className="hidden md:inline">Window</span>
        </div>
        <div className="flex items-center gap-3">
          <Wifi className="hidden sm:block w-3.5 h-3.5" />
          <BatteryFull className="hidden sm:block w-4 h-4" />
          <span className="font-mono">Mon 10:27</span>
        </div>
      </div>

      {/* Notch */}
      <AnimatePresence>
        {frame.notch && (
          <motion.div
            ref={register("notch")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 rounded-b-2xl bg-black z-30"
          />
        )}
      </AnimatePresence>

      {/* Desktops bar */}
      <motion.div
        className="absolute left-1/2 z-20 flex items-center gap-1 px-1 py-[3px] rounded-full bg-[#232329]/90 border border-white/[0.12] backdrop-blur-xl shadow-lg"
        style={{ x: "-50%", pointerEvents: barShown ? "auto" : "none" }}
        animate={{
          top: frame.notch ? 46 : 5,
          opacity: barShown ? 1 : 0,
          scale: barShown ? 1 : 0.92,
        }}
        transition={{ duration: barShown ? 0.2 : 0.25, ease: "easeOut" }}
      >
        {frame.desks.map((desk) => {
          const isActive = desk.id === frame.active;
          const isTarget = frame.hover === `d-${desk.id}`;
          return (
            <motion.div
              key={desk.id}
              ref={register(`d-${desk.id}`)}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="flex items-center gap-1.5 h-6 px-2 rounded-full"
              style={{
                background: isTarget ? "rgba(255,255,255,0.22)" : isActive ? "rgba(255,255,255,0.14)" : "transparent",
                transition: "background 0.12s",
              }}
            >
              <span className={`text-[13px] font-mono font-semibold ${isActive ? "text-white" : "text-white/50"}`}>
                {desk.id}
              </span>
              {desk.apps.map((app) => (
                <motion.span
                  key={app.id}
                  ref={register(`app-${app.id}`)}
                  layout
                  className="text-[13px] leading-none"
                  animate={{ opacity: frame.drag === app.id ? 0.25 : 1 }}
                >
                  {app.icon}
                </motion.span>
              ))}
            </motion.div>
          );
        })}
        <motion.div
          ref={register("plus")}
          layout
          className="w-5 h-5 mx-0.5 rounded-full border flex items-center justify-center text-[13px] leading-none"
          style={{
            borderColor: frame.hover === "plus" ? ACCENT : "rgba(255,255,255,0.45)",
            color: frame.hover === "plus" ? ACCENT : "rgba(255,255,255,0.7)",
            background: frame.hover === "plus" ? `${ACCENT}25` : "transparent",
          }}
          animate={{ scale: frame.hover === "plus" ? 1.2 : 1 }}
        >
          +
        </motion.div>
      </motion.div>

      {/* Desktop content: windows of the active desktop */}
      <div className="absolute inset-x-4 bottom-4 top-14">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeDesk.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute inset-0 flex gap-2"
          >
            <AnimatePresence mode="popLayout">
              {activeDesk.apps.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, y: -40 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative flex-1 h-full"
                >
                  <MiniWindow color={app.color} className="w-full h-full" />
                  <div className="absolute inset-0 top-3 flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">{app.icon}</span>
                    <span className="text-xs font-mono" style={{ color: app.color }}>
                      {app.title}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {activeDesk.apps.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-sm text-white/30 font-mono">Empty desktop</div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/40">Desktop {activeDesk.id}</div>
      </div>

      {/* Context menu */}
      <AnimatePresence>
        {frame.menu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute z-40 w-48 py-1 rounded-lg text-[12px] text-white/90 bg-[#2a2a30]/95 border border-white/10 shadow-2xl backdrop-blur-xl origin-top-left"
            style={{ left: cursor.x + 4, top: cursor.y + 8 }}
          >
            {[
              { label: "Manual", check: true },
              { label: "Auto Tiling" },
              { label: "Drag to Snap" },
              { sep: true },
              { label: "Layout", value: "2 + 1 ›" },
              { label: "Open Overlay" },
              { label: "Restore Layout" },
              { sep: true },
              { label: "Settings…" },
            ].map((item, i) =>
              item.sep ? (
                <div key={i} className="my-1 h-px bg-white/10" />
              ) : (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-[3px] mx-1 rounded"
                  style={i === 0 ? { background: "#3b82f6" } : undefined}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 text-[10px]">{item.check ? "✓" : ""}</span>
                    {item.label}
                  </span>
                  {item.value && <span className="text-white/50">{item.value}</span>}
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dragged icon */}
      <AnimatePresence>
        {dragged && (
          <motion.div
            key={dragged.id}
            className="absolute z-50 text-lg pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, left: cursor.x + 8, top: cursor.y - 4 }}
            animate={{ opacity: 1, scale: 1.25, left: cursor.x + 8, top: cursor.y - 4 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {dragged.icon}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        animate={{ left: cursor.x - 3, top: cursor.y - 3 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence>
          {(frame.press || frame.menu) && (
            <motion.div
              key={frameKey}
              className="absolute -left-3 -top-3 w-7 h-7 rounded-full"
              style={{ border: `2px solid ${ACCENT}` }}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
        <svg width="18" height="22" viewBox="0 0 18 22" className="drop-shadow-lg">
          <path d="M1 1L1 17L5.5 12.5L8.5 20L11.5 18.8L8.5 11.5L15 11.5Z" fill="white" stroke="black" strokeWidth="1.2" />
        </svg>
      </motion.div>
    </div>
  );
}

function DesktopsBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [scene, setScene] = useState(0);
  const [frame, setFrame] = useState(0);
  const [pinned, setPinned] = useState(false);

  const current = BAR_SCENES[scene];
  const step = current.frames[frame];

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      if (frame + 1 < current.frames.length) {
        setFrame(frame + 1);
      } else {
        setFrame(0);
        if (!pinned) setScene((s) => (s + 1) % BAR_SCENES.length);
      }
    }, step.ms);
    return () => clearTimeout(timer);
  }, [isInView, frame, scene, pinned, current.frames.length, step.ms]);

  const highlights = [
    { icon: MousePointerClick, title: "Instant switching", text: "Click a desktop number to jump straight there, with no slide." },
    { icon: Grip, title: "Drag to move", text: "Drop an app icon on another desktop. You stay put, or hold ⌥ to follow." },
    { icon: Plus, title: "New desktop in one drop", text: "The + button adds a desktop. Drop an icon on it to move that window there." },
    { icon: LayoutDashboard, title: "Slots remembered", text: "On a Manual desktop, a returning window snaps back into its old slot." },
    { icon: Laptop, title: "Notch friendly", text: "On MacBooks it hides under the notch and drops down when you point at it." },
    { icon: Monitor, title: "One bar per display", text: "Every monitor gets its own bar with its own desktops." },
  ];

  return (
    <section id="desktops-bar" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 radial-glow" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-3 mb-4"
          >
            <MeasurementLine width={60} />
            <span className="tag">
              <Sparkles className="w-4 h-4" />
              New in 5.47
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold mb-6"
          >
            Your desktops, <span style={{ color: ACCENT }}>in the menu bar</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            See every desktop and what&apos;s open on it. Switch with a click, and drag apps between desktops without leaving the one you&apos;re on
          </motion.p>
        </motion.div>

        {/* Scene picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {BAR_SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setScene(i);
                setFrame(0);
                setPinned(true);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                scene === i
                  ? "text-[var(--background)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--card-border)]"
              }`}
              style={{ backgroundColor: scene === i ? ACCENT : undefined }}
            >
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <DesktopsBarDemo frame={step} frameKey={`${scene}-${frame}`} />
          <div className="h-14 mt-5 flex items-start justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={step.caption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-center text-[var(--foreground-muted)] max-w-xl"
              >
                {step.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {highlights.map((h, i) => (
            <FeatureCard key={h.title} icon={h.icon} title={h.title} description={h.text} index={i} />
          ))}
        </div>

        <p className="text-center text-sm text-[var(--foreground-muted)] mt-8">
          Works on macOS 26 and later. Turn it on or off in Settings → General → Menu Bar
        </p>
      </div>
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

// ============================================
// LAYOUTS SECTION (overlay + zone editor)
// ============================================
type Rect = { x: number; y: number; w: number; h: number };
type LayoutTemplate = { id: string; name: string; zones: Rect[] };
type OverlayFrame = {
  view: "desktop" | "picker" | "editor";
  template?: string;
  assigned?: string[];
  applied?: boolean;
  saved?: boolean;
  zones?: Rect[];
  creator?: Rect | null;
  name?: string;
  hotkey?: boolean;
  cursor: string | [number, number];
  press?: boolean;
  caption: string;
  ms: number;
};

const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  { id: "halves", name: "Halves", zones: [{ x: 0, y: 0, w: 50, h: 100 }, { x: 50, y: 0, w: 50, h: 100 }] },
  { id: "thirds", name: "Thirds", zones: [{ x: 0, y: 0, w: 33.3, h: 100 }, { x: 33.3, y: 0, w: 33.4, h: 100 }, { x: 66.7, y: 0, w: 33.3, h: 100 }] },
  { id: "split", name: "1+2 Left", zones: [{ x: 0, y: 0, w: 50, h: 100 }, { x: 50, y: 0, w: 50, h: 50 }, { x: 50, y: 50, w: 50, h: 50 }] },
  { id: "quarters", name: "Quarters", zones: [{ x: 0, y: 0, w: 50, h: 50 }, { x: 50, y: 0, w: 50, h: 50 }, { x: 0, y: 50, w: 50, h: 50 }, { x: 50, y: 50, w: 50, h: 50 }] },
];
const MY_LAYOUT: LayoutTemplate = {
  id: "mine",
  name: "My Layout",
  zones: [{ x: 0, y: 0, w: 60, h: 100 }, { x: 60, y: 0, w: 40, h: 50 }, { x: 60, y: 50, w: 40, h: 50 }],
};
const ZONE_COLORS = [ACCENT, "#00FFE5", "#A855F7", "#FFB800"];
const LAYOUT_WINDOWS = [
  { id: "browser", title: "Browser", icon: "🌐", color: ACCENT, loose: { x: 6, y: 12, w: 44, h: 50 } },
  { id: "code", title: "Code", icon: "💻", color: "#00FFE5", loose: { x: 40, y: 24, w: 48, h: 56 } },
  { id: "mail", title: "Mail", icon: "✉️", color: "#A855F7", loose: { x: 14, y: 50, w: 38, h: 42 } },
];
// Editor area inside the stage, in stage percent.
const EDITOR = { x: 4, y: 22, w: 92, h: 64 };
const inEditor = (r: Rect): Rect => ({
  x: EDITOR.x + (r.x * EDITOR.w) / 100,
  y: EDITOR.y + (r.y * EDITOR.h) / 100,
  w: (r.w * EDITOR.w) / 100,
  h: (r.h * EDITOR.h) / 100,
});
const editorPoint = (x: number, y: number): [number, number] => [EDITOR.x + (x * EDITOR.w) / 100, EDITOR.y + (y * EDITOR.h) / 100];

const Z1 = { x: 0, y: 0, w: 60, h: 100 };
const Z2 = { x: 60, y: 0, w: 40, h: 50 };
const Z3 = { x: 60, y: 50, w: 40, h: 50 };

const LAYOUT_SCENES: Array<{ id: string; label: string; frames: OverlayFrame[] }> = [
  {
    id: "apply",
    label: "Apply a layout",
    frames: [
      { view: "desktop", cursor: "rest", hotkey: true, caption: "Press ⌃⌥G to open the overlay", ms: 1600 },
      { view: "picker", cursor: "rest", caption: "Pick a layout at the top…", ms: 700 },
      { view: "picker", cursor: "chip:split", caption: "Pick a layout at the top…", ms: 700 },
      { view: "picker", template: "split", cursor: "chip:split", press: true, caption: "Pick a layout at the top…", ms: 800 },
      { view: "picker", template: "split", cursor: "thumb:code", caption: "…then click windows in the order they should fill it", ms: 650 },
      { view: "picker", template: "split", assigned: ["code"], cursor: "thumb:code", press: true, caption: "…then click windows in the order they should fill it", ms: 650 },
      { view: "picker", template: "split", assigned: ["code"], cursor: "thumb:browser", caption: "…then click windows in the order they should fill it", ms: 600 },
      { view: "picker", template: "split", assigned: ["code", "browser"], cursor: "thumb:browser", press: true, caption: "…then click windows in the order they should fill it", ms: 650 },
      { view: "picker", template: "split", assigned: ["code", "browser"], cursor: "thumb:mail", caption: "…then click windows in the order they should fill it", ms: 600 },
      { view: "picker", template: "split", assigned: ["code", "browser", "mail"], cursor: "thumb:mail", press: true, caption: "…then click windows in the order they should fill it", ms: 700 },
      { view: "picker", template: "split", assigned: ["code", "browser", "mail"], cursor: "apply", caption: "Press Enter, and every window snaps into place", ms: 650 },
      { view: "desktop", template: "split", assigned: ["code", "browser", "mail"], applied: true, cursor: "rest", press: true, caption: "Press Enter, and every window snaps into place", ms: 2600 },
    ],
  },
  {
    id: "draw",
    label: "Draw your own",
    frames: [
      { view: "picker", cursor: "rest", caption: "Need a layout that isn't there? Click Custom", ms: 900 },
      { view: "picker", cursor: "chip:custom", caption: "Need a layout that isn't there? Click Custom", ms: 700 },
      { view: "editor", zones: [], creator: { x: 35, y: 30, w: 30, h: 40 }, cursor: "chip:custom", press: true, caption: "A frame appears on your screen", ms: 1000 },
      { view: "editor", zones: [], creator: { x: 35, y: 30, w: 30, h: 40 }, cursor: editorPoint(35, 30), caption: "Drag it and pull its handles to the size you want", ms: 600 },
      { view: "editor", zones: [], creator: { x: 0, y: 0, w: 65, h: 70 }, cursor: editorPoint(0, 0), caption: "Drag it and pull its handles to the size you want", ms: 850 },
      { view: "editor", zones: [], creator: { x: 0, y: 0, w: 65, h: 70 }, cursor: editorPoint(65, 70), caption: "Drag it and pull its handles to the size you want", ms: 550 },
      { view: "editor", zones: [], creator: Z1, cursor: editorPoint(60, 100), caption: "Drag it and pull its handles to the size you want", ms: 850 },
      { view: "editor", zones: [], creator: Z1, cursor: editorPoint(30, 50), caption: "Click + to turn it into a zone", ms: 600 },
      { view: "editor", zones: [Z1], creator: Z1, cursor: editorPoint(30, 50), press: true, caption: "Click + to turn it into a zone", ms: 800 },
      { view: "editor", zones: [Z1], creator: Z2, cursor: editorPoint(80, 25), caption: "Place the next one, and the next", ms: 900 },
      { view: "editor", zones: [Z1, Z2], creator: Z2, cursor: editorPoint(80, 25), press: true, caption: "Place the next one, and the next", ms: 700 },
      { view: "editor", zones: [Z1, Z2], creator: Z3, cursor: editorPoint(80, 75), caption: "Place the next one, and the next", ms: 900 },
      { view: "editor", zones: [Z1, Z2, Z3], creator: null, cursor: editorPoint(80, 75), press: true, caption: "Zones are numbered in the order windows fill them", ms: 1300 },
      { view: "editor", zones: [Z1, Z2, Z3], creator: null, cursor: "name", caption: "Name it and save", ms: 650 },
      { view: "editor", zones: [Z1, Z2, Z3], creator: null, name: "My Layout", cursor: "name", press: true, caption: "Name it and save", ms: 900 },
      { view: "editor", zones: [Z1, Z2, Z3], creator: null, name: "My Layout", cursor: "save", caption: "Name it and save", ms: 650 },
      { view: "picker", saved: true, template: "mine", cursor: "chip:mine", press: true, caption: "Your layout sits right next to the built-in ones", ms: 2600 },
    ],
  },
];

function LayoutPreview({ zones, highlight }: { zones: Rect[]; highlight?: number }) {
  return (
    <div className="relative w-full h-full">
      {zones.map((z, i) => (
        <div
          key={i}
          className="absolute rounded-[2px]"
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: `${z.w}%`,
            height: `${z.h}%`,
            padding: 1,
          }}
        >
          <div
            className="w-full h-full rounded-[2px]"
            style={{
              background: highlight === i ? `${ZONE_COLORS[i % 4]}90` : `${ZONE_COLORS[i % 4]}35`,
              border: `1px solid ${ZONE_COLORS[i % 4]}80`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function OverlayDemo({ frame, frameKey }: { frame: OverlayFrame; frameKey: string }) {
  const chips = [...LAYOUT_TEMPLATES, ...(frame.saved ? [MY_LAYOUT] : [])];
  const chipCount = chips.length + 1;
  const chipWidth = 12;
  const chipGap = 1.6;
  const chipStart = 50 - (chipCount * chipWidth + (chipCount - 1) * chipGap) / 2;
  const chipX = (i: number) => chipStart + i * (chipWidth + chipGap);
  const thumbX: Record<string, number> = { browser: 30, code: 50, mail: 70 };

  const resolve = (c: OverlayFrame["cursor"]): [number, number] => {
    if (Array.isArray(c)) return c;
    if (c === "rest") return [80, 74];
    if (c === "apply") return [50, 84];
    if (c === "name") return [22, 12];
    if (c === "save") return [86, 12];
    if (c.startsWith("thumb:")) return [thumbX[c.slice(6)], 52];
    const id = c.slice(5);
    const index = id === "custom" ? chips.length : chips.findIndex((t) => t.id === id);
    return [chipX(Math.max(index, 0)) + chipWidth / 2, 12];
  };
  const [cx, cy] = resolve(frame.cursor);

  const template = [...LAYOUT_TEMPLATES, MY_LAYOUT].find((t) => t.id === frame.template);
  const assigned = frame.assigned ?? [];
  const desktop = { x: 2, y: 4, w: 96, h: 92 };

  const windowRect = (id: string, loose: Rect): Rect => {
    const slot = assigned.indexOf(id);
    if (!frame.applied || !template || slot < 0) return loose;
    const z = template.zones[slot];
    return {
      x: desktop.x + (z.x * desktop.w) / 100 + 0.5,
      y: desktop.y + (z.y * desktop.h) / 100 + 0.8,
      w: (z.w * desktop.w) / 100 - 1,
      h: (z.h * desktop.h) / 100 - 1.6,
    };
  };

  return (
    <div
      className="relative w-full max-w-[760px] aspect-[16/10] rounded-2xl overflow-hidden demo-window select-none"
      style={{ background: "linear-gradient(180deg, #15151a 0%, #0a0a0c 100%)" }}
    >
      {/* Windows on the desktop */}
      {LAYOUT_WINDOWS.map((win) => {
        const r = windowRect(win.id, win.loose);
        return (
          <motion.div
            key={win.id}
            className="absolute"
            initial={false}
            animate={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <MiniWindow color={win.color} className="w-full h-full" />
            <div className="absolute inset-0 top-3 flex flex-col items-center justify-center gap-1">
              <span className="text-2xl">{win.icon}</span>
              <span className="text-[11px] font-mono" style={{ color: win.color }}>
                {win.title}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Hotkey hint */}
      <AnimatePresence>
        {frame.hotkey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute right-4 top-4 z-30 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/70 border border-white/10 backdrop-blur"
          >
            {["⌃", "⌥", "G"].map((k, i) => (
              <motion.span
                key={k}
                className="min-w-7 h-7 px-1.5 rounded-md flex items-center justify-center text-sm font-mono font-semibold"
                style={{ background: "var(--card-solid)", border: "1px solid var(--card-border)" }}
                animate={{ color: ["#888", ACCENT, ACCENT], borderColor: ["rgba(255,255,255,0.06)", ACCENT, ACCENT] }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.3 }}
              >
                {k}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {frame.view !== "desktop" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 bg-black/75 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Picker view */}
      <AnimatePresence>
        {frame.view === "picker" && (
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30"
          >
            {chips.map((t, i) => (
              <motion.div
                key={t.id}
                layout
                initial={t.id === "mine" ? { opacity: 0, scale: 0.6 } : false}
                animate={{ opacity: 1, scale: frame.template === t.id ? 1.06 : 1 }}
                className="absolute flex flex-col items-center gap-1"
                style={{ left: `${chipX(i)}%`, width: `${chipWidth}%`, top: "5%" }}
              >
                <div
                  className="w-full aspect-[16/10] rounded-md p-1 transition-colors"
                  style={{
                    background: frame.template === t.id ? `${ACCENT}22` : "rgba(255,255,255,0.05)",
                    border: `1px solid ${frame.template === t.id ? ACCENT : "rgba(255,255,255,0.12)"}`,
                  }}
                >
                  <LayoutPreview zones={t.zones} />
                </div>
                <span className={`text-[9px] sm:text-[10px] whitespace-nowrap ${frame.template === t.id ? "text-white" : "text-white/50"}`}>
                  {t.name}
                </span>
              </motion.div>
            ))}
            <motion.div
              layout
              className="absolute flex flex-col items-center gap-1"
              style={{ left: `${chipX(chips.length)}%`, width: `${chipWidth}%`, top: "5%" }}
            >
              <div className="w-full aspect-[16/10] rounded-md border border-dashed border-white/25 flex items-center justify-center text-white/60">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[9px] sm:text-[10px] text-white/50">Custom</span>
            </motion.div>

            {/* Zone indicator */}
            {template && (
              <div className="absolute left-1/2 -translate-x-1/2 top-[28%] w-[11%] aspect-[16/10] rounded-md p-0.5 bg-white/5 border border-white/10">
                <LayoutPreview zones={template.zones} highlight={assigned.length < template.zones.length ? assigned.length : undefined} />
              </div>
            )}

            {/* Window thumbnails */}
            {LAYOUT_WINDOWS.map((win) => {
              const order = assigned.indexOf(win.id);
              return (
                <motion.div
                  key={win.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-[16%] aspect-[4/3]"
                  style={{ left: `${thumbX[win.id]}%`, top: "52%" }}
                  animate={{ scale: order >= 0 ? 0.94 : 1, opacity: order >= 0 ? 0.75 : 1 }}
                >
                  <MiniWindow color={win.color} className="w-full h-full" />
                  <div className="absolute inset-0 top-3 flex flex-col items-center justify-center">
                    <span className="text-xl">{win.icon}</span>
                    <span className="text-[10px] font-mono" style={{ color: win.color }}>
                      {win.title}
                    </span>
                  </div>
                  <AnimatePresence>
                    {order >= 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                        style={{ background: ZONE_COLORS[order] }}
                      >
                        {order + 1}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Apply button */}
            {template && assigned.length > 0 && !frame.saved && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-[84%] px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#3b82f6] whitespace-nowrap"
              >
                ✓ Apply Layout <span className="text-white/75">({assigned.length}/{template.zones.length})</span>
              </motion.div>
            )}
            <div className="absolute left-0 right-0 top-[93%] text-center text-[10px] text-white/40">
              Press ESC to cancel • Enter to apply
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor view */}
      <AnimatePresence>
        {frame.view === "editor" && (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30"
          >
            {/* Toolbar */}
            <div className="absolute left-[4%] right-[4%] top-[6%] h-[12%] flex items-center gap-3 px-3 rounded-xl bg-white/[0.06] border border-white/10">
              <div className="w-[34%] h-[60%] rounded-md bg-white/10 border border-white/15 flex items-center px-2 text-[11px]">
                {frame.name ? <span className="text-white">{frame.name}</span> : <span className="text-white/35">Layout name…</span>}
              </div>
              <span className="text-[11px] text-white/60">
                <span className="font-bold text-white">{frame.zones?.length ?? 0}</span> zone{frame.zones?.length === 1 ? "" : "s"}
              </span>
              <div className="ml-auto flex items-center gap-2 text-[11px]">
                <span className="hidden sm:inline px-2.5 py-1 rounded-md bg-white/10 text-white/70">Cancel</span>
                <span className="px-2.5 py-1 rounded-md bg-[#3b82f6] text-white font-semibold">✓ Save Layout</span>
              </div>
            </div>

            {/* Editing area */}
            <div
              className="absolute rounded-md border border-[#60a5fa]/40"
              style={{ left: `${EDITOR.x}%`, top: `${EDITOR.y}%`, width: `${EDITOR.w}%`, height: `${EDITOR.h}%` }}
            />
            {(frame.zones ?? []).map((z, i) => {
              const r = inEditor(z);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute"
                  style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%`, padding: 3 }}
                >
                  <div
                    className="relative w-full h-full rounded-lg"
                    style={{ background: `${ZONE_COLORS[i]}25`, border: `2px solid ${ZONE_COLORS[i]}` }}
                  >
                    <span
                      className="absolute left-2 top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                      style={{ background: ZONE_COLORS[i] }}
                    >
                      {i + 1}
                    </span>
                  </div>
                </motion.div>
              );
            })}
            <AnimatePresence>
              {frame.creator && (
                <motion.div
                  key="creator"
                  className="absolute"
                  initial={(() => {
                    const r = inEditor(frame.creator);
                    return { opacity: 0, left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` };
                  })()}
                  animate={(() => {
                    const r = inEditor(frame.creator);
                    return { opacity: 1, left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` };
                  })()}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  style={{ padding: 3 }}
                >
                  <div className="relative w-full h-full rounded-xl border-2 border-[#60a5fa] bg-[#3b82f6]/15 shadow-[0_0_24px_rgba(96,165,250,0.35)]">
                    {[
                      "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
                      "right-0 top-0 translate-x-1/2 -translate-y-1/2",
                      "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
                      "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
                    ].map((pos) => (
                      <span key={pos} className={`absolute ${pos} w-2.5 h-2.5 rotate-45 bg-white border border-[#3b82f6]`} />
                    ))}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#2563eb] border-2 border-white/50 flex items-center justify-center shadow-lg">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <span className="absolute left-1/2 -translate-x-1/2 top-[calc(50%+26px)] px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white/80 whitespace-nowrap">
                      {Math.round((frame.creator.w / 100) * 1728)} × {Math.round((frame.creator.h / 100) * 1080)}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute left-0 right-0 top-[91%] text-center text-[10px] text-white/45">
              Drag handles to resize • Click + to add zone • Double-click to delete
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        initial={false}
        animate={{ left: `${cx}%`, top: `${cy}%` }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence>
          {frame.press && (
            <motion.div
              key={frameKey}
              className="absolute -left-3.5 -top-3.5 w-7 h-7 rounded-full"
              style={{ border: `2px solid ${ACCENT}` }}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
        <svg width="18" height="22" viewBox="0 0 18 22" className="-ml-[3px] -mt-[3px] drop-shadow-lg">
          <path d="M1 1L1 17L5.5 12.5L8.5 20L11.5 18.8L8.5 11.5L15 11.5Z" fill="white" stroke="black" strokeWidth="1.2" />
        </svg>
      </motion.div>
    </div>
  );
}

function Layouts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [scene, setScene] = useState(0);
  const [frame, setFrame] = useState(0);
  const [pinned, setPinned] = useState(false);

  const current = LAYOUT_SCENES[scene];
  const step = current.frames[frame];

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      if (frame + 1 < current.frames.length) {
        setFrame(frame + 1);
      } else {
        setFrame(0);
        if (!pinned) setScene((s) => (s + 1) % LAYOUT_SCENES.length);
      }
    }, step.ms);
    return () => clearTimeout(timer);
  }, [isInView, frame, scene, pinned, current.frames.length, step.ms]);

  const highlights = [
    { icon: LayoutGrid, title: "14 built-in layouts", text: "Halves, thirds, quarters, 1 + 2, center focus and more, ready to go." },
    { icon: MousePointerClick, title: "Click to assign", text: "Choose exactly which window goes where, in the order you click them." },
    { icon: Grid3X3, title: "Draw your own", text: "Place, move and resize zones right on your screen, with the exact size shown." },
    { icon: Undo2, title: "Save what you have", text: "Already arranged your windows by hand? Save Layout Snapshot in the Rapto menu turns it into a layout." },
    { icon: Keyboard, title: "One key per layout", text: "Give any layout its own shortcut in Settings → Shortcuts → Template Shortcuts." },
    { icon: Layers, title: "Yours to keep", text: "Right-click a custom layout in the picker to rename or delete it." },
  ];

  return (
    <section id="layouts" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-14">
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
            className="font-display text-4xl md:text-5xl font-bold mb-6"
          >
            Any layout, <span style={{ color: ACCENT }}>in seconds</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            Open the overlay, pick a layout and click your windows into it. Or draw a layout of your own, right on your screen
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {LAYOUT_SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setScene(i);
                setFrame(0);
                setPinned(true);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                scene === i
                  ? "text-[var(--background)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--card-border)]"
              }`}
              style={{ backgroundColor: scene === i ? ACCENT : undefined }}
            >
              {s.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <OverlayDemo frame={step} frameKey={`${scene}-${frame}`} />
          <div className="h-14 mt-5 flex items-start justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={step.caption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-center text-[var(--foreground-muted)] max-w-xl"
              >
                {step.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {highlights.map((h, i) => (
            <FeatureCard key={h.title} icon={h.icon} title={h.title} description={h.text} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// WORKSPACES SECTION
// ============================================
type WsWindow = { icon: SwitcherApp; title: string; frame: [number, number, number, number] };

type WsFrame = {
  desks: SwitcherApp[][];
  active: number;
  windows: WsWindow[];
  cursor: string;
  menu?: boolean;
  hl?: string;
  hl2?: string;
  dialog?: { title: string; text: string; field?: string; buttons: string[] };
  press?: boolean;
  note?: string;
  caption: string;
  ms: number;
};

const WS_TINT: Record<SwitcherApp, string> = {
  vscode: "#2F9AF2",
  terminal: "#A855F7",
  safari: "#00FFE5",
  tradingview: ACCENT,
  telegram: "#2AABEE",
  notes: "#FFB800",
};

const WS_WORK: WsWindow[] = [
  { icon: "vscode", title: "main.swift", frame: [0, 0, 58, 100] },
  { icon: "terminal", title: "~/projects", frame: [58, 0, 42, 50] },
  { icon: "safari", title: "GitHub", frame: [58, 50, 42, 50] },
];

const WS_TRADING: WsWindow[] = [
  { icon: "tradingview", title: "BTCUSD", frame: [0, 0, 66, 100] },
  { icon: "safari", title: "Calendar", frame: [66, 0, 34, 55] },
  { icon: "terminal", title: "bot.py", frame: [66, 55, 34, 45] },
];

const WS_BUSY: WsWindow[] = [
  { icon: "telegram", title: "Family", frame: [0, 0, 50, 100] },
  { icon: "notes", title: "Shopping list", frame: [50, 0, 50, 100] },
];

const wsIcons = (windows: WsWindow[]) => windows.map((w) => w.icon);

// Right-click → Workspaces → pick an item, shared by every scene
const wsPick = (base: Omit<WsFrame, "cursor" | "caption" | "ms">, desk: number, item: string, caption: string): WsFrame[] => [
  { ...base, cursor: `d-${desk}`, caption, ms: 700 },
  { ...base, cursor: "m-Workspaces", menu: true, caption, ms: 750 },
  { ...base, cursor: `m-${item}`, menu: true, hl: item, caption, ms: 750 },
  { ...base, cursor: `m-${item}`, menu: true, hl: item, press: true, caption, ms: 250 },
];

const WS_SCENES: Array<{ id: string; label: string; frames: WsFrame[] }> = (() => {
  const save = { desks: [wsIcons(WS_WORK), ["telegram" as SwitcherApp]], active: 1, windows: WS_WORK };
  const saveDialog = (field: string) => ({
    title: "Save as Workspace",
    text: "Saves the apps on this desktop and where they are",
    field,
    buttons: ["Save", "Cancel"],
  });

  const open = { desks: [["telegram" as SwitcherApp], []], active: 2, windows: [] };
  const opened = { desks: [["telegram" as SwitcherApp], wsIcons(WS_WORK)], active: 2, windows: WS_WORK };

  const busy = { desks: [wsIcons(WS_BUSY)], active: 1, windows: WS_BUSY };
  const newDialog = {
    title: "This Desktop Has Other Windows",
    text: "Open “Trading” in a new desktop to keep it separate, or open it here next to them",
    buttons: ["Open in New Desktop", "Open Here", "Cancel"],
  };

  const closeDialog = {
    title: "Close “Work”?",
    text: "Closes 3 windows: VS Code, Terminal, Safari.",
    buttons: ["Close", "Cancel"],
  };
  const cleared = { desks: [["telegram" as SwitcherApp], []], active: 2, windows: [] };

  const laptop = { desks: [[]], active: 1, windows: [], note: "Built-in Display only" };
  const missingDialog = {
    title: "A Display Is Not Connected",
    text: "“Work” also uses LG UltraFine, with Safari. Open these apps on “Built-in Display”, or open the workspace without them",
    buttons: ["Open on This Display", "Open Without Them", "Cancel"],
  };

  return [
    {
      id: "save",
      label: "Save",
      frames: [
        { ...save, cursor: "rest", caption: "Arrange the apps for one task the way you like", ms: 1600 },
        ...wsPick(save, 1, "Save as Workspace…", "Right-click its desktop in the bar → Workspaces → Save as Workspace…"),
        { ...save, cursor: "field", dialog: saveDialog("W"), caption: "Give it a name", ms: 350 },
        { ...save, cursor: "field", dialog: saveDialog("Wor"), caption: "Give it a name", ms: 300 },
        { ...save, cursor: "field", dialog: saveDialog("Work"), caption: "Give it a name", ms: 800 },
        { ...save, cursor: "b-0", dialog: saveDialog("Work"), caption: "Give it a name", ms: 700 },
        { ...save, cursor: "b-0", dialog: saveDialog("Work"), press: true, caption: "Give it a name", ms: 250 },
        { ...save, cursor: "rest", caption: "Saved. “Work” is now in the menu of every desktop", ms: 2200 },
      ],
    },
    {
      id: "open",
      label: "Open",
      frames: [
        { ...open, cursor: "rest", caption: "Go to a free desktop. The apps don’t even need to be running", ms: 1700 },
        ...wsPick(open, 2, "Work", "Right-click it and pick the workspace"),
        { ...opened, cursor: "rest", caption: "Closed apps start up, and every window goes into its place", ms: 2600 },
      ],
    },
    {
      id: "new",
      label: "New Desktop",
      frames: [
        { ...busy, cursor: "rest", caption: "This desktop is already busy with something else", ms: 1600 },
        ...wsPick(busy, 1, "Trading", "Open a workspace from its menu"),
        { ...busy, cursor: "rest", dialog: newDialog, caption: "Rapto asks before mixing two tasks", ms: 1800 },
        { ...busy, cursor: "b-0", dialog: newDialog, caption: "Rapto asks before mixing two tasks", ms: 700 },
        { ...busy, cursor: "b-0", dialog: newDialog, press: true, caption: "Rapto asks before mixing two tasks", ms: 250 },
        { desks: [wsIcons(WS_BUSY), []], active: 2, windows: [], cursor: "rest", caption: "A new desktop is added…", ms: 800 },
        {
          desks: [wsIcons(WS_BUSY), wsIcons(WS_TRADING)],
          active: 2,
          windows: WS_TRADING,
          cursor: "rest",
          caption: "…and the workspace opens there. The busy desktop stays as it was",
          ms: 2600,
        },
      ],
    },
    {
      id: "close",
      label: "Close",
      frames: [
        { ...opened, cursor: "rest", caption: "Done with this task?", ms: 1300 },
        { ...opened, cursor: "d-2", caption: "Workspaces → Close Workspace", ms: 700 },
        { ...opened, cursor: "m-Workspaces", menu: true, caption: "Workspaces → Close Workspace", ms: 750 },
        { ...opened, cursor: "m-Close Workspace", menu: true, hl: "Close Workspace", caption: "Workspaces → Close Workspace", ms: 750 },
        { ...opened, cursor: "s-Work", menu: true, hl: "Close Workspace", hl2: "Work", caption: "Workspaces → Close Workspace", ms: 700 },
        { ...opened, cursor: "s-Work", menu: true, hl: "Close Workspace", hl2: "Work", press: true, caption: "Workspaces → Close Workspace", ms: 250 },
        { ...opened, cursor: "rest", dialog: closeDialog, caption: "All its windows close at once, even on another desktop", ms: 1800 },
        { ...opened, cursor: "b-0", dialog: closeDialog, caption: "All its windows close at once, even on another desktop", ms: 700 },
        { ...opened, cursor: "b-0", dialog: closeDialog, press: true, caption: "All its windows close at once, even on another desktop", ms: 250 },
        { ...cleared, cursor: "rest", caption: "The desktop is free for the next task", ms: 1400 },
        ...wsPick(cleared, 2, "Trading", "Open the next one in its place"),
        {
          desks: [["telegram"], wsIcons(WS_TRADING)],
          active: 2,
          windows: WS_TRADING,
          cursor: "rest",
          caption: "Open the next one in its place",
          ms: 2400,
        },
      ],
    },
    {
      id: "display",
      label: "Missing display",
      frames: [
        { ...laptop, cursor: "rest", caption: "“Work” was saved at the office, with a second display", ms: 1800 },
        ...wsPick(laptop, 1, "Work", "Now open it on the laptop alone"),
        { ...laptop, cursor: "rest", dialog: missingDialog, caption: "Rapto tells you what’s missing and lets you choose", ms: 2200 },
        { ...laptop, cursor: "b-0", dialog: missingDialog, caption: "Rapto tells you what’s missing and lets you choose", ms: 700 },
        { ...laptop, cursor: "b-0", dialog: missingDialog, press: true, caption: "Rapto tells you what’s missing and lets you choose", ms: 250 },
        {
          ...laptop,
          desks: [wsIcons(WS_WORK)],
          windows: WS_WORK,
          cursor: "rest",
          caption: "Everything opens on the display you have",
          ms: 2400,
        },
      ],
    },
  ];
})();

const WS_ROOT_MENU = [
  { label: "Manual", check: true },
  { label: "Auto Tiling" },
  { label: "Drag to Snap" },
  { sep: true },
  { label: "Layout", value: "›" },
  { label: "Workspaces", value: "›" },
  { sep: true },
  { label: "Settings…" },
];

const WS_SUB_MENU = [
  { label: "Save as Workspace…" },
  { sep: true },
  { label: "Work" },
  { label: "Trading" },
  { label: "Open in New Desktop", value: "›" },
  { label: "Close Workspace", value: "›" },
  { sep: true },
  { label: "Rename Workspace", value: "›" },
  { label: "Delete Workspace", value: "›" },
];

function WorkspacesDemo({ frame, frameKey }: { frame: WsFrame; frameKey: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targets = useRef<Record<string, HTMLElement | null>>({});
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [menuAt, setMenuAt] = useState({ x: 0, y: 0 });
  const register = (key: string) => (el: HTMLElement | null) => {
    targets.current[key] = el;
  };

  useEffect(() => {
    const measure = () => {
      const box = containerRef.current?.getBoundingClientRect();
      if (!box) return;
      const desk = targets.current[`d-${frame.active}`];
      if (desk) {
        const r = desk.getBoundingClientRect();
        // Room for the menu and both submenus to the right
        setMenuAt({ x: Math.max(8, Math.min(r.left - box.left, box.width - 500)), y: r.bottom - box.top + 6 });
      }
      const el = targets.current[frame.cursor];
      if (!el || frame.cursor === "rest") {
        setCursor({ x: box.width * 0.9, y: box.height * 0.9 });
        return;
      }
      const r = el.getBoundingClientRect();
      setCursor({ x: r.left - box.left + Math.min(r.width / 2, 40), y: r.top - box.top + r.height / 2 + 2 });
    };
    const frameID = requestAnimationFrame(measure);
    const late = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frameID);
      clearTimeout(late);
      window.removeEventListener("resize", measure);
    };
  }, [frame.cursor, frame.active, frame.menu, frame.hl, frameKey]);

  const menuItem = (
    item: { label?: string; value?: string; check?: boolean; sep?: boolean },
    i: number,
    prefix: string,
    highlighted?: string
  ) =>
    item.sep ? (
      <div key={i} className="my-1 h-px bg-white/10" />
    ) : (
      <div
        key={i}
        ref={register(`${prefix}-${item.label}`)}
        className="flex items-center justify-between px-2.5 py-[3px] mx-1 rounded"
        style={item.label === highlighted ? { background: "#3b82f6" } : undefined}
      >
        <span className="flex items-center gap-1">
          {prefix === "r" && <span className="w-3 text-[9px]">{item.check ? "✓" : ""}</span>}
          {item.label}
        </span>
        {item.value && <span className="text-white/50">{item.value}</span>}
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[760px] h-[380px] sm:h-[440px] rounded-2xl overflow-hidden demo-window select-none"
      style={{ background: "linear-gradient(180deg, #15151a 0%, #0a0a0c 100%)" }}
    >
      {/* Menu bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-4 text-[12px] text-white/70 bg-white/[0.04] border-b border-white/[0.05] backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white/90">Finder</span>
          <span className="hidden sm:inline">File</span>
          <span className="hidden sm:inline">Edit</span>
          <span className="hidden md:inline">View</span>
        </div>
        <div className="flex items-center gap-3">
          <Wifi className="hidden sm:block w-3.5 h-3.5" />
          <BatteryFull className="hidden sm:block w-4 h-4" />
          <span className="font-mono">Mon 09:41</span>
        </div>
      </div>

      {/* Desktops bar */}
      <div
        className="absolute left-1/2 top-[5px] z-20 flex items-center gap-1 px-1 py-[3px] rounded-full bg-[#232329]/90 border border-white/[0.12] backdrop-blur-xl shadow-lg"
        style={{ transform: "translateX(-50%)" }}
      >
        {frame.desks.map((apps, i) => {
          const id = i + 1;
          const isActive = id === frame.active;
          return (
            <motion.div
              key={id}
              ref={register(`d-${id}`)}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="flex items-center gap-1.5 h-6 px-2 rounded-full"
              style={{ background: isActive ? "rgba(255,255,255,0.14)" : "transparent" }}
            >
              <span className={`text-[13px] font-mono font-semibold ${isActive ? "text-white" : "text-white/50"}`}>{id}</span>
              <AnimatePresence mode="popLayout">
                {apps.map((app) => (
                  <motion.span
                    key={app}
                    layout
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    className="flex"
                  >
                    <SwitcherAppIcon app={app} size={13} />
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          );
        })}
        <div className="w-5 h-5 mx-0.5 rounded-full border border-white/45 text-white/70 flex items-center justify-center text-[13px] leading-none">
          +
        </div>
      </div>

      {/* Windows of the active desktop */}
      <div className="absolute inset-x-4 bottom-4 top-14">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={frame.active}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <AnimatePresence>
              {frame.windows.map((win, i) => {
                const [x, y, w, h] = win.frame;
                return (
                  <motion.div
                    key={`${win.icon}-${win.title}`}
                    className="absolute p-1"
                    style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
                    initial={{ opacity: 0, scale: 0.6, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 24, delay: 0.1 + i * 0.18 } }}
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2, delay: i * 0.06 } }}
                  >
                    <div className="relative w-full h-full">
                      <MiniWindow color={WS_TINT[win.icon]} className="w-full h-full" />
                      <div className="absolute inset-0 top-3 flex flex-col items-center justify-center gap-2">
                        <SwitcherAppIcon app={win.icon} size={30} />
                        <span className="text-xs font-mono" style={{ color: WS_TINT[win.icon] }}>
                          {win.title}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {frame.windows.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/30 font-mono">Empty desktop</div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/40">Desktop {frame.active}</div>
        {frame.note && (
          <div className="absolute bottom-2 right-3 flex items-center gap-1.5 text-[10px] font-mono text-white/40">
            <Laptop className="w-3 h-3" />
            {frame.note}
          </div>
        )}
      </div>

      {/* Context menu with the Workspaces submenu */}
      <AnimatePresence>
        {frame.menu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute z-40 flex items-start text-[11px] text-white/90 origin-top-left"
            style={{ left: menuAt.x, top: menuAt.y }}
          >
            <div className="w-40 py-1 rounded-lg bg-[#2a2a30]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
              {WS_ROOT_MENU.map((item, i) => menuItem(item, i, "r", "Workspaces"))}
            </div>
            <div className="w-48 py-1 -ml-1 mt-[99px] rounded-lg bg-[#2a2a30]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
              {WS_SUB_MENU.map((item, i) => menuItem(item, i, "m", frame.hl))}
            </div>
            {frame.hl === "Close Workspace" && (
              <div className="w-28 py-1 -ml-1 mt-[198px] rounded-lg bg-[#2a2a30]/95 border border-white/10 shadow-2xl backdrop-blur-xl">
                {menuItem({ label: "Work" }, 0, "s", frame.hl2)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert */}
      <AnimatePresence>
        {frame.dialog && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-[260px] p-4 rounded-2xl bg-[#2a2a30]/95 border border-white/10 shadow-2xl backdrop-blur-xl text-center"
            >
              <Image src="/app-icon.png" alt="" width={40} height={40} className="mx-auto mb-2" />
              <p className="text-[13px] font-semibold text-white mb-1">{frame.dialog.title}</p>
              <p className="text-[11px] leading-snug text-white/60 mb-3">{frame.dialog.text}</p>
              {frame.dialog.field !== undefined && (
                <div
                  ref={register("field")}
                  className="mb-3 h-7 px-2 flex items-center rounded-md bg-black/30 border text-left text-[12px] text-white"
                  style={{ borderColor: "#3b82f6" }}
                >
                  {frame.dialog.field}
                  <span className="ml-px w-px h-3.5 bg-white animate-pulse" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                {frame.dialog.buttons.map((label, i) => (
                  <div
                    key={label}
                    ref={register(`b-${i}`)}
                    className="h-7 rounded-md flex items-center justify-center text-[12px] font-medium"
                    style={i === 0 ? { background: "#3b82f6", color: "white" } : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cursor */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        animate={{ left: cursor.x - 3, top: cursor.y - 3 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence>
          {frame.press && (
            <motion.div
              key={frameKey}
              className="absolute -left-3 -top-3 w-7 h-7 rounded-full"
              style={{ border: `2px solid ${ACCENT}` }}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
        <svg width="18" height="22" viewBox="0 0 18 22" className="drop-shadow-lg">
          <path d="M1 1L1 17L5.5 12.5L8.5 20L11.5 18.8L8.5 11.5L15 11.5Z" fill="white" stroke="black" strokeWidth="1.2" />
        </svg>
      </motion.div>
    </div>
  );
}

function Workspaces() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [scene, setScene] = useState(0);
  const [frame, setFrame] = useState(0);
  const [pinned, setPinned] = useState(false);

  const current = WS_SCENES[scene];
  const step = current.frames[frame];

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      if (frame + 1 < current.frames.length) {
        setFrame(frame + 1);
      } else {
        setFrame(0);
        if (!pinned) setScene((s) => (s + 1) % WS_SCENES.length);
      }
    }, step.ms);
    return () => clearTimeout(timer);
  }, [isInView, frame, scene, pinned, current.frames.length, step.ms]);

  const highlights = [
    { icon: Briefcase, title: "Save a desktop", text: "Right-click a desktop in the bar and save its apps and where each window goes, under a name you choose." },
    { icon: Zap, title: "Everything comes back", text: "Closed apps start up, minimized windows return, and each one lands in its place. A desktop in a layout keeps that layout." },
    { icon: Plus, title: "Here or in a new desktop", text: "Open in New Desktop gives a workspace a desktop of its own. On a busy desktop Rapto asks first." },
    { icon: X, title: "Close in one click", text: "Close Workspace closes all of its windows at once, even on another desktop. Unsaved work asks to be saved first." },
    { icon: Monitor, title: "Every display", text: "A workspace remembers each display. If one isn’t connected, you choose where its apps go." },
    { icon: Layers, title: "Easy to manage", text: "Rename, delete or open workspaces in Settings → Workspaces, the Rapto menu or the desktops bar." },
  ];

  return (
    <section id="workspaces" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 radial-glow" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div ref={ref} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-3 mb-4"
          >
            <MeasurementLine width={60} />
            <span className="tag">
              <Sparkles className="w-4 h-4" />
              New in 5.55
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 }}
            className="flex items-center justify-center gap-2 font-display text-xl md:text-2xl font-semibold text-[var(--foreground-muted)] mb-3"
          >
            <Briefcase className="w-5 h-5 md:w-6 md:h-6" style={{ color: ACCENT }} />
            Introducing <span className="text-[var(--foreground)]">Workspaces</span>
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold mb-6"
          >
            One task, <span style={{ color: ACCENT }}>one click</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto"
          >
            A workspace saves the apps you use for a task and where each window goes. Bring them all back when you need them, and close them all when you&apos;re done
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {WS_SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setScene(i);
                setFrame(0);
                setPinned(true);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                scene === i
                  ? "text-[var(--background)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--card-border)]"
              }`}
              style={{ backgroundColor: scene === i ? ACCENT : undefined }}
            >
              {s.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <WorkspacesDemo frame={step} frameKey={`${scene}-${frame}`} />
          <div className="h-14 mt-5 flex items-start justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={step.caption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-center text-[var(--foreground-muted)] max-w-xl"
              >
                {step.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {highlights.map((h, i) => (
            <FeatureCard key={h.title} icon={h.icon} title={h.title} description={h.text} index={i} />
          ))}
        </div>

        <p className="text-center text-sm text-[var(--foreground-muted)] mt-8 max-w-2xl mx-auto">
          Apps that already have windows on another desktop stay where they are. Apps open with their usual window: tabs and documents aren&apos;t reopened
        </p>
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
            <MeasurementLine width={60} label="03" />
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
            description="Focus, move, resize and arrange windows without touching your mouse"
            index={1}
          >
            <KeyboardDemo />
          </FeatureCard>

          {/* Window Switcher */}
          <FeatureCard
            icon={Search}
            title="Window Switcher"
            description="Type the first letters of an app or window name and jump to it, on any desktop or display"
            index={2}
          >
            <WindowSwitcherDemo />
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
            description="Stack windows in one slot. Click an icon in the badge to switch, or drag the badge out of the way"
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
      q: "What is the desktops bar?",
      a: "A bar in the middle of the menu bar that lists your desktops and the apps open on each one. Click a number to switch instantly, drag an app icon onto another desktop to move its window there, or drop it on “+” to give it a new desktop. Hold Option when you let go to go along with the window. It works on macOS 26 and later and can be turned off in Settings → General → Menu Bar.",
    },
    {
      q: "How does the desktops bar work on a MacBook with a notch, or with several monitors?",
      a: "On a screen with a notch the bar hides and drops down below the notch when you point at it. Choose Automatic, Always or On Hover in Settings → General → Menu Bar. With several monitors, each display gets its own bar with its own desktops, as long as “Displays have separate Spaces” is on in System Settings → Desktop & Dock.",
    },
    {
      q: "Why did my desktops change their order?",
      a: "macOS does this, not Rapto. By default it moves the desktop you used last next to the one you are on, so the numbers in the desktops bar change too. Each desktop keeps its mode and layout wherever it moves. To keep a fixed order, turn off “Automatically rearrange Spaces based on most recent use” in System Settings → Desktop & Dock → Mission Control.",
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
      a: "Yes. Rapto works entirely on your Mac and never records, saves or uploads your screen. Screen Recording permission only lets it read window titles and positions. Rapto has no servers and no accounts, and it collects no usage data, analytics or crash reports. The only time it goes online is to check for updates: when it starts, once a day, and when you choose “Check for Updates…”. You can turn automatic checks off in Settings.",
    },
    {
      q: "How do updates work?",
      a: "Use “Check for Updates…” from the menu bar. Rapto supports automatic update checks (depending on your build/config).",
    },
    {
      q: "How do I troubleshoot issues?",
      a: "Enable Debug Logging in Settings → About → Troubleshooting, reproduce the issue, then open the log folder and share logs with your report.",
    },
    {
      q: "Is Rapto free?",
      a: "Yes. Download Rapto and use every feature right away. There is no trial, subscription, or license key.",
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
            <MeasurementLine width={60} label="04" />
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

        {/* Free */}
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
              <span className="text-4xl font-bold" style={{ color: ACCENT }}>Free</span>
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">
              No trial, subscription, or license key
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="/download"
            className="btn-primary text-xl animate-pulse-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-6 h-6" />
            Download for Mac
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
          <span>macOS 26+</span>
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
            href="/docs"
            className="text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
            whileHover={{ y: -2 }}
          >
            Docs
          </motion.a>
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
      <DesktopsBar />
      <OperatingModes />
      <Layouts />
      <Workspaces />
      <Features />
      <FAQSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
