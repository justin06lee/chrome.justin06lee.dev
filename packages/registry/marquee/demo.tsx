"use client";

import { Marquee } from "./marquee";
import { Hazard } from "../hazard/hazard";

export default function MarqueeDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <Marquee
        fade
        separator={<span className="text-white/20">/</span>}
        className="border-y border-white/10 py-3"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
          now building
        </span>
      </Marquee>

      <Marquee speed={70} reverse gap={48} className="py-2">
        <span className="text-2xl tracking-tight text-white/80">
          measure twice
        </span>
        <Hazard thickness={10} className="w-16" />
        <span className="text-2xl tracking-tight text-white/80">cut once</span>
      </Marquee>

      <p className="text-[13px] text-white/40">
        hover either band to hold it.
      </p>
    </div>
  );
}
