"use client";

import * as React from "react";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** how many paper layers behind the front. default 2. */
  layers?: number;
}

const SPRING = "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)";

export function Stack({ children, className = "", layers = 2, ...rest }: StackProps) {
  const [hover, setHover] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={"relative " + className}
      {...rest}
    >
      {Array.from({ length: layers }).map((_, i) => {
        const offsetSign = i % 2 === 0 ? -1 : 1;
        return (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 border border-white/15 bg-black/80"
            style={{
              transform: hover
                ? `rotate(${offsetSign * 7}deg) translate(${offsetSign * -8}px, ${4 * offsetSign}px)`
                : `rotate(${offsetSign * 2}deg)`,
              transition: SPRING,
              boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
              zIndex: i,
            }}
          />
        );
      })}
      <div
        className="relative border border-white/15 bg-black/80"
        style={{
          transform: hover ? "rotate(4deg) translate(10px, -6px)" : "rotate(1deg)",
          transition: SPRING,
          boxShadow: "0 16px 28px rgba(0,0,0,0.4)",
          zIndex: layers,
        }}
      >
        {children}
      </div>
    </div>
  );
}
