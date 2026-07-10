"use client";

import { useState } from "react";
import { FadeIn, staggerDelay } from "./fade-in";

const ROWS = [
  { label: "01", title: "fade in on mount" },
  { label: "02", title: "staggered by index" },
  { label: "03", title: "pure css, no motion dep" },
  { label: "04", title: "respects reduced motion" },
];

export default function FadeInDemo() {
  // Key bump remounts the list so the stagger visibly replays.
  const [cycle, setCycle] = useState(0);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-3 flex items-center font-mono text-[11px]">
        <button
          type="button"
          onClick={() => setCycle((c) => c + 1)}
          className="border border-white/20 px-2 py-1 text-white/60 transition-colors hover:border-white/50 hover:text-white"
        >
          replay
        </button>
      </div>
      <div key={cycle} className="space-y-2">
        {ROWS.map((row, i) => (
          <FadeIn
            key={row.label}
            delay={staggerDelay(i)}
            className="flex items-center gap-3 border border-white/10 bg-white/5 px-4 py-3"
          >
            <span className="font-mono text-xs tabular-nums text-white/40">{row.label}</span>
            <span className="text-sm text-white/80">{row.title}</span>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
