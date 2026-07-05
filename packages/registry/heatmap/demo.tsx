"use client";

import { Heatmap } from "./heatmap";

// Deterministic sample values (no Math.random, so no hydration mismatch).
function sampleValues(year: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (let m = 1; m <= 12; m++) {
    const last = new Date(Date.UTC(year, m, 0)).getUTCDate();
    for (let d = 1; d <= last; d++) {
      const key = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const seed = (m * 31 + d * 17) % 11;
      out[key] = seed < 4 ? 0 : (seed - 3) * 25;
    }
  }
  return out;
}

export default function HeatmapDemo() {
  return <Heatmap values={sampleValues(2026)} year={2026} today="2026-05-24" />;
}
