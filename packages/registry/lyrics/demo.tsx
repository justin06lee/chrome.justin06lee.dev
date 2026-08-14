"use client";

import { useEffect, useState } from "react";
import { Lyrics, parseLrc } from "./lyrics";

const LRC = `[ti:demo]
[00:00.00]the tape starts
[00:03.20]a room, then the room's reverb
[00:07.60]someone counting in under their breath
[00:11.90]
[00:13.40]and the whole thing tilts
[00:17.80]the way a hallway does at four in the morning
[00:23.10]nobody said it would hold
[00:27.50]nobody said it wouldn't
[00:32.00]
[00:33.60]second verse, same room
[00:37.90]colder now, or the mic thinks so
[00:42.40]the count comes back
[00:46.80]this time everybody's already playing
[00:52.00]and it ends the way it started
[00:57.30]with the tape still running`;

const LINES = parseLrc(LRC);

export default function LyricsDemo() {
  // One immutable (position, startedAt) pair, replaced on seek — the shape a
  // now-playing poll hands you. Computing startedAt during render instead would
  // hand the clock a new anchor every frame.
  const [sample, setSample] = useState<{ position: number; startedAt: number } | null>(null);

  useEffect(() => {
    setSample({ position: 0, startedAt: Date.now() });
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
        synced — clicking a line seeks
      </div>
      <Lyrics
        lines={LINES}
        position={sample?.position ?? 0}
        startedAt={sample?.startedAt}
        onSeek={(seconds) => setSample({ position: seconds, startedAt: Date.now() })}
        height={240}
        className="border-y border-white/10 py-4"
      />
      <p className="text-[13px] text-white/40">
        scroll the box by hand and auto-scroll stands down for eight seconds.
      </p>
    </div>
  );
}
