import { CodeBlock } from "@/components/ui/code-block";

export default function Skill() {
  return (
    <main className="px-10 py-12 space-y-10 text-sm leading-7 text-white/80">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">claude code skill</h1>
        <p>
          chrome ships as a{" "}
          <a
            href="https://claude.com/claude-code"
            className="text-white underline-offset-4 hover:underline"
          >
            claude code
          </a>{" "}
          skill: a folder of instructions that teaches your agent the entire
          library — what every component does, how it works internally, every
          prop with its type and default, which components compose which, and
          the design language rules the code has to follow. with it installed,
          claude picks the right component, installs it with the cli, and
          writes code that matches the system instead of guessing.
        </p>
        <p>whats inside:</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <code>SKILL.md</code> — the core: install workflow, design
            language, cross-component conventions, and a fast map of which
            component fits which job.
          </li>
          <li>
            <code>references/</code> — five deep-dive files covering all ~95
            components by group (primitives, overlays &amp; navigation,
            effects, content &amp; data, editor suite), each with role,
            internals, full prop tables, and canonical examples.
          </li>
        </ul>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg text-white">install with bmo</h2>
        <p>
          the skill is distributed via{" "}
          <a
            href="https://github.com/justin06lee/bmo"
            className="text-white underline-offset-4 hover:underline"
          >
            bmo
          </a>{" "}
          — a tiny installer for claude code skills. no marketplaces, no
          plugin wrappers: it validates a skill folder and copies it into
          claude code&apos;s skills directory. it never executes anything it
          downloads.
        </p>
        <CodeBlock
          language="bash"
          code={`# get bmo (go 1.21+)
go install github.com/justin06lee/bmo@latest

# install the chrome skill globally (all your projects)
bmo add justin06lee/chrome.md

# ...or just into the current project
bmo add justin06lee/chrome.md here`}
        />
        <p>
          <code>here</code> installs to the project&apos;s{" "}
          <code>.claude/skills/</code>; <code>everywhere</code> (the default)
          installs globally to <code>~/.claude/skills/</code>. claude code
          picks the skill up automatically — in a session, it also answers to{" "}
          <code>/chrome</code>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white">managing it</h2>
        <CodeBlock
          language="bash"
          code={`bmo inspect justin06lee/chrome.md   # preview before installing
bmo list                             # what's installed where
bmo update chrome                    # pull the latest version
bmo remove chrome                    # uninstall
bmo doctor                           # diagnose skill-directory issues`}
        />
        <p>
          <code>update</code> re-resolves the original source, so the skill
          tracks this registry as components are added and changed.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white">what it unlocks</h2>
        <p>
          ask claude to &quot;build a settings page with chrome
          components&quot; and it will check for <code>chrome.json</code>, run{" "}
          <code>init</code> if needed, pick components from the reference map
          (and read the exact props before using them), install them with one{" "}
          <code>add</code> command trusting transitive dependencies, and keep
          the result inside the design language — dark-only, square corners,
          lowercase, no stray arrows.
        </p>
      </section>
    </main>
  );
}
