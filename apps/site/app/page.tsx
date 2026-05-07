import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <Hero />
    </main>
  );
}

function Nav() {
  return (
    <nav className="flex items-center px-7 py-3.5 border-b border-white/10 text-[13px]">
      <Link href="/" className="font-bold tracking-tight inline-flex items-baseline">
        <span className="chrome-foil italic font-serif">chrome</span>
        <span className="ml-px font-mono text-white/35 not-italic">.justin06lee.dev</span>
      </Link>
      <div className="ml-auto flex items-center gap-[22px] text-white/65">
        <Link href="/docs" className="hover:text-white">docs</Link>
        <Link href="/components" className="hover:text-white">components</Link>
        <Link href="/docs/theming" className="hover:text-white">themes</Link>
        <a href="https://github.com/justin06lee/chrome.justin06lee.dev" className="hover:text-white">github</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-10 py-32 overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-[80%] h-[120%] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(ellipse_at_center,rgba(150,200,255,0.08)_0%,rgba(255,200,230,0.05)_40%,transparent_70%)]" />
      <span className="text-lg text-white/70 mb-1">justin06lee&apos;s</span>
      <h1 className="chrome-foil italic font-serif font-bold leading-[0.95] tracking-[-0.04em] text-[clamp(80px,14vw,180px)]">
        chrome.
      </h1>
      <div className="mt-11 mb-7">
        <code className="font-mono text-[12.5px] border border-white/20 bg-white/[0.02] px-3.5 py-2 inline-flex items-center gap-3">
          bunx chromeui@latest init
          <span className="text-white/40 text-[11px] border-l border-white/15 pl-3">copy</span>
        </code>
      </div>
      <div className="flex gap-2.5">
        <Link href="/components" className="font-mono text-xs px-4.5 py-2 bg-white text-black border border-white">
          browse components →
        </Link>
        <a href="https://github.com/justin06lee/chrome.justin06lee.dev" className="font-mono text-xs px-4.5 py-2 border border-white/25">
          view on github
        </a>
      </div>
    </section>
  );
}
