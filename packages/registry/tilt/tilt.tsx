"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TiltProps extends React.HTMLAttributes<HTMLDivElement> {
  rotate?: number;
  shine?: boolean;
  duration?: number;
  /** CSS background applied to the root element. Transparent by default. */
  background?: string;
}

export function Tilt({
  children,
  className = "",
  rotate = 14,
  shine = true,
  duration = 900,
  background,
  ...rest
}: TiltProps) {
  const [hover, setHover] = React.useState(false);
  const shineRef = React.useRef<HTMLDivElement>(null);
  const animRef = React.useRef<Animation | null>(null);

  React.useEffect(() => {
    if (!hover || !shine || !shineRef.current) return;
    if (animRef.current) animRef.current.cancel();
    animRef.current = shineRef.current.animate(
      [
        { transform: "translateX(-220%)", opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.15 },
        { opacity: 1, offset: 0.85 },
        { transform: "translateX(320%)", opacity: 0, offset: 1 },
      ],
      { duration, easing: "ease-in-out", fill: "forwards" },
    );
    return () => animRef.current?.cancel();
  }, [hover, shine, duration]);

  return (
    <div style={{ background, perspective: "500px" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cn(
          "relative overflow-hidden border border-white/70 bg-white/5 cursor-pointer",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_24px_-8px_rgba(0,0,0,0.6)]",
          className,
        )}
        style={{
          transform: hover
            ? `rotateX(${rotate}deg) rotateY(${rotate}deg) translateZ(0)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0)",
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1)",
          willChange: "transform",
        }}
        {...rest}
      >
        {children}
        {shine && (
          <div
            ref={shineRef}
            aria-hidden
            className="absolute top-0 bottom-0 w-1/2 pointer-events-none"
            style={{
              background:
                "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.75) 50%, transparent 80%)",
              filter: "blur(1px)",
              mixBlendMode: "screen",
              transform: "translateX(-220%)",
              opacity: 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
