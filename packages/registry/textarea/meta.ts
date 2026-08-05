import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "textarea",
  type: "registry:ui",
  description:
    "minimal multiline input. matches input — thin border, square corners, vertical resize. optional live character counter that reads '120 / 500' against maxLength and warns as it fills.",
  registryDependencies: ["utils"],
  files: [{ source: "textarea.tsx", target: "textarea.tsx" }],
  props: [
    { name: "rows", type: "number", default: "4" },
    {
      name: "counter",
      type: "boolean",
      default: "false",
      description:
        "live character count under the field; pairs with maxLength to show a limit and warn near it.",
    },
    { name: "wrapperClassName", type: "string", description: "classes for the wrapper that appears when counter is set." },
    { name: "background", type: "string", description: "CSS background. transparent by default." },
    { name: "...props", type: "TextareaHTMLAttributes", description: "all native textarea attributes." },
  ],
});
