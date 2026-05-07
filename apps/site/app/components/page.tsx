import Link from "next/link";
import { REGISTRY } from "../../registry-manifest";

export default function ComponentsIndex() {
  const ui = REGISTRY.filter((m) => m.type === "registry:ui");
  return (
    <main className="px-10 py-16 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">components</h1>
      <p className="text-white/55 mb-12 text-sm">
        copy-paste, dark-only, no abstractions you don&apos;t own.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ui.map((m) => (
          <Link key={m.name} href={`/components/${m.name}`} className="border border-white/10 p-5 hover:border-white/30 transition-colors">
            <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-3">{m.name}</div>
            <div className="text-sm text-white/80 min-h-12">{m.description ?? ""}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
