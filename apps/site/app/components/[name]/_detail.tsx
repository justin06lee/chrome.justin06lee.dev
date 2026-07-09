"use client";

import { useState } from "react";
import { Button } from "../../../../../packages/registry/button/button";
import { CodeBlock } from "../../../../../packages/registry/code-block/code-block";
import { Showcase } from "../../../../../packages/registry/showcase/showcase";
import { USAGE_EXAMPLES } from "./_examples";

export function ComponentDetail({
  name,
  description,
  source,
  installCommand,
  title,
  /** When true, the preview tab drops its bordered+dotted frame so the demo
   *  doesn't appear "inside another showcase". Use for container-type components. */
  barePreview,
  /** Full-width canvas for components with their own size presets; others stay at reading width. */
  wide,
  children,
}: {
  name: string;
  description?: string;
  source: string;
  installCommand: string;
  title?: React.ReactNode;
  barePreview?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const examples = USAGE_EXAMPLES[name] ?? [];

  return (
    <div className={wide ? undefined : "max-w-[720px] mx-auto"}>
      <div className="text-[13px] font-mono text-white/45 mb-3">
        components / <span className="text-white/70">{name}</span>
      </div>
      {title ?? (
        <h1 className="text-[44px] font-bold italic font-serif tracking-[-0.02em] mb-3">
          {name}.
        </h1>
      )}
      {description && (
        <p className="text-white/65 text-[15px] mb-10 max-w-[600px]">{description}</p>
      )}

      <div className="flex items-center gap-6 border-b border-white/10 mb-6">
        {(["preview", "code"] as const).map((t) => (
          <Button
            key={t}
            variant="link"
            onClick={() => setTab(t)}
            className={
              "py-3 px-0 text-[13px] -mb-px border-b-2 hover:no-underline " +
              (tab === t
                ? "border-white text-white"
                : "border-transparent text-white/55 hover:text-white")
            }
          >
            {t}
          </Button>
        ))}
      </div>

      {tab === "preview" ? (
        barePreview ? (
          <div className="min-h-[260px] mb-12 overflow-hidden">{children}</div>
        ) : (
          <Showcase className="mb-12">{children}</Showcase>
        )
      ) : (
        <CodeBlock code={source} language="tsx" className="mb-12" />
      )}

      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3">
        installation
      </div>
      <div className="flex max-w-[720px] items-center gap-3 border border-white/10 px-4 py-3 bg-white/[0.02] mb-12">
        <code className="font-mono text-[13px] flex-1">{installCommand}</code>
        <Button
          variant="link"
          copy={installCommand}
          copyFeedback="copied"
          className="text-[11px] font-mono text-white/55 hover:text-white hover:no-underline border-l border-white/15 pl-3"
        >
          copy
        </Button>
      </div>

      {examples.length > 0 && (
        <>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 mb-4">
            usage
          </div>
          <div className="flex flex-col gap-8 mb-12">
            {examples.map((ex) => (
              <div key={ex.label}>
                <div className="text-[13px] text-white/70 mb-2">{ex.label}</div>
                <div className="flex min-h-[150px] items-center justify-center overflow-hidden border border-white/10 border-b-0 p-8 bg-white/[0.01]">
                  {ex.render}
                </div>
                <CodeBlock code={ex.code} language="tsx" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
