"use client";

import { useState } from "react";
import { Badge } from "./badge";

const TAGS = ["react", "next", "tailwind", "motion"];

export default function BadgeDemo() {
  const [selected, setSelected] = useState<string[]>(["react"]);
  const toggle = (t: string) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge>outline</Badge>
        <Badge variant="solid">solid</Badge>
        <Badge variant="ghost">ghost</Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {TAGS.map((t) => (
          <Badge
            key={t}
            variant="ghost"
            active={selected.includes(t)}
            onClick={() => toggle(t)}
          >
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
}
