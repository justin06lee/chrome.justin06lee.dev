"use client";

import { useState } from "react";
import { Switch } from "./switch";

export default function SwitchDemo() {
  const [open, setOpen] = useState(true);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-5 border border-white/10 bg-black p-6">
      <Switch
        checked={open}
        onChange={setOpen}
        labelPosition="start"
        label="bookings open"
        description="turns the whole calendar off without deleting anything."
      />
      <Switch
        checked={confirm}
        onChange={setConfirm}
        labelPosition="start"
        label="require confirmation"
        description="new bookings sit pending until you approve them."
      />
      <Switch checked={false} onChange={() => {}} labelPosition="start" label="sms reminders" description="not wired up yet." disabled />
    </div>
  );
}
