"use client";

import { useState } from "react";
import { CommandPalette, type PaletteItem } from "./command-palette";

const ITEMS: PaletteItem[] = [
  { label: "introduction", href: "#", group: "docs", keywords: ["getting started", "overview"] },
  { label: "installation", href: "#", group: "docs", keywords: ["setup", "cli"] },
  { label: "theming", href: "#", group: "docs", keywords: ["dark", "colors"] },
  { label: "changelog", href: "#", group: "docs", keywords: ["releases", "versions"] },
  { label: "button", href: "#", group: "components" },
  { label: "dialog", href: "#", group: "components", keywords: ["modal", "confirm"] },
  { label: "sheet", href: "#", group: "components", keywords: ["drawer", "panel"] },
  { label: "tabs", href: "#", group: "components" },
  { label: "tooltip", href: "#", group: "components", keywords: ["hint", "hover"] },
  { label: "command palette", href: "#", group: "components", keywords: ["cmd+k", "search", "spotlight"] },
];

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3 border border-white/20 p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-white/40 px-3 py-1 text-xs hover:bg-white/10"
      >
        open palette (⌘k)
      </button>
      <p className="font-mono text-[10px] text-white/40">
        or press cmd+k / ctrl+k anywhere
      </p>
      <CommandPalette items={ITEMS} open={open} onOpenChange={setOpen} />
    </div>
  );
}
