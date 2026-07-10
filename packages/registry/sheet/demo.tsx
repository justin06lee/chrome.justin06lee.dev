"use client";

import { useState, type ReactNode } from "react";
import { Sheet } from "./sheet";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/50">
      {children}
    </div>
  );
}

export default function SheetDemo() {
  const [open, setOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);

  return (
    <div className="flex h-32 w-full items-center justify-center gap-3 border border-white/10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-white/40 px-3 py-1 text-xs text-white transition hover:bg-white hover:text-black"
      >
        open right
      </button>
      <button
        type="button"
        onClick={() => setDayOpen(true)}
        className="border border-white/40 px-3 py-1 text-xs text-white transition hover:bg-white hover:text-black"
      >
        open bottom
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} side="right" title="settings">
        <div className="flex flex-col items-start gap-2">
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            profile
          </a>
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            preferences
          </a>
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            sign out
          </a>
        </div>
      </Sheet>

      {/* Sheets are headless about their contents — this one carries a small
          day panel with labeled sections, not just a list of buttons. */}
      <Sheet
        open={dayOpen}
        onClose={() => setDayOpen(false)}
        side="bottom"
        title="today"
        className="h-96"
      >
        <div className="mx-auto max-w-md space-y-4 text-sm">
          <section>
            <SectionLabel>now playing</SectionLabel>
            <div className="text-xs text-white/40">nothing running</div>
          </section>

          <section>
            <SectionLabel>sleep</SectionLabel>
            <button
              type="button"
              className="w-full border border-white/20 px-3 py-2 text-left text-sm hover:bg-white/10"
            >
              sleep
            </button>
          </section>

          <section>
            <SectionLabel>planned today</SectionLabel>
            <div className="text-xs text-white/40">no timed plans for this day</div>
          </section>

          <section>
            <SectionLabel>activity log</SectionLabel>
            <div className="space-y-1">
              <div className="flex w-full items-center gap-2 border border-white/15 px-3 py-2">
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/50">
                  08:10–09:40
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="size-2 shrink-0 border border-white/30 bg-emerald-300" />
                  <span className="truncate">deep work — registry docs</span>
                </span>
              </div>
              <div className="flex w-full items-center gap-2 border border-white/15 px-3 py-2">
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/50">
                  10:00–10:25
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="size-2 shrink-0 border border-white/30 bg-sky-300" />
                  <span className="truncate">reading — day view notes</span>
                </span>
              </div>
            </div>
          </section>

          <section>
            <button
              type="button"
              className="w-full border border-dashed border-white/20 px-3 py-2 text-left text-sm text-white/70 hover:bg-white/5"
            >
              + new activity
            </button>
          </section>
        </div>
      </Sheet>
    </div>
  );
}
