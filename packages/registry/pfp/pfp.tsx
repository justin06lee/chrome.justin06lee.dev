"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
 * Profile-picture tile: an image framed in a bordered square that tilts in 3D
 * and sweeps a shine across itself on hover. Use `x`/`y`/`scale` to frame the
 * subject within the tile. Size it via `className` (defaults to `size-16`).
 */
export function Pfp({ src, alt = "", x = 0, y = 0, scale = 1, className }: PfpProps) {
  const [hover, setHover] = useState(false);
  const shineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hover || !shineRef.current) return;
    const anim = shineRef.current.animate(
      [
        { transform: "translateX(-220%)", opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.15 },
        { opacity: 1, offset: 0.85 },
        { transform: "translateX(320%)", opacity: 0, offset: 1 },
      ],
      { duration: 900, easing: "ease-in-out", fill: "forwards" },
    );
    return () => anim.cancel();
  }, [hover]);

  return (
    <div style={{ perspective: "500px" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cn(
          "relative size-16 cursor-pointer overflow-hidden border border-white/70 bg-white/5",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_24px_-8px_rgba(0,0,0,0.6)]",
          className,
        )}
        style={{
          transform: hover
            ? "rotateX(14deg) rotateY(14deg) translateZ(0)"
            : "rotateX(0deg) rotateY(0deg) translateZ(0)",
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1)",
          willChange: "transform",
        }}
      >
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
        <div
          ref={shineRef}
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 w-1/2"
          style={{
            background:
              "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.75) 50%, transparent 80%)",
            filter: "blur(1px)",
            mixBlendMode: "screen",
            transform: "translateX(-220%)",
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
}
