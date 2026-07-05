"use client";

import * as React from "react";
import { CountUp } from "./count-up";

export default function CountUpDemo() {
  const [target, setTarget] = React.useState(1280);

  return (
    <div className="flex flex-col items-center gap-8 font-mono">
      <div className="flex flex-col items-center gap-3">
        <CountUp value={target} className="text-5xl tracking-tight" />
        <button
          type="button"
          onClick={() => setTarget(Math.floor(Math.random() * 10000))}
          className="border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-white/70 hover:text-white"
        >
          randomize
        </button>
      </div>

      <div className="text-2xl text-white/70">
        <CountUp value={99.5} decimals={1} suffix="%" duration={1.5} />
      </div>
    </div>
  );
}
