import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "grain",
  type: "registry:ui",
  description:
    "paper / film texture overlay — speckle, fibrous paper stock, or a dot screen. the texture is an inline feTurbulence data uri rather than a bundled png, so it is a few hundred bytes and resolution-independent. pointer-events-none and aria-hidden, so it can sit over live ui at any z-index.",
  registryDependencies: ["utils"],
  files: [{ source: "grain.tsx", target: "grain.tsx" }],
  props: [
    { name: "variant", type: "'noise' | 'paper' | 'dots'", default: "'noise'" },
    { name: "opacity", type: "number", default: "0.05", description: "past ~0.12 grain reads as dirt." },
    {
      name: "scale",
      type: "number",
      description:
        "turbulence base frequency for noise/paper (default 0.8, higher is finer), or dot pitch in px for dots (default 4).",
    },
    { name: "animate", type: "boolean", default: "false", description: "jitter the texture like film grain; frozen under reduced motion." },
    {
      name: "fixed",
      type: "boolean",
      default: "true",
      description: "cover the viewport; false covers the nearest positioned ancestor instead.",
    },
    { name: "blend", type: "CSSProperties['mixBlendMode']", description: "mix-blend-mode for the layer." },
    { name: "className", type: "string" },
  ],
});
