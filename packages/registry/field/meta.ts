import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "field",
  type: "registry:ui",
  description:
    "label, control, hint and error as one accessible unit. the render-prop form hands the control its id, aria-describedby, aria-invalid and required already computed, so a field is announced correctly without matching ids by hand. an error replaces the hint rather than stacking under it.",
  dependencies: [],
  registryDependencies: ["utils"],
  files: [{ source: "field.tsx", target: "field.tsx" }],
  props: [
    { name: "label", type: "ReactNode", required: true, description: "label text." },
    {
      name: "children",
      type: "ReactNode | ((props: FieldControlProps) => ReactNode)",
      required: true,
      description:
        "the control. pass a function to receive { id, aria-describedby, aria-invalid, required } and spread it onto the input.",
    },
    { name: "htmlFor", type: "string", description: "explicit control id; one is generated when omitted." },
    { name: "hint", type: "ReactNode", description: "muted line under the control. hidden while an error is showing." },
    { name: "error", type: "ReactNode", description: "error text. its presence is what marks the field invalid." },
    { name: "required", type: "boolean", default: "false", description: "adds a marker to the label and sets required on the control." },
    { name: "optional", type: "boolean", default: "false", description: "renders a muted \"optional\" tag instead. ignored when required." },
    { name: "labelHidden", type: "boolean", default: "false", description: "keeps the label for screen readers only." },
    { name: "action", type: "ReactNode", description: "trailing slot on the label row — a counter, a \"forgot?\" link." },
    { name: "className", type: "string" },
  ],
});
