"use client";

import { useState } from "react";
import { CalendarNav, type CalendarView } from "./calendar-nav";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TODAY = new Date(2026, 5, 15); // June 15, 2026

export default function CalendarNavDemo() {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(TODAY);

  // Prev/next step by the active view's unit: ±1 day, ±1 month, or ±1 year.
  const step = (dir: 1 | -1) =>
    setDate((d) => {
      const next = new Date(d);
      if (view === "day") next.setDate(d.getDate() + dir);
      else if (view === "month") next.setMonth(d.getMonth() + dir);
      else next.setFullYear(d.getFullYear() + dir);
      return next;
    });

  const month = MONTHS[date.getMonth()] ?? "";
  const label =
    view === "day"
      ? `${month} ${date.getDate()}, ${date.getFullYear()}`
      : view === "month"
        ? `${month} ${date.getFullYear()}`
        : String(date.getFullYear());

  return (
    <div className="w-full max-w-2xl">
      <CalendarNav
        label={label}
        view={view}
        onViewChange={setView}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        onToday={() => setDate(TODAY)}
      />
    </div>
  );
}
