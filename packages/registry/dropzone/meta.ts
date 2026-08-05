import { defineComponent } from "chrome-ui-registry-builder";

export default defineComponent({
  name: "dropzone",
  type: "registry:ui",
  description:
    "standalone drag-and-drop upload zone — validates a drop against accept/maxSize/maxFiles and hands you File[], with optional rows showing size, upload progress and errors. stateless by design: upload transport is yours. drag depth is counted rather than flagged, so the highlight doesn't strobe when the pointer crosses a child, and the zone is a real button so click, enter and space all open the picker.",
  dependencies: ["lucide-react"],
  registryDependencies: ["utils", "progress"],
  files: [{ source: "dropzone.tsx", target: "dropzone.tsx" }],
  props: [
    { name: "onFiles", type: "(files: File[]) => void", required: true, description: "receives everything that passed validation." },
    { name: "onReject", type: "(rejections: DropzoneRejection[]) => void", description: "{ file, reason: 'type' | 'size' | 'count' }[]." },
    { name: "accept", type: "string", description: "native input syntax: '.pdf,.md,image/*'. also enforced on drop." },
    { name: "maxSize", type: "number", description: "per-file limit in bytes." },
    { name: "maxFiles", type: "number", description: "cap on files accepted per drop." },
    { name: "multiple", type: "boolean", default: "true" },
    { name: "disabled", type: "boolean", default: "false" },
    { name: "label", type: "ReactNode", default: "'drop files here'" },
    { name: "hint", type: "ReactNode", description: "second line — formats and limits." },
    { name: "files", type: "DropzoneFile[]", description: "{ id, name, size?, progress?, error? }[] rendered as rows under the zone." },
    { name: "onRemove", type: "(id: string) => void", description: "adds a remove button to each row." },
    { name: "accent", type: "string", default: "'#ffffff'", description: "active border and progress-bar colour." },
    { name: "className", type: "string" },
  ],
});
