import { Sparkline } from "./sparkline";

// Weekly hours, oldest first.
const SERIES = [
  { label: "machine learning", values: [4, 6, 5, 9, 8, 12, 11, 14, 13, 17, 16, 19] },
  { label: "cybersecurity", values: [2, 3, 9, 4, 2, 8, 3, 2, 7, 3, 2, 6] },
  { label: "working out", values: [5, 5, 4, 6, 5, 5, 6, 5, 4, 6, 6, 5] },
];

export default function SparklineDemo() {
  return (
    <div className="w-full max-w-md border border-white/10 bg-black p-6">
      <div className="flex flex-col gap-4">
        {SERIES.map((series) => (
          <div key={series.label} className="flex items-center justify-between gap-4">
            <span className="text-sm text-white/70">{series.label}</span>
            <Sparkline
              values={series.values}
              highlightLast
              label={`${series.label}, weekly hours trend`}
              className="text-white/55"
            />
          </div>
        ))}

        <div className="border-t border-white/10 pt-4">
          <Sparkline
            values={SERIES[0]!.values}
            width={320}
            height={64}
            curve="smooth"
            fill="rgba(255,255,255,0.06)"
            highlightLast
            label="machine learning, weekly hours trend"
            className="w-full text-white"
          />
        </div>
      </div>
    </div>
  );
}
