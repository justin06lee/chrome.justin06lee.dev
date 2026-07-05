import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Example = {
  slug: string;
  name: string;
  tagline: string;
  status: "live" | "soon";
};

const EXAMPLES: Example[] = [];

export default function ExamplesIndex() {
  return (
    <main className="flex-1 px-12 py-12 max-w-[860px] mx-auto w-full">
      <div className="text-[13px] font-mono text-white/45 mb-3">examples</div>
      <h1 className="text-[44px] font-bold italic font-serif tracking-[-0.02em] mb-3">
        examples.
      </h1>
      <p className="text-white/65 text-[15px] mb-12 max-w-[600px]">
        showcases built with the chrome component library. each is a take on what owning the
        code lets you do.
      </p>

      {EXAMPLES.length === 0 ? (
        <div className="border border-dashed border-white/15 px-5 py-10 text-center text-[13px] text-white/45">
          nothing here yet.
        </div>
      ) : (
        <div className="border border-white/10">
          {EXAMPLES.map((ex, i) => (
            <Link
              key={ex.slug}
              href={`/examples/${ex.slug}`}
              className={
                "flex items-baseline justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors " +
                (i < EXAMPLES.length - 1 ? "border-b border-white/10" : "")
              }
            >
              <div className="flex-1 pr-6">
                <div className="text-[15px] font-medium">{ex.name}</div>
                <div className="text-[12px] text-white/55 mt-0.5">{ex.tagline}</div>
              </div>
              <div className="font-mono text-[11px] text-white/40 shrink-0">
                {ex.status === "live" ? (
                  <span className="flex items-center gap-1">
                    view <ArrowRight size={11} aria-hidden />
                  </span>
                ) : (
                  "soon"
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
