"use client";

import { CalendarX } from "lucide-react";
import { EmptyState } from "./empty-state";
import { Button } from "../button/button";

export default function EmptyStateDemo() {
  return (
    <div className="w-full max-w-xl bg-black p-6">
      <EmptyState
        icon={<CalendarX className="size-7" strokeWidth={1} />}
        title="nothing on friday"
        description="every slot that day is either taken or outside the hours i keep. the next opening is monday morning."
        action={
          <Button size="sm" variant="solid">
            jump to monday
          </Button>
        }
        secondaryAction={
          <Button size="sm" variant="ghost">
            see the whole month
          </Button>
        }
      />
    </div>
  );
}
