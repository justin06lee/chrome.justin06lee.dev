"use client";

import { Tooltip } from "./tooltip";

export default function TooltipDemo() {
  return (
    <div className="flex items-center justify-center gap-10 py-6">
      <Tooltip label="slides up">
        <button
          type="button"
          aria-label="top tooltip"
          className="border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
        >
          hover me
        </button>
      </Tooltip>
      <Tooltip label="slides down" side="bottom">
        <button
          type="button"
          aria-label="bottom tooltip"
          className="border border-white/20 px-3 py-1.5 text-sm hover:bg-white/5"
        >
          or focus me
        </button>
      </Tooltip>
    </div>
  );
}
