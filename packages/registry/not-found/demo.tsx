"use client";

import { useState } from "react";
import { NotFound } from "./not-found";

export default function NotFoundDemo() {
  const [seed, setSeed] = useState(0);
  return (
    <div className="w-full">
      <div className="mb-3 flex justify-center">
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="border border-white/20 px-2 py-1 font-mono text-[11px] text-white/60 transition-colors hover:border-white/50 hover:text-white"
        >
          another cat
        </button>
      </div>
      <NotFound
        key={seed}
        links={[
          { label: "home", href: "#" },
          { label: "components", href: "#" },
        ]}
        className="py-8"
      />
    </div>
  );
}
