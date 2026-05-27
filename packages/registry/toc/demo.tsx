"use client";

import { Toc } from "./toc";

const HEADINGS = [
  { id: "toc-demo-intro", text: "introduction" },
  { id: "toc-demo-install", text: "installation" },
  { id: "toc-demo-usage", text: "usage" },
  { id: "toc-demo-api", text: "api reference" },
];

export default function TocDemo() {
  return (
    <div className="flex w-full max-w-md gap-8">
      <div className="flex-1 space-y-6 text-sm text-white/70">
        {HEADINGS.map((h) => (
          <section key={h.id} id={h.id} className="space-y-1">
            <h3 className="font-semibold text-white">{h.text}</h3>
            <p>scroll the page; the active heading tracks into view.</p>
          </section>
        ))}
      </div>
      <div className="w-40 shrink-0">
        <Toc headings={HEADINGS} />
      </div>
    </div>
  );
}
