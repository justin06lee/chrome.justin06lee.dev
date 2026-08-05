import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "album-art",
  type: "registry:ui",
  description:
    "square cover tile with a real fallback state — expired cdn links and art-less tracks are the norm in music apis, so onError swaps to a disc glyph without changing the tile's footprint. pass an array of urls for a playlist mosaic (halves, half-plus-quarters, or a grid), and bleed to throw the cover's colour onto the page behind it.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils"],
  files: [{ source: "album-art.tsx", target: "album-art.tsx" }],
  props: [
    {
      name: "src",
      type: "string | string[]",
      description:
        "cover url; omit or let it fail and the fallback takes over. an array is a mosaic — up to four covers laid out so the tile is always fully filled.",
    },
    { name: "alt", type: "string", default: "''", description: "describe the record, not the picture." },
    { name: "size", type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: "'full' fills the container as a square." },
    { name: "bleed", type: "boolean", default: "false", description: "blurred copy of the art behind the tile; only reads at lg and up." },
    { name: "fallback", type: "ReactNode", description: "node shown when there is no art." },
    { name: "onClick", type: "() => void", description: "renders the tile as a button." },
    { name: "href", type: "string", description: "renders the tile as a link." },
    { name: "linkComponent", type: "React.ElementType", description: "anchor component for internal hrefs (e.g. next/link)." },
    { name: "overlay", type: "ReactNode", description: "drawn on top of the art — a play button, a hover scrim." },
    { name: "className", type: "string" },
  ],
});
