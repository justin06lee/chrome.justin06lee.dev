"use client";

import { useState } from "react";
import { TimerRing } from "./timer-ring";
import { Button } from "../button/button";

const SESSION_MS = 45_000;

export default function TimerRingDemo() {
  const [run, setRun] = useState<{ start: number; end: number } | null>(null);
  const [done, setDone] = useState(false);

  const startRun = () => {
    const start = Date.now();
    setDone(false);
    setRun({ start, end: start + SESSION_MS });
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 border border-white/10 bg-black p-8">
      <div className="flex flex-wrap items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-3">
          {run ? (
            <TimerRing
              key={run.start}
              startedAt={run.start}
              endsAt={run.end}
              direction="drain"
              ariaLabel="time until break"
              onComplete={() => setDone(true)}
            />
          ) : (
            <TimerRing value={0} label="00:45" ariaLabel="time until break" />
          )}
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            {done ? "break time" : "until break"}
          </span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <TimerRing value={68} size={96} thickness={4} ariaLabel="weekly goal" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            weekly goal
          </span>
        </div>
      </div>
      <Button size="sm" variant={run ? "outline" : "solid"} onClick={run ? () => setRun(null) : startRun}>
        {run ? "reset" : "start session"}
      </Button>
    </div>
  );
}
