// Shared bake registry for <Donut/>. Every Donut with an identical config shares
// ONE entry: one precomputed array of frame strings, baked once. Steady-state
// animation is then literally `pre.textContent = frames[i]` — pure array
// iteration, zero per-frame math.
//
// The array is filled by whichever finishes first:
//   - a single process-wide web worker (off-thread, preferred), or
//   - a chunked main-thread bake (fallback) that fills it over a few idle slices.
// The main-thread fallback ALSO fires if the worker is present but never answers
// (broken/blocked in some bundlers), so playback always converges to smooth
// array iteration within ~1s regardless of environment. N donuts on a page never
// spawn N workers or recompute the same frame twice.
import { makeDonutRenderer, indicesToString, type DonutConfig } from "./donut-frames";
import type { BakeRequest, BakeResult } from "./donut.worker";

export interface DonutHandle {
  key: string;
  cfg: DonutConfig;
  N: number;
  bufSize: number;
  width: number;
  height: number;
  chars: string;
  live: ReturnType<typeof makeDonutRenderer>;
  /** Precomputed frame strings, shared across every instance. Filled lazily/by bake. */
  frames: (string | undefined)[];
  /** True once every frame string is materialised — pure array iteration from here. */
  ready: boolean;
  bakeStarted: boolean;
  refs: number;
}

const handles = new Map<string, DonutHandle>();

// --- one process-wide worker, created lazily, with graceful fallback ----------
let worker: Worker | null = null;
let workerTried = false;

function ensureWorker(): void {
  if (workerTried) return;
  workerTried = true;
  if (typeof Worker === "undefined") return;
  try {
    worker = new Worker(new URL("./donut.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<BakeResult>) => fillFromBuffer(e.data.key, e.data.buf);
    // A worker that fails to load just leaves entries to the main-thread bake.
    worker.onerror = () => {
      worker = null;
    };
  } catch {
    worker = null;
  }
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function keyOf(cfg: DonutConfig): string {
  return [
    cfg.width,
    cfg.height,
    round(cfg.R),
    round(cfg.r),
    round(cfg.K),
    round(cfg.D),
    cfg.du ?? 0,
    cfg.dv ?? 0,
    round(cfg.Lx),
    round(cfg.Ly),
    round(cfg.Lz),
    cfg.chars,
    round(cfg.speed),
    round(cfg.yScale),
    cfg.isLowEnd ? 1 : 0,
  ].join("|");
}

/** Worker delivered the full index buffer — materialise every frame string at once (~ms). */
function fillFromBuffer(key: string, buf: Uint8Array): void {
  const h = handles.get(key);
  if (!h || h.ready) return;
  for (let fi = 0; fi < h.N; fi++) {
    h.frames[fi] = indicesToString(buf, fi * h.bufSize, h.width, h.height, h.chars);
  }
  h.ready = true;
}

/** Fallback: bake the loop on the main thread, spread across idle slices (non-blocking). */
function mainThreadBake(h: DonutHandle): void {
  if (h.ready) return;
  const CHUNK = 48;
  let fi = 0;
  const schedule: (cb: () => void) => void =
    typeof requestIdleCallback !== "undefined"
      ? (cb) => requestIdleCallback(() => cb())
      : (cb) => setTimeout(cb, 0);
  function step(): void {
    if (h.ready) return; // worker beat us to it
    const end = Math.min(h.N, fi + CHUNK);
    for (; fi < end; fi++) {
      if (h.frames[fi] === undefined) h.frames[fi] = h.live.renderString(fi);
    }
    if (fi < h.N) schedule(step);
    else h.ready = true;
  }
  schedule(step);
}

function scheduleBake(h: DonutHandle): void {
  if (h.bakeStarted) return;
  h.bakeStarted = true;
  ensureWorker();
  if (worker) {
    worker.postMessage({ key: h.key, cfg: h.cfg } satisfies BakeRequest);
    // Safety net: if the worker never answers, fall back to a main-thread bake.
    setTimeout(() => {
      if (!h.ready) mainThreadBake(h);
    }, 1000);
  } else {
    mainThreadBake(h);
  }
}

/** Get (creating if needed) the shared bake for this config and bump its refcount. */
export function acquireBake(cfg: DonutConfig): DonutHandle {
  const key = keyOf(cfg);
  let h = handles.get(key);
  if (!h) {
    const live = makeDonutRenderer(cfg);
    h = {
      key,
      cfg,
      N: live.N,
      bufSize: live.bufSize,
      width: cfg.width,
      height: cfg.height,
      chars: cfg.chars,
      live,
      frames: new Array(live.N),
      ready: false,
      bakeStarted: false,
      refs: 0,
    };
    handles.set(key, h);
    scheduleBake(h);
  }
  h.refs++;
  return h;
}

/** Drop a reference. The entry (and its warm frame array) is kept for fast remounts. */
export function releaseBake(h: DonutHandle): void {
  h.refs = Math.max(0, h.refs - 1);
}

/**
 * The printable `<pre>` string for frame `fi`. Once baked this is a plain array
 * read; before the bake lands it computes (and shares) the frame on demand so the
 * same frame is never rendered twice across instances.
 */
export function frameString(h: DonutHandle, fi: number): string {
  const cached = h.frames[fi];
  if (cached !== undefined) return cached;
  const s = h.live.renderString(fi);
  h.frames[fi] = s;
  return s;
}
