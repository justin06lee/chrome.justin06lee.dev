import * as React from "react";
import { cn } from "@/lib/utils";

export interface AsciiProps {
  /** The ASCII art, exactly as authored. Trailing newline and \r\n are normalized. */
  children: string | string[];
  /** Accessible name (role="img"). Omit for purely decorative art (aria-hidden). */
  label?: string;
  /** Font size in px. Default 12. */
  size?: number;
  /** Line-height multiplier. Default 1.15 — tight enough that box-drawing rows touch. */
  lineHeight?: number;
  className?: string;
}

/**
 * Seamless ASCII-art renderer: a mono <pre> locked to a fixed character grid —
 * ligatures and contextual alternates off, tabs normalized, tight line height —
 * so art never shifts, collapses, or renders "weirdly". Static and paint-plain,
 * which means wrapping it in `<Chrome>` foils every glyph with zero extra setup.
 */
export function Ascii({
  children,
  label,
  size = 12,
  lineHeight = 1.15,
  className,
}: AsciiProps) {
  const art = (Array.isArray(children) ? children.join("") : children)
    .replace(/\r\n/g, "\n")
    .replace(/\n+$/, "");

  return (
    <pre
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      className={cn(
        "inline-block select-none whitespace-pre text-left font-mono text-white/80",
        className,
      )}
      style={{
        fontSize: size,
        lineHeight,
        // Ligatures/alternates merge glyph pairs (=>, |-, fi) and break the grid.
        fontVariantLigatures: "none",
        fontFeatureSettings: '"liga" 0, "calt" 0',
        tabSize: 4,
        textRendering: "geometricPrecision",
      }}
    >
      {art}
    </pre>
  );
}
