"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { useToc, type TocHeading } from "@/hooks/use-toc";

export type { TocHeading } from "@/hooks/use-toc";

// Smooth-scroll to a heading instead of the default hash jump, keeping the
// URL hash in sync. Falls back to an instant jump for reduced motion.
function scrollToHeading(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return; // no target: let the default navigation handle it
  e.preventDefault();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", `#${id}`);
}

export type TocProps = {
  headings: TocHeading[];
  /** Heading shown above the list. Defaults to "on this page". */
  label?: string;
  className?: string;
};

/**
 * Sticky table-of-contents with scroll-spy highlighting. Give it the page's
 * headings ({ id, text }); the active row tracks scroll position via the
 * headless useToc hook. Sticks below a --sticky-header-offset CSS var.
 */
export function Toc({ headings, label = "on this page", className }: TocProps) {
  const activeId = useToc(headings);
  if (headings.length === 0) return null;

  return (
    <nav
      className={cn("sticky overflow-y-auto", className)}
      style={{
        top: "var(--sticky-header-offset, 80px)",
        maxHeight: "calc(100vh - var(--sticky-header-offset, 80px) - 2rem)",
      }}
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-white/40">
        {label}
      </p>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => scrollToHeading(e, h.id)}
              aria-current={activeId === h.id ? "page" : undefined}
              className={cn(
                "block py-1 text-sm leading-5 transition-colors",
                activeId === h.id ? "text-white" : "text-white/50 hover:text-white",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
