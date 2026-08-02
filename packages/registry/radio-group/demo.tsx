"use client";

import { useState } from "react";
import { RadioGroup } from "./radio-group";

export default function RadioGroupDemo() {
  const [kind, setKind] = useState("coffee");

  return (
    <div className="w-full max-w-md border border-white/10 bg-black p-6">
      <RadioGroup
        label="what for"
        variant="cards"
        value={kind}
        onChange={setKind}
        options={[
          {
            value: "coffee",
            label: "coffee",
            description: "no agenda. whatever you want to talk about.",
            meta: "30m",
          },
          {
            value: "review",
            label: "code review",
            description: "bring a pr, a repo, or a design doc.",
            meta: "45m",
          },
          {
            value: "sync",
            label: "quick sync",
            description: "one question, one answer.",
            meta: "15m",
          },
          {
            value: "pairing",
            label: "pairing session",
            description: "booked out for the rest of the month.",
            meta: "2h",
            disabled: true,
          },
        ]}
      />
    </div>
  );
}
