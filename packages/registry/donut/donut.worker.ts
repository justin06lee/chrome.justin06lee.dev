// Background donut baker. Receives `{ key, cfg }`, renders every frame of one
// seamless loop into a single Uint8Array of char-ramp indices, and transfers the
// underlying buffer back (zero-copy), tagged with `key` so the main thread can
// route it to the right cache entry. A single worker bakes every distinct config
// sequentially. The main thread never does this math.
import { makeDonutRenderer, type DonutConfig } from "./donut-frames";

export type BakeRequest = { key: string; cfg: DonutConfig };
export type BakeResult = {
  key: string;
  buf: Uint8Array; // N * width * height char-ramp indices, frame-major
};

const ctx = self as unknown as Worker;

ctx.onmessage = (e: MessageEvent<BakeRequest>) => {
  const { key, cfg } = e.data;
  const renderer = makeDonutRenderer(cfg);
  const { N, bufSize } = renderer;
  const buf = new Uint8Array(N * bufSize);
  for (let fi = 0; fi < N; fi++) renderer.renderToIndices(fi, buf, fi * bufSize);
  ctx.postMessage({ key, buf } satisfies BakeResult, [buf.buffer]);
};
