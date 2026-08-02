"use client";

import { useState } from "react";
import { Stepper } from "./stepper";
import { Button } from "../button/button";

const STEPS = [
  { label: "pick a day", description: "next 45 days" },
  { label: "pick a time", description: "shown in your zone" },
  { label: "your details", description: "name and email" },
  { label: "done", description: "invite sent" },
];

export default function StepperDemo() {
  const [current, setCurrent] = useState(1);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8 border border-white/10 bg-black p-6">
      <Stepper steps={STEPS} current={current} onStepClick={setCurrent} />

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          back
        </Button>
        <Button
          size="sm"
          variant="solid"
          disabled={current === STEPS.length - 1}
          onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
        >
          next
        </Button>
      </div>
    </div>
  );
}
