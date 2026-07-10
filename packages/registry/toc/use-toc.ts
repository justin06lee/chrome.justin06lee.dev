"use client";

import { useEffect, useState } from "react";

export type TocHeading = {
  id: string;
  text: string;
};

/**
 * Headless scroll-spy: observes the elements whose ids are given and returns
 * the id of the one currently in view. No styling. The rootMargin keeps a
 * heading "active" until it scrolls into the top ~30% of the viewport.
 */
export function useToc(headings: TocHeading[], rootMargin = "-80px 0px -70% 0px"): string {
  const [activeId, setActiveId] = useState("");

  // Stable key over the heading ids so a fresh array literal with the same ids
  // doesn't re-subscribe the observer on every render.
  const idsKey = headings.map((h) => h.id).join("|");

  useEffect(() => {
    const ids = idsKey ? idsKey.split("|") : [];
    if (ids.length === 0) return;

    // The observed zone's top edge sits below the viewport top by the
    // rootMargin's top inset (e.g. "-80px 0px -70% 0px" starts the zone 80px
    // down), so "scrolled past" must be measured against that same line — not
    // the viewport edge — or a heading sitting under the sticky header snaps
    // the highlight back to the previous section.
    const topMargin = /^(-?\d*\.?\d+)(px|%)/.exec(rootMargin.trim());
    const topInset = (viewportHeight: number): number => {
      if (!topMargin) return 0;
      const v = parseFloat(topMargin[1] ?? "0");
      return topMargin[2] === "%" ? (-v / 100) * viewportHeight : -v;
    };

    // Track which observed headings are currently intersecting; on every batch
    // pick the topmost intersecting one (in document order) so the result is
    // deterministic rather than "last entry in the batch wins".
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        const topmost = ids.find((id) => intersecting.has(id));
        if (topmost) {
          setActiveId(topmost);
        } else {
          // Nothing intersecting: keep the last heading scrolled above the
          // observed zone active, falling back to the first heading at the top.
          const offset = topInset(window.innerHeight);
          const passed = ids.filter((id) => {
            const el = document.getElementById(id);
            return el ? el.getBoundingClientRect().top < offset : false;
          });
          setActiveId(passed[passed.length - 1] ?? ids[0] ?? "");
        }
      },
      { rootMargin },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [idsKey, rootMargin]);

  return activeId;
}
