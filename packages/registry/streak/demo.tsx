import { Streak } from "./streak";

// Last 28 days, most recent last. Two misses, then an unbroken run of 12.
const LAST_28 = [
  true, true, false, true, true, true, true,
  true, false, true, true, true, true, true,
  true, false, true, true, true, true, true,
  true, true, true, true, true, true, true,
];

export default function StreakDemo() {
  return (
    <div className="w-full max-w-md border border-white/10 bg-black p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Streak
          label="machine learning"
          current={12}
          best={31}
          days={LAST_28}
        />
        <Streak label="working out" current={1} best={44} unit="day" />
      </div>
    </div>
  );
}
