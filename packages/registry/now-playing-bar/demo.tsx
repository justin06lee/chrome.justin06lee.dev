"use client";

import { useState } from "react";
import { NowPlayingBar } from "./now-playing-bar";
import { Button } from "../button/button";

export default function NowPlayingBarDemo() {
  const [startedAt, setStartedAt] = useState<number | undefined>(undefined);
  const running = startedAt !== undefined;

  return (
    <div className="relative flex h-[220px] w-full flex-col overflow-hidden border border-white/10 bg-black">
      <div className="flex flex-1 items-center justify-center">
        <Button variant={running ? "outline" : "solid"} onClick={() => setStartedAt(running ? undefined : Date.now())}>
          {running ? "Stop" : "Start"}
        </Button>
      </div>
      <NowPlayingBar
        position="sticky"
        title="Deep work — writing"
        subtitle="focus session"
        accent="#6ee7b7"
        startedAt={startedAt}
        actions={
          running ? (
            <Button size="sm" variant="outline" onClick={() => setStartedAt(undefined)}>
              Stop
            </Button>
          ) : null
        }
      />
    </div>
  );
}
