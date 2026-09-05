"use client";

import { Pane } from "./pane";

const RELEASES = [
  ["0.9.2", "pane: fade only the edge the content runs past"],
  ["0.9.1", "shelf: arrows disable at their end"],
  ["0.9.0", "marquee: repeats are inert as well as hidden"],
  ["0.8.4", "salon: trailing row capped instead of stretched"],
  ["0.8.3", "intro: onExit fires as the fade begins"],
  ["0.8.2", "navbar: owns its entrance"],
  ["0.8.1", "donut: frames cached across mounts"],
  ["0.8.0", "desk: editor and preview sync by caret"],
  ["0.7.6", "heatmap: buckets are tz-aware"],
  ["0.7.5", "toast: success earns its icon, not a colour"],
  ["0.7.4", "kbd: the one rounded corner in the registry"],
  ["0.7.3", "stack: fanned pile, not a laid-out wall"],
];

export default function PaneDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Pane maxHeight="220px" ariaLabel="releases" className="border border-white/10">
        <ul className="divide-y divide-white/10">
          {RELEASES.map(([version, note]) => (
            <li key={version} className="flex items-baseline gap-3 px-3 py-2.5">
              <span className="font-mono text-[11px] tracking-[0.12em] text-white/40">{version}</span>
              <span className="text-[13px] text-white/70">{note}</span>
            </li>
          ))}
        </ul>
      </Pane>
      <p className="text-[13px] text-white/40">
        scroll inside the pane — the page stays where it is until the pane runs out.
      </p>
    </div>
  );
}
