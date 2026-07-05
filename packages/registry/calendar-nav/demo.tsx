"use client";

import { useState } from "react";
import { CalendarNav, type CalendarView } from "./calendar-nav";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarNavDemo() {
  const [view, setView] = useState<CalendarView>("month");
  // Absolute month index since year 0; lets prev/next roll across years.
  const [monthIndex, setMonthIndex] = useState(2026 * 12 + 5); // June 2026

  const year = Math.floor(monthIndex / 12);
  const month = MONTHS[monthIndex % 12] ?? "";

  const label =
    view === "year" ? String(year) : `${month} ${year}`;

  return (
    <div className="w-full max-w-2xl">
      <CalendarNav
        label={label}
        view={view}
        onViewChange={setView}
        onPrev={() => setMonthIndex((i) => i - 1)}
        onNext={() => setMonthIndex((i) => i + 1)}
        onToday={() => setMonthIndex(2026 * 12 + 5)}
      />
    </div>
  );
}
