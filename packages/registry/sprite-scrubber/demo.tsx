"use client";

import { useState } from "react";
import { SpriteScrubber } from "./sprite-scrubber";

const COLS = 4;
const ROWS = 3;
const FRAMES = 12;
const CELL = 200;

// Build a synthetic sprite sheet: a COLS x ROWS grid where each cell draws its
// frame number and a hand rotating around a dial, so dragging visibly scrubs.
// Dimensions match the cols/rows/frames props passed below.
function buildSheet() {
  let cells = "";
  for (let i = 0; i < FRAMES; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = col * CELL;
    const y = row * CELL;
    const cx = x + CELL / 2;
    const cy = y + CELL / 2;
    const angle = (i / FRAMES) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const r = CELL * 0.32;
    const hx = cx + Math.cos(rad) * r;
    const hy = cy + Math.sin(rad) * r;
    const tx = cx + Math.cos(rad) * (r + 16);
    const ty = cy + Math.sin(rad) * (r + 16);
    const hue = Math.round((i / FRAMES) * 360);
    cells += `
      <g>
        <rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="#0a0a0a"/>
        <circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="none" stroke="#404040" stroke-width="2"/>
        <circle cx="${tx}" cy="${ty}" r="5" fill="hsl(${hue} 90% 60%)"/>
        <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="hsl(${hue} 90% 60%)" stroke-width="6" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="6" fill="hsl(${hue} 90% 60%)"/>
        <text x="${x + 14}" y="${y + 38}" font-family="monospace" font-size="28" fill="#e5e5e5">${i + 1}</text>
      </g>`;
  }
  const w = COLS * CELL;
  const h = ROWS * CELL;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${cells}</svg>`;
  // Escape parentheses too: encodeURIComponent leaves "(" and ")" raw, and a
  // raw paren inside an unquoted CSS url() invalidates the whole declaration.
  const encoded = encodeURIComponent(svg)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  return `data:image/svg+xml,${encoded}`;
}

const SHEET = buildSheet();

export default function SpriteScrubberDemo() {
  const [frame, setFrame] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <SpriteScrubber
        src={SHEET}
        frames={FRAMES}
        cols={COLS}
        rows={ROWS}
        edgeLeft={0}
        edgeRight={1}
        reverse={false}
        aspectRatio="1 / 1"
        className="w-64"
        onFrameChange={setFrame}
        aria-label="sprite scrubber demo"
      />
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        drag across to scrub — frame {String(frame + 1).padStart(2, "0")}/{FRAMES}
      </p>
    </div>
  );
}
