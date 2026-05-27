"use client";

import { useState } from "react";
import { Range } from "./range";

export default function RangeDemo() {
  const [v, setV] = useState(40);
  return (
    <div className="flex w-64 flex-col gap-3">
      <Range value={v} onChange={setV} ariaLabel="demo" />
      <div className="text-center font-mono text-xs text-white/50">{v}</div>
    </div>
  );
}
