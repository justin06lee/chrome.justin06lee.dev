import Link from "next/link";
import Image from "next/image";
import { Chrome } from "../../../../../packages/registry/chrome/chrome";

type Category = {
  id: string;
  name: string;
  tagline: string;
  href: string;
  components: string[];
  preview: React.ReactNode;
};

const CATEGORIES: Category[] = [
  {
    id: "α-01",
    name: "primitives",
    tagline: "— foundational interactive surfaces",
    href: "/components/button",
    components: ["button"],
    preview: (
      <div className="flex gap-2">
        <span className="font-mono text-[11px] px-2.5 py-1 bg-white text-black">primary</span>
        <span className="font-mono text-[11px] px-2.5 py-1 border border-white/25">ghost</span>
      </div>
    ),
  },
  {
    id: "β-02",
    name: "overlays",
    tagline: "— modal dialogs & portals",
    href: "/components/dialog",
    components: ["dialog"],
    preview: (
      <div className="border border-white/15 px-3 py-2 bg-black/60 text-[11px]">
        <div className="font-medium mb-0.5">delete file?</div>
        <div className="text-white/55 text-[10px]">cannot be undone</div>
      </div>
    ),
  },
  {
    id: "γ-03",
    name: "forms",
    tagline: "— input controls, native first",
    href: "/components/input",
    components: ["input", "select"],
    preview: (
      <div className="flex flex-col gap-1.5">
        <input
          placeholder="email"
          readOnly
          className="font-sans text-[10px] px-2 py-1 bg-transparent border border-white/15 w-[200px] outline-none"
        />
        <div className="font-sans text-[10px] px-2 py-1 bg-transparent border border-white/15 w-[200px] flex justify-between">
          <span>option</span>
          <span className="text-white/40">▾</span>
        </div>
      </div>
    ),
  },
  {
    id: "δ-04",
    name: "composites",
    tagline: "— pre-assembled patterns",
    href: "/components/socials",
    components: ["socials"],
    preview: (
      <div className="flex gap-1.5">
        {["gh", "x", "m"].map((s) => (
          <span
            key={s}
            className="w-7 h-7 border border-white/15 inline-flex items-center justify-center font-mono text-[10px] text-white/65"
          >
            {s}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "ε-05",
    name: "effects",
    tagline: "— typographic chrome treatments",
    href: "/docs/theming",
    components: ["foil text"],
    preview: (
      <Chrome className="italic font-serif font-bold text-3xl tracking-[-0.02em]">
        chrome.
      </Chrome>
    ),
  },
  {
    id: "ζ-06",
    name: "—",
    tagline: "— available for installation",
    href: "/docs",
    components: [],
    preview: (
      <div className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
        empty socket
      </div>
    ),
  },
];

const NODE_POS: Array<[string, string]> = [
  ["13%", "50%"],
  ["28%", "51%"],
  ["42%", "53%"],
  ["55%", "55%"],
  ["68%", "56%"],
  ["81%", "57%"],
];

const CARD_POS = [
  { top: "6%", left: "4%" },
  { top: "22%", right: "4%" },
  { top: "44%", left: "4%" },
  { top: "50%", right: "4%" },
  { top: "70%", left: "4%" },
  { top: "76%", right: "4%" },
] as const;

const WIRES = [
  "M 312,80 C 500,80 600,100 700,135",
  "M 1128,230 C 1000,230 850,230 770,250",
  "M 312,440 C 500,440 650,400 740,395",
  "M 1128,490 C 980,490 880,500 800,510",
  "M 312,680 C 500,680 700,650 808,625",
  "M 1128,720 C 980,720 880,740 814,750",
];

export default function CyberwarePage() {
  return (
    <>
      <div className="px-12 py-6 border-b border-white/10 text-[13px] font-mono text-white/45">
        <Link href="/examples" className="hover:text-white/70">examples</Link>
        <span className="mx-2">/</span>
        <span className="text-white/70">cyberware spine</span>
      </div>

      <section className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[820px]">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden
        >
          {WIRES.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={i === WIRES.length - 1 ? "rgba(255,255,255,0.12)" : "rgba(255,92,180,0.45)"}
              strokeWidth="1"
              strokeDasharray="4 4"
              className={i === WIRES.length - 1 ? "" : "[animation:flow_2s_linear_infinite]"}
            />
          ))}
          <style>{`@keyframes flow { to { stroke-dashoffset: -16; } }`}</style>
        </svg>

        <div className="relative h-[min(80vh,720px)] aspect-[4/5] z-[2]">
          <Image
            src="/david.png"
            alt="david — cyberware operator"
            fill
            sizes="(max-width: 1024px) 80vw, 50vw"
            priority
            className="object-contain [filter:drop-shadow(0_0_60px_rgba(255,92,180,0.15))_drop-shadow(0_0_120px_rgba(80,200,255,0.08))]"
          />
          {NODE_POS.map(([top, left], i) => {
            const isEmpty = i === NODE_POS.length - 1;
            return (
              <span
                key={i}
                aria-hidden
                style={{ top, left }}
                className={
                  isEmpty
                    ? "absolute -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-2 border-black z-[3] bg-[radial-gradient(circle,#1a1a1a,#0a0a0a)] shadow-[0_0_0_2px_rgba(255,255,255,0.15)]"
                    : "absolute -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-2 border-black z-[3] bg-[radial-gradient(circle_at_30%_30%,#fff,#888_50%,#2a2a2a)] [animation:nodepulse_2.4s_ease-in-out_infinite]"
                }
              />
            );
          })}
          <style>{`
            @keyframes nodepulse {
              0%, 100% { box-shadow: 0 0 0 2px rgba(255,255,255,0.5), 0 0 12px rgba(255,92,180,0.5), 0 0 24px rgba(255,92,180,0.2); }
              50%      { box-shadow: 0 0 0 2px rgba(255,255,255,0.85), 0 0 24px rgba(255,92,180,0.9), 0 0 48px rgba(255,92,180,0.5); }
            }
          `}</style>
        </div>

        {CATEGORIES.map((cat, i) => {
          const pos = CARD_POS[i];
          const isEmpty = cat.components.length === 0;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              style={pos}
              className={
                "absolute z-[4] w-[240px] backdrop-blur-md border border-white/15 transition-colors hover:border-white/35 " +
                "bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.6))] " +
                (isEmpty ? "opacity-50 hover:opacity-100" : "")
              }
            >
              <div className="flex justify-between px-3.5 py-2.5 border-b border-white/10 font-mono text-[9px] tracking-[0.2em] uppercase text-white/55">
                <span>node {cat.id}</span>
                <span>{isEmpty ? "○ reserved" : "● port"}</span>
              </div>
              <div
                className={
                  "px-4 pt-3.5 pb-1.5 text-lg font-medium tracking-tight " +
                  (isEmpty
                    ? "text-white/30"
                    : "[background:linear-gradient(180deg,#fff,#888)] [-webkit-background-clip:text] bg-clip-text text-transparent")
                }
              >
                {cat.name}
              </div>
              <div className="px-4 pb-3.5 text-[11px] text-white/50 italic">{cat.tagline}</div>
              <div className="border-t border-white/10 px-4 py-3.5 bg-black/40 flex items-center justify-center min-h-[70px]">
                {cat.preview}
              </div>
              <div className="flex justify-between px-3.5 py-2.5 border-t border-white/10 font-mono text-[9px] tracking-[0.18em] uppercase text-white/55">
                <span>
                  {cat.components.length}{" "}
                  {cat.components.length === 1 ? "component" : "components"}
                </span>
                <span className="text-white">{cat.components.join(" · ") || "request →"}</span>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
