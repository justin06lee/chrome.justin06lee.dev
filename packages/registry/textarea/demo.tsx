"use client";

import { useState } from "react";
import { Textarea } from "./textarea";

export default function TextareaDemo() {
  const [v, setV] = useState("");
  const [brief, setBrief] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <Textarea
        className="w-72"
        placeholder="write something…"
        value={v}
        onChange={(e) => setV(e.target.value)}
      />

      <Textarea
        counter
        maxLength={280}
        rows={5}
        className="w-72"
        placeholder="what do you want built?"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
      />
    </div>
  );
}
