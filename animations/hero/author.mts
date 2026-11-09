import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ANIMATION_DOCUMENT_VERSION, assertValidAnimationDocument, base, constant, fill, hex, keyed, marker,
  stroke, withComputedRevision, type CubicBezier, type SceneNode, type Key,
} from "@clayzo/animation/authoring";

// Art direction: product surface. Verb: snap. Geometry: rounded windows on a grid.
// Palette: Rapto brand — near-black field, lime accent, cyan / purple / coral / amber per app.

const W = 1920;
const H = 1080;
const TPS = 240;
const FRAME = 4; // 60 fps
const DURATION = 8 * TPS;
const s = (seconds: number) => Math.round((seconds * TPS) / FRAME) * FRAME;

const BG = hex("#0A0A0C");
const BAR = hex("#121216");
const WINDOW = hex("#141418");
const TITLEBAR = hex("#1B1B21");
const GHOST = hex("#2A2A33");
const LIME = hex("#BFFF00");
const MUTED = hex("#8A8A96");

const SNAP: CubicBezier = { x1: 0.3, y1: 1.18, x2: 0.4, y2: 1 };
const SCATTER: CubicBezier = { x1: 0.45, y1: 0, x2: 0.25, y2: 1 };
const OUT: CubicBezier = { x1: 0.2, y1: 0.45, x2: 0.45, y2: 1 };
const DRAIN: CubicBezier = { x1: 0.5, y1: 0, x2: 0.7, y2: 0.7 };
const POP: CubicBezier = { x1: 0.1, y1: 0.9, x2: 0.3, y2: 1 };

// Work area below the menu bar.
const MENU_H = 40;
const PAD = 40;
const GAP = 20;
const AREA = { x: PAD, y: MENU_H + PAD - 8, w: W - PAD * 2, h: H - MENU_H - PAD * 2 + 8 };

type Frame = { x: number; y: number; w: number; h: number; r: number };

const zone = (fx: number, fy: number, fw: number, fh: number): Frame => {
  const x0 = AREA.x + fx * AREA.w + (fx > 0 ? GAP / 2 : 0);
  const y0 = AREA.y + fy * AREA.h + (fy > 0 ? GAP / 2 : 0);
  const x1 = AREA.x + (fx + fw) * AREA.w - (fx + fw < 1 ? GAP / 2 : 0);
  const y1 = AREA.y + (fy + fh) * AREA.h - (fy + fh < 1 ? GAP / 2 : 0);
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0, r: 0 };
};

const APPS = [
  { id: "browser", title: "Browser", color: hex("#BFFF00") },
  { id: "code", title: "Code", color: hex("#00FFE5") },
  { id: "mail", title: "Mail", color: hex("#A855F7") },
  { id: "music", title: "Music", color: hex("#FF6B6B") },
  { id: "files", title: "Files", color: hex("#FFB800") },
] as const;

const CHAOS: Frame[] = [
  { x: 700, y: 420, w: 860, h: 560, r: -3 },
  { x: 1180, y: 520, w: 820, h: 540, r: 2.5 },
  { x: 520, y: 700, w: 640, h: 420, r: 4 },
  { x: 1420, y: 330, w: 520, h: 360, r: -5 },
  { x: 1200, y: 800, w: 600, h: 380, r: -2 },
];

// Three Rapto layouts, one frame per app in APPS order.
const LAYOUTS: Frame[][] = [
  // Focus left + stacked right
  [zone(0, 0, 0.5, 1), zone(0.5, 0, 0.5, 0.5), zone(0.5, 0.5, 1 / 6, 0.5), zone(0.5 + 1 / 6, 0.5, 1 / 6, 0.5), zone(0.5 + 2 / 6, 0.5, 1 / 6, 0.5)],
  // Wide top row, three below
  [zone(0.6, 0, 0.4, 0.55), zone(0, 0, 0.6, 0.55), zone(0, 0.55, 1 / 3, 0.45), zone(1 / 3, 0.55, 1 / 3, 0.45), zone(2 / 3, 0.55, 1 / 3, 0.45)],
  // Centre stage
  [zone(0, 0, 0.22, 0.5), zone(0.22, 0, 0.56, 1), zone(0, 0.5, 0.22, 0.5), zone(0.78, 0, 0.22, 0.5), zone(0.78, 0.5, 0.22, 0.5)],
];

// Beats: overlay appears, windows snap in under it, overlay drains.
const BEATS = [s(0.4), s(2.6), s(4.8)];
const SNAP_DELAY = s(0.2);
const SNAP_DUR = s(0.55);
const STAGGER = 12; // 50 ms
const SNAP_ORDER = [[0, 1, 2, 3, 4], [1, 0, 2, 3, 4], [1, 0, 2, 3, 4]];
const SCATTER_AT = s(7.0);
const SCATTER_DUR = s(0.7);

const nodes: Record<string, SceneNode> = {};
const add = (node: SceneNode) => { nodes[node.id] = node; return node.id; };

const v3 = (x: number, y: number) => ({ x, y, z: 0 });
const sz = (width: number, height: number) => ({ width, height });

// Builds a window track: for each key the frame, so every child property can be derived from it.
function windowKeys(i: number): [number, Frame, CubicBezier | "linear"][] {
  const keys: [number, Frame, CubicBezier | "linear"][] = [[0, CHAOS[i], "linear"]];
  let current = CHAOS[i];
  LAYOUTS.forEach((layout, l) => {
    const start = BEATS[l] + SNAP_DELAY + SNAP_ORDER[l].indexOf(i) * STAGGER;
    keys.push([start, current, SNAP]);
    current = layout[i];
    keys.push([start + SNAP_DUR, current, "linear"]);
  });
  const out = SCATTER_AT + (4 - i) * 8;
  keys.push([out, current, SCATTER]);
  keys.push([out + SCATTER_DUR, CHAOS[i], "linear"]);
  return keys;
}

// Windows lift slightly while in flight so swaps read as carried over each other.
function liftKeys(i: number): Key<{ x: number; y: number; z: number }>[] {
  const one = { x: 1, y: 1, z: 1 };
  const up = { x: 1.05, y: 1.05, z: 1 };
  const keys: Key<{ x: number; y: number; z: number }>[] = [[0, one, "linear"]];
  LAYOUTS.forEach((_, l) => {
    const start = BEATS[l] + SNAP_DELAY + SNAP_ORDER[l].indexOf(i) * STAGGER;
    keys.push([start, one, OUT], [start + s(0.2), up, SNAP], [start + SNAP_DUR, one, "linear"]);
  });
  const out = SCATTER_AT + (4 - i) * 8;
  keys.push([out, one, OUT], [out + s(0.25), up, OUT], [out + SCATTER_DUR, one, "linear"]);
  return keys;
}

function track<T>(id: string, keys: [number, Frame, CubicBezier | "linear"][], map: (f: Frame) => T) {
  return keyed<T>(id, keys.map(([tick, f, ease]) => [tick, map(f), ease] as Key<T>));
}

const TITLE_H = 44;
const windowIds: string[] = [];

APPS.forEach((app, i) => {
  const k = windowKeys(i);
  const id = `win-${app.id}`;
  const top = (f: Frame) => -f.h / 2;
  const left = (f: Frame) => -f.w / 2;

  const clip = add({
    ...base(`${id}-clip`, { outTick: DURATION }), type: "rect",
    size: track(`${id}.clip.size`, k, (f) => sz(f.w, f.h)), cornerRadius: constant(16), style: {},
  });

  const children: string[] = [];
  children.push(add({
    ...base(`${id}-body`, { outTick: DURATION }), type: "rect",
    size: track(`${id}.body.size`, k, (f) => sz(f.w, f.h)), cornerRadius: constant(0),
    style: { fill: fill(WINDOW) },
  }));
  children.push(add({
    ...base(`${id}-titlebar`, { outTick: DURATION, position: track(`${id}.tb.pos`, k, (f) => v3(0, top(f) + TITLE_H / 2)) }),
    type: "rect", size: track(`${id}.tb.size`, k, (f) => sz(f.w, TITLE_H)), cornerRadius: constant(0),
    style: { fill: fill(TITLEBAR) },
  }));
  ["#FF5F57", "#FEBC2E", "#28C840"].forEach((c, d) => {
    children.push(add({
      ...base(`${id}-dot${d}`, { outTick: DURATION, position: track(`${id}.dot${d}.pos`, k, (f) => v3(left(f) + 24 + d * 22, top(f) + TITLE_H / 2)) }),
      type: "ellipse", size: constant(sz(13, 13)), style: { fill: fill(hex(c)) },
    }));
  });
  children.push(add({
    ...base(`${id}-title`, { outTick: DURATION, position: track(`${id}.title.pos`, k, (f) => v3(-100, top(f) + TITLE_H / 2)) }),
    type: "text", box: sz(200, TITLE_H), wrap: "none", align: "center", verticalAlign: "middle",
    runs: constant([{ text: app.title, fontFamily: "Manrope", fontSize: 17, fontWeight: 600, letterSpacing: 0, lineHeight: 22, color: MUTED }]),
  }));

  // Content: an accent headline bar, grey text lines, and a tinted panel in the app colour.
  const CX = 28;
  const CY = TITLE_H + 34;
  const lines = [0.42, 0.78, 0.64, 0.7, 0.5];
  lines.forEach((frac, li) => {
    const h = li === 0 ? 18 : 11;
    const yOff = li === 0 ? CY : CY + 22 + li * 26;
    children.push(add({
      ...base(`${id}-line${li}`, { outTick: DURATION, position: track(`${id}.line${li}.pos`, k, (f) => v3(left(f) + CX + ((f.w - CX * 2) * frac) / 2, top(f) + yOff)) }),
      type: "rect", size: track(`${id}.line${li}.size`, k, (f) => sz((f.w - CX * 2) * frac, h)), cornerRadius: constant(h / 2),
      style: { fill: li === 0 ? fill(app.color) : fill(GHOST) },
    }));
  });
  const PANEL_TOP = CY + 22 + 5 * 26 + 10;
  children.push(add({
    ...base(`${id}-panel`, { outTick: DURATION, position: track(`${id}.panel.pos`, k, (f) => v3(0, top(f) + PANEL_TOP + (f.h - PANEL_TOP - CX) / 2)) }),
    type: "rect", size: track(`${id}.panel.size`, k, (f) => sz(f.w - CX * 2, f.h - PANEL_TOP - CX)), cornerRadius: constant(12),
    style: { fill: fill(app.color, 0.14), stroke: stroke(app.color, 1.5, { opacity: 0.35 }) },
  }));

  windowIds.push(add({
    ...base(id, {
      outTick: DURATION,
      position: track(`${id}.pos`, k, (f) => v3(f.x, f.y)),
      rotation: track(`${id}.rot`, k, (f) => ({ x: 0, y: 0, z: f.r })),
      scale: keyed(`${id}.lift`, liftKeys(i)),
    }),
    type: "group", children, clipPathId: clip,
  }));

  // Outline drawn above the clipped content so the app colour frames the window.
  windowIds.push(add({
    ...base(`${id}-frame`, {
      outTick: DURATION,
      position: track(`${id}.frame.pos`, k, (f) => v3(f.x, f.y)),
      rotation: track(`${id}.frame.rot`, k, (f) => ({ x: 0, y: 0, z: f.r })),
      scale: keyed(`${id}.frame.lift`, liftKeys(i)),
    }),
    type: "rect", size: track(`${id}.frame.size`, k, (f) => sz(f.w, f.h)), cornerRadius: constant(16),
    style: { stroke: stroke(app.color, 2, { opacity: 0.45 }) },
  }));
});

// Rapto overlay: lime zones pop in, windows land under them, the zones drain.
const overlayIds: string[] = [];
LAYOUTS.forEach((layout, l) => {
  const t0 = BEATS[l];
  const lastLand = t0 + SNAP_DELAY + 4 * STAGGER + SNAP_DUR;
  const fadeOut = lastLand - s(0.1);
  const end = fadeOut + s(0.25);
  layout.forEach((z, zi) => {
    const delay = zi * 8;
    overlayIds.push(add({
      ...base(`zone${l}-${zi}`, {
        outTick: end, inTick: t0, x: z.x, y: z.y,
        scale: keyed(`zone${l}-${zi}.scale`, [[t0 + delay, { x: 0.9, y: 0.9, z: 1 }, POP], [t0 + delay + s(0.2), { x: 1, y: 1, z: 1 }]]),
      }),
      type: "rect", size: constant(sz(z.w, z.h)), cornerRadius: constant(16),
      style: {
        fill: fill(LIME, keyed(`zone${l}-${zi}.fill`, [[t0 + delay, 0, OUT], [t0 + delay + s(0.15), 0.12, "linear"], [fadeOut, 0.12, DRAIN], [end - FRAME, 0]])),
        stroke: stroke(LIME, 3, {
          opacity: keyed(`zone${l}-${zi}.stroke`, [[t0 + delay, 0, OUT], [t0 + delay + s(0.12), 1, "linear"], [fadeOut, 1, DRAIN], [end - FRAME, 0]]),
          dash: [14, 10],
        }),
      },
    }));
  });
});

// Menu bar with the Rapto icon, which pulses on every layout change.
const menuIds: string[] = [];
menuIds.push(add({
  ...base("menubar", { outTick: DURATION, x: W / 2, y: MENU_H / 2 }), type: "rect",
  size: constant(sz(W, MENU_H)), cornerRadius: constant(0), style: { fill: fill(BAR) },
}));
[70, 60, 76, 64].forEach((bw, bi) => {
  menuIds.push(add({
    ...base(`menu-item${bi}`, { outTick: DURATION, x: 40 + bi * 96 + bw / 2, y: MENU_H / 2 }), type: "rect",
    size: constant(sz(bw, 10)), cornerRadius: constant(5), style: { fill: fill(GHOST) },
  }));
});
const pulseKeys: Key<{ x: number; y: number; z: number }>[] = [[0, { x: 1, y: 1, z: 1 }, "linear"]];
BEATS.forEach((t) => {
  pulseKeys.push([t - FRAME, { x: 1, y: 1, z: 1 }, POP]);
  pulseKeys.push([t + s(0.1), { x: 1.35, y: 1.35, z: 1 }, OUT]);
  pulseKeys.push([t + s(0.35), { x: 1, y: 1, z: 1 }, "linear"]);
});
const iconCells: string[] = [];
[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([cx, cy], ci) => {
  iconCells.push(add({
    ...base(`icon-cell${ci}`, { outTick: DURATION, x: cx * 5, y: cy * 5 }), type: "rect",
    size: constant(sz(8, 8)), cornerRadius: constant(2), style: { fill: fill(LIME) },
  }));
});
menuIds.push(add({
  ...base("rapto-icon", { outTick: DURATION, x: W - 140, y: MENU_H / 2, scale: keyed("rapto-icon.scale", pulseKeys) }),
  type: "group", children: iconCells,
}));
[0, 1].forEach((bi) => {
  menuIds.push(add({
    ...base(`menu-right${bi}`, { outTick: DURATION, x: W - 96 + bi * 44, y: MENU_H / 2 }), type: "rect",
    size: constant(sz(28, 10)), cornerRadius: constant(5), style: { fill: fill(GHOST) },
  }));
});

const field = add({
  ...base("field", { outTick: DURATION, x: W / 2, y: H / 2 }), type: "rect",
  size: constant(sz(W, H)), cornerRadius: constant(0), style: { fill: fill(BG) },
});

const rootNodeIds = [field, ...windowIds, ...overlayIds, ...menuIds];

const document = withComputedRevision({
  version: ANIMATION_DOCUMENT_VERSION, id: "rapto-hero", name: "Rapto Hero",
  canvas: { width: W, height: H, pixelAspectRatio: 1, backgroundColor: BG },
  timing: { ticksPerSecond: TPS, frameRate: { numerator: 60, denominator: 1 }, durationTicks: DURATION, displayStartTick: 0 },
  assets: {}, rootCompositionId: "main", components: {},
  compositions: { main: { id: "main", name: "Main", width: W, height: H, durationTicks: DURATION, nodes, rootNodeIds } },
  markers: [
    marker("chaos", 0),
    ...BEATS.map((t, l) => marker(`layout-${l + 1}`, t + SNAP_DELAY + 4 * STAGGER + SNAP_DUR)),
    marker("scatter", SCATTER_AT + SCATTER_DUR),
  ],
  design: { tokens: { looping: true } },
  capabilities: { required: [], optional: [], unsupportedPolicy: "warn" },
});
assertValidAnimationDocument(document);

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, "out"), { recursive: true });
writeFileSync(join(here, "out", "hero.json"), JSON.stringify(document));
console.log(`wrote hero.json: ${Object.keys(nodes).length} nodes`);
