"use client";

import { useRouter } from "next/navigation";
import { CommandPalette, type PaletteItem } from "@/components/ui/command-palette";
import { REGISTRY } from "../../registry-manifest";

// Every component page plus the docs, searchable from anywhere with cmd+k.
const ITEMS: PaletteItem[] = [
  { label: "home", href: "/", group: "pages" },
  { label: "components", href: "/components", group: "pages" },
  { label: "examples", href: "/examples", group: "pages" },
  { label: "introduction", href: "/docs", group: "docs" },
  { label: "installation", href: "/docs/cli", group: "docs", keywords: ["cli", "init", "add"] },
  { label: "theming", href: "/docs/theming", group: "docs" },
  ...REGISTRY.filter((m) => m.type === "registry:ui")
    .map((m) => ({
      label: m.name,
      href: `/components/${m.name}`,
      group: "components",
      keywords: [m.description],
    }))
    .sort((a, b) => a.label.localeCompare(b.label)),
];

// Dogfoods the registry's `command-palette` component site-wide.
export function SiteCommandPalette() {
  const router = useRouter();
  return (
    <CommandPalette
      items={ITEMS}
      placeholder="search components…"
      onSelect={(item) => {
        if (item.href) router.push(item.href);
      }}
    />
  );
}
