"use client";

import { Pfp } from "./pfp";

const svg = (inner: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">${inner}</svg>`,
  )}`;

const gradient = svg(
  `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs>` +
    `<rect width="64" height="64" fill="url(#g)"/>` +
    `<text x="32" y="42" font-family="monospace" font-size="28" fill="white" text-anchor="middle">j</text>`,
);

const dot = svg(`<rect width="64" height="64" fill="#111"/><circle cx="32" cy="32" r="18" fill="#6ee7b7"/>`);

export default function PfpDemo() {
  return (
    <div className="flex items-center gap-8">
      <Pfp src={gradient} alt="avatar" />
      <Pfp src={dot} alt="avatar" className="size-24" scale={1.2} />
    </div>
  );
}
