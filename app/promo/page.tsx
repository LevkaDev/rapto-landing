"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  LayoutGrid,
  Monitor,
  Keyboard,
  Layers,
  Command,
  ArrowLeftRight,
  Maximize2,
  MousePointerClick,
  Settings,
  Zap,
  Check,
  Sparkles,
  Grid3X3,
  Move,
} from "lucide-react";

// ============================================
// CONSTANTS
// ============================================
const ACCENT = "#BFFF00";
const CYAN = "#00FFE5";
const VIOLET = "#A855F7";
const AMBER = "#FFB800";

const SCENE_DURATION = 8000;
const TOTAL_SCENES = 10;

// ============================================
// FLOATING PARTICLES BACKGROUND
// ============================================
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  xOffset: number;
}

function FloatingParticles() {
  // Generate particles only on client to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    const colors = [ACCENT, CYAN, VIOLET, AMBER];
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * 4)],
      xOffset: Math.random() * 50 - 25,
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, p.xOffset, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// PARALLAX CONTAINER - follows mouse
// ============================================
function ParallaxContainer({ 
  children, 
  intensity = 20,
  className = "" 
}: { 
  children: React.ReactNode; 
  intensity?: number;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const x = useTransform(springX, [-1, 1], [-intensity, intensity]);
  const y = useTransform(springY, [-1, 1], [-intensity, intensity]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set((e.clientX - centerX) / centerX);
      mouseY.set((e.clientY - centerY) / centerY);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

// ============================================
// ANIMATED TEXT - with typewriter effect option
// ============================================
function AnimatedText({ 
  children, 
  delay = 0,
  className = "",
  stagger = false,
}: { 
  children: string; 
  delay?: number;
  className?: string;
  stagger?: boolean;
}) {
  if (stagger) {
    const words = children.split(" ");
    return (
      <span className={className}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.3em]"
            initial={{ opacity: 0, y: 30, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: delay + i * 0.08,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

// ============================================
// BREATHING GLOW EFFECT
// ============================================
function BreathingGlow({ 
  color = ACCENT, 
  size = 600,
  className = ""
}: { 
  color?: string; 
  size?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ============================================
// MINI WINDOW COMPONENT - enhanced
// ============================================
function MiniWindow({
  color = ACCENT,
  title = "",
  className = "",
  style = {},
  children,
  breathing = false,
}: {
  color?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  breathing?: boolean;
}) {
  return (
    <motion.div
      className={`rounded-xl overflow-hidden backdrop-blur-sm ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
        border: `1px solid ${color}40`,
        boxShadow: `0 20px 60px ${color}15, inset 0 1px 0 ${color}20`,
        ...style,
      }}
      animate={breathing ? {
        boxShadow: [
          `0 20px 60px ${color}15, inset 0 1px 0 ${color}20`,
          `0 25px 80px ${color}25, inset 0 1px 0 ${color}30`,
          `0 20px 60px ${color}15, inset 0 1px 0 ${color}20`,
        ],
      } : undefined}
      transition={breathing ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      {/* Title bar */}
      <div
        className="h-8 flex items-center gap-2 px-3"
        style={{ background: `${color}25` }}
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        {title && (
          <span className="ml-2 text-base text-white/70 font-medium">{title}</span>
        )}
      </div>
      {/* Content */}
      <div className="p-4">{children}</div>
    </motion.div>
  );
}

// ============================================
// SCENE 1: LOGO REVEAL + INTRO
// ============================================
function Scene1_LogoReveal({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Multiple breathing glows */}
      <BreathingGlow color={ACCENT} size={800} className="-translate-x-20" />
      <BreathingGlow color={CYAN} size={500} className="translate-x-40 translate-y-20" />
      
      <ParallaxContainer intensity={30}>
        {/* Logo with spin and scale */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={isActive ? { scale: 1, rotate: 0, opacity: 1 } : {}}
          transition={{ type: "spring", duration: 1.2, delay: 0.2 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/app-icon.png"
              alt="Rapto"
              width={200}
              height={200}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </ParallaxContainer>

      {/* App name - HUGE */}
      <motion.h1
        className="text-[12rem] font-extrabold mt-6 tracking-tight"
        style={{ 
          color: ACCENT,
          textShadow: `0 0 80px ${ACCENT}50`,
        }}
        initial={{ opacity: 0, y: 60, scale: 0.8 }}
        animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Rapto
      </motion.h1>

      {/* Tagline - large and readable */}
      <motion.p
        className="text-5xl text-white/80 mt-4 text-center font-light tracking-wide"
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
      >
        The Ultimate Window Manager for macOS
      </motion.p>

      {/* Features preview - bigger icons */}
      <motion.div
        className="flex gap-16 mt-16"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        {[
          { icon: LayoutGrid, label: "Auto Tiling", color: ACCENT },
          { icon: Keyboard, label: "50+ Shortcuts", color: CYAN },
          { icon: Monitor, label: "Multi-Monitor", color: VIOLET },
          { icon: Layers, label: "Window Groups", color: AMBER },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.8 + i * 0.12 }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${item.color}20` }}
              whileHover={{ scale: 1.1, background: `${item.color}30` }}
              animate={{ y: [0, -5, 0] }}
              transition={{ 
                y: { duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <item.icon className="w-8 h-8" style={{ color: item.color }} />
            </motion.div>
            <span className="text-xl text-white/60">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Platform badge */}
      <motion.div
        className="absolute bottom-24 flex items-center gap-8 text-2xl text-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.5 }}
      >
        <span>🍎 Native macOS</span>
        <span className="w-2 h-2 rounded-full bg-white/30" />
        <span>⚡ Built with Swift</span>
        <span className="w-2 h-2 rounded-full bg-white/30" />
        <span>🚀 Lightweight</span>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// SCENE 2: THE PROBLEM
// ============================================
function Scene2_Problem({ isActive }: { isActive: boolean }) {
  const chaosPositions = [
    { x: 50, y: 60, w: 300, h: 220, r: -8 },
    { x: 280, y: 140, w: 350, h: 260, r: 5 },
    { x: 150, y: 320, w: 280, h: 200, r: -4 },
    { x: 500, y: 80, w: 320, h: 240, r: 7 },
    { x: 420, y: 350, w: 260, h: 180, r: -6 },
  ];

  const colors = [ACCENT, CYAN, VIOLET, AMBER, "#FF6B6B"];
  const titles = ["Browser", "Code Editor", "Terminal", "Notes", "Slack"];

  return (
    <motion.div
      className="absolute inset-0 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color="#FF6B6B" size={600} className="-left-40 top-1/3" />
      
      {/* Left side - Text */}
      <div className="w-1/2 flex flex-col justify-center pl-24 pr-12">
        <motion.h2 
          className="text-7xl font-bold text-white mb-10 leading-tight"
          initial={{ opacity: 0, x: -50 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Sound{" "}
          <span className="text-red-400">Familiar</span>?
        </motion.h2>
        
        <div className="space-y-6">
          {[
            { text: "You open your Mac, ready to work...", delay: 0.6 },
            { text: <>But your windows are <span className="text-red-400 font-semibold">scattered everywhere</span>.</>, delay: 0.9 },
            { text: <>You spend <span className="text-red-400 font-semibold">precious minutes</span> resizing.</>, delay: 1.2 },
            { text: "Every. Single. Day.", delay: 1.5 },
          ].map((item, i) => (
            <motion.p
              key={i}
              className="text-3xl text-white/70 leading-relaxed"
              initial={{ opacity: 0, x: -30 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: item.delay }}
            >
              {item.text}
            </motion.p>
          ))}
        </div>

        <motion.div
          className="mt-12 p-6 rounded-2xl border-2 border-red-500/30 bg-red-500/5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2.2, type: "spring" }}
        >
          <p className="text-red-400 font-semibold text-2xl">
            ⏱️ ~10% of work time lost to window management
          </p>
          <p className="text-red-400/70 text-xl mt-2">
            Microsoft Research Study
          </p>
        </motion.div>
      </div>

      {/* Right side - Chaotic windows with subtle movement */}
      <div className="w-1/2 flex items-center justify-center">
        <ParallaxContainer intensity={15}>
          <div className="relative w-[800px] h-[600px]">
            {chaosPositions.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: pos.w,
                  height: pos.h,
                }}
                initial={{ opacity: 0, scale: 0.5, rotate: pos.r * 2 }}
                animate={isActive ? { 
                  opacity: 1, 
                  scale: 1, 
                  rotate: pos.r,
                  y: [0, -5, 0],
                } : {}}
                transition={{ 
                  delay: 0.4 + i * 0.15, 
                  type: "spring",
                  y: { duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }
                }}
              >
                <MiniWindow color={colors[i]} title={titles[i]} className="w-full h-full" breathing />
              </motion.div>
            ))}
          </div>
        </ParallaxContainer>
      </div>
    </motion.div>
  );
}

// ============================================
// SCENE 3: THE SOLUTION
// ============================================
function Scene3_Solution({ isActive }: { isActive: boolean }) {
  const [isOrdered, setIsOrdered] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsOrdered(false);
      const timer = setTimeout(() => setIsOrdered(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const chaosPositions = [
    { x: 50, y: 50, w: 280, h: 200, r: -8 },
    { x: 260, y: 100, w: 320, h: 240, r: 5 },
    { x: 160, y: 270, w: 260, h: 180, r: -3 },
    { x: 440, y: 70, w: 280, h: 200, r: 7 },
    { x: 370, y: 290, w: 240, h: 160, r: -5 },
  ];

  const orderedPositions = [
    { x: 30, y: 28, w: 340, h: 195, r: 0 },
    { x: 380, y: 28, w: 340, h: 195, r: 0 },
    { x: 30, y: 233, w: 220, h: 185, r: 0 },
    { x: 260, y: 233, w: 230, h: 185, r: 0 },
    { x: 500, y: 233, w: 220, h: 185, r: 0 },
  ];

  const colors = [ACCENT, CYAN, VIOLET, AMBER, "#FF6B6B"];
  const titles = ["Browser", "Code Editor", "Terminal", "Notes", "Slack"];

  return (
    <motion.div
      className="absolute inset-0 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color={ACCENT} size={700} className="-right-40 top-1/4" />
      
      {/* Left side - Demo */}
      <div className="w-1/2 flex items-center justify-center">
        <ParallaxContainer intensity={10}>
          <div className="relative w-[750px] h-[450px] rounded-3xl bg-[#151518] border border-white/10 overflow-hidden shadow-2xl">
            {/* Menu bar */}
            <div className="h-8 bg-[#252528] flex items-center px-4 gap-2">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-base text-white/50 ml-4">Desktop 1</span>
            </div>

            {/* Windows */}
            <div className="relative w-full h-[calc(100%-32px)]">
              {chaosPositions.map((pos, i) => {
                const ordered = orderedPositions[i];
                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                      left: pos.x,
                      top: pos.y,
                      width: pos.w,
                      height: pos.h,
                      rotate: pos.r,
                    }}
                    animate={{
                      left: isOrdered ? ordered.x : pos.x,
                      top: isOrdered ? ordered.y : pos.y,
                      width: isOrdered ? ordered.w : pos.w,
                      height: isOrdered ? ordered.h : pos.h,
                      rotate: isOrdered ? ordered.r : pos.r,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 20,
                      delay: isOrdered ? i * 0.1 : 0,
                    }}
                  >
                    <MiniWindow color={colors[i]} title={titles[i]} className="w-full h-full" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ParallaxContainer>
      </div>

      {/* Right side - Text */}
      <div className="w-1/2 flex flex-col justify-center pl-12 pr-24">
        <motion.h2 
          className="text-7xl font-bold text-white mb-8 leading-tight"
          initial={{ opacity: 0, x: 50 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Meet{" "}
          <span style={{ color: ACCENT }}>Rapto</span>
        </motion.h2>

        <motion.p
          className="text-3xl text-white/70 mb-10"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          One keyboard shortcut. Instant organization.
        </motion.p>

        <div className="space-y-5">
          {[
            "Windows snap to a perfect grid automatically",
            "15+ predefined layouts ready to use",
            "Create your own custom layouts",
            "Works on any Space or monitor",
          ].map((text, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 30 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.0 + i * 0.2 }}
            >
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `${ACCENT}25` }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <Check className="w-5 h-5" style={{ color: ACCENT }} />
              </motion.div>
              <span className="text-2xl text-white/80">{text}</span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isOrdered && (
            <motion.div
              className="mt-12 px-8 py-5 rounded-2xl flex items-center gap-5"
              style={{ background: `${ACCENT}15`, border: `2px solid ${ACCENT}40` }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring" }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-8 h-8" style={{ color: ACCENT }} />
              </motion.div>
              <span style={{ color: ACCENT }} className="text-2xl font-semibold">
                Perfectly organized in milliseconds!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================
// SCENE 4: THREE OPERATING MODES
// ============================================
function Scene4_Modes({ isActive }: { isActive: boolean }) {
  const [activeMode, setActiveMode] = useState(0);

  useEffect(() => {
    if (isActive) {
      setActiveMode(0);
      const timer1 = setTimeout(() => setActiveMode(1), 2500);
      const timer2 = setTimeout(() => setActiveMode(2), 5000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isActive]);

  const modes = [
    {
      title: "Auto Tiling",
      icon: LayoutGrid,
      color: ACCENT,
      description: "Windows arrange themselves automatically",
      features: [
        "Set tiling depth (2-8 windows)",
        "Smart reflow on close",
        "Zero manual effort",
      ],
    },
    {
      title: "Manual Mode",
      icon: Grid3X3,
      color: CYAN,
      description: "Full control with visual zone picker",
      features: [
        "Pick exact window positions",
        "Auto window grouping",
        "One-click layouts",
      ],
    },
    {
      title: "Drag to Snap",
      icon: Move,
      color: VIOLET,
      description: "Classic drag-to-edge snapping",
      features: [
        "Drag to edges to snap",
        "Visual preview zones",
        "Works with other modes",
      ],
    },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color={modes[activeMode].color} size={800} />
      
      <motion.h2 
        className="text-7xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
      >
        Three Powerful{" "}
        <span style={{ color: ACCENT }}>Modes</span>
      </motion.h2>

      <motion.p
        className="text-2xl text-white/50 mb-16 text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        Choose your workflow • Set independently per monitor
      </motion.p>

      <div className="flex gap-10 w-full max-w-6xl">
        {modes.map((mode, i) => (
          <motion.div
            key={i}
            className="flex-1 p-10 rounded-3xl transition-all duration-500"
            style={{
              background: activeMode === i ? `${mode.color}12` : "rgba(255,255,255,0.02)",
              border: `2px solid ${activeMode === i ? mode.color : "rgba(255,255,255,0.06)"}`,
              boxShadow: activeMode === i ? `0 0 80px ${mode.color}20` : "none",
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={isActive ? { 
              opacity: 1, 
              y: 0,
              scale: activeMode === i ? 1.02 : 1,
            } : {}}
            transition={{ delay: 0.8 + i * 0.15 }}
          >
            {/* Icon */}
            <motion.div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
              style={{ background: `${mode.color}20` }}
              animate={{ 
                scale: activeMode === i ? [1, 1.1, 1] : 1,
                rotate: activeMode === i ? [0, 5, -5, 0] : 0,
              }}
              transition={{ duration: 0.6 }}
            >
              <mode.icon className="w-10 h-10" style={{ color: mode.color }} />
            </motion.div>

            {/* Title */}
            <h3
              className="text-3xl font-bold mb-4"
              style={{ color: activeMode === i ? mode.color : "white" }}
            >
              {mode.title}
            </h3>

            {/* Description */}
            <p className="text-xl text-white/60 mb-8">{mode.description}</p>

            {/* Features */}
            <div className="space-y-4">
              {mode.features.map((feature, j) => (
                <motion.div
                  key={j}
                  className="flex items-center gap-3"
                  animate={{ 
                    opacity: activeMode === i ? 1 : 0.4,
                    x: activeMode === i ? 0 : -5,
                  }}
                  transition={{ delay: j * 0.1 }}
                >
                  <Check
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: mode.color }}
                  />
                  <span className="text-lg text-white/70">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mode indicator dots */}
      <motion.div
        className="flex gap-4 mt-14"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        {modes.map((mode, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full"
            style={{
              background: activeMode === i ? mode.color : "rgba(255,255,255,0.15)",
            }}
            animate={{
              scale: activeMode === i ? [1, 1.3, 1] : 1,
              boxShadow: activeMode === i ? `0 0 25px ${mode.color}` : "none",
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ============================================
// SCENE 5: AUTO TILING DEMO
// ============================================
function Scene5_AutoTiling({ isActive }: { isActive: boolean }) {
  const [windowCount, setWindowCount] = useState(0);

  useEffect(() => {
    if (isActive) {
      setWindowCount(0);
      const intervals = [700, 2000, 3300, 4600, 5900];
      const timers = intervals.map((delay, i) =>
        setTimeout(() => setWindowCount(i + 1), delay)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [isActive]);

  const layouts: Record<number, { x: number; y: number; w: number; h: number }[]> = {
    0: [],
    1: [{ x: 15, y: 8, w: 70, h: 84 }],
    2: [
      { x: 2, y: 2, w: 48, h: 96 },
      { x: 52, y: 2, w: 48, h: 96 },
    ],
    3: [
      { x: 2, y: 2, w: 58, h: 96 },
      { x: 62, y: 2, w: 38, h: 48 },
      { x: 62, y: 52, w: 38, h: 48 },
    ],
    4: [
      { x: 2, y: 2, w: 48, h: 48 },
      { x: 52, y: 2, w: 48, h: 48 },
      { x: 2, y: 52, w: 48, h: 48 },
      { x: 52, y: 52, w: 48, h: 48 },
    ],
    5: [
      { x: 22, y: 2, w: 56, h: 96 },
      { x: 2, y: 2, w: 18, h: 48 },
      { x: 2, y: 52, w: 18, h: 48 },
      { x: 80, y: 2, w: 18, h: 48 },
      { x: 80, y: 52, w: 18, h: 48 },
    ],
  };

  const colors = [ACCENT, CYAN, VIOLET, AMBER, "#FF6B6B"];
  const titles = ["Safari", "VS Code", "Terminal", "Slack", "Notes"];
  const currentLayout = layouts[windowCount] || [];

  return (
    <motion.div
      className="absolute inset-0 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color={ACCENT} size={600} className="left-1/4 top-1/3" />
      
      {/* Left side - Demo */}
      <div className="w-3/5 flex items-center justify-center">
        <ParallaxContainer intensity={8}>
          <div className="relative w-[750px] h-[480px] rounded-3xl bg-[#151518] border border-white/10 overflow-hidden shadow-2xl">
            {/* Menu bar */}
            <div className="h-9 bg-[#252528] flex items-center justify-between px-4">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#28C840]" />
              </div>
              <motion.span 
                className="text-xl font-mono font-semibold"
                style={{ color: ACCENT }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
                key={windowCount}
              >
                {windowCount} window{windowCount !== 1 ? "s" : ""}
              </motion.span>
            </div>

            {/* Windows */}
            <div className="relative w-full h-[calc(100%-36px)]">
              {currentLayout.map((pos, i) => (
                <motion.div
                  key={`${windowCount}-${i}`}
                  className="absolute"
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    width: `${pos.w}%`,
                    height: `${pos.h}%`,
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 22,
                    delay: i === windowCount - 1 ? 0.1 : 0,
                  }}
                >
                  <MiniWindow color={colors[i]} title={titles[i]} className="w-full h-full">
                    <div className="text-center text-white/40 text-lg">
                      {titles[i]}
                    </div>
                  </MiniWindow>
                </motion.div>
              ))}
            </div>
          </div>
        </ParallaxContainer>
      </div>

      {/* Right side - Steps */}
      <div className="w-2/5 flex flex-col justify-center pr-20">
        <motion.h2 
          className="text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <span style={{ color: ACCENT }}>Auto Tiling</span>
          <br />in Action
        </motion.h2>

        <motion.p
          className="text-2xl text-white/60 mb-10"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Watch windows arrange as you open them
        </motion.p>

        <div className="space-y-5">
          {[
            { count: 1, text: "First window centers" },
            { count: 2, text: "Split into halves" },
            { count: 3, text: "Main + side panels" },
            { count: 4, text: "Perfect quarters" },
            { count: 5, text: "Center focus layout" },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-5"
              initial={{ opacity: 0.3, x: -20 }}
              animate={{
                opacity: windowCount >= step.count ? 1 : 0.3,
                x: windowCount === step.count ? 15 : 0,
                scale: windowCount === step.count ? 1.05 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{
                  background: windowCount >= step.count ? colors[i] : "rgba(255,255,255,0.08)",
                  color: windowCount >= step.count ? "#000" : "rgba(255,255,255,0.3)",
                }}
                animate={windowCount === step.count ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {step.count}
              </motion.div>
              <span className="text-2xl" style={{
                color: windowCount >= step.count ? "white" : "rgba(255,255,255,0.3)",
              }}>
                {step.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// SCENE 6: KEYBOARD SHORTCUTS
// ============================================
function Scene6_Keyboard({ isActive }: { isActive: boolean }) {
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    if (isActive) {
      setActiveGroup(0);
      const timer1 = setTimeout(() => setActiveGroup(1), 2500);
      const timer2 = setTimeout(() => setActiveGroup(2), 5000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isActive]);

  const shortcutGroups = [
    {
      title: "Positioning",
      shortcuts: [
        { keys: ["⌃", "⌥", "←"], action: "Left Half" },
        { keys: ["⌃", "⌥", "→"], action: "Right Half" },
        { keys: ["⌃", "⌥", "↑"], action: "Top Half" },
        { keys: ["⌃", "⌥", "↓"], action: "Bottom Half" },
      ],
      color: ACCENT,
    },
    {
      title: "Actions",
      shortcuts: [
        { keys: ["⌃", "⌥", "M"], action: "Maximize" },
        { keys: ["⌃", "⌥", "C"], action: "Center" },
        { keys: ["⌃", "⌥", "F"], action: "Focus" },
        { keys: ["⌃", "⌥", "R"], action: "Restore" },
      ],
      color: CYAN,
    },
    {
      title: "Multi-Window",
      shortcuts: [
        { keys: ["⌃", "⇧", "←"], action: "Swap Left" },
        { keys: ["⌃", "⇧", "→"], action: "Swap Right" },
        { keys: ["⌃", "⌥", "G"], action: "Group" },
        { keys: ["⌘", "Tab"], action: "Cycle" },
      ],
      color: VIOLET,
    },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color={shortcutGroups[activeGroup].color} size={700} />
      
      <motion.h2 
        className="text-7xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
        <span style={{ color: ACCENT }}>Keyboard</span> First
      </motion.h2>

      <motion.p
        className="text-2xl text-white/50 mb-14 text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        50+ customizable shortcuts • No mouse required
      </motion.p>

      <div className="flex gap-8 w-full max-w-5xl">
        {shortcutGroups.map((group, gi) => (
          <motion.div
            key={gi}
            className="flex-1 p-8 rounded-2xl"
            style={{
              background: activeGroup === gi ? `${group.color}12` : "rgba(255,255,255,0.02)",
              border: `2px solid ${activeGroup === gi ? group.color : "rgba(255,255,255,0.06)"}`,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 + gi * 0.15 }}
          >
            <h3
              className="text-2xl font-bold mb-8"
              style={{ color: activeGroup === gi ? group.color : "white" }}
            >
              {group.title}
            </h3>

            <div className="space-y-5">
              {group.shortcuts.map((shortcut, si) => (
                <motion.div
                  key={si}
                  className="flex items-center justify-between"
                  animate={{
                    opacity: activeGroup === gi ? 1 : 0.4,
                    x: activeGroup === gi ? 0 : -5,
                  }}
                  transition={{ delay: si * 0.08 }}
                >
                  <div className="flex gap-1.5">
                    {shortcut.keys.map((key, ki) => (
                      <motion.div
                        key={ki}
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-semibold"
                        style={{
                          background: activeGroup === gi ? group.color : "rgba(255,255,255,0.1)",
                          color: activeGroup === gi ? "#000" : "#fff",
                        }}
                        animate={activeGroup === gi ? { y: [0, -3, 0] } : {}}
                        transition={{ delay: si * 0.1 + ki * 0.05, duration: 0.3 }}
                      >
                        {key}
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-xl text-white/60">{shortcut.action}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-xl text-white/30 mt-12"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
      >
        All shortcuts fully customizable in Settings
      </motion.p>
    </motion.div>
  );
}

// ============================================
// SCENE 7: MULTI-MONITOR
// ============================================
function Scene7_MultiMonitor({ isActive }: { isActive: boolean }) {
  const [activeMonitor, setActiveMonitor] = useState(-1);

  useEffect(() => {
    if (isActive) {
      setActiveMonitor(-1);
      const timer0 = setTimeout(() => setActiveMonitor(0), 1000);
      const timer1 = setTimeout(() => setActiveMonitor(1), 2500);
      const timer2 = setTimeout(() => setActiveMonitor(2), 4000);
      return () => {
        clearTimeout(timer0);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isActive]);

  const monitors = [
    { name: "MacBook Pro", layout: "Auto Tiling", mode: "2 windows", color: ACCENT, w: 240, h: 170 },
    { name: "Dell 4K", layout: "Manual Mode", mode: "Thirds", color: CYAN, w: 320, h: 200 },
    { name: "LG Ultrawide", layout: "Drag to Snap", mode: "Quarters", color: VIOLET, w: 420, h: 170 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color={CYAN} size={800} />
      
      <motion.h2 
        className="text-7xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
        <span style={{ color: ACCENT }}>Multi-Monitor</span> Ready
      </motion.h2>

      <motion.p
        className="text-2xl text-white/50 mb-20 text-center max-w-3xl"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        Each monitor gets its own mode, layout, and settings
      </motion.p>

      {/* Monitors */}
      <ParallaxContainer intensity={10}>
        <div className="flex items-end gap-16">
          {monitors.map((monitor, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + i * 0.2 }}
            >
              {/* Monitor frame */}
              <motion.div
                className="rounded-2xl overflow-hidden"
                style={{
                  width: monitor.w,
                  height: monitor.h,
                  background: "#151518",
                  border: `3px solid ${activeMonitor >= i ? monitor.color : "rgba(255,255,255,0.1)"}`,
                  boxShadow: activeMonitor >= i ? `0 0 80px ${monitor.color}30` : "none",
                }}
                animate={{ scale: activeMonitor === i ? 1.08 : 1 }}
                transition={{ type: "spring" }}
              >
                {/* Menu bar */}
                <div className="h-6 bg-[#252528] flex items-center px-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                </div>

                {/* Layout visualization */}
                <div className="flex gap-1.5 p-2 h-[calc(100%-24px)]">
                  {i === 0 && (
                    <>
                      <motion.div 
                        className="flex-1 rounded-lg" 
                        style={{ background: `${monitor.color}50` }}
                        animate={activeMonitor === i ? { opacity: [0.5, 1, 0.5] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="flex-1 rounded-lg" style={{ background: `${monitor.color}25` }} />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <div className="flex-1 rounded-lg" style={{ background: `${monitor.color}50` }} />
                      <div className="flex-1 rounded-lg" style={{ background: `${monitor.color}35` }} />
                      <div className="flex-1 rounded-lg" style={{ background: `${monitor.color}20` }} />
                    </>
                  )}
                  {i === 2 && (
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1.5">
                      <div className="rounded-lg" style={{ background: `${monitor.color}50` }} />
                      <div className="rounded-lg" style={{ background: `${monitor.color}40` }} />
                      <div className="rounded-lg" style={{ background: `${monitor.color}30` }} />
                      <div className="rounded-lg" style={{ background: `${monitor.color}20` }} />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Stand */}
              <div className="w-10 h-8 bg-[#252528] rounded-b-xl" />
              <div className="w-20 h-3 bg-[#252528] rounded-full" />

              {/* Info */}
              <motion.div
                className="mt-8 text-center"
                animate={{ opacity: activeMonitor >= i ? 1 : 0.3 }}
              >
                <p className="text-xl text-white font-medium">{monitor.name}</p>
                <p className="text-lg mt-2" style={{ color: monitor.color }}>
                  {monitor.layout}
                </p>
                <p className="text-base text-white/40 mt-1">{monitor.mode}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </ParallaxContainer>
    </motion.div>
  );
}

// ============================================
// SCENE 8: WINDOW GROUPS
// ============================================
function Scene8_WindowGroups({ isActive }: { isActive: boolean }) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isActive) {
      setActiveTab(0);
      const timer1 = setTimeout(() => setActiveTab(1), 2000);
      const timer2 = setTimeout(() => setActiveTab(2), 4000);
      const timer3 = setTimeout(() => setActiveTab(0), 6000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isActive]);

  const tabs = [
    { name: "Safari", icon: "🌐", color: "#007AFF", content: "Web Research" },
    { name: "VS Code", icon: "💻", color: VIOLET, content: "Code Editor" },
    { name: "Terminal", icon: "⌨️", color: ACCENT, content: "Commands" },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color={CYAN} size={600} className="left-1/4" />
      
      {/* Left side */}
      <div className="w-2/5 flex flex-col justify-center pl-24 pr-12">
        <motion.h2 
          className="text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <span style={{ color: ACCENT }}>Window</span>
          <br />Groups
        </motion.h2>

        <motion.p
          className="text-2xl text-white/60 mb-10"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Stack windows in one slot.
          <br />Cycle like browser tabs.
        </motion.p>

        <div className="space-y-5">
          {[
            "Multiple windows per zone",
            "Visual tab indicator",
            "⌘+Tab to cycle",
            "Click tab to switch",
          ].map((text, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8 + i * 0.15 }}
            >
              <Check className="w-6 h-6 flex-shrink-0" style={{ color: CYAN }} />
              <span className="text-2xl text-white/80">{text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right side - Demo */}
      <div className="w-3/5 flex items-center justify-center">
        <ParallaxContainer intensity={12}>
          <div className="relative w-[580px] h-[420px]">
            {/* Stacked windows */}
            {tabs.map((tab, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${tab.color}25, ${tab.color}08)`,
                  border: `2px solid ${tab.color}50`,
                  zIndex: activeTab === i ? 10 : tabs.length - i,
                }}
                animate={{
                  y: activeTab === i ? 0 : (i - activeTab) * 15,
                  scale: activeTab === i ? 1 : 0.96 - Math.abs(i - activeTab) * 0.02,
                  opacity: activeTab === i ? 1 : 0.5,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 22 }}
              >
                {/* Title bar */}
                <div
                  className="h-12 flex items-center gap-4 px-5"
                  style={{ background: `${tab.color}30` }}
                >
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-xl text-white/80 font-medium">
                    {tab.icon} {tab.name}
                  </span>
                </div>

                {/* Content */}
                <div className="p-10 h-[calc(100%-48px)] flex flex-col items-center justify-center">
                  <motion.span 
                    className="text-8xl mb-6"
                    animate={activeTab === i ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {tab.icon}
                  </motion.span>
                  <span className="text-3xl text-white/60">{tab.content}</span>
                </div>
              </motion.div>
            ))}

            {/* Tab indicator */}
            <motion.div
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-4 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 }}
            >
              {tabs.map((tab, i) => (
                <motion.div
                  key={i}
                  className="px-5 py-3 rounded-full flex items-center gap-3 cursor-pointer"
                  style={{
                    background: activeTab === i ? `${tab.color}35` : "transparent",
                    border: `2px solid ${activeTab === i ? tab.color : "transparent"}`,
                  }}
                  animate={{ scale: activeTab === i ? 1.1 : 1 }}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <span
                    className="text-lg font-medium"
                    style={{ color: activeTab === i ? tab.color : "rgba(255,255,255,0.5)" }}
                  >
                    {tab.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ParallaxContainer>
      </div>
    </motion.div>
  );
}

// ============================================
// SCENE 9: MORE FEATURES
// ============================================
function Scene9_MoreFeatures({ isActive }: { isActive: boolean }) {
  const features = [
    { icon: Maximize2, name: "Focus Window", desc: "Expand to fullscreen or zone", color: ACCENT },
    { icon: ArrowLeftRight, name: "Window Swap", desc: "Swap with keyboard", color: CYAN },
    { icon: MousePointerClick, name: "Snap Back", desc: "Auto-return to slots", color: VIOLET },
    { icon: Settings, name: "Per-Space", desc: "Layouts per Space", color: AMBER },
    { icon: Grid3X3, name: "Custom Layouts", desc: "Create your zones", color: "#FF6B6B" },
    { icon: Layers, name: "Floating", desc: "Exclude from tiling", color: "#00D4AA" },
    { icon: Zap, name: "Resize Adjacent", desc: "Smart resizing", color: "#FF9F43" },
    { icon: Command, name: "Hotkeys", desc: "One-key layouts", color: "#A855F7" },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color={ACCENT} size={800} />
      
      <motion.h2 
        className="text-7xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
        And{" "}
        <span style={{ color: ACCENT }}>Much More</span>
      </motion.h2>

      <motion.p
        className="text-2xl text-white/50 mb-14 text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        Everything for professional window management
      </motion.p>

      {/* Features grid */}
      <div className="grid grid-cols-4 gap-6 w-full max-w-5xl">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="p-7 rounded-2xl cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.7 + i * 0.08, type: "spring" }}
            whileHover={{
              scale: 1.08,
              background: `${feature.color}15`,
              borderColor: `${feature.color}40`,
              y: -5,
            }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              <feature.icon className="w-10 h-10 mb-5" style={{ color: feature.color }} />
            </motion.div>
            <h3 className="text-xl text-white font-semibold mb-2">{feature.name}</h3>
            <p className="text-base text-white/50">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// SCENE 10: CALL TO ACTION
// ============================================
function Scene10_CTA({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <BreathingGlow color={ACCENT} size={900} />
      <BreathingGlow color={CYAN} size={600} className="translate-x-60" />
      
      <ParallaxContainer intensity={20}>
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, y: 30 }}
          animate={isActive ? { scale: 1, y: 0 } : {}}
          transition={{ type: "spring", delay: 0.3 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/app-icon.png"
              alt="Rapto"
              width={180}
              height={180}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </ParallaxContainer>

      {/* Text */}
      <motion.h2
        className="text-8xl font-bold text-white mt-12 text-center leading-tight"
        initial={{ opacity: 0, y: 40 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
      >
        Ready to take control?
      </motion.h2>

      <motion.p
        className="text-3xl text-white/50 mt-8 mb-14 text-center max-w-3xl"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
      >
        Stop wasting time on window management.
        <br />
        Start being productive with Rapto.
      </motion.p>

      {/* CTA Button */}
      <motion.a
        href="/"
        className="px-14 py-6 rounded-full text-2xl font-bold flex items-center gap-5"
        style={{
          background: ACCENT,
          color: "#000",
          boxShadow: `0 0 60px ${ACCENT}50`,
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.08, boxShadow: `0 0 100px ${ACCENT}70` }}
        whileTap={{ scale: 0.95 }}
      >
        Download Free
        <motion.span 
          className="text-3xl"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.span>
      </motion.a>

      {/* Platform info */}
      <motion.div
        className="flex flex-col items-center gap-6 mt-14"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-8 text-2xl text-white/50">
          <span>🍎 Apple Silicon & Intel</span>
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <span>macOS 13+</span>
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <span>⚡ 100% Swift</span>
        </div>
        <p className="text-xl text-white/30">Free to use • No subscription • No tracking</p>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN PROMO PAGE
// ============================================
export default function PromoPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hideUI, setHideUI] = useState(false);

  // Check URL parameter for clean mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("clean") === "1") {
      setHideUI(true);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "h" || e.key === "H") {
        setHideUI((prev) => !prev);
      }
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (e.key === "ArrowRight") {
        setCurrentScene((prev) => (prev + 1) % TOTAL_SCENES);
      }
      if (e.key === "ArrowLeft") {
        setCurrentScene((prev) => (prev - 1 + TOTAL_SCENES) % TOTAL_SCENES);
      }
      if (e.key === "r" || e.key === "R") {
        setCurrentScene(0);
        setIsPlaying(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % TOTAL_SCENES);
    }, SCENE_DURATION);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const goToScene = useCallback((index: number) => {
    setCurrentScene(index);
    setIsPlaying(false);
  }, []);

  const scenes = [
    Scene1_LogoReveal,
    Scene2_Problem,
    Scene3_Solution,
    Scene4_Modes,
    Scene5_AutoTiling,
    Scene6_Keyboard,
    Scene7_MultiMonitor,
    Scene8_WindowGroups,
    Scene9_MoreFeatures,
    Scene10_CTA,
  ];

  const sceneNames = [
    "Intro",
    "Problem",
    "Solution",
    "Modes",
    "Auto Tiling",
    "Keyboard",
    "Multi-Monitor",
    "Groups",
    "Features",
    "Download",
  ];

  return (
    <main className="relative w-screen h-screen bg-[#08080a] overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scenes */}
      {scenes.map((SceneComponent, i) => (
        <SceneComponent key={i} isActive={currentScene === i} />
      ))}

      {/* UI Controls - hidden in clean mode */}
      {!hideUI && (
        <>
          {/* Scene name - LARGER */}
          <div
            className="absolute top-10 left-10 px-6 py-3 rounded-xl text-xl font-medium z-40"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
          >
            {sceneNames[currentScene]}
          </div>

          {/* Progress bar - LARGER */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-40">
            {scenes.map((_, i) => (
              <button
                key={i}
                onClick={() => goToScene(i)}
                className="group relative"
              >
                <div
                  className="w-20 h-2 rounded-full overflow-hidden transition-all"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: ACCENT }}
                    initial={{ width: 0 }}
                    animate={{
                      width: currentScene === i ? "100%" : currentScene > i ? "100%" : "0%",
                    }}
                    transition={{
                      duration: currentScene === i && isPlaying ? SCENE_DURATION / 1000 : 0.3,
                      ease: "linear",
                    }}
                  />
                </div>
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span className="text-base text-white/70 bg-black/80 px-3 py-1.5 rounded-lg">
                    {sceneNames[i]}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Play/Pause - LARGER */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute bottom-10 right-10 p-4 rounded-xl z-40 transition-colors"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {isPlaying ? (
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Scene counter - LARGER */}
          <div
            className="absolute top-10 right-10 px-6 py-3 rounded-xl text-xl font-mono z-40"
            style={{ background: "rgba(255,255,255,0.06)", color: ACCENT }}
          >
            {currentScene + 1} / {TOTAL_SCENES}
          </div>

          {/* Help hint */}
          <motion.div
            className="absolute bottom-24 left-10 text-base z-40"
            style={{ color: "rgba(255,255,255,0.3)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 5, duration: 1 }}
          >
            H = hide UI • Space = play/pause • ←→ = navigate • R = restart
          </motion.div>
        </>
      )}
    </main>
  );
}
