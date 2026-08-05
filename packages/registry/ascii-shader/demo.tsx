"use client";

import { useState } from "react";
import { AsciiShader, plasma, ripple, tunnel, type ShaderFn } from "./ascii-shader";
import { Segmented } from "../segmented/segmented";
import { Button } from "../button/button";

type Preset = "plasma" | "ripple" | "tunnel";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "plasma", label: "plasma" },
  { value: "ripple", label: "ripple" },
  { value: "tunnel", label: "tunnel" },
];

const SHADERS: Record<Preset, ShaderFn> = { plasma, ripple, tunnel };

export default function AsciiShaderDemo() {
  const [preset, setPreset] = useState<Preset>("plasma");
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented options={PRESETS} value={preset} onChange={setPreset} ariaLabel="shader" />
        <Button size="sm" variant="outline" onClick={() => setPaused((p) => !p)}>
          {paused ? "play" : "pause"}
        </Button>
      </div>

      {/* Rows are auto-fit, so the height has to come from the element. */}
      <AsciiShader
        shader={SHADERS[preset]}
        paused={paused}
        size={11}
        label={`${preset} ascii shader`}
        className="h-64 border border-white/10 bg-black p-2 text-white/70"
      />
    </div>
  );
}
