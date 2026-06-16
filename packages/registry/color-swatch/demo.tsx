"use client";

import { useState } from "react";
import {
  ColorSwatch,
  ColorSwatchPicker,
  CATEGORY_PALETTE,
  pickNextUnusedColor,
} from "./color-swatch";

export default function ColorSwatchDemo() {
  const [value, setValue] = useState<string | null>(CATEGORY_PALETTE[0]!.hex);

  return (
    <div className="flex w-64 flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-white/80">
        <ColorSwatch color={value ?? "#000000"} />
        <span className="truncate">
          {CATEGORY_PALETTE.find((c) => c.hex === value)?.name ?? "none"}
        </span>
      </div>

      <ColorSwatchPicker value={value} onChange={setValue} ariaLabel="pick a color" />

      <button
        type="button"
        onClick={() => setValue(pickNextUnusedColor(value ? [value] : []))}
        className="border border-white/20 px-2 py-1 text-left text-xs text-white/60 hover:bg-white/5"
      >
        suggest next unused
      </button>
    </div>
  );
}
