"use client";

import { useState } from "react";
import { Navbar } from "./navbar";

export default function NavbarDemo() {
  const [plays, setPlays] = useState(0);
  // The entrance runs on mount, so remounting is the only way to watch it
  // twice — bump a key rather than adding replay machinery to the component.
  const [cycle, setCycle] = useState(0);

  return (
    // The real Navbar is position:fixed; the `relative` override (tailwind-merge
    // wins on the position utility) pins it inside this demo frame instead.
    <div className="relative h-32 w-full overflow-hidden border border-white/10">
      <Navbar
        key={cycle}
        className="relative"
        entrance
        brand={<span className="text-sm text-white">justin06lee.dev</span>}
        leftLinks={[
          // No href — renders as a <button>.
          { id: "intro", label: "intro", onClick: () => setPlays((n) => n + 1) },
          // Labels are ReactNodes, so styled spans work too.
          { id: "cat", label: <span className="font-mono tracking-tight">^cat^</span>, href: "#" },
        ]}
        links={[
          { label: "calendar", href: "#" },
          { label: "articles", href: "#" },
          { label: "gallery", href: "#" },
        ]}
      />
      <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-white/40">
        <span>{plays > 0 ? `intro clicked ${plays}x` : "resize narrow for the hamburger"}</span>
        <button
          type="button"
          onClick={() => setCycle((c) => c + 1)}
          className="border border-white/20 px-2 py-1 text-white/70 transition-colors hover:bg-white/10"
        >
          replay entrance
        </button>
      </div>
    </div>
  );
}
