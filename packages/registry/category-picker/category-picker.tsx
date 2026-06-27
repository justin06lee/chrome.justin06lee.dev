"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const rowId = (i: number) => `${baseId}-row-${i}`;

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(-1);
      return;
    }
    function onPointer(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  const selected = items.find((i) => i.id === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const trimmed = query.trim();

  // Reset the highlight whenever the navigable rows change (e.g. filtering).
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  // Navigable rows, in render order: optional create, optional clear, then the
  // filtered items.
  const showCreate = Boolean(onCreate);
  const showClear = Boolean(allowClear && value !== null);
  const createIndex = showCreate ? 0 : -1;
  const clearIndex = showClear ? (showCreate ? 1 : 0) : -1;
  const optionsOffset = (showCreate ? 1 : 0) + (showClear ? 1 : 0);
  const rowCount = optionsOffset + filtered.length;

  const activateRow = (i: number) => {
    if (i === createIndex && onCreate) {
      onCreate(trimmed);
      setOpen(false);
      return;
    }
    if (i === clearIndex) {
      onChange(null);
      setOpen(false);
      return;
    }
    const item = filtered[i - optionsOffset];
    if (item) {
      onChange(item.id);
      setOpen(false);
    }
  };

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const move = (dir: 1 | -1) => {
      if (rowCount === 0) return;
      setActiveIndex((i) => {
        const next = i + dir;
        if (next < 0) return rowCount - 1;
        if (next > rowCount - 1) return 0;
        return next;
      });
    };
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Enter":
        if (activeIndex >= 0 && activeIndex < rowCount) {
          e.preventDefault();
          activateRow(activeIndex);
        }
        break;
      case "Escape":
        // Scoped, non-capture handler: only fires while the picker is open and
        // its input is focused. stopPropagation keeps a wrapping dialog from
        // also closing, without the global capture-phase swallowing of before.
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        break;
    }
  }

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
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeIndex >= 0 ? rowId(activeIndex) : undefined}
            onKeyDown={onInputKeyDown}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-b border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/60"
          />
          <div
            id={listboxId}
            role="listbox"
            className="max-h-72 overflow-auto"
          >
            {showCreate && (
              <button
                type="button"
                id={rowId(createIndex)}
                role="option"
                aria-selected={false}
                onMouseEnter={() => setActiveIndex(createIndex)}
                onClick={() => {
                  onCreate?.(trimmed);
                  setOpen(false);
                }}
                className={cn(
                  "w-full border-b border-white/10 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10",
                  activeIndex === createIndex && "bg-white/10",
                )}
              >
                + create {trimmed ? `"${trimmed}"` : "new"}
              </button>
            )}

            {showClear && (
              <button
                type="button"
                id={rowId(clearIndex)}
                role="option"
                aria-selected={false}
                onMouseEnter={() => setActiveIndex(clearIndex)}
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className={cn(
                  "w-full border-b border-white/10 px-3 py-2 text-left text-xs text-white/50 hover:bg-white/10",
                  activeIndex === clearIndex && "bg-white/10",
                )}
              >
                clear
              </button>
            )}

            {filtered.map((i, idx) => (
              <button
                key={i.id}
                id={rowId(optionsOffset + idx)}
                type="button"
                role="option"
                aria-selected={i.id === value}
                onMouseEnter={() => setActiveIndex(optionsOffset + idx)}
                onClick={() => {
                  onChange(i.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/10",
                  activeIndex === optionsOffset + idx && "bg-white/10",
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
