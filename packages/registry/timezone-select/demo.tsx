"use client";

import { useState } from "react";
import { TimezoneSelect } from "./timezone-select";

export default function TimezoneSelectDemo() {
  const [zone, setZone] = useState("America/Los_Angeles");

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 border border-white/10 bg-black p-6 pb-40">
      <TimezoneSelect label="your time zone" value={zone} onChange={setZone} liveSeconds />
      <p className="text-sm text-white/55">
        slots will be shown in <span className="text-white">{zone}</span>
      </p>
    </div>
  );
}
