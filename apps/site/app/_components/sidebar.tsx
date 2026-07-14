"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar as SidebarUi, type SidebarGroup } from "@/components/ui/sidebar";
import { REGISTRY } from "../../registry-manifest";

// Components are sourced from the registry manifest so the sidebar lists every
// component that exists and never drifts from what's been built.
const COMPONENT_ITEMS = REGISTRY.filter((m) => m.type === "registry:ui")
  .map((m) => ({ label: m.name, href: `/components/${m.name}` }))
  .sort((a, b) => a.label.localeCompare(b.label));

const GROUPS: SidebarGroup[] = [
  {
    label: "getting started",
    items: [
      { label: "introduction", href: "/docs" },
      { label: "installation", href: "/docs/cli" },
      { label: "theming", href: "/docs/theming" },
    ],
  },
  {
    label: "components",
    items: COMPONENT_ITEMS,
  },
];

// Dogfoods the registry's `sidebar` component.
export function Sidebar() {
  const pathname = usePathname();
  return (
    <SidebarUi
      groups={GROUPS}
      activeHref={pathname}
      searchable
      searchPlaceholder="search components…"
      linkComponent={Link}
    />
  );
}
