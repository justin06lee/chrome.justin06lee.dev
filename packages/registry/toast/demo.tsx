"use client";

import { ToastProvider, useToast } from "./toast";
import { Button } from "../button/button";

function Triggers() {
  const { toast, dismiss } = useToast();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="sm"
        onClick={() => toast({ title: "timer started", description: "deep work — writing" })}
      >
        default
      </Button>
      <Button
        size="sm"
        onClick={() =>
          toast({ variant: "success", title: "logged 1h 12m", description: "added to today" })
        }
      >
        success
      </Button>
      <Button
        size="sm"
        onClick={() =>
          toast({
            variant: "danger",
            title: "couldn't save the entry",
            description: "you're offline — it'll retry.",
            // Sticky, because the action has to still be there when the user
            // finally looks over at it.
            duration: 0,
            action: (
              <button
                type="button"
                onClick={() => dismiss()}
                className="border border-red-400/60 px-2 py-1 text-[11px] text-red-300 transition hover:bg-red-400/10"
              >
                retry
              </button>
            ),
          })
        }
      >
        danger
      </Button>
    </div>
  );
}

export default function ToastDemo() {
  return (
    // anchor="container" keeps the stack inside this frame instead of pinning
    // it to the page — the real thing defaults to the viewport.
    <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden border border-white/10 bg-black">
      <ToastProvider anchor="container" position="bottom-right" duration={5000}>
        <Triggers />
      </ToastProvider>
    </div>
  );
}
