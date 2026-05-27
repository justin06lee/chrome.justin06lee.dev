"use client";

import { Showcase, type ShowcaseBackground } from "./showcase";

const BACKGROUNDS: ShowcaseBackground[] = ["dots", "grid", "none"];

export default function ShowcaseDemo() {
  return (
    <div className="flex flex-col gap-3 w-full">
      {BACKGROUNDS.map((bg) => (
        <Showcase key={bg} label={bg} background={bg} className="mb-0">
          <div className="h-12" />
        </Showcase>
      ))}
    </div>
  );
}
