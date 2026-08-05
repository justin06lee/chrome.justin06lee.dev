"use client";

import * as React from "react";
import { usePlaybackClock } from "@/hooks/use-playback-clock";
import { cn } from "@/lib/utils";

export type LyricLine = {
  /** Start time in seconds. Omit on every line for an unsynced lyric sheet. */
  time?: number;
  text: string;
};

export type LyricsProps = {
  lines: LyricLine[];
  /** Last known playback position in seconds. */
  position?: number;
  /** Wall-clock ms at which `position` was true — the line then advances on its own. */
  startedAt?: number | Date;
  /** Advance only while true. Defaults to true. */
  playing?: boolean;
  /** Click a line to jump to its timestamp. */
  onSeek?: (seconds: number) => void;
  /** Scroll the active line into view. Defaults to true. */
  autoScroll?: boolean;
  /** Height of the scroll box in px, or "auto" to let it grow. Defaults to 280. */
  height?: number | "auto";
  align?: "left" | "center";
  /** Rendered when `lines` is empty. */
  empty?: React.ReactNode;
  className?: string;
};

/** Index of the last line whose time has passed, or -1 before the first. */
function activeIndex(lines: LyricLine[], at: number): number {
  let found = -1;
  for (let i = 0; i < lines.length; i++) {
    const time = lines[i]?.time;
    if (time === undefined || time > at) break;
    found = i;
  }
  return found;
}

/**
 * Parses an `.lrc` sheet — `[mm:ss.xx] text` — into lines.
 *
 * Handles the two things real lrc files do that a naive split doesn't: several
 * timestamps on one line (a repeated chorus), and metadata tags like `[ar:...]`,
 * which are dropped rather than rendered as lyrics. Output is sorted by time,
 * because multi-timestamp lines arrive out of order by construction.
 */
export function parseLrc(source: string): LyricLine[] {
  const out: LyricLine[] = [];
  const stamp = /\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
  for (const raw of source.split(/\r?\n/)) {
    const times: number[] = [];
    let match: RegExpExecArray | null;
    stamp.lastIndex = 0;
    while ((match = stamp.exec(raw)) !== null) {
      const fraction = match[3] ? Number(`0.${match[3]}`) : 0;
      times.push(Number(match[1]) * 60 + Number(match[2]) + fraction);
    }
    const text = raw.replace(stamp, "").trim();
    if (times.length === 0) continue; // metadata tag or blank line
    for (const time of times) out.push({ time, text });
  }
  return out.sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
}

/**
 * Time-synced lyrics: the current line lit, the rest receding.
 *
 * The active line is found by scanning for the last timestamp that has passed
 * rather than by diffing against the previous index, so a seek to the middle of
 * a song lands on the right line immediately instead of walking there.
 *
 * Auto-scroll centres the active line in the box — `scrollTop` on the container,
 * never `scrollIntoView`, which would drag the whole page along with it. It
 * stands down for eight seconds after you scroll by hand, because yanking the
 * view back while someone is reading ahead is the single worst thing a lyric
 * pane can do. Smooth scrolling drops out under reduced motion.
 *
 * Lines with no `time` render as a plain sheet with nothing highlighted — an
 * unsynced lyric is still worth showing.
 */
export function Lyrics({
  lines,
  position = 0,
  startedAt,
  playing = true,
  onSeek,
  autoScroll = true,
  height = 280,
  align = "left",
  empty,
  className,
}: LyricsProps) {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef<HTMLLIElement>(null);
  const manualUntil = React.useRef(0);

  const at = usePlaybackClock({ position, startedAt, playing, interval: 200 });
  const synced = lines.some((line) => line.time !== undefined);
  const index = synced ? activeIndex(lines, at) : -1;

  React.useEffect(() => {
    if (!autoScroll || index < 0) return;
    const box = boxRef.current;
    const line = activeRef.current;
    if (!box || !line) return;
    if (Date.now() < manualUntil.current) return;

    const target = line.offsetTop - box.clientHeight / 2 + line.clientHeight / 2;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
  }, [index, autoScroll]);

  if (lines.length === 0) {
    return (
      <div className={cn("text-[13px] text-white/35", className)}>
        {empty ?? "no lyrics for this one."}
      </div>
    );
  }

  return (
    <div
      ref={boxRef}
      // Wheel and touch are the honest signals that a human took over; a
      // scroll listener would also fire for our own programmatic scrolling.
      onWheel={() => (manualUntil.current = Date.now() + 8000)}
      onTouchMove={() => (manualUntil.current = Date.now() + 8000)}
      className={cn(
        "w-full overflow-y-auto",
        height !== "auto" && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      style={height === "auto" ? undefined : { height }}
    >
      <ul className={cn("flex flex-col gap-1", align === "center" && "items-center text-center")}>
        {lines.map((line, i) => {
          const active = i === index;
          const past = index >= 0 && i < index;
          const content = line.text || "·";
          const tone = active
            ? "text-white"
            : past
              ? "text-white/25"
              : synced
                ? "text-white/45"
                : "text-white/70";

          return (
            <li key={i} ref={active ? activeRef : undefined} aria-current={active || undefined}>
              {onSeek && line.time !== undefined ? (
                <button
                  type="button"
                  onClick={() => onSeek(line.time!)}
                  className={cn(
                    "block w-full py-1 text-[15px] leading-7 transition-colors hover:text-white",
                    align === "center" ? "text-center" : "text-left",
                    tone,
                  )}
                >
                  {content}
                </button>
              ) : (
                <p className={cn("py-1 text-[15px] leading-7 transition-colors", tone)}>{content}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
