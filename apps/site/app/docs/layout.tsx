import { Nav } from "../_components/nav";
import { Sidebar } from "../_components/sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 flex pl-10">
        <Sidebar />
        <main className="flex-1 px-12 py-10">
          <div className="max-w-[720px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
