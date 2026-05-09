"use client";

import * as React from "react";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

function ScrambleWord({ text, speed = 30, step = 1 / 3 }: { text: string; speed?: number; step?: number }) {
  const visRef = React.useRef<HTMLSpanElement | null>(null);
  const sizerRef = React.useRef<HTMLSpanElement | null>(null);
  const intervalRef = React.useRef<number | null>(null);
  const [widthPx, setWidthPx] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const measure = () => {
      if (!sizerRef.current) return;
      const w = sizerRef.current.getBoundingClientRect().width;
      if (w) setWidthPx(Math.ceil(w));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sizerRef.current) ro.observe(sizerRef.current);
    return () => ro.disconnect();
  }, [text]);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const handleEnter = () => {
    let iteration = 0;
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      const node = visRef.current;
      if (!node) return;
      const scrambled = text
        .split("")
        .map((_, idx) =>
          idx < iteration ? text[idx] : LETTERS[Math.floor(Math.random() * 26)],
        )
        .join("");
      node.textContent = scrambled;
      iteration += step;
      if (iteration >= text.length) {
        window.clearInterval(intervalRef.current!);
        intervalRef.current = null;
        node.textContent = text;
      }
    }, speed);
  };

  return (
    <>
      <span
        ref={sizerRef}
        className="absolute -left-[9999px] -top-[9999px] whitespace-pre"
        aria-hidden
      >
        {text}
      </span>
      <span
        className="inline-block whitespace-nowrap align-baseline cursor-default"
        style={widthPx ? { minWidth: `${widthPx}px` } : undefined}
        onMouseEnter={handleEnter}
      >
        <span ref={visRef}>{text}</span>
      </span>
    </>
  );
}

export interface ScrambleProps {
  text: string;
  speed?: number;
  step?: number;
}

export function Scramble({ text, speed, step }: ScrambleProps) {
  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((p, i) =>
        /\s+/.test(p) ? (
          <span key={i}>{p}</span>
        ) : (
          <ScrambleWord key={i} text={p} speed={speed} step={step} />
        ),
      )}
    </>
  );
}
