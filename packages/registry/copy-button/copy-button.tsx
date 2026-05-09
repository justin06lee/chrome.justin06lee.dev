"use client";

import * as React from "react";

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  resetMs?: number;
  labels?: { idle: string; copied: string; error: string };
}

export function CopyButton({
  text,
  resetMs = 2000,
  labels = { idle: "copy", copied: "copied", error: "failed" },
  className = "",
  children,
  ...rest
}: CopyButtonProps) {
  const [state, setState] = React.useState<"idle" | "copied" | "error">("idle");
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setState("idle"), resetMs);
  };

  const label =
    state === "copied" ? labels.copied : state === "error" ? labels.error : labels.idle;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={
        "font-mono text-[11px] text-white/55 hover:text-white transition-colors " +
        className
      }
      {...rest}
    >
      {children ?? label}
    </button>
  );
}
