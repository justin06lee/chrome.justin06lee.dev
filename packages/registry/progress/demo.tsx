"use client";

import { useEffect, useState } from "react";
import { Progress } from "./progress";

export default function ProgressDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 4)), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex w-full flex-col gap-7 border border-white/10 bg-black p-6">
      <Progress value={value} label="today's focus" showValue ariaLabel="today's focus" />
      <Progress value={5} max={8} size="lg" bordered label="sessions" valueText="5 of 8" showValue ariaLabel="sessions" />
      <Progress indeterminate size="sm" label="syncing" showValue ariaLabel="syncing" />
    </div>
  );
}
