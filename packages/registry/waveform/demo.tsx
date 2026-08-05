"use client";

import { useState } from "react";
import { Waveform, samplePeaks } from "./waveform";

// A deterministic stand-in for decoded audio: two drifting partials with a
// slow envelope over them, sampled the same way real pcm would be.
const PCM = Array.from({ length: 12000 }, (_, i) => {
  const t = i / 12000;
  const envelope = 0.35 + 0.65 * Math.abs(Math.sin(t * Math.PI * 2.3));
  const body = Math.sin(i * 0.031) * 0.6 + Math.sin(i * 0.0071) * 0.4;
  return body * envelope;
});

const PEAKS = samplePeaks(PCM, 96);

export default function WaveformDemo() {
  const [progress, setProgress] = useState(0.38);

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          seekable
        </div>
        <Waveform peaks={PEAKS} progress={progress} onSeek={setProgress} />
        <p className="mt-3 font-mono text-[11px] tabular-nums text-white/40">
          {(progress * 100).toFixed(0)}% — click anywhere on the wave
        </p>
      </div>

      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          mirrored, taller bars
        </div>
        <Waveform peaks={PEAKS} progress={progress} mirror height={64} barWidth={5} gap={3} />
      </div>

      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          inline, unplayed
        </div>
        <Waveform peaks={samplePeaks(PCM, 40)} height={20} barWidth={2} gap={1} />
      </div>
    </div>
  );
}
