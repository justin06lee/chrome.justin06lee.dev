"use client";

import { useState } from "react";
import { Vinyl } from "./vinyl";

const LABEL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#e8e8e8"/>
      <circle cx="100" cy="100" r="62" fill="none" stroke="#0a0a0a" stroke-width="3"/>
      <rect x="18" y="92" width="164" height="16" fill="#0a0a0a"/>
    </svg>`,
  );

export default function VinylDemo() {
  const [spinning, setSpinning] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <div className="flex items-end gap-8">
        <Vinyl src={LABEL} alt="record label" spinning={spinning} arm />
        <Vinyl size={88} spinning={spinning} period={2.4} />
        <Vinyl size={56} spinning={spinning} period={1.6} labelRatio={0.5} />
      </div>

      <button
        type="button"
        onClick={() => setSpinning((s) => !s)}
        className="border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/5"
      >
        {spinning ? "stop" : "start"}
      </button>

      <p className="text-[13px] text-white/40">
        stopping holds the record where it is — starting picks up from there.
      </p>
    </div>
  );
}
