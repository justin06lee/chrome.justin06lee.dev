"use client";

import { useCallback, useState } from "react";
import { Spectrum } from "./spectrum";

const BARS = 40;

export default function SpectrumDemo() {
  const [paused, setPaused] = useState(false);

  // Stands in for an AnalyserNode: a bass-weighted curve with three partials
  // drifting across it, so the columns behave like music rather than noise.
  const sample = useCallback((time: number) => {
    const t = time / 1000;
    return Array.from({ length: BARS }, (_, i) => {
      const x = i / (BARS - 1);
      const tilt = Math.pow(1 - x, 1.6);
      const partials =
        0.5 + 0.5 * Math.sin(t * 2.1 + x * 9) * Math.sin(t * 0.7 + x * 3.3) +
        0.25 * Math.sin(t * 5.3 - x * 17);
      return Math.max(0, Math.min(1, tilt * partials * 1.15));
    });
  }, []);

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Spectrum sample={sample} bars={BARS} paused={paused} height={96} className="border-b border-white/10" />

      <div className="flex items-center gap-6">
        <Spectrum sample={sample} bars={24} paused={paused} mirror height={48} barWidth={4} />
        <Spectrum sample={sample} bars={12} paused={paused} height={48} barWidth={3} peakHold={false} accent="#ff5c5c" />
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="self-start border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/5"
      >
        {paused ? "resume" : "pause"}
      </button>
    </div>
  );
}
