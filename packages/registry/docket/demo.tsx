"use client";

import { Docket } from "./docket";
import { Stamp } from "../stamp/stamp";
import { CopyButton } from "../copy-button/copy-button";

export default function DocketDemo() {
  return (
    <div className="w-full max-w-xl">
      <Docket
        kind="work order"
        reference="OJ-0042"
        title="rebuild the intake form"
        mark={<Stamp size="sm">received</Stamp>}
        rows={[
          { label: "job type", value: "build" },
          { label: "budget", value: "1k – 5k" },
          { label: "by when", value: "no fixed date" },
          { label: "links", value: "figma, one loom walkthrough" },
        ]}
        stub={
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
              keep this stub
            </span>
            <CopyButton text="OJ-0042" />
          </div>
        }
      />
    </div>
  );
}
