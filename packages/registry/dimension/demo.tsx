"use client";

import { useState } from "react";
import { Dimension, type DimensionCap } from "./dimension";
import { Segmented } from "../segmented/segmented";

const CAPS: { value: DimensionCap; label: string }[] = [
  { value: "arrow", label: "arrow" },
  { value: "tick", label: "tick" },
  { value: "dot", label: "dot" },
  { value: "none", label: "none" },
];

export default function DimensionDemo() {
  const [cap, setCap] = useState<DimensionCap>("arrow");

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <Segmented options={CAPS} value={cap} onChange={setCap} ariaLabel="cap style" />

      <div className="flex gap-4">
        <div className="flex-1">
          <Dimension label="1 200" cap={cap} ariaLabel="width: 1200 millimetres" />
          <div className="mt-2 flex h-40 items-center justify-center border border-white/15 bg-white/[0.02]">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30">
              plan
            </span>
          </div>
          <Dimension label="1 200" cap={cap} className="mt-2" />
        </div>

        <Dimension label="640" cap={cap} orientation="vertical" className="mt-8 mb-8" />
      </div>
    </div>
  );
}
