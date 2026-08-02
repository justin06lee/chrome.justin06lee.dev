"use client";

import { useState } from "react";
import {
  AvailabilityGrid,
  isAvailabilityValid,
  type AvailabilityRange,
} from "./availability-grid";
import { Button } from "../button/button";

const INITIAL: AvailabilityRange[] = [
  { weekday: 1, startMin: 540, endMin: 720 },
  { weekday: 1, startMin: 840, endMin: 1020 },
  { weekday: 2, startMin: 540, endMin: 1020 },
  { weekday: 3, startMin: 540, endMin: 1020 },
  { weekday: 4, startMin: 600, endMin: 960 },
];

export default function AvailabilityGridDemo() {
  const [ranges, setRanges] = useState(INITIAL);
  const valid = isAvailabilityValid(ranges);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 border border-white/10 bg-black p-6">
      <AvailabilityGrid value={ranges} onChange={setRanges} />
      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
        <Button size="sm" variant="solid" disabled={!valid}>
          save
        </Button>
        <span className="text-[13px] text-white/40">
          {ranges.length} window{ranges.length === 1 ? "" : "s"} across the week
        </span>
      </div>
    </div>
  );
}
