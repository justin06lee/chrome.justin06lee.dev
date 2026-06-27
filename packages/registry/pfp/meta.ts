import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "pfp",
  type: "registry:ui",
  description:
    "profile-picture tile: an image framed in a bordered square that tilts in 3d and sweeps a shine across itself on hover. frame the subject with x/y/scale; size it via className.",
  registryDependencies: ["utils"],
  files: [{ source: "pfp.tsx", target: "pfp.tsx" }],
  props: [
    { name: "src", type: "string", required: true },
    { name: "alt", type: "string", default: "''" },
    { name: "x", type: "number", default: "0", description: "horizontal framing offset, % of tile." },
    { name: "y", type: "number", default: "0", description: "vertical framing offset, % of tile." },
    { name: "scale", type: "number", default: "1", description: "zoom of the image inside the tile." },
  ],
});
