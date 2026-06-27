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
          // viewport active, falling back to the first heading at the top.
          const passed = ids.filter((id) => {
            const el = document.getElementById(id);
            return el ? el.getBoundingClientRect().top < 0 : false;
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
