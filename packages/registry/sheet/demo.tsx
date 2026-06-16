"use client";

import { useState } from "react";
import { Sheet } from "./sheet";

export default function SheetDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-32 w-full items-center justify-center border border-white/10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-white/40 px-3 py-1 text-xs text-white transition hover:bg-white hover:text-black"
      >
        open sheet
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} side="right" title="settings">
        <div className="flex flex-col items-start gap-2">
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            profile
          </a>
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            preferences
          </a>
          <a href="#" className="text-sm text-white underline-offset-4 hover:underline">
            sign out
          </a>
        </div>
      </Sheet>
    </div>
  );
}
