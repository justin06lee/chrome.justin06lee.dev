"use client";

import { useState } from "react";
import { Stamp, type StampSize } from "./stamp";
import { Segmented } from "../segmented/segmented";
import { Checkbox } from "../checkbox/checkbox";

const SIZES: { value: StampSize; label: string }[] = [
  { value: "sm", label: "sm" },
  { value: "md", label: "md" },
  { value: "lg", label: "lg" },
];

export default function StampDemo() {
  const [size, setSize] = useState<StampSize>("md");
  const [distress, setDistress] = useState(true);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5">
      <div className="flex flex-wrap items-center gap-4">
        <Segmented options={SIZES} value={size} onChange={setSize} ariaLabel="size" />
        <Checkbox
          label="distress"
          checked={distress}
          onChange={(e) => setDistress(e.target.checked)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Stamp size={size} distress={distress}>
          received
        </Stamp>
        <Stamp size={size} distress={distress} rotate={6} sub="04 aug">
          in progress
        </Stamp>
        <Stamp size={size} distress={distress} rotate={-4} color="rgba(248,113,113,0.7)">
          void
        </Stamp>
      </div>

      {/* The typical use: absolutely positioned over the thing it marks. */}
      <div className="relative border border-white/10 bg-black p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          work order
        </p>
        <p className="mt-2 text-lg text-white">oj-0042 — rebuild the intake form</p>
        <p className="mt-1 text-[13px] text-white/45">submitted 4 august</p>
        <Stamp size="lg" rotate={-14} distress={distress} className="absolute right-6 top-6">
          filed
        </Stamp>
      </div>
    </div>
  );
}
