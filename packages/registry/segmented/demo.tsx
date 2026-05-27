"use client";

import { useState } from "react";
import { Segmented } from "./segmented";

export default function SegmentedDemo() {
  const [mode, setMode] = useState<"now" | "backfill">("now");
  const [view, setView] = useState<"day" | "month" | "year">("day");
  return (
    <div className="flex flex-col items-center gap-6">
      <Segmented
        size="compact"
        value={mode}
        onChange={setMode}
        options={[
          { value: "now", label: "Now" },
          { value: "backfill", label: "Backfill" },
        ]}
      />
      <Segmented
        value={view}
        onChange={setView}
        options={[
          { value: "day", label: "day" },
          { value: "month", label: "month" },
          { value: "year", label: "year" },
        ]}
      />
    </div>
  );
}
