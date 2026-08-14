"use client";

import { useState } from "react";
import { SoundBars } from "./sound-bars";

export default function SoundBarsDemo() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center gap-2">
          <SoundBars size="sm" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">sm</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SoundBars size="md" bars={5} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">md</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SoundBars size="lg" bars={7} speed={0.8} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">lg</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SoundBars size="lg" bars={7} accent="#ff5c5c" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">accent</span>
        </div>
      </div>

      <div className="border border-white/10">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03]"
        >
          <SoundBars paused={paused} size="sm" label={null} className="text-white/70" />
          <span className="min-w-0 flex-1 truncate text-sm">weightless</span>
          <span className="font-mono text-[11px] tabular-nums text-white/40">
            {paused ? "paused" : "playing"}
          </span>
        </button>
      </div>

      <p className="text-[13px] text-white/40">click the row to pause the meter.</p>
    </div>
  );
}
