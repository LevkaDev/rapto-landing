import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ANIMATION_DOCUMENT_VERSION, assertValidAnimationDocument, base, constant, fill, hex, keyed, marker,
  stroke, withComputedRevision, type Color, type CubicBezier, type Key, type Marker, type SceneNode,
  type TextAnimator,
} from "@clayzo/animation/authoring";

// Promo video titles for Product Hunt, cut between the landing page demos.
// Art direction: one object. Verb: snap. Geometry: the rounded panes of the Rapto icon
// (one tall pane on the left, two stacked on the right, a link in the middle).
// Palette: Rapto brand — near-black field, white panes on a periwinkle plate, lime accent.
// Words: Bricolage Grotesque, the landing page's display face.

const W = 1920;
const H = 1080;
const TPS = 240;
const FRAME = 4; // 60 fps
const s = (seconds: number) => Math.round((seconds * TPS) / FRAME) * FRAME;

const BG = hex("#0A0A0C");
const WINDOW = hex("#141418");
const TITLEBAR = hex("#1B1B21");
const GHOST = hex("#2A2A33");
const PANE = hex("#F4F6FF");
const PLATE = hex("#B8C5F4");
const LIME = hex("#BFFF00");
const INK = hex("#F5F5F7");
const MUTED = hex("#9A9AA8");
const KEYCAP = hex("#1B1B21");
const KEYEDGE = hex("#3A3A46");

const OUT: CubicBezier = { x1: 0.2, y1: 0.45, x2: 0.45, y2: 1 };
const SETTLE: CubicBezier = { x1: 0.25, y1: 0.5, x2: 0.45, y2: 1 };
const SNAP: CubicBezier = { x1: 0.3, y1: 1.18, x2: 0.4, y2: 1 };
const DRAIN: CubicBezier = { x1: 0.5, y1: 0, x2: 0.7, y2: 0.7 };
const POP: CubicBezier = { x1: 0.1, y1: 0.9, x2: 0.3, y2: 1 };
const INOUT: CubicBezier = { x1: 0.45, y1: 0, x2: 0.55, y2: 1 };
const AWAY: CubicBezier = { x1: 0.55, y1: 0, x2: 0.8, y2: 0.4 };

const FONT = "bricolage";
const FONT_ASSET = { id: FONT, type: "font" as const, uri: "fonts/Bricolage.ttf", family: "Bricolage Grotesque", style: "normal", weight: 400 };

type V3 = { x: number; y: number; z: number };
const v3 = (x: number, y: number): V3 => ({ x, y, z: 0 });
const sc = (k: number): V3 => ({ x: k, y: k, z: 1 });
const sz = (width: number, height: number) => ({ width, height });

// One document's node map, so helpers can add nodes without passing it around.
class Scene {
  nodes: Record<string, SceneNode> = {};
  add(node: SceneNode) { this.nodes[node.id] = node; return node.id; }
}

function run(text: string, size: number, weight: number, color: Color, lineHeight = Math.round(size * 1.08)) {
  return { text, fontAssetId: FONT, fontFamily: "Bricolage Grotesque", fontSize: size, fontWeight: weight, letterSpacing: 0, lineHeight, color };
}

/** Per-word rise: each word fades in and rises `rise` px, `gap` ticks after the previous one. */
function wordRise(id: string, words: number, start: number, gap: number, rise: number, dur = s(0.34)): TextAnimator[] {
  return Array.from({ length: words }, (_, i) => {
    const t = start + i * gap;
    return {
      id: `${id}-w${i}`,
      selector: { start: i, end: i + 1, units: "words" as const },
      opacity: keyed(`${id}.w${i}.op`, [[0, 0, "hold"], [t, 0, OUT], [t + dur, 1]]),
      position: keyed(`${id}.w${i}.pos`, [[0, { x: 0, y: rise }, "hold"], [t, { x: 0, y: rise }, SETTLE], [t + dur, { x: 0, y: 0 }]]),
    };
  });
}

/** Everything drains together at the end so the cut to the next shot is clean. */
function exitKeys(id: string, end: number, from = 1): Key<number>[] {
  return [[0, from, "linear"], [end - s(0.3), from, DRAIN], [end - FRAME, 0]];
}

function document(id: string, name: string, scene: Scene, roots: string[], duration: number, markers: Marker[]) {
  const field = scene.add({
    ...base("field", { outTick: duration, x: W / 2, y: H / 2 }), type: "rect",
    size: constant(sz(W, H)), cornerRadius: constant(0), style: { fill: fill(BG) },
  });
  const doc = withComputedRevision({
    version: ANIMATION_DOCUMENT_VERSION, id, name,
    canvas: { width: W, height: H, pixelAspectRatio: 1, backgroundColor: BG },
    timing: { ticksPerSecond: TPS, frameRate: { numerator: 60, denominator: 1 }, durationTicks: duration, displayStartTick: 0 },
    assets: { [FONT]: FONT_ASSET }, rootCompositionId: "main", components: {},
    compositions: { main: { id: "main", name, width: W, height: H, durationTicks: duration, nodes: scene.nodes, rootNodeIds: [field, ...roots] } },
    markers,
    design: { tokens: { looping: false } },
    capabilities: { required: [], optional: [], unsupportedPolicy: "warn" },
  });
  assertValidAnimationDocument(doc);
  return doc;
}

// MARK: - The Rapto icon

// Measured from the 1024 px app icon and scaled so the plate is 560 px.
const K = 560 / 660;
const PLATE_SIZE = 660 * K;
const PLATE_RADIUS = 150 * K;
const PANES = [
  { x: -126 * K, y: 0, w: 230 * K, h: 443 * K },
  { x: 126 * K, y: -124 * K, w: 230 * K, h: 195 * K },
  { x: 126 * K, y: 108.5 * K, w: 230 * K, h: 226 * K },
];
const PANE_RADIUS = 30 * K;
const LINK = { x: 0, y: -9 * K, w: 176 * K, h: 104 * K, r: 22 * K, stroke: 22 * K };

/** Plate and link of the icon, popping in at `at`. Returns ids drawn behind and above the panes. */
function iconPlateAndLink(scene: Scene, prefix: string, at: number, duration: number) {
  const plate = scene.add({
    ...base(`${prefix}-plate`, {
      outTick: duration, inTick: at,
      scale: keyed(`${prefix}.plate.scale`, [[at, sc(0.001), POP], [at + s(0.22), sc(1.04), INOUT], [at + s(0.34), sc(1)]]),
    }),
    type: "rect", size: constant(sz(PLATE_SIZE, PLATE_SIZE)), cornerRadius: constant(PLATE_RADIUS), style: { fill: fill(PLATE) },
  });
  const linkAt = at + s(0.3);
  const link = scene.add({
    ...base(`${prefix}-link`, {
      outTick: duration, inTick: linkAt, x: LINK.x, y: LINK.y,
      scale: keyed(`${prefix}.link.scale`, [[linkAt, sc(0.001), POP], [linkAt + s(0.18), sc(1.18), "linear"], [linkAt + s(0.26), sc(1.19), INOUT], [linkAt + s(0.36), sc(1)]]),
    }),
    type: "rect", size: constant(sz(LINK.w, LINK.h)), cornerRadius: constant(LINK.r),
    style: { stroke: stroke(LIME, LINK.stroke) },
  });
  return { plate, link };
}

// MARK: - Opener: too many windows, then they snap into the Rapto icon

function opener() {
  const scene = new Scene();
  const DURATION = s(6.4);
  const TITLE_IN = s(0.2);
  const TITLE_OUT = s(2.3);
  const SNAP_AT = s(2.45);
  const SNAP_DUR = s(0.6);
  const PLATE_AT = SNAP_AT + SNAP_DUR - s(0.05);
  const LOCKUP_AT = s(3.75);
  const LOCKUP_DUR = s(0.7);
  const ICON_HOME = v3(960, 540);
  const ICON_LOCKUP = v3(560, 540);
  const LOCKUP_SCALE = 0.74;

  // Chaos frames in canvas coordinates. The first three become the panes.
  const APPS = [
    { color: hex("#BFFF00"), chaos: { x: 640, y: 430, w: 820, h: 540, r: -4 } },
    { color: hex("#00FFE5"), chaos: { x: 1270, y: 380, w: 760, h: 480, r: 3 } },
    { color: hex("#A855F7"), chaos: { x: 1120, y: 760, w: 700, h: 420, r: -2.5 } },
    { color: hex("#FF6B6B"), chaos: { x: 420, y: 820, w: 560, h: 360, r: 5 } },
    { color: hex("#FFB800"), chaos: { x: 1560, y: 820, w: 520, h: 330, r: -6 } },
  ];

  const TB = 40;
  const iconChildren: string[] = [];
  const looseIds: string[] = [];

  APPS.forEach((app, i) => {
    const id = `win${i}`;
    const pane = PANES[i];
    const c = app.chaos;
    const drift = { x: (i % 2 ? -1 : 1) * 26, y: (i < 2 ? 1 : -1) * 18 };
    const start = SNAP_AT + [1, 0, 2, 3, 4][i] * s(0.05);
    const end = start + SNAP_DUR;
    const inIcon = i < 3;

    // Frames relative to the icon centre for panes, absolute for the loose windows.
    const ox = inIcon ? ICON_HOME.x : 0;
    const oy = inIcon ? ICON_HOME.y : 0;
    const from = { x: c.x - ox, y: c.y - oy, w: c.w, h: c.h, r: c.r };
    const drifted = { ...from, x: from.x + drift.x, y: from.y + drift.y, r: from.r * 0.6 };
    const awayDir = { x: c.x < 960 ? -1 : 1, y: c.y < 540 ? -1 : 1 };
    const to = inIcon
      ? { x: pane.x, y: pane.y, w: pane.w, h: pane.h, r: 0 }
      : { x: drifted.x + awayDir.x * 900, y: drifted.y + awayDir.y * 500, w: c.w * 0.7, h: c.h * 0.7, r: drifted.r * 3 };
    const ease = inIcon ? SNAP : AWAY;

    type F = typeof from;
    const keys: [number, F, CubicBezier | "linear"][] = [[0, from, "linear"], [s(0.1), from, INOUT], [start, drifted, ease], [end, to, "linear"]];
    const tr = <T,>(name: string, map: (f: F) => T) => keyed<T>(`${id}.${name}`, keys.map(([t, f, e]) => [t, map(f), e] as Key<T>));
    const fade = (name: string, peak = 1) => keyed<number>(`${id}.${name}`, [[0, peak, "linear"], [start, peak, OUT], [start + s(0.3), 0]]);

    const children: string[] = [];
    // Body turns from a dark window into a white pane while it flies.
    children.push(scene.add({
      ...base(`${id}-body`, { outTick: DURATION }), type: "rect",
      size: tr("body.size", (f) => sz(f.w, f.h)),
      cornerRadius: inIcon ? keyed(`${id}.body.r`, [[0, 16, "linear"], [start, 16, OUT], [end, PANE_RADIUS]]) : constant(16),
      style: {
        fill: fill(inIcon ? keyed<Color>(`${id}.body.c`, [[0, WINDOW, "linear"], [start + s(0.08), WINDOW, OUT], [start + s(0.24), PANE]]) : constant(WINDOW)),
        stroke: stroke(app.color, 2.5, { opacity: inIcon ? fade("outline", 0.85) : constant(0.85) }),
      },
    }));
    children.push(scene.add({
      ...base(`${id}-tb`, { outTick: DURATION, position: tr("tb.pos", (f) => v3(0, -f.h / 2 + TB / 2 + 1)) }), type: "rect",
      size: tr("tb.size", (f) => sz(f.w - 4, TB)), cornerRadius: constant(14),
      style: { fill: fill(TITLEBAR, inIcon ? fade("tb.op") : 1) },
    }));
    ["#FF5F57", "#FEBC2E", "#28C840"].forEach((dot, d) => {
      children.push(scene.add({
        ...base(`${id}-dot${d}`, { outTick: DURATION, position: tr(`dot${d}.pos`, (f) => v3(-f.w / 2 + 24 + d * 22, -f.h / 2 + TB / 2 + 1)) }),
        type: "ellipse", size: constant(sz(12, 12)), style: { fill: fill(hex(dot), inIcon ? fade(`dot${d}.op`) : 1) },
      }));
    });
    [0.4, 0.75, 0.6, 0.68].forEach((frac, li) => {
      const h = li === 0 ? 16 : 10;
      const y = (f: F) => -f.h / 2 + TB + 36 + li * 26;
      children.push(scene.add({
        ...base(`${id}-line${li}`, { outTick: DURATION, position: tr(`line${li}.pos`, (f) => v3(-f.w / 2 + 28 + ((f.w - 56) * frac) / 2, y(f))) }),
        type: "rect", size: tr(`line${li}.size`, (f) => sz((f.w - 56) * frac, h)), cornerRadius: constant(h / 2),
        style: { fill: fill(li === 0 ? app.color : GHOST, inIcon ? fade(`line${li}.op`) : 1) },
      }));
    });

    const group = scene.add({
      ...base(id, { outTick: DURATION, position: tr("pos", (f) => v3(f.x, f.y)), rotation: tr("rot", (f) => ({ x: 0, y: 0, z: f.r })) }),
      type: "group", children,
    });
    (inIcon ? iconChildren : looseIds).push(group);
  });

  const { plate, link } = iconPlateAndLink(scene, "icon", PLATE_AT, DURATION);
  const icon = scene.add({
    ...base("icon", {
      outTick: DURATION,
      position: keyed("icon.pos", [[0, ICON_HOME, "linear"], [LOCKUP_AT, ICON_HOME, INOUT], [LOCKUP_AT + LOCKUP_DUR, ICON_LOCKUP]]),
      scale: keyed("icon.scale", [[0, sc(1), "linear"], [LOCKUP_AT, sc(1), INOUT], [LOCKUP_AT + LOCKUP_DUR, sc(LOCKUP_SCALE)]]),
    }),
    type: "group", children: [plate, ...iconChildren, link],
  });

  // Scrim keeps the hook title readable over the windows, then lifts for the snap.
  const scrim = scene.add({
    ...base("scrim", { outTick: SNAP_AT + s(0.3), x: W / 2, y: H / 2 }), type: "rect",
    size: constant(sz(W, H)), cornerRadius: constant(0),
    style: { fill: fill(BG, keyed("scrim.op", [[0, 0.3, "linear"], [TITLE_OUT, 0.3, DRAIN], [SNAP_AT + s(0.2), 0]])) },
  });

  const HOOK = "Too many windows?";
  const hook = scene.add({
    ...base("hook", {
      outTick: TITLE_OUT + s(0.3), x: 0, y: 540 - 100,
      opacity: keyed("hook.op", [[0, 1, "linear"], [TITLE_OUT, 1, DRAIN], [TITLE_OUT + s(0.25), 0]]),
    }),
    type: "text", box: sz(W, 200), wrap: "none", align: "center", verticalAlign: "top",
    runs: constant([run(HOOK, 168, 760, INK, 190)]),
    animators: wordRise("hook", 3, TITLE_IN, s(0.09), 50),
  });

  const WORD_X = 900;
  const wordAt = LOCKUP_AT + s(0.35);
  const subAt = wordAt + s(0.3);
  const word = scene.add({
    ...base("wordmark", {
      outTick: DURATION, inTick: wordAt,
      opacity: keyed("wordmark.op", [[0, 0, "hold"], [wordAt, 0, SETTLE], [wordAt + s(0.34), 1]]),
      position: keyed("wordmark.pos", [[0, v3(WORD_X - 40, 330), "hold"], [wordAt, v3(WORD_X - 40, 330), SETTLE], [wordAt + s(0.4), v3(WORD_X, 330)]]),
    }),
    type: "text", box: sz(1000, 300), wrap: "none", align: "left", verticalAlign: "top",
    runs: constant([run("Rapto", 270, 800, INK, 270)]),
  });
  const sub = scene.add({
    ...base("tagline", { outTick: DURATION, inTick: subAt, x: WORD_X + 8, y: 640 }),
    type: "text", box: sz(1000, 80), wrap: "none", align: "left", verticalAlign: "top",
    runs: constant([run("The free window manager for Mac", 52, 500, MUTED, 64)]),
    animators: wordRise("tagline", 6, subAt, s(0.05), 24, s(0.3)),
  });

  return document("rapto-opener", "Opener", scene, [...looseIds, icon, scrim, hook, word, sub], DURATION, [
    marker("chaos", s(0.1)),
    marker("hook", TITLE_IN + s(0.6)),
    marker("snap", SNAP_AT + SNAP_DUR),
    marker("icon", PLATE_AT + s(0.7)),
    marker("lockup", subAt + s(0.6)),
  ]);
}

// MARK: - Section title cards

type Card = { id: string; kicker: string; title: string; accentWord?: number; keys?: string[] };

const CARDS: Card[] = [
  { id: "layouts", kicker: "Layouts", title: "Snap every window into place" },
  { id: "auto", kicker: "Auto Tiling", title: "New windows find their spot" },
  { id: "desktops", kicker: "Desktops Bar", title: "Every desktop in your menu bar" },
  { id: "switcher", kicker: "Window Switcher", title: "Jump to any window", keys: ["control", "option", "W"] },
  { id: "workspaces", kicker: "New in 5.55", title: "Introducing Workspaces", accentWord: 1 },
];

/** Small three-pane mark, the icon's panes in lime, used as the kicker's bullet. */
function miniMark(scene: Scene, id: string, x: number, y: number, at: number, duration: number) {
  const k = 0.11;
  const ids = PANES.map((p, i) => {
    const t = at + [1, 0, 2][i] * s(0.05);
    return scene.add({
      ...base(`${id}-p${i}`, { outTick: duration, x: p.x * k * 1.0, y: p.y * k, scale: keyed(`${id}.p${i}.s`, [[0, sc(0.001), "hold"], [t, sc(0.001), POP], [t + s(0.14), sc(1)]]) }),
      type: "rect", size: constant(sz(p.w * k, p.h * k)), cornerRadius: constant(4), style: { fill: fill(LIME) },
    });
  });
  return scene.add({ ...base(id, { outTick: duration, x, y }), type: "group", children: ids });
}

function titleCard(card: Card) {
  const scene = new Scene();
  const DURATION = s(card.keys ? 3.0 : 2.4);
  const LEFT = 170;
  const KICK_Y = card.keys ? 330 : 400;
  const TITLE_Y = KICK_Y + 70;
  const words = card.title.split(" ").length;

  const mark = miniMark(scene, "mark", LEFT + 18, KICK_Y + 22, s(0.1), DURATION);
  const kicker = scene.add({
    ...base("kicker", {
      outTick: DURATION,
      opacity: keyed("kicker.op", [[0, 0, "hold"], [s(0.15), 0, OUT], [s(0.4), 1]]),
      position: keyed("kicker.pos", [[0, v3(LEFT + 44, KICK_Y), "hold"], [s(0.15), v3(LEFT + 44, KICK_Y), OUT], [s(0.4), v3(LEFT + 58, KICK_Y)]]),
    }),
    type: "text", box: sz(1200, 60), wrap: "none", align: "left", verticalAlign: "top",
    runs: constant([run(card.kicker, 44, 650, LIME, 48)]),
  });

  const animators = wordRise("title", words, s(0.28), s(0.08), 46);
  if (card.accentWord !== undefined) {
    animators.push({ id: "title-accent", selector: { start: card.accentWord, end: card.accentWord + 1, units: "words" }, fillColor: constant(LIME) });
  }
  const title = scene.add({
    ...base("title", { outTick: DURATION, x: LEFT, y: TITLE_Y }),
    type: "text", box: sz(W - LEFT * 2, 380), wrap: "word", align: "left", verticalAlign: "top",
    runs: constant([run(card.title, 150, 760, INK, 158)]),
    animators,
  });

  const content = [mark, kicker, title];

  if (card.keys) {
    const KEY = 190;
    const KEY_Y = TITLE_Y + 158 + 170;
    let x = LEFT;
    card.keys.forEach((label, i) => {
      const wide = label.length > 1;
      const w = wide ? 270 : KEY;
      const t = s(0.85) + i * s(0.12);
      const press = t + s(0.75) + i * s(0.04);
      const cx = x + w / 2;
      const cap = scene.add({
        ...base(`key${i}-cap`, { outTick: DURATION }), type: "rect", size: constant(sz(w, KEY)), cornerRadius: constant(26),
        style: { fill: fill(KEYCAP), stroke: stroke(keyed<Color>(`key${i}.edge`, [[0, KEYEDGE, "hold"], [press, LIME, "hold"]]), 3) },
      });
      const text = scene.add({
        ...base(`key${i}-label`, { outTick: DURATION, x: -w / 2 + (wide ? 28 : 0), y: wide ? KEY / 2 - 76 : -60 }),
        type: "text", box: sz(wide ? w - 56 : w, 100), wrap: "none", align: wide ? "left" : "center", verticalAlign: "top",
        runs: constant([wide ? run(label, 50, 600, INK, 56) : run(label, 96, 700, INK, 100)]),
      });
      content.push(scene.add({
        ...base(`key${i}`, {
          outTick: DURATION, x: cx, y: KEY_Y,
          scale: keyed(`key${i}.s`, [[0, sc(0.001), "hold"], [t, sc(0.001), POP], [t + s(0.16), sc(1), "linear"], [press, sc(1), OUT], [press + s(0.06), sc(0.93), SETTLE], [press + s(0.2), sc(1)]]),
        }),
        type: "group", children: [cap, text],
      }));
      x += w + 28;
      if (i < card.keys!.length - 1) x += 0;
    });
  }

  const all = scene.add({
    ...base("card", { outTick: DURATION, opacity: keyed("card.op", exitKeys("card", DURATION)) }),
    type: "group", children: content, isolation: true,
  });
  return document(`rapto-title-${card.id}`, card.kicker, scene, [all], DURATION, [
    marker("title", s(0.28) + words * s(0.08) + s(0.34)),
    ...(card.keys ? [marker("keys", s(2.0))] : []),
    marker("exit", DURATION - s(0.15)),
  ]);
}

// MARK: - End card

function endCard() {
  const scene = new Scene();
  const DURATION = s(4.5);
  const ICON_AT = s(0.15);
  const panes = PANES.map((p, i) => {
    const t = ICON_AT + s(0.2) + [1, 0, 2][i] * s(0.06);
    return scene.add({
      ...base(`pane${i}`, { outTick: DURATION, inTick: t, x: p.x, y: p.y, scale: keyed(`pane${i}.s`, [[t, sc(0.001), POP], [t + s(0.2), sc(1)]]) }),
      type: "rect", size: constant(sz(p.w, p.h)), cornerRadius: constant(PANE_RADIUS), style: { fill: fill(PANE) },
    });
  });
  const { plate, link } = iconPlateAndLink(scene, "icon", ICON_AT, DURATION);
  const icon = scene.add({ ...base("icon", { outTick: DURATION, x: 560, y: 540, scale: 0.74 }), type: "group", children: [plate, ...panes, link] });

  const X = 900;
  const lines = [
    { id: "free", text: "Free for Mac", size: 150, weight: 800, color: INK, y: 300, at: s(0.7), words: 3 },
    { id: "terms", text: "No trial. No license key.", size: 56, weight: 500, color: MUTED, y: 500, at: s(1.0), words: 5 },
    { id: "url", text: "rapto.app", size: 96, weight: 750, color: LIME, y: 640, at: s(1.35), words: 1 },
  ];
  const texts = lines.map((l) => scene.add({
    ...base(l.id, { outTick: DURATION, x: X, y: l.y }),
    type: "text", box: sz(1000, l.size * 1.3), wrap: "none", align: "left", verticalAlign: "top",
    runs: constant([run(l.text, l.size, l.weight, l.color)]),
    animators: wordRise(l.id, l.words, l.at, s(0.07), Math.round(l.size * 0.3)),
  }));

  return document("rapto-end", "End card", scene, [icon, ...texts], DURATION, [
    marker("icon", ICON_AT + s(0.9)),
    marker("cta", s(2.0)),
  ]);
}

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "out");
mkdirSync(outDir, { recursive: true });
const docs = [opener(), ...CARDS.map(titleCard), endCard()];
for (const doc of docs) {
  writeFileSync(join(outDir, `${doc.id}.json`), JSON.stringify(doc));
  console.log(`wrote ${doc.id}.json: ${Object.keys(doc.compositions.main.nodes).length} nodes, ${doc.timing.durationTicks / TPS}s`);
}
