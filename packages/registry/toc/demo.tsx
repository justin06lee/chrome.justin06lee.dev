"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Toc } from "./toc";

const HEADINGS = [
  { id: "toc-demo-intro", text: "introduction" },
  { id: "toc-demo-install", text: "installation" },
  { id: "toc-demo-usage", text: "usage" },
  { id: "toc-demo-api", text: "api reference" },
];

export default function TocDemo() {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-full max-w-md gap-6 text-left">
      <div
        ref={panelRef}
        className="h-72 flex-1 overflow-y-auto border border-white/10 bg-white/[0.01] px-4"
      >
        {HEADINGS.map((h, i) => (
          <section
            key={h.id}
            id={h.id}
            // The last section fills the panel so it can scroll to the top
            // and take the highlight.
            className={cn("space-y-2 py-5", i === HEADINGS.length - 1 ? "min-h-full" : "min-h-44")}
          >
            <h3 className="text-sm font-semibold text-white">{h.text}</h3>
            <p className="text-xs leading-5 text-white/50">
              scroll this panel or click a row on the right — the active row
              follows whichever section is in view.
            </p>
            <p className="text-xs leading-5 text-white/30">
              only this panel scrolls; the page around it stays put.
            </p>
          </section>
        ))}
      </div>
      <div className="w-32 shrink-0">
        <Toc headings={HEADINGS} container={panelRef} className="!static" />
      </div>
    </div>
  );
}
