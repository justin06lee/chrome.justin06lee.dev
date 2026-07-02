"use client";

import { SpriteScrubber } from "./sprite-scrubber";

const COLS = 4;
const ROWS = 3;
const FRAMES = 12;
const CELL = 200;

// Build a synthetic sprite sheet: a COLS x ROWS grid where each cell draws its
// frame number and a hand rotating around the clock, so dragging visibly scrubs.
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
    const hue = Math.round((i / FRAMES) * 360);
    cells += `
      <g>
        <rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="#0a0a0a"/>
        <circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="none" stroke="#262626" stroke-width="2"/>
        <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="hsl(${hue} 90% 60%)" stroke-width="6" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="6" fill="hsl(${hue} 90% 60%)"/>
        <text x="${x + 12}" y="${y + 30}" font-family="monospace" font-size="22" fill="#e5e5e5">${i + 1}</text>
      </g>`;
  }
  const w = COLS * CELL;
  const h = ROWS * CELL;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${cells}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SHEET = buildSheet();

export default function SpriteScrubberDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <SpriteScrubber
        src={SHEET}
        frames={FRAMES}
        cols={COLS}
        rows={ROWS}
        aspectRatio="1 / 1"
        className="w-64"
        aria-label="sprite scrubber demo"
      />
      <p className="font-mono text-xs uppercase tracking-widest text-white/50">
        drag across to scrub
      </p>
    </div>
  );
}
