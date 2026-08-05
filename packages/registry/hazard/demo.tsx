"use client";

import { useState } from "react";
import { Hazard, HazardFrame } from "./hazard";
import { Button } from "../button/button";

export default function HazardDemo() {
  const [animate, setAnimate] = useState(true);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <Hazard animate={animate} />

      <HazardFrame animate={animate} edges={["left"]} thickness={6}>
        <div className="border border-white/10 bg-black py-6 pl-10 pr-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            site notice
          </p>
          <p className="mt-2 text-[15px] leading-7 text-white/80">
            work in progress. mind the scaffolding.
          </p>
        </div>
      </HazardFrame>

      <div className="flex items-center gap-6">
        <Hazard orientation="vertical" animate={animate} className="h-16" thickness={6} />
        <Hazard animate={animate} angle={-45} pitch={20} thickness={14} className="flex-1" />
      </div>

      <Button size="sm" variant="outline" onClick={() => setAnimate((a) => !a)}>
        {animate ? "stop" : "march"}
      </Button>
    </div>
  );
}
