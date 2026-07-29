"use client";

import { useState } from "react";
import { BreakOverlay } from "./break-overlay";
import { Button } from "../button/button";

export default function BreakOverlayDemo() {
  const [open, setOpen] = useState(false);

  return (
    // anchor="container" keeps the rest screen inside this frame; the real one
    // covers the viewport.
    <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden border border-white/10 bg-black">
      <Button onClick={() => setOpen(true)}>take a break</Button>

      <BreakOverlay
        open={open}
        anchor="container"
        // Short so the demo actually reaches zero while you're looking at it.
        seconds={20}
        title="step away from the screen"
        message="look at something twenty feet away. the timer keeps running without you."
        dismissible
        extendBy={60}
        onResume={() => setOpen(false)}
        onSkip={() => setOpen(false)}
        onExtend={(added) => console.log("extended by", added, "seconds")}
        onComplete={() => setOpen(false)}
      />
    </div>
  );
}
