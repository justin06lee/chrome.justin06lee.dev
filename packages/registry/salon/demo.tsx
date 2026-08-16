"use client";

import { Salon, type SalonItem } from "./salon";

// Inline SVGs at genuinely different intrinsic sizes, so the demo needs no
// network and the varied shapes are the point. Each piece paints its own
// intrinsic dimensions, which is exactly what drives the salon's aspect ratios.
const piece = (width: number, height: number, fill: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<rect width="100%" height="100%" fill="${fill}"/>` +
      `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="rgba(255,255,255,0.2)"/>` +
      `<text x="50%" y="50%" fill="rgba(255,255,255,0.65)" font-family="monospace" font-size="${Math.round(Math.min(width, height) / 6)}" text-anchor="middle" dominant-baseline="middle">${width}×${height}</text>` +
      `</svg>`,
  );

const ITEMS: SalonItem[] = [
  { src: piece(960, 320, "#3b3a4e"), width: 960, height: 320, title: "the horizon line", alt: "wide banner", href: "#horizon" },
  { src: piece(400, 600, "#4e3b3b"), width: 400, height: 600, title: "monolith", alt: "tall poster" },
  { src: piece(480, 480, "#3b4e46"), width: 480, height: 480, title: "study in gray", alt: "square study" },
  { src: piece(800, 450, "#4e4a3b"), width: 800, height: 450, title: "wide angle", alt: "16:9 still", href: "https://chrome.justin06lee.dev", external: true },
  { src: piece(360, 540, "#463b4e"), width: 360, height: 540, title: "portrait no. 4", alt: "portrait" },
  { src: piece(480, 480, "#3b444e"), width: 480, height: 480, title: "second study", alt: "square study" },
  { src: piece(640, 480, "#4e3b46"), width: 640, height: 480, title: "still life", alt: "4:3 landscape" },
  { src: piece(320, 320, "#404e3b"), width: 320, height: 320, title: "swatch", alt: "small square" },
];

export default function SalonDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Salon items={ITEMS} targetRowHeight={200} ariaLabel="works on the wall" />
      <p className="text-[13px] text-white/40">
        every piece keeps its own proportions; each row is justified to fill the
        width. narrow the window and the hang reflows. two pieces link out.
      </p>
    </div>
  );
}
