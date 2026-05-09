import { Nav } from "../../_components/nav";

export default function ButtonPreview() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-12 py-10 max-w-[860px] mx-auto w-full">
        <div className="text-[13px] font-mono text-white/45 mb-3">preview / button</div>
        <h1 className="text-[44px] font-bold italic font-serif tracking-[-0.02em] mb-3">
          button.
        </h1>
        <p className="text-white/65 text-[15px] mb-10 max-w-[600px]">
          scratch space.
        </p>
      </main>
    </div>
  );
}
