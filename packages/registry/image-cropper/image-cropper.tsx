"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Range } from "@/components/ui/range";

export type CropValue = {
  /** Image url. */
  url: string;
  /** Zoom applied to the image inside the frame. */
  scale: number;
  /** Horizontal framing offset, in % of the frame. */
  x: number;
  /** Vertical framing offset, in % of the frame. */
  y: number;
};

export type ImageCropperProps = {
  /** Controlled crop value. */
  value: CropValue;
  /** Emitted on drag/zoom/nudge. */
  onChange: (value: CropValue) => void;
  /** Frame size in px (square unless `aspect` is set). */
  size?: number;
  /** Width / height ratio of the frame. */
  aspect?: number;
  /** Min/max zoom. */
  minScale?: number;
  maxScale?: number;
  /** Render a circular crop guide over the frame. */
  circle?: boolean;
  className?: string;
};

/**
 * Drag-to-reposition + scroll/slider-to-zoom image cropper. Dark only.
 * Drag inside the frame nudges x/y (clamped -100..100), the wheel and the
 * sliders drive zoom. Emits `{ url, scale, x, y }` via `onChange` only.
 */
export function ImageCropper({
  value,
  onChange,
  size = 240,
  aspect = 1,
  minScale = 0.5,
  maxScale = 4,
  circle = false,
  className,
}: ImageCropperProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    w: number;
  } | null>(null);

  const clampScale = (s: number) => Math.min(maxScale, Math.max(minScale, s));
  const clampPct = (p: number) => Math.min(100, Math.max(-100, p));

  const onMouseDown = (e: React.MouseEvent) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: value.x,
      origY: value.y,
      w: rect.width,
    };
    const move = (ev: MouseEvent) => {
      const d = dragState.current;
      if (!d) return;
      const dxPct = ((ev.clientX - d.startX) / d.w) * 100;
      const dyPct = ((ev.clientY - d.startY) / d.w) * 100;
      onChange({
        ...value,
        x: clampPct(d.origX + dxPct),
        y: clampPct(d.origY + dyPct),
      });
    };
    const up = () => {
      dragState.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    onChange({ ...value, scale: clampScale(value.scale + delta) });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        ref={boxRef}
        onMouseDown={onMouseDown}
        onWheel={onWheel}
        className={cn(
          "relative overflow-hidden border border-white/20 bg-white/5",
          "cursor-grab touch-none select-none active:cursor-grabbing",
        )}
        style={{ width: size, height: size / aspect }}
      >
        {value.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.url}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{
              transform: `translate(${value.x}%, ${value.y}%) scale(${value.scale})`,
              transformOrigin: "center",
            }}
          />
        )}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/30",
            circle && "rounded-full",
          )}
        />
      </div>

      <div className="flex flex-col gap-4" style={{ width: size }}>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-white/60">
            Zoom: {value.scale.toFixed(2)}x
          </span>
          <Range
            value={value.scale}
            onChange={(scale) => onChange({ ...value, scale: clampScale(scale) })}
            min={minScale}
            max={maxScale}
            step={0.01}
            ariaLabel="zoom"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/60">X: {value.x.toFixed(0)}%</span>
            <Range
              value={value.x}
              onChange={(x) => onChange({ ...value, x: clampPct(x) })}
              min={-100}
              max={100}
              step={0.5}
              ariaLabel="horizontal offset"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/60">Y: {value.y.toFixed(0)}%</span>
            <Range
              value={value.y}
              onChange={(y) => onChange({ ...value, y: clampPct(y) })}
              min={-100}
              max={100}
              step={0.5}
              ariaLabel="vertical offset"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...value, x: 0, y: 0, scale: 1 })}
          className="self-start border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10"
        >
          Reset position & zoom
        </button>
      </div>
    </div>
  );
}
