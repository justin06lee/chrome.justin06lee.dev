"use client";

import { useState } from "react";

export function ComponentDetail({
  name,
  description,
  source,
  installCommand,
  title,
  children,
}: {
  name: string;
  description?: string;
  source: string;
  installCommand: string;
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — silently ignore */
    }
  };

  return (
    <>
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
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "py-3 text-[13px] -mb-px border-b-2 transition-colors " +
              (tab === t
                ? "border-white text-white"
                : "border-transparent text-white/55 hover:text-white")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div
          className="border border-white/10 min-h-[260px] flex items-center justify-center p-10 mb-12"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            backgroundPosition: "0 0",
          }}
        >
          {children}
        </div>
      ) : (
        <pre className="border border-white/10 bg-white/[0.02] p-5 text-[12px] leading-[1.65] overflow-x-auto whitespace-pre mb-12">
          {source}
        </pre>
      )}

      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3">
        installation
      </div>
      <div className="flex items-center gap-3 border border-white/10 px-4 py-3 bg-white/[0.02] mb-12">
        <code className="font-mono text-[13px] flex-1">{installCommand}</code>
        <button
          onClick={copy}
          className="font-mono text-[11px] text-white/55 hover:text-white border-l border-white/15 pl-3"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
    </>
  );
}
