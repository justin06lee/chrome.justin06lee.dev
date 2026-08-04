"use client";

import { useState } from "react";
import { PencilRule } from "./pencil-rule";
import { Button } from "../button/button";

export default function PencilRuleDemo() {
  // Remounting is how you replay a draw-once animation — the same trick the
  // fade-in demo uses.
  const [run, setRun] = useState(0);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div>
        <p className="text-2xl tracking-tight text-white">odd jobs, done properly.</p>
        <PencilRule key={run} trigger="mount" delay={0.2} className="mt-1" />
        <p className="mt-2 text-[15px] leading-7 text-white/60">
          the rule draws left to right and the pencil leaves once it lands.
        </p>
      </div>

      <PencilRule
        key={`thick-${run}`}
        trigger="mount"
        delay={0.5}
        duration={1.8}
        thickness={2}
        color="rgba(255,255,255,0.2)"
      />

      <Button size="sm" variant="outline" onClick={() => setRun((r) => r + 1)}>
        draw again
      </Button>
    </div>
  );
}
