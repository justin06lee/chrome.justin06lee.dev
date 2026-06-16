"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ColorSwatch } from "@/components/ui/color-swatch";

export type CategoryItem = {
  id: string;
  label: string;
  /** Hex color rendered as the leading swatch. */
  color: string;
};

export type CategoryPickerProps = {
  /** Controlled selection, or null when nothing is chosen. */
  value: string | null;
  onChange: (id: string | null) => void;
  items: CategoryItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  /** Show a "clear" row when something is selected. */
  allowClear?: boolean;
  /**
   * When set, renders a "+ create {query}" row that calls this with the typed
   * label. The caller owns appending the new item and selecting it.
   */
  onCreate?: (label: string) => void;
  className?: string;
  ariaLabel?: string;
};

/**
 * Searchable dropdown of color-coded items with click-outside + Escape to close
 * and an optional inline create row. Generalized from the calendar category
 * picker — no fetching, no domain coupling; fully controlled.
 */
export function CategoryPicker({
  value,
  onChange,
  items,
  placeholder = "no category",
  searchPlaceholder = "search…",
  allowClear,
  onCreate,
  className,
  ariaLabel,
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    function onPointer(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // Capture-phase + stopImmediatePropagation so an open picker nested in a
        // dialog swallows the Escape and only closes itself.
        e.stopImmediatePropagation();
        e.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const selected = items.find((i) => i.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const trimmed = query.trim();

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 border border-white/20 px-2 py-1 text-left text-sm hover:bg-white/5"
      >
        {selected ? (
          <>
            <ColorSwatch color={selected.color} />
            <span className="truncate">{selected.label}</span>
          </>
        ) : (
          <span className="text-white/50">{placeholder}</span>
        )}
        <span className="ml-auto text-white/30">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 border border-white/20 bg-black">
          <input
            autoFocus
            aria-controls="chrome-category-picker-listbox"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-b border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/60"
          />
          <div
            id="chrome-category-picker-listbox"
            role="listbox"
            className="max-h-72 overflow-auto"
          >
            {onCreate && (
              <button
                type="button"
                onClick={() => {
                  onCreate(trimmed);
                  setOpen(false);
                }}
                className="w-full border-b border-white/10 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
              >
                + create {trimmed ? `"${trimmed}"` : "new"}
              </button>
            )}

            {allowClear && value !== null && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="w-full border-b border-white/10 px-3 py-2 text-left text-xs text-white/50 hover:bg-white/10"
              >
                clear
              </button>
            )}

            {filtered.map((i) => (
              <button
                key={i.id}
                type="button"
                role="option"
                aria-selected={i.id === value}
                onClick={() => {
                  onChange(i.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/10",
                  i.id === value ? "text-white" : "text-white/80",
                )}
              >
                <ColorSwatch color={i.color} />
                <span className="truncate">{i.label}</span>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-white/40">no matches</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
