import { Stack } from "./stack";

export default function StackDemo() {
  return (
    <Stack>
      <div className="flex h-full flex-col justify-between p-4">
        <div className="space-y-2">
          <div className="h-px w-full bg-white/15" />
          <div className="h-px w-5/6 bg-white/15" />
          <div className="h-px w-2/3 bg-white/15" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
            article
          </p>
          <p className="mt-2 text-sm font-medium leading-6">
            stacked paper card
          </p>
        </div>
      </div>
    </Stack>
  );
}
