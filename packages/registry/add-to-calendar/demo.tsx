"use client";

import { AddToCalendar } from "./add-to-calendar";

const EVENT = {
  title: "coffee with justin",
  start: Date.UTC(2026, 7, 5, 16, 0),
  end: Date.UTC(2026, 7, 5, 16, 30),
  description: "no agenda. whatever you want to talk about.",
  location: "google meet",
  uid: "demo-booking@chrome.justin06lee.dev",
};

export default function AddToCalendarDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6 border border-white/10 bg-black p-6 pb-32">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          menu
        </span>
        <AddToCalendar event={EVENT} targets={["google", "outlook", "office", "yahoo", "ics"]} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          inline
        </span>
        <AddToCalendar event={EVENT} variant="inline" targets={["google", "ics"]} />
      </div>
    </div>
  );
}
