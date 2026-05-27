"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { REGISTRY } from "../../registry-manifest";

type Group = {
  label: string;
  items: { name: string; href: string }[];
};

// Components are sourced from the registry manifest so the sidebar lists every
// component that exists and never drifts from what's been built.
const COMPONENT_ITEMS = REGISTRY.filter((m) => m.type === "registry:ui")
  .map((m) => ({ name: m.name, href: `/components/${m.name}` }))
  .sort((a, b) => a.name.localeCompare(b.name));

const GROUPS: Group[] = [
  {
    label: "getting started",
    items: [
      { name: "introduction", href: "/docs" },
      { name: "installation", href: "/docs/cli" },
      { name: "theming", href: "/docs/theming" },
    ],
  },
  {
    label: "components",
    items: COMPONENT_ITEMS,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[240px] shrink-0 border-r border-white/10 px-6 py-10 text-[13px]">
      {GROUPS.map((group) => (
        <div key={group.label} className="mb-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3">
            {group.label}
          </div>
          <ul className="space-y-1.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      "block py-0.5 transition-colors " +
                      (active
                        ? "text-white border-l-2 border-white pl-2.5 -ml-3 font-medium"
                        : "text-white/55 hover:text-white pl-0")
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
