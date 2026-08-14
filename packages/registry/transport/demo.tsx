"use client";

import { useState } from "react";
import { Transport, type RepeatMode } from "./transport";

export default function TransportDemo() {
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [skipped, setSkipped] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          full
        </div>
        <Transport
          playing={playing}
          onPlayPause={() => setPlaying((p) => !p)}
          onPrevious={() => setSkipped("previous")}
          onNext={() => setSkipped("next")}
          shuffle={shuffle}
          onShuffleChange={setShuffle}
          repeat={repeat}
          onRepeatChange={setRepeat}
        />
        <p className="mt-3 font-mono text-[11px] text-white/40">
          {playing ? "playing" : "paused"} · shuffle {shuffle ? "on" : "off"} · repeat {repeat}
          {skipped && ` · ${skipped}`}
        </p>
      </div>

      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          play only, three sizes
        </div>
        <div className="flex items-center gap-6">
          <Transport size="sm" playing={playing} onPlayPause={() => setPlaying((p) => !p)} />
          <Transport size="md" playing={playing} onPlayPause={() => setPlaying((p) => !p)} />
          <Transport size="lg" playing={playing} onPlayPause={() => setPlaying((p) => !p)} />
        </div>
      </div>

      <div>
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          buffering / disabled
        </div>
        <div className="flex items-center gap-8">
          <Transport playing onPlayPause={() => {}} loading onPrevious={() => {}} onNext={() => {}} />
          <Transport playing={false} onPlayPause={() => {}} disabled onPrevious={() => {}} onNext={() => {}} />
        </div>
      </div>
    </div>
  );
}
