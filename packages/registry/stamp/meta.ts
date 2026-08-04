import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "stamp",
  type: "registry:ui",
  description:
    "rubber-stamp overlay — mono uppercase inside a double rule, rotated off square, optionally distressed. unlike badge, which is a flat chip in a row of metadata, a stamp is an assertion applied on top of something: it rotates, it overlaps, it sits over the document it marks. the distress is a turbulence mask, so it inherits the ink colour and loads nothing.",
  registryDependencies: ["utils"],
  files: [{ source: "stamp.tsx", target: "stamp.tsx" }],
  props: [
    { name: "children", type: "ReactNode", required: true },
    { name: "sub", type: "ReactNode", description: "second line — a date, a reference, an initial." },
    { name: "rotate", type: "number", default: "-12", description: "rotation in degrees." },
    { name: "color", type: "string", default: "'rgba(255,255,255,0.55)'", description: "ink colour." },
    { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'" },
    { name: "distress", type: "boolean", default: "true", description: "eat away at the ink so it reads as pressed rather than printed." },
    {
      name: "ariaLabel",
      type: "string | null",
      description:
        "accessible name; defaults to the text when children is a string. null marks the stamp decorative.",
    },
    { name: "className", type: "string" },
  ],
});
