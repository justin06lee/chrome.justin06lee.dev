import { test, expect } from "bun:test";
import { defineComponent } from "../src/define";

test("defineComponent returns its input unchanged", () => {
  const meta = defineComponent({
    name: "button",
    type: "registry:ui",
    files: [{ source: "button.tsx", target: "button.tsx" }],
  });
  expect(meta.name).toBe("button");
  expect(meta.type).toBe("registry:ui");
});

test("defineComponent preserves type narrowing for type field", () => {
  const meta = defineComponent({
    name: "utils",
    type: "registry:lib",
    files: [{ source: "utils.ts", target: "utils.ts" }],
  });
  const t: "registry:lib" = meta.type;
  expect(t).toBe("registry:lib");
});
