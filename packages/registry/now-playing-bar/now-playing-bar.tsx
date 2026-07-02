"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type NowPlayingBarProps = {
  /** Title of the currently-running activity. */
  title: React.ReactNode;
  /** When set, a live elapsed timer ticks every second. Omit for the idle state. */
  startedAt?: number | Date;
  /** CSS color for the left accent bar + dot. */
  accent?: string;
  subtitle?: React.ReactNode;
  /** Right-side slot (e.g. a Stop button). */
  actions?: React.ReactNode;
  onClick?: () => void;
  /** Hide the bar (also tears down the timer). Defaults to true. */
  visible?: boolean;
  /** Pin to the viewport ("fixed", default) or the scroll container ("sticky"). */
  position?: "fixed" | "sticky";
  className?: string;
};

/** Compact elapsed format, mirroring upstream: `1h 2m`, `2m 3s`, `4s`. */
function formatElapsed(startAt: number, now: number): string {
  const totalSec = Math.max(0, Math.floor((now - startAt) / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/**
 * Sticky bottom "now playing" bar: a running activity with a live elapsed
 * timer, an accent color, and a right-side action slot. All data is driven by
 * props/callbacks. Dark-only.
 */
export function NowPlayingBar({
  title,
  startedAt,
  accent,
  subtitle,
  actions,
  onClick,
  visible = true,
  position = "fixed",
  className,
}: NowPlayingBarProps) {
  const startMs =
    startedAt === undefined
      ? undefined
      : startedAt instanceof Date
        ? startedAt.getTime()
        : startedAt;
  const running = visible && startMs !== undefined;

  const [now, setNow] = useState<number>(() => Date.now());

  // Tick every second only while running and visible; clean up otherwise.
  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  if (!visible) return null;

  const elapsed = startMs !== undefined ? formatElapsed(startMs, now) : null;

  return (
    <div
      className={cn(
        "left-0 right-0 bottom-0 z-20 border-t border-white/20 bg-black",
        position === "fixed" ? "fixed" : "sticky",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          type="button"
          onClick={onClick}
          disabled={!onClick}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 text-left",
            onClick ? "cursor-pointer" : "cursor-default",
          )}
        >
          <span
            aria-hidden
            className="h-8 w-1 shrink-0 rounded-full"
            style={{ background: accent ?? "rgba(255,255,255,0.25)" }}
          />
          <span className="flex min-w-0 flex-col">
            <span className="text-[10px] uppercase tracking-wider text-white/50">
              Now playing
            </span>
            {startMs !== undefined ? (
              <span className="flex items-center gap-2 truncate text-sm text-white">
                <span
                  aria-hidden
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: accent ?? "currentColor" }}
                />
                <span className="truncate">{title}</span>
                {elapsed && (
                  <span className="shrink-0 tabular-nums text-white/60">
                    · {elapsed}
                  </span>
                )}
              </span>
            ) : (
              <span className="truncate text-sm text-white/50">
                Nothing running
              </span>
            )}
            {subtitle && (
              <span className="truncate text-xs text-white/40">{subtitle}</span>
            )}
          </span>
        </button>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
