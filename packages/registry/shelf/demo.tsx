"use client";

import { Shelf } from "./shelf";

const COVERS = ["#1f1f1f", "#141414", "#242424", "#101010", "#1a1a1a", "#2b2b2b"];

const ITEMS = [
  "late shift",
  "rain on the window",
  "second coffee",
  "the long way round",
  "nothing at all",
  "closing up",
  "four in the morning",
  "walk it off",
];

export default function ShelfDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <Shelf title="playlists" action={<span className="font-mono text-[11px] text-white/35">8</span>}>
        {ITEMS.map((name, i) => (
          <div key={name} className="flex flex-col gap-2">
            <div
              className="aspect-square w-full border border-white/10"
              style={{ background: COVERS[i % COVERS.length] }}
            />
            <div className="truncate text-[13px] text-white/80">{name}</div>
            <div className="truncate text-[11px] text-white/40">{(i + 3) * 4} tracks</div>
          </div>
        ))}
      </Shelf>

      <Shelf title="wider items, no snap" itemWidth={240} gap={12} snap={false}>
        {ITEMS.slice(0, 5).map((name, i) => (
          <div key={name} className="border border-white/10 p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
              0{i + 1}
            </div>
            <div className="mt-2 text-[15px] text-white/85">{name}</div>
          </div>
        ))}
      </Shelf>

      <p className="text-[13px] text-white/40">
        the arrows only exist while the row overflows — narrow the window and watch
        them appear.
      </p>
    </div>
  );
}
