"use client";

import { Clock } from "./clock";

const ZONES = [
  { zone: "America/Los_Angeles", label: "sfo" },
  { zone: "Europe/London", label: "lhr" },
  { zone: "Asia/Seoul", label: "icn" },
];

export default function ClockDemo() {
  return (
    <div className="flex w-full flex-col gap-6 border border-white/10 bg-black p-6">
      <div className="flex flex-wrap items-end justify-center gap-8">
        {ZONES.map((z) => (
          <div key={z.zone} className="flex flex-col items-center gap-3">
            <Clock variant="analog" timeZone={z.zone} size={104} />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
              {z.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center border-t border-white/10 pt-6">
        <Clock variant="both" timeZone="Asia/Seoul" size={64} showZone hour12 sweep />
      </div>
    </div>
  );
}
