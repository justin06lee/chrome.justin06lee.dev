import { Nav } from "../_components/nav";

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      {children}
    </div>
  );
}
