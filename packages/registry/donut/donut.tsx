"use client";

import * as React from "react";
import type { DonutConfig } from "./donut-frames";
import { acquireBake, releaseBake, frameString } from "./donut-cache";

export interface DonutProps {
  width?: number;
  height?: number;
  R?: number;
  r?: number;
  /** Projection scale. Omit to auto-fit the torus to the grid (recommended). */
  K?: number;
  D?: number;
  /** Optional override for the adaptive u-sampling step (radians). */
  du?: number;
  /** Optional override for the adaptive v-sampling step (radians). */
  dv?: number;
  luminanceChars?: string;
  lightDirection?: [number, number, number];
  speed?: number;
  yScaleOverride?: number;
  className?: string;
  /** CSS background applied to the root element. Transparent by default. */
  background?: string;
}

export function Donut({
  width = 60,
  height = 30,
  R = 0.4,
  r = 0.25,
  K,
  D = 4,
  du,
  dv,
  luminanceChars = " ,-~:;=!*#$@",
  lightDirection = [0, 1, -1],
  speed = 0.75,
  yScaleOverride,
  className = "font-mono text-xs leading-[1] whitespace-pre cursor-default select-none",
  background,
}: DonutProps) {
  const preRef = React.useRef<HTMLPreElement | null>(null);
  const [yScale, setYScale] = React.useState<number>(yScaleOverride ?? 0.55);

  // Auto-fit the projection scale to the char grid so the torus always sits
  // inside its bounds with a margin, at any width/height. A fixed K overflows
  // small grids (the donut gets clipped at the top/sides). Caller can still
  // override K explicitly.
  const Keff =
    K ??
    0.82 * Math.min((width * D) / (2 * (R + r)), (height * D) / (2 * (R + r) * yScale));

  const lx = lightDirection[0];
  const ly = lightDirection[1];
  const lz = lightDirection[2];

  React.useLayoutEffect(() => {
    if (yScaleOverride != null || !preRef.current) return;
    const pre = preRef.current;

    const probe = document.createElement("span");
    probe.textContent = "0";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    pre.appendChild(probe);

    const charWidth = probe.getBoundingClientRect().width || 1;
    let lineHeight = parseFloat(getComputedStyle(pre).lineHeight);
    if (!isFinite(lineHeight) || lineHeight <= 0) {
      const twoLines = document.createElement("div");
      twoLines.style.position = "absolute";
      twoLines.style.visibility = "hidden";
      twoLines.style.whiteSpace = "pre";
      twoLines.textContent = "0\n0";
      pre.appendChild(twoLines);
      lineHeight = twoLines.getBoundingClientRect().height / 2 || 1;
      pre.removeChild(twoLines);
    }
    pre.removeChild(probe);
    setYScale(charWidth / lineHeight);
  }, [yScaleOverride]);

  React.useEffect(() => {
    let rafId = 0;
    let terminated = false;

    // Device tier feeds sampling density (coarser on weak hardware).
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
    const isLowEnd = cores <= 4 || memory <= 4;

    const lMag = Math.hypot(lx, ly, lz) || 1;
    const chars = luminanceChars.length ? luminanceChars : " ";

    const cfg: DonutConfig = {
      width,
      height,
      R,
      r,
      K: Keff,
      D,
      du,
      dv,
      Lx: lx / lMag,
      Ly: ly / lMag,
      Lz: lz / lMag,
      chars,
      speed,
      yScale,
      isLowEnd,
    };

    // Shared across every Donut with this exact config: one frame-string cache,
    // one baked buffer, one worker. Identical donuts replay the same data.
    const handle = acquireBake(cfg);
    const N = handle.N;

    const frameBudget = isLowEnd ? 33 : 0; // ~30fps on low-end, vsync otherwise
    let lastFrameTime = 0;
    let fi = 0;

    function frame(now: number) {
      if (frameBudget > 0 && now - lastFrameTime < frameBudget) {
        rafId = requestAnimationFrame(frame);
        return;
      }
      lastFrameTime = now;

      const pre = preRef.current;
      if (pre && !terminated) pre.textContent = frameString(handle, fi);
      fi = (fi + 1) % N;

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => {
      terminated = true;
      cancelAnimationFrame(rafId);
      releaseBake(handle);
    };
  }, [width, height, R, r, Keff, D, du, dv, luminanceChars, speed, lx, ly, lz, yScale]);

  return (
    <pre
      ref={preRef}
      className={className}
      style={{ background }}
      aria-label="ASCII donut"
    />
  );
}
