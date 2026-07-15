import { CodeBlock } from "@/components/ui/code-block";

export default function Cli() {
  return (
    <main className="px-10 py-12 space-y-10 text-sm leading-7 text-white/80">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">installation</h1>
        <p>
          the cli is published as <code>@justin06lee/chrome</code>. it needs a
          react project with tailwind v4; next.js (app router, root or{" "}
          <code>src/</code> layout) is what it&apos;s tested against. run
          everything from the project root with your package manager&apos;s
          runner (<code>bunx</code>, <code>npx</code>, <code>pnpm dlx</code>).
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg text-white">init</h2>
        <CodeBlock language="bash" code="bunx @justin06lee/chrome@latest init [--cwd .] [--yes] [--registry <url>]" />
        <p>
          bootstraps chrome in the project: detects the package manager,
          framework, and tailwind version, then writes <code>chrome.json</code>{" "}
          (the registry config), <code>lib/utils.ts</code> (the <code>cn</code>{" "}
          helper), and patches <code>globals.css</code> with the fenced theme
          block. re-running it is safe — only the fenced block is replaced.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white">add</h2>
        <CodeBlock language="bash" code="bunx @justin06lee/chrome@latest add <name...> [--overwrite] [--yes]" />
        <p>
          installs one or more components. what you can rely on:
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <code>registryDependencies</code> resolve transitively — adding{" "}
            <code>command-palette</code> also installs <code>kbd</code>;{" "}
            <code>desk</code> pulls the whole editor suite. never hand-install
            a component&apos;s dependencies.
          </li>
          <li>
            npm dependencies are unioned across everything being added and
            installed in a single pass.
          </li>
          <li>
            files land under your alias base — <code>components/ui/</code>,{" "}
            <code>hooks/</code>, <code>lib/</code>. projects with a{" "}
            <code>src/</code> layout are detected from tsconfig&apos;s{" "}
            <code>@/*</code> mapping.
          </li>
          <li>
            page files install into the app dir: adding{" "}
            <code>not-found</code> drops <code>app/not-found.tsx</code> so the
            404 page works with zero wiring.
          </li>
          <li>
            a local file that differs from the registry copy is a conflict —
            the cli shows it and exits nonzero instead of overwriting.{" "}
            <code>--overwrite</code> opts in explicitly.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white">list</h2>
        <CodeBlock language="bash" code="bunx @justin06lee/chrome@latest list" />
        <p>lists every available component, grouped by type.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white">diff</h2>
        <CodeBlock language="bash" code="bunx @justin06lee/chrome@latest diff <name>" />
        <p>
          unified diff between your local copy and the registry version. the
          installed code is yours to edit — <code>diff</code> is how you audit
          drift before deciding whether to pull an update with{" "}
          <code>add --overwrite</code>.
        </p>
      </section>
    </main>
  );
}
