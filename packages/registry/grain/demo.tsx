"use client";

import { useState } from "react";
import { Grain, type GrainVariant } from "./grain";
import { Segmented } from "../segmented/segmented";
import { Range } from "../range/range";
import { Checkbox } from "../checkbox/checkbox";

const VARIANTS: { value: GrainVariant; label: string }[] = [
  { value: "noise", label: "noise" },
  { value: "paper", label: "paper" },
  { value: "dots", label: "dots" },
];

export default function GrainDemo() {
  const [variant, setVariant] = useState<GrainVariant>("noise");
  const [opacity, setOpacity] = useState(0.12);
  const [animate, setAnimate] = useState(false);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Segmented options={VARIANTS} value={variant} onChange={setVariant} ariaLabel="texture" />
        <Checkbox
          label="jitter"
          checked={animate}
          onChange={(e) => setAnimate(e.target.checked)}
        />
      </div>

      <label className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          opacity
        </span>
        <Range
          min={0}
          max={0.4}
          step={0.01}
          value={opacity}
          onChange={setOpacity}
          className="max-w-60"
        />
        <span className="font-mono text-[11px] tabular-nums text-white/40">
          {opacity.toFixed(2)}
        </span>
      </label>

      {/* fixed={false} scopes the texture to this panel instead of the viewport. */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden border border-white/10 bg-white/[0.03]">
        <Grain variant={variant} opacity={opacity} animate={animate} fixed={false} />
        <p className="relative text-2xl tracking-tight text-white">textured.</p>
      </div>
    </div>
  );
}
