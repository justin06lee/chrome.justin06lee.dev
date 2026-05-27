"use client";

import { useState } from "react";
import { Calendar } from "./calendar";

export default function CalendarDemo() {
  const [month, setMonth] = useState("2026-05");
  const [selected, setSelected] = useState<string | null>("2026-05-24");
  return (
    <Calendar
      month={month}
      onMonthChange={setMonth}
      selected={selected}
      onSelect={setSelected}
      today="2026-05-24"
    />
  );
}
