"use client";

import { FadeIn, staggerDelay } from "./fade-in";

const ROWS = [
  { label: "01", title: "fade in on mount" },
  { label: "02", title: "staggered by index" },
  { label: "03", title: "pure css, no motion dep" },
  { label: "04", title: "respects reduced motion" },
];

export default function FadeInDemo() {
  return (
    <div className="w-full max-w-sm space-y-2">
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
  );
}
