import { CodeBlock } from "./code-block";

const SAMPLE = `import { Button } from "@/components/ui/button";

// a tiny greeting
export function Hello({ name }: { name: string }) {
  const greeting = \`hi \${name}\`;
  return <Button variant="dashed">{greeting}</Button>;
}`;

export default function CodeBlockDemo() {
  return (
    <div className="w-full max-w-[520px]">
      <CodeBlock code={SAMPLE} language="tsx" />
    </div>
  );
}
