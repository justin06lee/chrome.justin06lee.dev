"use client";

import { Children, isValidElement, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type ShowcaseBackground = "dots" | "grid" | "none";

export type ShowcaseProps = {
  /** Small uppercase label rendered above the frame. */
  label?: string;
  /** Code-styled caption rendered below the frame. */
  source?: string;
  /** Muted secondary caption below the source. */
  note?: string;
  /** Backdrop pattern. Defaults to "dots". */
  background?: ShowcaseBackground;
  /**
   * Clip children to the frame (default). Set false for demos whose popups
   * (menus, dropdowns) should overflow the frame.
   */
  clip?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const BACKGROUNDS: Record<ShowcaseBackground, CSSProperties> = {
  none: {},
  // Opacity matches the _detail.tsx outer preview wrapper so nested/sibling
  // Showcases read as the same visual primitive.
  dots: {
    backgroundImage:
      "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
    backgroundSize: "14px 14px",
  },
  grid: {
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  },
};

export function Showcase({
  label,
  source,
  note,
  background = "dots",
  clip = true,
  className,
  children,
}: ShowcaseProps) {
  // If any direct child is a <Row>, stack rows vertically. Otherwise wrap
  // every child in one implicit Row so bare-component children still center.
  const hasRow = Children.toArray(children).some(
    (c) => isValidElement(c) && c.type === Row,
  );

  return (
    <div className={cn("mb-10", className)}>
      {label && (
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3">
          {label}
        </div>
      )}
      <div
        className={cn(
          "border border-white/10 px-6 py-10 flex flex-col gap-6 mb-2",
          clip && "overflow-hidden",
        )}
        style={BACKGROUNDS[background]}
      >
        {hasRow ? children : <Row>{children}</Row>}
      </div>
      {source && (
        <code className="font-mono text-[11px] text-white/45 block break-all">
          {source}
        </code>
      )}
      {note && <div className="text-[12px] text-white/40 mt-1">{note}</div>}
    </div>
  );
}

export type RowProps = {
  children?: React.ReactNode;
  className?: string;
};

export function Row({ children, className }: RowProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 flex flex-wrap items-center justify-center gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
