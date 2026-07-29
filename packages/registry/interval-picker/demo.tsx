"use client";

import { useState } from "react";
import { IntervalPicker } from "./interval-picker";

export default function IntervalPickerDemo() {
  const [minutes, setMinutes] = useState(50);

  return (
    <div className="flex w-full flex-col items-start gap-5 border border-white/10 bg-black p-6">
      <IntervalPicker value={minutes} onChange={setMinutes} label="break reminder" />
      <p className="text-sm text-white/55">
        nudging you every <span className="tabular-nums text-white">{minutes}</span> minutes
      </p>
    </div>
  );
}
