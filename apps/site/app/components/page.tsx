import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { REGISTRY } from "../../registry-manifest";

export default function ComponentsIndex() {
  const ui = REGISTRY.filter((m) => m.type === "registry:ui");
  return (
    <div className="max-w-[720px] mx-auto">
      <div className="text-[13px] font-mono text-white/45 mb-3">components</div>
      <h1 className="text-[44px] font-bold italic font-serif tracking-[-0.02em] mb-3">
        components.
      </h1>
      <p className="text-white/65 text-[15px] mb-10 max-w-[600px]">
        copy-paste, dark-only, no abstractions you don&apos;t own. install via the cli — the
        component lives in your codebase, not behind a package boundary.
      </p>

      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3">
        all components
      </div>
      <div className="border border-white/10">
        {ui.map((m, i) => (
          <Link
            key={m.name}
            href={`/components/${m.name}`}
            className={
              "flex items-baseline justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors " +
              (i < ui.length - 1 ? "border-b border-white/10" : "")
            }
          >
            <div>
              <div className="text-[15px] font-medium">{m.name}</div>
              {m.description && (
                <div className="text-[12px] text-white/55 mt-0.5">{m.description}</div>
              )}
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-white/40">
              view <ArrowRight size={11} aria-hidden />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
