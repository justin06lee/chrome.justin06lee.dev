import { NotFound } from "@/components/ui/not-found";

// Dogfoods the registry's `not-found` component — the same file the CLI
// installs as app/not-found.tsx.
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <NotFound
        links={[
          { label: "home", href: "/" },
          { label: "components", href: "/components" },
        ]}
      />
    </div>
  );
}
