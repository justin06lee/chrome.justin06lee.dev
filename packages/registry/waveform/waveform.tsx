"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type WaveformProps = {
  /** Peak amplitudes, 0–1, left to right. One entry per bar. */
  peaks: number[];
  /** How far through, 0–1. Bars behind it are played, bars ahead are not. */
  progress?: number;
  /** Ratio 0–1 of the clicked position. Makes the waveform seekable. */
  onSeek?: (ratio: number) => void;
  /** Height in px. Defaults to 48. */
  height?: number;
  /** Widest a bar may get, in px. Bars flex to fill the container up to this. Defaults to 3. */
  barWidth?: number;
  /** Gap between bars in px. Defaults to 2. */
  gap?: number;
  /** Mirror each bar around the centre line instead of standing it on the floor. */
  mirror?: boolean;
  /** CSS color of the played bars. Defaults to white. */
  accent?: string;
  /** Shortest bar as a fraction of the tallest, so silence still has a spine. Defaults to 0.06. */
  floor?: number;
  ariaLabel?: string;
  className?: string;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Downsamples raw pcm to `count` peak values in 0–1 — the shape `peaks` wants.
 *
 * Takes the maximum absolute sample per bucket rather than the mean: an average
 * of a waveform that swings symmetrically about zero trends towards zero, which
 * would flatten every loud passage into the same grey band.
 */
export function samplePeaks(samples: ArrayLike<number>, count: number): number[] {
  if (count <= 0 || samples.length === 0) return [];
  const bucket = samples.length / count;
  const out: number[] = [];
  let loudest = 0;
  for (let i = 0; i < count; i++) {
    const start = Math.floor(i * bucket);
    const end = Math.min(samples.length, Math.floor((i + 1) * bucket));
    let peak = 0;
    for (let j = start; j < end; j++) {
      const value = Math.abs(samples[j] ?? 0);
      if (value > peak) peak = value;
    }
    if (peak > loudest) loudest = peak;
    out.push(peak);
  }
  // Normalise to the loudest peak so quiet masters still fill the frame.
  return loudest > 0 ? out.map((p) => p / loudest) : out;
}

/**
 * Static waveform: precomputed peaks with the played portion filled in.
 *
 * Bars are elements, not a canvas. At the few hundred bars a track needs that
 * costs nothing, and it buys crisp 1px edges at every dpr, real hover targets,
 * and a progress fill that is a css transition rather than a repaint loop.
 *
 * `sparkline` draws a trend through a series; this draws a signal's envelope —
 * bipolar, normalised, and cut by a playhead. The two look nothing alike on the
 * page, which is why they are separate components.
 */
export function Waveform({
  peaks,
  progress = 0,
  onSeek,
  height = 48,
  barWidth = 3,
  gap = 2,
  mirror = false,
  accent = "#fff",
  floor = 0.06,
  ariaLabel = "waveform",
  className,
}: WaveformProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [hoverRatio, setHoverRatio] = React.useState<number | null>(null);
  const seekable = typeof onSeek === "function";
  const played = clamp01(progress);

  const ratioFromPointer = (clientX: number) => {
    const rect = hostRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return clamp01((clientX - rect.left) / rect.width);
  };

  return (
    <div
      ref={hostRef}
      role={seekable ? "slider" : "img"}
      aria-label={ariaLabel}
      aria-valuemin={seekable ? 0 : undefined}
      aria-valuemax={seekable ? 100 : undefined}
      aria-valuenow={seekable ? Math.round(played * 100) : undefined}
      tabIndex={seekable ? 0 : undefined}
      onClick={seekable ? (event) => onSeek?.(ratioFromPointer(event.clientX)) : undefined}
      onPointerMove={
        seekable ? (event) => setHoverRatio(ratioFromPointer(event.clientX)) : undefined
      }
      onPointerLeave={seekable ? () => setHoverRatio(null) : undefined}
      onKeyDown={
        seekable
          ? (event) => {
              const step = event.key === "ArrowLeft" ? -0.02 : event.key === "ArrowRight" ? 0.02 : 0;
              if (step === 0) return;
              event.preventDefault();
              onSeek?.(clamp01(played + step));
            }
          : undefined
      }
      className={cn(
        "relative flex w-full overflow-hidden outline-none",
        mirror ? "items-center" : "items-end",
        seekable && "cursor-pointer",
        className,
      )}
      style={{ height, gap }}
    >
      {peaks.map((peak, i) => {
        const ratio = peaks.length > 1 ? i / (peaks.length - 1) : 0;
        const isPlayed = ratio <= played;
        const size = Math.max(floor, clamp01(peak));
        return (
          <span
            key={i}
            aria-hidden
            className="min-w-px flex-1 transition-colors duration-150"
            style={{
              maxWidth: barWidth,
              height: `${size * 100}%`,
              background: isPlayed ? accent : "rgba(255,255,255,0.18)",
            }}
          />
        );
      })}

      {seekable && hoverRatio !== null && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-white/40"
          style={{ left: `${hoverRatio * 100}%` }}
        />
      )}
    </div>
  );
}
