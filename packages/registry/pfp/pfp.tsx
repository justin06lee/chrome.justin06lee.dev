"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/ui/tilt";

export type PfpProps = {
  /** Image url. */
  src: string;
  alt?: string;
  /** Horizontal framing offset, in % of the tile (passed to translate). */
  x?: number;
  /** Vertical framing offset, in % of the tile. */
  y?: number;
  /** Zoom applied to the image inside the tile. */
  scale?: number;
  className?: string;
};

/**
 * Profile-picture tile: an image framed in a bordered square, composed on the
 * Tilt component for the 3D hover, with an angled specular sweep that glints
 * diagonally across the tile. Use `x`/`y`/`scale` to frame the subject within
 * the tile. Size it via `className` (defaults to `size-16`).
 */
export function Pfp({ src, alt = "", x = 0, y = 0, scale = 1, className }: PfpProps) {
  const shineRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);

  // One diagonal glint per hover: transform + opacity only, so it stays on
  // the compositor.
  const sweep = () => {
    if (!shineRef.current) return;
    animRef.current?.cancel();
    animRef.current = shineRef.current.animate(
      [
        { transform: "translate3d(-45%, -45%, 0)", opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.2 },
        { opacity: 1, offset: 0.8 },
        { transform: "translate3d(45%, 45%, 0)", opacity: 0, offset: 1 },
      ],
      { duration: 900, easing: "ease-in-out", fill: "forwards" },
    );
  };

  return (
    // Shine handlers live on a wrapper: Tilt spreads its rest props after its
    // own hover handlers, so passing ours directly would replace the tilt.
    <div onMouseEnter={sweep} onMouseLeave={() => animRef.current?.cancel()}>
      <Tilt shine={false} className={cn("size-16", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `translate(${x}%, ${y}%) scale(${scale})`,
            transformOrigin: "center",
          }}
        />
        {/* Oversized angled gradient band; translating it diagonally reads as
            a glossy specular glint crossing the tile. */}
        <div
          ref={shineRef}
          aria-hidden
          className="pointer-events-none absolute -inset-1/2"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 47%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.35) 53%, transparent 60%)",
            filter: "blur(2px)",
            mixBlendMode: "screen",
            transform: "translate3d(-45%, -45%, 0)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      </Tilt>
    </div>
  );
}
