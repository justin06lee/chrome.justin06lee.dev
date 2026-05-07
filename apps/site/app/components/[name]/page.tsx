import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentType } from "react";
import type { ComponentMeta } from "chrome-ui-registry-builder";
import { REGISTRY } from "../../../registry-manifest";

const REPO_BASE =
  "https://github.com/justin06lee/chrome.justin06lee.dev/tree/main/packages/registry";

// Static map of demo imports keyed by component name. Turbopack can't resolve
// a fully dynamic import path through packages/registry/<name>/demo.tsx
// (the parent contains non-component dirs), so we enumerate explicitly.
const DEMOS: Record<string, () => Promise<{ default: ComponentType }>> = {
  button: () => import("../../../../../packages/registry/button/demo"),
  dialog: () => import("../../../../../packages/registry/dialog/demo"),
  input: () => import("../../../../../packages/registry/input/demo"),
  select: () => import("../../../../../packages/registry/select/demo"),
  socials: () => import("../../../../../packages/registry/socials/demo"),
};

export async function generateStaticParams() {
  return REGISTRY.filter((m) => m.type === "registry:ui").map((m) => ({ name: m.name }));
}

export default async function ComponentPage(props: { params: Promise<{ name: string }> }) {
  const { name } = await props.params;
  const meta = REGISTRY.find((m) => m.name === name) as ComponentMeta | undefined;
  if (!meta) notFound();

  // The folder layout: packages/registry/<name>/ for ui, _shared/<name>/ for libs.
  const folder = meta.type === "registry:ui"
    ? join(process.cwd(), "..", "..", "packages", "registry", name)
    : join(process.cwd(), "..", "..", "packages", "registry", "_shared", name);
  const sourceFile = meta.files[0]?.source ?? `${name}.tsx`;
  const source = await readFile(join(folder, sourceFile), "utf8");

  // Static-map import the demo so it's a real component, not an iframe.
  const Demo: ComponentType | null = meta.type === "registry:ui" && DEMOS[name]
    ? (await DEMOS[name]()).default
    : null;

  return (
    <main className="max-w-4xl mx-auto px-10 py-12 space-y-10">
      <header className="space-y-3">
        <div className="font-mono text-xs uppercase tracking-widest text-white/50">component</div>
        <h1 className="text-3xl font-bold">{name}</h1>
        {meta.description && <p className="text-white/65">{meta.description}</p>}
        <code className="inline-block font-mono text-[12.5px] border border-white/20 bg-white/[0.02] px-3 py-1.5 mt-2">
          bunx chrome.ui@latest add {name}
        </code>
        <div className="text-xs">
          <a className="text-white/55 hover:text-white underline" href={`${REPO_BASE}/${meta.type === "registry:ui" ? "" : "_shared/"}${name}`}>
            view source on github
          </a>
        </div>
      </header>

      {Demo && (
        <section>
          <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-3">demo</div>
          <div className="border border-white/10 p-10 flex items-center justify-center min-h-40">
            <Demo />
          </div>
        </section>
      )}

      <section>
        <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-3">source</div>
        <pre className="border border-white/10 p-4 text-xs overflow-x-auto whitespace-pre">{source}</pre>
      </section>

      {meta.props && meta.props.length > 0 && (
        <section>
          <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-3">props</div>
          <table className="w-full text-sm border border-white/10">
            <thead><tr className="text-left">
              <th className="p-2 border-b border-white/10">name</th>
              <th className="p-2 border-b border-white/10">type</th>
              <th className="p-2 border-b border-white/10">default</th>
              <th className="p-2 border-b border-white/10">description</th>
            </tr></thead>
            <tbody>
              {meta.props.map((p) => (
                <tr key={p.name}>
                  <td className="p-2 font-mono text-xs">{p.name}{p.required ? " *" : ""}</td>
                  <td className="p-2 font-mono text-xs text-white/70">{p.type}</td>
                  <td className="p-2 font-mono text-xs text-white/50">{p.default ?? "—"}</td>
                  <td className="p-2 text-white/70">{p.description ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <Link href="/components" className="inline-block text-sm text-white/55 hover:text-white">← all components</Link>
    </main>
  );
}
