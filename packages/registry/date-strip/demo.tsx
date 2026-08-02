"use client";

import { useState } from "react";
import { DateStrip } from "./date-strip";

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

// A fortnight starting Monday 3 August 2026, weekends closed.
const DAYS = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 7, 3 + i));
  const weekday = date.getUTCDay();
  const closed = weekday === 0 || weekday === 6;
  return {
    value: date.toISOString().slice(0, 10),
    label: String(date.getUTCDate()),
    weekday: WEEKDAYS[weekday],
    count: closed ? 0 : ((i * 3) % 5) + 1,
    today: i === 0,
  };
});

export default function DateStripDemo() {
  const [value, setValue] = useState(DAYS[0]?.value ?? "");
  const picked = DAYS.find((d) => d.value === value);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 border border-white/10 bg-black p-6">
      <DateStrip label="august 2026" days={DAYS} value={value} onChange={setValue} />
      <p className="text-sm text-white/55">
        {picked ? (
          <>
            <span className="text-white">{picked.count}</span> times on august {picked.label}
          </>
        ) : null}
      </p>
    </div>
  );
}
