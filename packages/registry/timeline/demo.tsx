"use client";

import { Timeline } from "./timeline";

export default function TimelineDemo() {
  return (
    <div className="h-[420px] w-full max-w-md overflow-y-auto">
      <Timeline
        showNow
        events={[
          { startMin: 8 * 60, endMin: 9 * 60 + 30, label: "deep work", color: "#6ee7b7" },
          { startMin: 10 * 60, endMin: 11 * 60, label: "standup", color: "#93c5fd" },
          { startMin: 13 * 60, endMin: 14 * 60 + 30, label: "reading", color: "#c4b5fd" },
          { startMin: 22 * 60, endMin: 23 * 60, label: "sleep", color: "#fca5a5" },
        ]}
      />
    </div>
  );
}
