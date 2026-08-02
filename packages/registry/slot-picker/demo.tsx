"use client";

import { useState } from "react";
import { SlotPicker } from "./slot-picker";

const SLOTS = [
  { value: "09:00", label: "9:00 am" },
  { value: "09:30", label: "9:30 am" },
  { value: "10:00", label: "10:00 am", disabled: true },
  { value: "10:30", label: "10:30 am" },
  { value: "11:00", label: "11:00 am" },
  { value: "13:00", label: "1:00 pm" },
  { value: "13:30", label: "1:30 pm" },
  { value: "14:00", label: "2:00 pm", note: "last" },
];

export default function SlotPickerDemo() {
  const [value, setValue] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 border border-white/10 bg-black p-6">
      <SlotPicker
        label="wednesday, august 5"
        slots={SLOTS}
        value={value}
        onChange={setValue}
        onConfirm={(v) => setBooked(v)}
        footnote="times shown in america/los_angeles"
      />
      {booked ? (
        <p className="text-sm text-white/55">
          confirmed <span className="text-white">{booked}</span>
        </p>
      ) : null}
    </div>
  );
}
