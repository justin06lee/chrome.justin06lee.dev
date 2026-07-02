"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ListFilter, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Menu, type MenuItem } from "@/components/ui/menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
  CardBody,
  CardActions,
} from "@/components/ui/card";

export type GalleryItem = {
  id: string;
  title: string;
  /** Optional link wrapping the title. External URLs open in a new tab. */
  link?: string;
  description: string;
  year: number;
  tech: string[];
  /** "View Code" link. */
  repo?: string;
  /** "Live" link. */
  live?: string;
  /** Muted italic line under the description. */
  notes?: string;
  /** Pins the item to the front and shows a pin marker. */
  pinned?: boolean;
};

export type GallerySort = "newest" | "oldest" | "az" | "za";

export type GalleryProps = {
  title: string;
  subtitle?: string;
  items?: GalleryItem[];
  initialSort?: GallerySort;
  /** Base animation delay (seconds) before the first staggered element. */
  chipBase?: number;
  /** Per-element stagger step (seconds). */
  chipStep?: number;
  className?: string;
};

const SORT_LABEL: Record<GallerySort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  az: "A → Z",
  za: "Z → A",
};

const SORT_KEYS: GallerySort[] = ["newest", "oldest", "az", "za"];

/**
 * Searchable / filterable / sortable card grid. A sort menu, tag filter chips,
 * and a search input drive a responsive grid of project cards (pinned badge,
 * tech chips, repo / live links). Generalized from the justin06lee.dev item
 * gallery. Dark-only.
 */
export function Gallery({
  title,
  subtitle = "A curated list of things I've built or explored.",
  items = [],
  initialSort = "newest",
  chipBase = 0.4,
  chipStep = 0.1,
  className,
}: GalleryProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<GallerySort>(initialSort);
  const hasAnimated = useRef(false);

  // After first render, stop applying staggered entrance delays.
  useEffect(() => {
    const timer = setTimeout(() => {
      hasAnimated.current = true;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    items.forEach((p) => p.tech.forEach((t) => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const res = items.filter((p) => {
      const text = `${p.title} ${p.description} ${p.tech.join(" ")}`.toLowerCase();
      const matchesQ = q === "" || text.includes(q);
      const matchesTags =
        selected.length === 0 || selected.every((t) => p.tech.includes(t));
      return matchesQ && matchesTags;
    });

    res.sort((a, b) => {
      const pinDiff = (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      if (pinDiff !== 0) return pinDiff;
      switch (sort) {
        case "newest":
          return b.year - a.year || a.title.localeCompare(b.title);
        case "oldest":
          return a.year - b.year || a.title.localeCompare(b.title);
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
      }
    });

    return res;
  }, [items, query, selected, sort]);

  const toggleTag = (t: string) => {
    setSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const sortItems: MenuItem[] = SORT_KEYS.map((key) => ({
    label: SORT_LABEL[key],
    onSelect: () => setSort(key),
    selected: sort === key,
  }));

  // Only stagger on the first render.
  const shouldAnimate = !hasAnimated.current;
  const animStart = shouldAnimate ? chipBase + allTags.length * chipStep : 0;

  return (
    <main className={cn("mx-auto max-w-6xl px-4 pb-24 pt-16", className)}>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="mt-1 text-sm text-white/70">{subtitle}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm"
        >
          <Menu
            align="right"
            label="Sort by"
            items={sortItems}
            trigger={
              <>
                <ListFilter className="size-4" aria-hidden />
                <span>Sort: {SORT_LABEL[sort]}</span>
              </>
            }
          />
        </motion.div>
      </div>

      <div className="mb-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <input
            type="text"
            placeholder="Search items, tech…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-white/20 bg-black px-4 py-2 text-white outline-none placeholder:text-white/40 focus:border-white/40"
          />
        </motion.div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {allTags.map((t, i) => (
          <motion.div
            key={t}
            initial={shouldAnimate ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: shouldAnimate ? chipBase + i * chipStep : 0,
            }}
          >
            <Badge
              variant="ghost"
              active={selected.includes(t)}
              onClick={() => toggleTag(t)}
              className="px-3 py-1 text-sm"
            >
              {t}
            </Badge>
          </motion.div>
        ))}

        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected([])}
            className="-mt-1 px-2 text-sm text-white underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-white/60">
          No items match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              item={p}
              index={i}
              start={animStart}
              shouldAnimate={shouldAnimate}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function ProjectCard({
  item,
  index,
  start,
  shouldAnimate,
}: {
  item: GalleryItem;
  index: number;
  start: number;
  shouldAnimate: boolean;
}) {
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: shouldAnimate ? start + index * 0.1 : 0,
      }}
    >
      <Card>
        <CardHeader>
          <div className="flex min-w-0 items-start gap-1.5">
            {item.pinned && (
              <Pin
                className="mt-1 size-3.5 shrink-0 -rotate-45 fill-white text-white"
                aria-label="Pinned"
              />
            )}
            <CardTitle href={item.link}>{item.title}</CardTitle>
          </div>
          <CardMeta>{item.year}</CardMeta>
        </CardHeader>

        <CardBody>{item.description}</CardBody>
        {item.notes && (
          <p className="text-xs italic text-white/60">{item.notes}</p>
        )}

        <div className="mt-1 flex flex-wrap gap-2">
          {item.tech.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>

        {(item.repo || item.live) && (
          <CardActions>
            {item.repo && (
              <a
                href={item.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 text-sm text-white underline-offset-4 hover:underline"
              >
                View Code
              </a>
            )}
            {item.live && (
              <a
                href={item.live}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 text-sm text-white underline-offset-4 hover:underline"
              >
                Live
              </a>
            )}
          </CardActions>
        )}
      </Card>
    </motion.div>
  );
}
