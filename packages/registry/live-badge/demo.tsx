"use client";

import { useState } from "react";
import { LiveBadge, type LiveStatus } from "./live-badge";

const ORDER: LiveStatus[] = ["live", "connecting", "idle", "offline"];

export default function LiveBadgeDemo() {
  const [status, setStatus] = useState<LiveStatus>("live");

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <LiveBadge status="live" detail="12 listening" />
        <LiveBadge status="connecting" />
        <LiveBadge status="idle" label="away" size="sm" />
        <LiveBadge status="offline" size="sm" />
      </div>

      <div className="flex items-center gap-3 border border-white/10 px-4 py-3">
        <LiveBadge status={status} accent="#ff5c5c" detail={status === "live" ? "3 listening" : undefined} />
        <button
          type="button"
          onClick={() => setStatus((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length]!)}
          className="ml-auto border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/5"
        >
          next state
        </button>
      </div>
    </div>
  );
}
