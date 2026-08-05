"use client";

import { AlbumArt } from "./album-art";

const cover = (angle: number, ring: number) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle} 0.5 0.5)">
          <stop offset="0" stop-color="#2b2b2b"/>
          <stop offset="1" stop-color="#0a0a0a"/>
        </linearGradient>
      </defs>
      <rect width="320" height="320" fill="url(#g)"/>
      <circle cx="160" cy="160" r="${ring}" fill="none" stroke="#e8e8e8" stroke-width="1.5"/>
      <circle cx="160" cy="160" r="52" fill="none" stroke="#e8e8e8" stroke-width="1.5"/>
      <rect x="152" y="24" width="16" height="272" fill="#e8e8e8"/>
    </svg>`,
  );

const COVER = cover(0, 96);
const MOSAIC = [cover(0, 96), cover(45, 72), cover(90, 110), cover(135, 60)];

export default function AlbumArtDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex items-end gap-4">
        {(["xs", "sm", "md", "lg"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <AlbumArt src={COVER} alt={`cover, size ${size}`} size={size} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              {size}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">
          <AlbumArt size="lg" alt="no cover" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            fallback
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <AlbumArt src="https://example.invalid/gone.jpg" size="lg" alt="broken cover" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            404 → fallback
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <AlbumArt src={COVER} size="lg" alt="cover with bleed" bleed />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            bleed
          </span>
        </div>
      </div>

      <div className="flex items-end gap-6">
        {([2, 3, 4] as const).map((count) => (
          <div key={count} className="flex flex-col items-center gap-2">
            <AlbumArt src={MOSAIC.slice(0, count)} size="lg" alt={`playlist of ${count}`} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              mosaic · {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
