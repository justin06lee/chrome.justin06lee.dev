"use client";

import { useEffect, useState } from "react";
import { Playhead } from "./playhead";

const DURATION = 214;

export default function PlayheadDemo() {
  // Stands in for a now-playing poll: a position plus the instant it was true.
  const [sample, setSample] = useState<{ position: number; startedAt: number } | null>(null);
  const [seeked, setSeeked] = useState<number | null>(null);

  useEffect(() => {
    setSample({ position: 47, startedAt: Date.now() });
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          live — extrapolating between polls
        </div>
        <Playhead
          position={sample?.position ?? 47}
          startedAt={sample?.startedAt}
          duration={DURATION}
          remaining
        />
      </div>

      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          seekable, buffered, size md
        </div>
        <Playhead
          position={seeked ?? 82}
          duration={DURATION}
          playing={false}
          buffered={140}
          size="md"
          onSeek={(seconds) => setSeeked(seconds)}
        />
        <p className="mt-3 text-[13px] text-white/40">
          {seeked === null
            ? "drag the bar, or focus it and use the arrow keys."
            : `seeked to ${seeked.toFixed(1)}s`}
        </p>
      </div>

      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          read-only, no times
        </div>
        <Playhead position={158} duration={DURATION} playing={false} showTimes={false} />
      </div>
    </div>
  );
}
