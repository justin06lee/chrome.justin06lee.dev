"use client";

import { Pfp } from "./pfp";

export default function PfpDemo() {
  return (
    <div className="flex items-center gap-8">
      <Pfp src="/pfp.png" alt="justin's pfp" />
      <Pfp src="/pfp.png" alt="justin's pfp" className="size-24" scale={1.2} />
    </div>
  );
}
