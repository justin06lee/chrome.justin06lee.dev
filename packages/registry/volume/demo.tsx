"use client";

import { useState } from "react";
import { Volume } from "./volume";

export default function VolumeDemo() {
  const [level, setLevel] = useState(0.62);
  const [muted, setMuted] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          with mute
        </div>
        <Volume value={level} onChange={setLevel} muted={muted} onMutedChange={setMuted} />
        <p className="mt-3 font-mono text-[11px] tabular-nums text-white/40">
          {muted ? `muted (holding ${Math.round(level * 100)}%)` : `${Math.round(level * 100)}%`}
        </p>
      </div>

      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          collapsible — hover it
        </div>
        <div className="flex items-center gap-4 border border-white/10 px-4 py-3">
          <span className="min-w-0 flex-1 truncate text-sm text-white/70">
            an ending (ascent)
          </span>
          <Volume value={level} onChange={setLevel} muted={muted} onMutedChange={setMuted} collapsible />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <Volume size="sm" value={level} onChange={setLevel} width={60} />
        <Volume value={0.3} onChange={() => {}} disabled />
      </div>
    </div>
  );
}
