import * as React from "react";

const CHROME_STYLE: React.CSSProperties = {
  background: [
    "linear-gradient(115deg," +
      "transparent 30%," +
      "rgba(255,255,255,0.85) 48%," +
      "rgba(255,255,255,0.95) 50%," +
      "rgba(255,255,255,0.85) 52%," +
      "transparent 70%)",
    "repeating-linear-gradient(48deg," +
      "rgba(255,255,255,0) 0 1px," +
      "rgba(255,255,255,0.12) 1px 2px," +
      "rgba(0,0,0,0.05) 2px 4px)",
    "linear-gradient(180deg," +
      "hsl(195, 95%, 88%) 0%," +
      "hsl(170, 75%, 82%) 14%," +
      "hsl(85, 70%, 84%) 26%," +
      "hsl(50, 95%, 86%) 38%," +
      "hsl(25, 90%, 88%) 50%," +
      "hsl(345, 80%, 88%) 62%," +
      "hsl(310, 70%, 88%) 74%," +
      "hsl(265, 70%, 88%) 86%," +
      "hsl(210, 90%, 88%) 100%)",
  ].join(", "),
  backgroundSize: "220% 100%, 100% 100%, 100% 100%",
  backgroundPosition: "-50% 0, 0 0, 0 0",
  backgroundRepeat: "no-repeat",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  filter:
    "drop-shadow(0 2px 0 rgba(255,255,255,0.18)) " +
    "drop-shadow(0 0 60px rgba(180,200,255,0.25)) " +
    "drop-shadow(0 0 120px rgba(255,200,230,0.15))",
  animation: "chrome-shine 5s cubic-bezier(.4,0,.6,1) infinite",
};

// `background-clip: text` clips the wrapper's gradient to every glyph it
// contains, descendants included — so Chrome works as a wrapper around any
// content. But a nested element with its own `color` would paint opaque text
// over that clipped gradient; force every descendant transparent so the
// chrome shows through all text inside.
const KEYFRAMES = `@keyframes chrome-shine {
  0%   { background-position: -50% 0, 0 0, 0 0; }
  100% { background-position: 250% 0, 0 0, 0 0; }
}
[data-chrome] * { color: transparent !important; }`;

export interface ChromeProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

/** Wrap any content — every text glyph inside renders with the chrome foil effect. */
export function Chrome({ as: Tag = "span", style, children, ...rest }: ChromeProps) {
  return (
    <>
      <style precedence="default" href="chrome-shine-keyframes">
        {KEYFRAMES}
      </style>
      <Tag data-chrome style={{ ...CHROME_STYLE, ...style }} {...rest}>
        {children}
      </Tag>
    </>
  );
}
