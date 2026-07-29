import { BarList } from "./bar-list";

const HOURS = [
  { id: "ml", label: "machine learning", value: 412.5, href: "#" },
  { id: "sec", label: "cybersecurity", value: 186, href: "#" },
  { id: "gym", label: "working out", value: 94, href: "#" },
  { id: "reading", label: "reading", value: 61.5, href: "#" },
  { id: "korean", label: "korean", value: 28, href: "#" },
];

export default function BarListDemo() {
  return (
    <div className="w-full max-w-md border border-white/10 bg-black p-6">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
        hours this year
      </p>
      <BarList
        items={HOURS}
        formatValue={(value) => `${value.toFixed(1)} h`}
      />
    </div>
  );
}
