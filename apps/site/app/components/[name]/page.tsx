import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ComponentType } from "react";
import type { ComponentMeta } from "chrome-ui-registry-builder";
import { REGISTRY } from "../../../registry-manifest";
import { ComponentDetail } from "./_detail";
import { Chrome } from "../../../../../packages/registry/chrome/chrome";

// Static map of demo imports keyed by component name. Turbopack can't resolve
// a fully dynamic import path through packages/registry/<name>/demo.tsx
// (the parent contains non-component dirs), so we enumerate explicitly.
const DEMOS: Record<string, () => Promise<{ default: ComponentType }>> = {
  button: () => import("../../../../../packages/registry/button/demo"),
  chrome: () => import("../../../../../packages/registry/chrome/demo"),
  "copy-button": () => import("../../../../../packages/registry/copy-button/demo"),
  dialog: () => import("../../../../../packages/registry/dialog/demo"),
  donut: () => import("../../../../../packages/registry/donut/demo"),
  input: () => import("../../../../../packages/registry/input/demo"),
  rainbow: () => import("../../../../../packages/registry/rainbow/demo"),
  scramble: () => import("../../../../../packages/registry/scramble/demo"),
  select: () => import("../../../../../packages/registry/select/demo"),
  socials: () => import("../../../../../packages/registry/socials/demo"),
  stack: () => import("../../../../../packages/registry/stack/demo"),
  tilt: () => import("../../../../../packages/registry/tilt/demo"),
};

export async function generateStaticParams() {
  return REGISTRY.filter((m) => m.type === "registry:ui").map((m) => ({ name: m.name }));
}

export default async function ComponentPage(props: { params: Promise<{ name: string }> }) {
  const { name } = await props.params;
  const meta = REGISTRY.find((m) => m.name === name) as ComponentMeta | undefined;
  if (!meta) notFound();

  const folder = meta.type === "registry:ui"
    ? join(process.cwd(), "..", "..", "packages", "registry", name)
    : join(process.cwd(), "..", "..", "packages", "registry", "_shared", name);
  const sourceFile = meta.files[0]?.source ?? `${name}.tsx`;
  const source = await readFile(join(folder, sourceFile), "utf8");

  const Demo: ComponentType | null = meta.type === "registry:ui" && DEMOS[name]
    ? (await DEMOS[name]()).default
    : null;

  const title =
    name === "chrome" ? (
      <Chrome
        as="h1"
        className="font-serif italic font-bold tracking-[-0.02em] mb-3 inline-block text-[44px]"
      >
        chrome.
      </Chrome>
    ) : undefined;

  return (
    <ComponentDetail
      name={name}
      description={meta.description}
      source={source}
      installCommand={`bunx @justin06lee/chrome@latest add ${name}`}
      title={title}
    >
      {Demo ? <Demo /> : null}
    </ComponentDetail>
  );
}
