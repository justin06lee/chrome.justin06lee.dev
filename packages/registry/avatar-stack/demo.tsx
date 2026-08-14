"use client";

import { useState } from "react";
import { AvatarStack, type Person } from "./avatar-stack";

const PEOPLE: Person[] = [
  { id: "1", name: "ana lee" },
  { id: "2", name: "marco" },
  { id: "3", name: "jun hwang" },
  { id: "4", name: "priya r" },
  { id: "5", name: "tomás" },
  { id: "6", name: "wren" },
  { id: "7", name: "kai" },
];

export default function AvatarStackDemo() {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-4">
        <AvatarStack people={PEOPLE} size="xs" max={4} />
        <AvatarStack people={PEOPLE} size="sm" max={5} onSelect={(p) => setPicked(p.name)} />
        <AvatarStack people={PEOPLE.slice(0, 3)} size="md" total={128} />
      </div>

      <p className="text-[13px] text-white/40">
        {picked ? `picked ${picked}` : "hover a face for its name; the last stack knows there are 128 in the room."}
      </p>

      <div className="flex items-center gap-3 border border-white/10 px-4 py-3">
        <AvatarStack people={PEOPLE} max={4} size="xs" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          listening now
        </span>
      </div>
    </div>
  );
}
