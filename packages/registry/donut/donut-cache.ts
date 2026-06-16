// Shared bake registry for <Donut/>. Every Donut with an identical config shares
// ONE cache entry: one frame-string cache, one set of baked frames, and at most
// one bake request to a single process-wide worker. This means N donuts on a page
// never spin up N workers or recompute the same frames N times — they all replay
// the same data.
//
// Even with no worker available, playback stays smooth: each unique frame's string
// is computed at most once (the first time it is shown) and cached, so the donut
// math is amortised to ~one frame per animation tick during the first loop, then
// every later loop is a pure textContent swap. The worker is a pure accelerator —
// it pre-bakes the whole loop off-thread so even the first loop is instant.
import { makeDonutRenderer, indicesToString, type DonutConfig } from "./donut-frames";
import type { BakeResult } from "./donut.worker";

export interface DonutHandle {
  key: string;
  N: number;
  bufSize: number;
  width: number;
  height: number;
  chars: string;
  live: ReturnType<typeof makeDonutRenderer>;
  /** Lazily materialised frame strings, shared across every instance. */
  strCache: (string | undefined)[];
  /** Fully baked index buffer once the worker delivers it; null until then. */
  buf: Uint8Array | null;
  refs: number;
}

const handles = new Map<string, DonutHandle>();

// --- single process-wide worker, created lazily, with graceful fallback --------
let worker: Worker | null = null;
let workerTried = false;

function ensureWorker(): void {
  if (workerTried) return;
  workerTried = true;
  if (typeof Worker === "undefined") return;
  try {
    worker = new Worker(new URL("./donut.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<BakeResult>) => {
      const h = handles.get(e.data.key);
      if (h) h.buf = e.data.buf;
    };
    // A worker that fails to load (e.g. a bundler that can't resolve the module
    // URL) just leaves buf null forever — the lazy strCache path keeps playback
    // smooth regardless, so we simply drop the worker.
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

/** Get (creating if needed) the shared bake for this config and bump its refcount. */
export function acquireBake(cfg: DonutConfig): DonutHandle {
  const key = keyOf(cfg);
  let h = handles.get(key);
  if (!h) {
    const live = makeDonutRenderer(cfg);
    h = {
      key,
      N: live.N,
      bufSize: live.bufSize,
      width: cfg.width,
      height: cfg.height,
      chars: cfg.chars,
      live,
      strCache: new Array(live.N),
      buf: null,
      refs: 0,
    };
    handles.set(key, h);
    ensureWorker();
    worker?.postMessage({ key, cfg } satisfies import("./donut.worker").BakeRequest);
  }
  h.refs++;
  return h;
}

/** Drop a reference. The entry (and its warm caches) is kept for fast remounts. */
export function releaseBake(h: DonutHandle): void {
  h.refs = Math.max(0, h.refs - 1);
}

/** The printable `<pre>` string for frame `fi`, computed once and shared. */
export function frameString(h: DonutHandle, fi: number): string {
  let s = h.strCache[fi];
  if (s !== undefined) return s;
  s = h.buf
    ? indicesToString(h.buf, fi * h.bufSize, h.width, h.height, h.chars)
    : h.live.renderString(fi);
  h.strCache[fi] = s;
  return s;
}
