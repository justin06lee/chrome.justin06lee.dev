"use client";

import { useState } from "react";
import { Intro } from "./intro";

export default function IntroDemo() {
  // Remount key so the intro can be replayed from the start each time.
  const [cycle, setCycle] = useState<number | null>(null);

  return (
    <div className="flex h-32 w-full items-center justify-center border border-white/10">
      <button
        type="button"
        onClick={() => setCycle((c) => (c ?? 0) + 1)}
        className="border border-white/40 px-3 py-1 text-xs text-white transition hover:bg-white hover:text-black"
      >
        play intro
      </button>

      {cycle !== null && (
        // No persistKey here, so it replays on every click. onComplete unmounts it.
        <Intro
          key={cycle}
          steps={["hi.", "im a registry component.", "welcome."]}
          stepDuration={1500}
          onComplete={() => setCycle(null)}
        />
      )}
    </div>
  );
}
