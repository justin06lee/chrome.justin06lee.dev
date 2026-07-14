"use client";

import { useState } from "react";
import { Intro } from "./intro";
import { Chrome } from "../chrome/chrome";
import { Donut } from "../donut/donut";

// Mirrors the justin06lee.dev homepage intro: a chrome-foiled ascii donut
// holds on top while the greeting lines take turns in the slot beneath it,
// then the whole scene fades out to reveal the page.
const HERO = (
  <Chrome as="div">
    <Donut width={44} height={20} isolate={false} />
  </Chrome>
);

// The "im justin." line embeds the pfp inline in parens, exactly like the
// justin06lee.dev intro does.
const JUSTIN_LINE = (
  <span className="inline-flex items-center gap-1.5">
    <span>im justin.</span>
    <span className="inline-flex items-center gap-0.5">
      <span>(</span>
      <span className="relative inline-block size-7 overflow-hidden align-middle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/pfp.png"
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      </span>
      <span>)</span>
    </span>
  </span>
);

const LINES = ["hi.", JUSTIN_LINE, "welcome to my component library."];

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
          hero={HERO}
          lines={LINES}
          onComplete={() => setCycle(null)}
        />
      )}
    </div>
  );
}
