import * as React from "react";

const KEYFRAMES = `@keyframes chrome-rainbow-cycle {
  0%   { color: hsl(0,   95%, 65%); }
  20%  { color: hsl(60,  95%, 65%); }
  40%  { color: hsl(120, 80%, 60%); }
  60%  { color: hsl(200, 95%, 65%); }
  80%  { color: hsl(280, 90%, 70%); }
  100% { color: hsl(360, 95%, 65%); }
}`;

export interface RainbowProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  text: string;
  duration?: number;
  stagger?: number;
}

export function Rainbow({
  as: Tag = "span",
  text,
  duration = 3,
  stagger = 0.25,
  ...rest
}: RainbowProps) {
  const chars = Array.from(text);
  return (
    <>
      <style precedence="default" href="chrome-rainbow-keyframes">
        {KEYFRAMES}
      </style>
      <Tag aria-label={text} {...rest}>
        {chars.map((c, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              animation: `chrome-rainbow-cycle ${duration}s linear infinite`,
              animationDelay: `${-stagger * i}s`,
            }}
            aria-hidden
          >
            {c === " " ? " " : c}
          </span>
        ))}
      </Tag>
    </>
  );
}
