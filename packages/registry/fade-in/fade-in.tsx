import * as React from "react";
import { cn } from "@/lib/utils";

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  /** element/component to render. default "div". */
  as?: React.ElementType;
  /** delay before the animation starts, in seconds. default 0. */
  delay?: number;
  /** starting vertical offset in px (animates to 0). default -10. */
  y?: number;
  /** starting horizontal offset in px (animates to 0). default 0. */
  x?: number;
  /** animation duration in seconds. default 0.4. */
  duration?: number;
  /** animate once on mount. default true. */
  once?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Fade + translate a node in on mount. Pure CSS (no motion dependency):
 * a keyframe drives opacity 0 -> 1 and translate(x, y) -> 0, with the offsets
 * passed as CSS custom properties. Honors prefers-reduced-motion.
 *
 * Stagger a list with the `staggerDelay` helper:
 *   items.map((item, i) => <FadeIn key={i} delay={staggerDelay(i)}>…</FadeIn>)
 */
export function FadeIn({
  as,
  delay = 0,
  y = -10,
  x = 0,
  duration = 0.4,
  once = true,
  className,
  style,
  children,
  ...rest
}: FadeInProps) {
  const Tag = (as ?? "div") as React.ElementType;
  return (
    <Tag
      data-fade-in=""
      data-once={once ? "" : undefined}
      className={cn("chrome-fade-in", className)}
      style={
        {
          "--fade-x": `${x}px`,
          "--fade-y": `${y}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Stagger helper mirroring upstream: delay = base + i * step (seconds). */
export function staggerDelay(index: number, step = 0.08, base = 0): number {
  return base + index * step;
}
