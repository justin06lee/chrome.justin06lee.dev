import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { Kbd } from "@/components/ui/kbd";

export default function Docs() {
  return (
    <main className="px-10 py-12 space-y-10 text-sm leading-7 text-white/80">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">introduction</h1>
        <p>
          chrome is a dark-only component registry in the shadcn mold: you
          don&apos;t install a package, you install <em>source</em>. the cli
          copies each component&apos;s code into your project under{" "}
          <code>components/chrome/</code>, and from then on it&apos;s yours — read
          it, restyle it, rip parts out. there is no runtime dependency on this
          site.
        </p>
        <p>
          the components port the design language of{" "}
          <a
            href="https://justin06lee.dev"
            className="text-white underline-offset-4 hover:underline"
          >
            justin06lee.dev
          </a>
          : black backgrounds, 1px borders, square corners, lowercase copy,
          restrained motion. they&apos;re framework-agnostic react — plain
          anchors instead of router links, tailwind v4 for styling, and any
          css a component needs travels inside its own file.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg text-white">quick start</h2>
        <p>in any next.js + tailwind v4 project:</p>
        <CodeBlock
          language="bash"
          code={`# one-time setup: writes chrome.json, lib/utils.ts, patches globals.css
bunx @justin06lee/chrome@latest init

# then add components as you need them
bunx @justin06lee/chrome@latest add button dialog command-palette`}
        />
        <p>
          <code>add</code> resolves component-to-component dependencies
          transitively — adding <code>command-palette</code> also brings{" "}
          <code>kbd</code>; adding <code>desk</code> pulls the whole editor
          suite. npm dependencies are unioned and installed in one pass.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white">browsing</h2>
        <p className="flex flex-wrap items-center gap-1.5">
          every component page has a live demo, copyable usage variants, and a
          props table. the sidebar has search, or press <Kbd>⌘</Kbd>
          <Kbd>k</Kbd> anywhere to jump straight to a component.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white">next</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <Link href="/docs/cli" className="text-white underline-offset-4 hover:underline">
              installation
            </Link>{" "}
            — the full cli reference.
          </li>
          <li>
            <Link href="/docs/theming" className="text-white underline-offset-4 hover:underline">
              theming
            </Link>{" "}
            — the token block init writes and how to change it.
          </li>
          <li>
            <Link href="/docs/skill" className="text-white underline-offset-4 hover:underline">
              claude code skill
            </Link>{" "}
            — teach your agent the entire library.
          </li>
        </ul>
      </section>
    </main>
  );
}
