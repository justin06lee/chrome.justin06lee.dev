"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type ComboboxOption<T extends string | number> = {
  value: T;
  label: string;
  /** Optional color swatch shown before the label. */
  color?: string;
};

export type UseComboboxOptions<T extends string | number> = {
  value: T | null;
  options: ComboboxOption<T>[];
};

export type UseComboboxReturn<T extends string | number> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  /** Options filtered by the current query (case-insensitive label match). */
  filtered: ComboboxOption<T>[];
  selected: ComboboxOption<T> | null;
  /** Wrap trigger + dropdown; outside click / Escape closes and resets query. */
  containerRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * Headless searchable-select behavior: open state, query filtering,
 * outside-click + Escape close. No styling, no opinion on create/clear — the
 * styled Combobox layers those on. Generalized from the calendar CategoryPicker.
 */
export function useCombobox<T extends string | number>({
  value,
  options,
}: UseComboboxOptions<T>): UseComboboxReturn<T> {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const onPointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selected = options.find((o) => o.value === value) ?? null;

  return { open, setOpen, query, setQuery, filtered, selected, containerRef };
}
