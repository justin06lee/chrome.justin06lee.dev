"use client";

import { Skeleton } from "./skeleton";

export default function SkeletonDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6 border border-white/10 bg-black p-6">
      <div className="flex items-start gap-4">
        <Skeleton variant="circle" label={null} />
        <div className="flex-1">
          <Skeleton variant="text" lines={3} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }, (_, i) => (
          <Skeleton key={i} height="2.25rem" label={i === 0 ? "loading slots" : null} />
        ))}
      </div>
    </div>
  );
}
