"use client";

import { useState } from "react";
import { Intro } from "./intro";
import { Chrome } from "../chrome/chrome";
import { Donut } from "../donut/donut";

// Mirrors the justin06lee.dev homepage intro: "hi." -> a spinning ascii donut
// (here wrapped in the chrome foil) -> a welcome line, each step holding a few
// seconds with a soft fade between, in the site's text-lg typography.
const STEPS = [
  "hi.",
  <Chrome key="donut" as="div">
    <Donut width={44} height={20} isolate={false} />
  </Chrome>,
  "welcome to my component library.",
];

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
          steps={STEPS}
          stepDuration={3000}
          onComplete={() => setCycle(null)}
        />
      )}
    </div>
  );
}
