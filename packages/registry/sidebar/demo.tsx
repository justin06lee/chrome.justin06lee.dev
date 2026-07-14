"use client";

import { Sidebar, type SidebarGroup } from "./sidebar";

const GROUPS: SidebarGroup[] = [
  {
    label: "getting started",
    items: [
      { label: "introduction", href: "#introduction" },
      { label: "installation", href: "#installation" },
      { label: "theming", href: "#theming" },
    ],
  },
  {
    label: "components",
    items: [
      { label: "badge", href: "#badge" },
      { label: "button", href: "#button" },
      { label: "card", href: "#card" },
      { label: "gallery", href: "#gallery" },
      { label: "menu", href: "#menu" },
      { label: "navbar", href: "#navbar" },
      { label: "sidebar", href: "#sidebar" },
      { label: "tooltip", href: "#tooltip" },
    ],
  },
];

export default function SidebarDemo() {
  return (
    <div className="flex h-[420px] w-full overflow-hidden border border-white/10">
      <Sidebar
        groups={GROUPS}
        activeHref="#sidebar"
        searchable
        className="overflow-y-auto"
      />
      <div className="flex flex-1 items-center justify-center text-xs text-white/40">
        try the search filter
      </div>
    </div>
  );
}
