import { Brain, Dumbbell, ShieldHalf } from "lucide-react";
import { StatTile } from "./stat-tile";

export default function StatTileDemo() {
  return (
    <div className="w-full border border-white/10 bg-black p-6">
      <div className="grid gap-px bg-white/10 sm:grid-cols-3">
        <StatTile
          label="machine learning"
          value={412.5}
          decimals={1}
          unit="h"
          animate
          delta={38}
          deltaLabel="vs last quarter"
          icon={<Brain className="size-3.5" strokeWidth={1.5} />}
          footnote="logged across 148 sessions since jan"
          className="border-0"
        />
        <StatTile
          label="cybersecurity"
          value={186}
          unit="h"
          animate
          delta={-12}
          deltaLabel="vs last quarter"
          icon={<ShieldHalf className="size-3.5" strokeWidth={1.5} />}
          footnote="ctf weekends only, so it moves in steps"
          className="border-0"
        />
        <StatTile
          label="working out"
          value={94}
          unit="h"
          animate
          delta={6}
          deltaLabel="vs last quarter"
          icon={<Dumbbell className="size-3.5" strokeWidth={1.5} />}
          footnote="lifting and running, warmups included"
          className="border-0"
        />
      </div>
    </div>
  );
}
