export default function Cli() {
  return (
    <main className="max-w-2xl mx-auto px-10 py-12 space-y-8 text-sm leading-7 text-white/80">
      <h1 className="text-3xl font-bold text-white">CLI reference</h1>
      <section>
        <h2 className="text-lg text-white">init</h2>
        <pre className="border border-white/10 p-4 text-xs my-2">chromeui init [--cwd .] [--yes] [--registry &lt;url&gt;]</pre>
        <p>bootstrap chromeui in this project. detects pkg manager, framework, tailwind version. writes <code>chromeui.json</code>, <code>lib/utils.ts</code>, and patches <code>globals.css</code>.</p>
      </section>
      <section>
        <h2 className="text-lg text-white">add</h2>
        <pre className="border border-white/10 p-4 text-xs my-2">chromeui add &lt;name...&gt; [--overwrite] [--yes]</pre>
        <p>install one or more components. resolves <code>registryDependencies</code> transitively. unions <code>dependencies</code> and runs a single install pass.</p>
      </section>
      <section>
        <h2 className="text-lg text-white">list</h2>
        <pre className="border border-white/10 p-4 text-xs my-2">chromeui list</pre>
        <p>list available components grouped by type.</p>
      </section>
      <section>
        <h2 className="text-lg text-white">diff</h2>
        <pre className="border border-white/10 p-4 text-xs my-2">chromeui diff &lt;name&gt;</pre>
        <p>show a unified diff between your local copy and the registry version.</p>
      </section>
    </main>
  );
}
