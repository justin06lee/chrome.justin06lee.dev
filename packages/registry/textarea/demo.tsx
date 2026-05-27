"use client";

import { useState } from "react";
import { Textarea } from "./textarea";

export default function TextareaDemo() {
  const [v, setV] = useState("");
  return (
    <Textarea
      className="w-72"
      placeholder="write something…"
      value={v}
      onChange={(e) => setV(e.target.value)}
    />
  );
}
