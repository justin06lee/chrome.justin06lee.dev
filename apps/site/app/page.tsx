import { Nav } from "./_components/nav";
import { Chrome } from "../../../packages/registry/chrome/chrome";
import { Button } from "../../../packages/registry/button/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <Hero />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-10 py-32 overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-[80%] h-[120%] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(ellipse_at_center,rgba(150,200,255,0.08)_0%,rgba(255,200,230,0.05)_40%,transparent_70%)]" />
      <span className="text-lg text-white/70 mb-1">justin06lee&apos;s</span>
      <Chrome
        as="h1"
        className="italic font-serif font-bold leading-[0.95] tracking-[-0.04em] text-[clamp(80px,14vw,180px)]"
      >
        chrome.
      </Chrome>
      <div className="mt-11 mb-7">
        <code className="font-mono text-[12.5px] border border-white/20 bg-white/[0.02] px-3.5 py-2 inline-flex items-center gap-3">
          bunx @justin06lee/chrome@latest init
          <span className="text-white/40 text-[11px] border-l border-white/15 pl-3">copy</span>
        </code>
      </div>
      <div className="flex gap-2.5">
        <Button href="/components">browse components →</Button>
        <Button href="https://github.com/justin06lee/chrome.justin06lee.dev" variant="ghost">
          view on github
        </Button>
      </div>
    </section>
  );
}
