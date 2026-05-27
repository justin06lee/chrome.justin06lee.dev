"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export type UseMenuOptions = {
  itemCount: number;
};

export type UseMenuReturn = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Index of the keyboard-highlighted item, or -1. */
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  /** Wrap the trigger + dropdown; an outside click closes the menu. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Spread onto the trigger button. */
  triggerProps: {
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** Spread onto the menu container; handles arrow/Enter/Escape. */
  menuProps: {
    role: "menu";
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** Call when an item is chosen — closes and resets. */
  onSelect: (run: () => void) => void;
};

/**
 * Headless action-menu behavior: open state, outside-click + Escape close, and
 * arrow-key navigation with a highlighted item. No styling.
 */
export function useMenu({ itemCount }: UseMenuOptions): UseMenuReturn {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }
    const onPointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const move = (dir: 1 | -1) => {
    if (itemCount === 0) return;
    setActiveIndex((i) => {
      const next = i + dir;
      if (next < 0) return itemCount - 1;
      if (next > itemCount - 1) return 0;
      return next;
    });
  };

  const triggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(0);
    }
  };

  const menuKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  return {
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    containerRef,
    triggerProps: {
      "aria-haspopup": "menu",
      "aria-expanded": open,
      onClick: () => setOpen(!open),
      onKeyDown: triggerKeyDown,
    },
    menuProps: { role: "menu", onKeyDown: menuKeyDown },
    onSelect: (run: () => void) => {
      run();
      setOpen(false);
    },
  };
}
