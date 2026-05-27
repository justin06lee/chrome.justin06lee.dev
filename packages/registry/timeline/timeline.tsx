"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TimelineEvent = {
  /** Minutes since midnight, 0–1440. */
  startMin: number;
  endMin: number;
  label?: string;
  /** CSS color for the block's left border + tint. Defaults to white. */
  color?: string;
};

export type TimelineProps = {
  events: TimelineEvent[];
  /** Draw a live red "now" line that ticks each minute. */
  showNow?: boolean;
  /** Override the now-line position (minutes of day). Implies the line shows. */
  nowMinutes?: number;
  className?: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function HourGrid() {
  return (
    <>
      {HOURS.map((h) => (
        <div
          key={h}
          className="absolute left-0 right-0 flex items-start border-t border-white/5 pl-2"
          style={{ top: `${(h / 24) * 100}%`, height: `${100 / 24}%` }}
        >
          <span className="mt-[-6px] font-mono text-[10px] text-white/40">
            {String(h).padStart(2, "0")}:00
          </span>
        </div>
      ))}
    </>
  );
}

function NowLine({ minutes }: { minutes: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
      style={{ top: `${(minutes / 1440) * 100}%` }}
    >
      <div className="-ml-1 size-2 shrink-0 rounded-full bg-red-500" />
      <div className="h-px flex-1 bg-red-500" />
    </div>
  );
}

/**
 * Day schedule — a 24h vertical axis with positioned event blocks and an
 * optional live now-line. Blocks are placed by minutes-of-day. Generalized
 * from the justin06lee.dev calendar day view.
 */
export function Timeline({ events, showNow, nowMinutes, className }: TimelineProps) {
  const [liveNow, setLiveNow] = useState<number | null>(null);

  useEffect(() => {
    if (!showNow || nowMinutes != null) return;
    const tick = () => {
      const d = new Date();
      setLiveNow(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [showNow, nowMinutes]);

  const now = nowMinutes ?? liveNow;

  return (
    <div className={cn("relative min-h-[960px] border border-white/10 bg-white/[0.02] pl-12", className)}>
      <HourGrid />
      {now != null && <NowLine minutes={now} />}
      {events.map((e, i) => {
        const top = (Math.max(0, e.startMin) / 1440) * 100;
        const height = (Math.max(1, e.endMin - e.startMin) / 1440) * 100;
        const color = e.color ?? "#ffffff";
        return (
          <div
            key={i}
            className="absolute left-12 right-1 overflow-hidden border-l-2 px-2 py-1"
            style={{
              top: `${top}%`,
              height: `${height}%`,
              borderLeftColor: color,
              background: `color-mix(in srgb, ${color} 15%, transparent)`,
            }}
          >
            {e.label && (
              <span className="line-clamp-2 text-[11px] leading-tight text-white/80">{e.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
