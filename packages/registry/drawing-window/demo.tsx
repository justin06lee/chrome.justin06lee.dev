"use client";

import { useRef, useState } from "react";
import { DrawingWindow } from "./drawing-window";

export default function Demo() {
  const counter = useRef(0);
  const [windows, setWindows] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [darkMapping, setDarkMapping] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  function open() {
    counter.current += 1;
    const id = counter.current;
    setWindows((current) => [...current, id]);
    setActiveId(id);
  }

  function close(id: number) {
    setWindows((current) => current.filter((value) => value !== id));
    setActiveId((current) => (current === id ? null : current));
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 py-10">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={open}
          className="bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
        >
          open drawing window
        </button>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={darkMapping}
            onChange={(event) => setDarkMapping(event.target.checked)}
          />
          dark-mapping mode
        </label>
      </div>

      {saved ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={saved} alt="saved drawing" className="max-h-48 border border-white/15" />
      ) : (
        <p className="text-sm text-white/40">
          open one or more windows — each is numbered (#1, #2, …). draw, then save to preview here.
        </p>
      )}

      {windows.map((id, index) => (
        <DrawingWindow
          key={id}
          title={`drawing #${id}`}
          subtitle="demo"
          active={id === activeId}
          darkMapping={darkMapping}
          zIndex={80 + index}
          initialPosition={{ x: 72 + index * 28, y: 120 + index * 28 }}
          onFocus={() => setActiveId(id)}
          onClose={() => close(id)}
          onSave={({ dataUrl, darkDataUrl }) => {
            setSaved(darkDataUrl ?? dataUrl);
            close(id);
          }}
        />
      ))}
    </div>
  );
}
