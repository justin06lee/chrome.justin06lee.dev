import { CodeBlock } from "@/components/ui/code-block";

const THEME_BLOCK = `/* @chrome:theme */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-alt: var(--surface-alt);
  --color-border: var(--border);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --font-sans: "Poppins", sans-serif;
}

:root,
.dark {
  --background: #000000;
  --foreground: #ffffff;
  --surface: #0a0a0a;
  --surface-alt: #141414;
  --border: rgba(255, 255, 255, 0.12);
  --muted: rgba(255, 255, 255, 0.6);
  --accent: #ffffff;
}
/* @chrome:end */`;

export default function Theming() {
  return (
    <main className="px-10 py-12 space-y-10 text-sm leading-7 text-white/80">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">theming</h1>
        <p>
          chrome is dark-only by design — there is no light theme and the
          components assume a black page. what <em>is</em> configurable are the
          tokens. <code>init</code> writes a fenced block into your{" "}
          <code>globals.css</code> (it also loads poppins via a{" "}
          <code>@font-face</code> rule, trimmed here):
        </p>
        <CodeBlock language="css" code={THEME_BLOCK} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg text-white">the tokens</h2>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <code>--background</code> / <code>--foreground</code> — the page.
            components mostly use raw white-with-opacity classes on top of
            this, so shifting the background off pure black is the highest-
            impact edit.
          </li>
          <li>
            <code>--surface</code> / <code>--surface-alt</code> — raised
            panels (cards, editors, popups).
          </li>
          <li>
            <code>--border</code> — the 1px lines everywhere. raise the alpha
            for a harder grid, lower it to soften.
          </li>
          <li>
            <code>--muted</code> / <code>--accent</code> — secondary text and
            the (white) highlight color.
          </li>
          <li>
            <code>--font-sans</code> — swap poppins for anything; the mono
            styles use your tailwind <code>font-mono</code> stack.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white">editing safely</h2>
        <p>
          edit any token freely. re-running <code>init</code> replaces only
          what&apos;s between <code>/* @chrome:theme */</code> and{" "}
          <code>/* @chrome:end */</code> — everything outside the fence is
          untouched. if you want your token edits to survive re-init too, move
          them below the fence; later rules win.
        </p>
        <p>
          component-level styling doesn&apos;t go through tokens at all: the
          installed source is yours, and <code>className</code> merges via
          tailwind-merge, so per-instance overrides just work.
        </p>
      </section>
    </main>
  );
}
