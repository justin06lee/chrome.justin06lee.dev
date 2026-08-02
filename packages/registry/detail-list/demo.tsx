"use client";

import { Clock, MapPin, User } from "lucide-react";
import { DetailList } from "./detail-list";

export default function DetailListDemo() {
  return (
    <div className="grid w-full gap-6 bg-black p-6 lg:grid-cols-2">
      <div className="border border-white/10 p-5">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          rows
        </p>
        <DetailList
          items={[
            { label: "what", value: "coffee", icon: <User className="size-3.5" strokeWidth={1.5} /> },
            {
              label: "when",
              value: "wed, aug 5 · 9:30 am",
              icon: <Clock className="size-3.5" strokeWidth={1.5} />,
              note: "america/los_angeles",
            },
            {
              label: "where",
              value: "google meet",
              icon: <MapPin className="size-3.5" strokeWidth={1.5} />,
            },
            { label: "how long", value: "30m" },
          ]}
        />
      </div>

      <div className="border border-white/10 p-5">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
          grid
        </p>
        <DetailList
          layout="grid"
          items={[
            { label: "guest", value: "sam rivera" },
            { label: "email", value: "sam@example.com" },
            { label: "booked", value: "aug 1, 4:12 pm" },
            { label: "zone", value: "europe/berlin" },
            {
              label: "notes",
              value: "want to talk through the migration plan before the review.",
              wide: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
