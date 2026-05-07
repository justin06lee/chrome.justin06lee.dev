export default function Theming() {
  return (
    <main className="max-w-2xl mx-auto px-10 py-12 space-y-6 text-sm leading-7 text-white/80">
      <h1 className="text-3xl font-bold text-white">theming</h1>
      <p>chromeui ships a dark-only theme. <code>init</code> writes a fenced block into your <code>globals.css</code>:</p>
      <pre className="border border-white/10 p-4 text-xs whitespace-pre">{`/* @chromeui:theme */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  ...
}
:root, .dark {
  --background: #000000;
  --foreground: #ffffff;
  --surface:    #0a0a0a;
  --border:     rgba(255,255,255,0.12);
  ...
}
/* @chromeui:end */`}</pre>
      <p>edit any token freely — re-running <code>init</code> only replaces the fenced block, leaving your edits outside it untouched.</p>
    </main>
  );
}
