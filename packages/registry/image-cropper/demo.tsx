"use client";

import { useState } from "react";
import { ImageCropper, type CropValue } from "./image-cropper";

export default function ImageCropperDemo() {
  const [crop, setCrop] = useState<CropValue>({
    // start zoomed in a little so there's room to pan (at scale 1 the image
    // exactly covers the frame and x/y are locked at 0).
    url: "https://picsum.photos/id/1025/600/600",
    scale: 1.5,
    x: 0,
    y: 0,
  });

  return (
    <div className="flex flex-col items-start gap-4">
      <ImageCropper value={crop} onChange={setCrop} size={240} circle />
      <pre className="font-mono text-xs text-white/50">
        {JSON.stringify(
          {
            scale: Number(crop.scale.toFixed(2)),
            x: Number(crop.x.toFixed(0)),
            y: Number(crop.y.toFixed(0)),
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
