"use client";

import { useEffect, useRef } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SheetSide = "right" | "left" | "top" | "bottom";

export type SheetProps = {
  /** Whether the sheet is visible. */
  open: boolean;
  /** Called when the sheet requests to close (backdrop click, escape, close button). */
  onClose: () => void;
  /** Edge the panel slides in from. Defaults to "right". */
  side?: SheetSide;
  /** Optional heading shown at the top of the panel. */
  title?: string;
  /** Panel body. */
  children?: React.ReactNode;
  /** Extra classes for the panel. */
  className?: string;
};

// Off-screen position per edge, used for both the initial and exit states.
const OFFSCREEN: Record<SheetSide, { x?: string; y?: string }> = {
  right: { x: "100%" },
  left: { x: "-100%" },
  top: { y: "-100%" },
  bottom: { y: "100%" },
};

// Edge anchoring + sizing per side. Mirrors navbar's right-side panel.
const PANEL_SIDE: Record<SheetSide, string> = {
  right: "inset-y-0 right-0 w-72 border-l sm:w-80",
  left: "inset-y-0 left-0 w-72 border-r sm:w-80",
  top: "inset-x-0 top-0 h-72 border-b",
  bottom: "inset-x-0 bottom-0 h-72 border-t",
};

/**
 * Animated slide-in panel from a screen edge with a dimmed backdrop. Closes on
 * backdrop click, escape, or the close button. Locks body scroll while open.
 * Framework-agnostic and headless about its contents — pass any children.
 */
export function Sheet({
  open,
  onClose,
  side = "right",
  title,
  children,
  className,
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape-to-close.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock — lock on open, restore on close/unmount.
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const off = OFFSCREEN[side];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70"
          />
          <motion.div
            ref={panelRef}
            initial={off}
            animate={{ x: 0, y: 0 }}
            exit={off}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            role="dialog"
            aria-modal="true"
            className={cn(
              "fixed z-[80] flex flex-col gap-4 border border-white/20 bg-black",
              PANEL_SIDE[side],
              className,
            )}
          >
            <div className="flex items-center justify-between p-4">
              {title ? (
                <span className="text-sm font-semibold text-white">{title}</span>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="close"
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
