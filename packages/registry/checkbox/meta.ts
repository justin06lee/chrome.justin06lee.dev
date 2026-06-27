import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "checkbox",
  type: "registry:ui",
  description:
    "square checkbox with a check-on-fill. wraps a native checkbox so it works in forms; thin border, no corners, fills white with a black check when checked.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "checkbox.tsx", target: "checkbox.tsx" }],
  props: [
    { name: "label", type: "ReactNode", description: "text rendered beside the box." },
    { name: "checked", type: "boolean", description: "controlled checked state." },
    { name: "defaultChecked", type: "boolean", description: "uncontrolled initial state." },
    { name: "onChange", type: "(e: ChangeEvent<HTMLInputElement>) => void" },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "wrapperClassName", type: "string", description: "classes for the outer <label>." },
  ],
});
