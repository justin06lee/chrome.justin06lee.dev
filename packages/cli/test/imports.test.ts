import { test, expect } from "bun:test";
import { rewriteImports } from "../src/writers/imports";

const DEFAULT_ALIASES = {
  components: "@/components/chrome",
  utils: "@/lib/utils",
  hooks: "@/hooks",
};

test("rewrites cross-component imports to a custom components alias", () => {
  const src = `import { Button } from "@/components/ui/button";\n`;
  const out = rewriteImports(src, { ...DEFAULT_ALIASES, components: "~/widgets" });
  expect(out).toBe(`import { Button } from "~/widgets/button";\n`);
});

test("rewrites to the default components alias (@/components/chrome)", () => {
  const src = `import { Chrome } from "@/components/ui/chrome";\n`;
  const out = rewriteImports(src, DEFAULT_ALIASES);
  expect(out).toBe(`import { Chrome } from "@/components/chrome/chrome";\n`);
});

test("rewrites @/lib/utils to a custom utils alias", () => {
  const src = `import { cn } from "@/lib/utils";\n`;
  const out = rewriteImports(src, { ...DEFAULT_ALIASES, utils: "~/shared/cn" });
  expect(out).toBe(`import { cn } from "~/shared/cn";\n`);
});

test("default utils and hooks aliases are identity rewrites", () => {
  const src =
    `import { cn } from "@/lib/utils";\n` +
    `import { useThing } from "@/hooks/use-thing";\n`;
  expect(rewriteImports(src, DEFAULT_ALIASES)).toBe(src);
});

test("rewrites hook imports to a custom hooks alias", () => {
  const src = `import { useLineSync } from '@/hooks/use-line-sync';\n`;
  const out = rewriteImports(src, { ...DEFAULT_ALIASES, hooks: "@/lib/hooks" });
  expect(out).toBe(`import { useLineSync } from '@/lib/hooks/use-line-sync';\n`);
});

test("handles single quotes and require() specifiers", () => {
  const src = `const b = require('@/components/ui/button');\n`;
  const out = rewriteImports(src, { ...DEFAULT_ALIASES, components: "@/c" });
  expect(out).toBe(`const b = require('@/c/button');\n`);
});

test("leaves lookalike specifiers alone", () => {
  const src =
    `import a from "@/lib/utils-extra";\n` +
    `import b from "@/components/uikit/button";\n` +
    `import c from "@/hooksmith/use-x";\n` +
    `import d from "@/components/ui";\n`;
  expect(rewriteImports(src, { ...DEFAULT_ALIASES, components: "~/x", utils: "~/y", hooks: "~/z" }))
    .toBe(src);
});

test("rewrites every occurrence across a multi-import file", () => {
  const src =
    `import { cn } from "@/lib/utils";\n` +
    `import { Kbd } from "@/components/ui/kbd";\n` +
    `import { Input } from "@/components/ui/input";\n`;
  const out = rewriteImports(src, {
    components: "@/components/custom",
    utils: "@/utils/cn",
    hooks: "@/hooks",
  });
  expect(out).toBe(
    `import { cn } from "@/utils/cn";\n` +
    `import { Kbd } from "@/components/custom/kbd";\n` +
    `import { Input } from "@/components/custom/input";\n`,
  );
});

test("missing alias fields fall back to the defaults", () => {
  const src = `import { cn } from "@/lib/utils";\nimport { B } from "@/components/ui/b";\n`;
  expect(rewriteImports(src, {})).toBe(
    `import { cn } from "@/lib/utils";\nimport { B } from "@/components/chrome/b";\n`,
  );
});
