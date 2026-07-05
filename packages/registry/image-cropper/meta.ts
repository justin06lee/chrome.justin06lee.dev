import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "image-cropper",
  type: "registry:ui",
  description:
    "drag-to-reposition, scroll/slider-to-zoom image cropper. emits { url, scale, x, y }.",
  dependencies: [],
  registryDependencies: ["utils", "range"],
  files: [{ source: "image-cropper.tsx", target: "image-cropper.tsx" }],
  props: [
    { name: "value", type: "CropValue", required: true, description: "controlled crop value { url, scale, x, y }." },
    { name: "onChange", type: "(value: CropValue) => void", required: true },
    { name: "size", type: "number", default: "240", description: "frame size in px." },
    { name: "aspect", type: "number", default: "1", description: "width / height ratio of the frame." },
    { name: "minScale", type: "number", default: "0.5" },
    { name: "maxScale", type: "number", default: "4" },
    { name: "circle", type: "boolean", default: "false", description: "render a circular crop guide." },
  ],
});
