"use client";

import { useState } from "react";
import { Blueprint } from "./blueprint";
import { Segmented } from "../segmented/segmented";

type Fade = "none" | "radial" | "bottom";

const FADES: { value: Fade; label: string }[] = [
  { value: "none", label: "none" },
  { value: "radial", label: "radial" },
  { value: "bottom", label: "bottom" },
];

export default function BlueprintDemo() {
  const [fade, setFade] = useState<Fade>("radial");

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Segmented options={FADES} value={fade} onChange={setFade} ariaLabel="edge fade" />

      <Blueprint
        fade={fade}
        ticks
        crosshair
        className="flex h-72 items-center justify-center border border-white/10 bg-black p-8"
      >
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            drawing no. 04
          </p>
          <p className="mt-2 text-2xl tracking-tight text-white">move the pointer</p>
          <p className="mt-1 text-[13px] text-white/45">
            the crosshair reads out in grid cells
          </p>
        </div>
      </Blueprint>
    </div>
  );
}
