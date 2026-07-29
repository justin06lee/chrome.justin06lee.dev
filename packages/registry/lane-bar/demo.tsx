"use client";

import { useState } from "react";
import { LaneBar, type Lane } from "./lane-bar";
import { Button } from "../button/button";

const TRACKS = [
  { id: "code", title: "coding — registry docs", subtitle: "deep work", accent: "#e5e5e5" },
  { id: "chess", title: "chess — blitz 5+0", subtitle: "background", accent: "#8b8b8b" },
  { id: "music", title: "listening — ambient", accent: "#5a5a5a" },
];

export default function LaneBarDemo() {
  // Start times land in state on click, never at render — the clock has to
  // agree between the server and the client.
  const [started, setStarted] = useState<Record<string, number>>({});

  const toggle = (id: string) =>
    setStarted((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) delete next[id];
      else next[id] = Date.now();
      return next;
    });

  const lanes: Lane[] = TRACKS.filter((t) => started[t.id] !== undefined).map((t) => ({
    ...t,
    startedAt: started[t.id],
    actions: (
      <Button size="sm" variant="outline" onClick={() => toggle(t.id)}>
        stop
      </Button>
    ),
  }));

  return (
    <div className="relative flex h-[320px] w-full flex-col overflow-hidden border border-white/10 bg-black">
      <div className="flex flex-1 flex-wrap items-center justify-center gap-2 p-4">
        {TRACKS.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={started[t.id] !== undefined ? "outline" : "solid"}
            onClick={() => toggle(t.id)}
          >
            {started[t.id] !== undefined ? `stop ${t.id}` : `start ${t.id}`}
          </Button>
        ))}
      </div>

      <LaneBar
        position="sticky"
        lanes={lanes}
        onLaneClick={(id) => console.log("lane clicked:", id)}
        actions={
          lanes.length > 0 ? (
            <Button size="sm" variant="ghost" onClick={() => setStarted({})}>
              stop all
            </Button>
          ) : null
        }
      />
    </div>
  );
}
