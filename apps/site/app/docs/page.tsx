export default function Docs() {
  return (
    <main className="max-w-2xl mx-auto px-10 py-12 space-y-6 text-sm leading-7 text-white/80">
      <h1 className="text-3xl font-bold text-white">getting started</h1>
      <p>install the CLI in any next.js + tailwind v4 project:</p>
      <pre className="border border-white/10 p-4 text-xs">bunx chromeui@latest init</pre>
      <p>this writes <code>chromeui.json</code>, patches <code>app/globals.css</code>, and installs peer dependencies.</p>
      <p>then add components one at a time:</p>
      <pre className="border border-white/10 p-4 text-xs">bunx chromeui@latest add button dialog</pre>
    </main>
  );
}
