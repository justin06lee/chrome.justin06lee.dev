import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "ascii-shader",
  type: "registry:ui",
  description:
    "ascii fragment shader — supply (x, y, t) => luminance and it paints a character grid. the general form of what donut does for one fixed torus. one string assigned to textContent per frame, capped fps, paused off-screen by an IntersectionObserver, and static under reduced motion. ships plasma, ripple and tunnel presets.",
  registryDependencies: ["utils"],
  files: [{ source: "ascii-shader.tsx", target: "ascii-shader.tsx" }],
  props: [
    {
      name: "shader",
      type: "(point: ShaderPoint) => number",
      required: true,
      description:
        "returns luminance 0..1 for a cell. point is { col, row, x, y, t, cols, rows }; x/y are aspect-corrected so a circle is round.",
    },
    { name: "cols", type: "number", description: "fixed column count; omit to fill the element's width." },
    {
      name: "rows",
      type: "number",
      description:
        "fixed row count; omit to fill the element's height (which then has to be set on the element).",
    },
    { name: "chars", type: "string", default: "' .:-=+*#%@'", description: "luminance ramp, dark to light." },
    { name: "fps", type: "number", default: "24", description: "frame cap." },
    { name: "speed", type: "number", default: "1", description: "multiplies the time fed to the shader." },
    { name: "paused", type: "boolean", default: "false", description: "freeze on the current frame; the clock holds rather than skipping." },
    { name: "size", type: "number", default: "12", description: "font size in px; drives the auto-fit grid." },
    {
      name: "isolate",
      type: "boolean",
      default: "true",
      description: "css containment for the per-frame repaint; set false inside <Chrome> so the foil paints through.",
    },
    { name: "label", type: "string", description: "accessible name; without one the canvas is decorative and hidden." },
    { name: "className", type: "string" },
  ],
});
