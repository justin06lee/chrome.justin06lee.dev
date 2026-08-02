"use client";

import { useState } from "react";
import { Callout } from "./callout";
import { Button } from "../button/button";

export default function CalloutDemo() {
  const [showNote, setShowNote] = useState(true);

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 border border-white/10 bg-black p-6">
      {showNote ? (
        <Callout
          title="times are shown in your zone"
          onDismiss={() => setShowNote(false)}
        >
          we detected america/los_angeles. change it below if that&apos;s wrong.
        </Callout>
      ) : null}

      <Callout variant="success" title="booked">
        wednesday, august 5 at 9:30 am. the invite is on its way.
      </Callout>

      <Callout variant="warn" title="this slot is tight">
        you have another meeting ending 15 minutes before this one.
      </Callout>

      <Callout
        variant="danger"
        title="that slot just went away"
        action={
          <Button size="sm" variant="outline">
            pick another
          </Button>
        }
      >
        someone booked it while this page was open.
      </Callout>
    </div>
  );
}
