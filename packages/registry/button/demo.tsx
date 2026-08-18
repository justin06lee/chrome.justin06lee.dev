"use client";

import {
  ArrowDown,
  Copy,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button variant="solid">solid</Button>
        <Button variant="outline">outline</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="dashed">dashed</Button>
        <Button variant="link">link</Button>
        <Button variant="outline" disabled>
          disabled
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button variant="solid" icon={Menu}>
          icon left
        </Button>
        <Button variant="outline" iconRight={X}>
          icon right
        </Button>
        <Button variant="ghost" icon={ArrowDown} label="scroll" />
        <Button
          variant="dashed"
          icon={ExternalLink}
          label="docs"
          tooltip="docs"
          href="https://example.com"
        />
        <Button
          variant="ghost"
          icon={ArrowDown}
          label="sign out"
          tooltip="tooltip below"
          tooltipSide="bottom"
        />
        <Button
          variant="link"
          icon={Copy}
          tooltip="Copy email"
          copy="hi@example.com"
        >
          Copy
        </Button>
      </div>
    </div>
  );
}
