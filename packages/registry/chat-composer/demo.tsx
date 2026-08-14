"use client";

import { useState } from "react";
import { ChatComposer } from "./chat-composer";

/**
 * Two states worth seeing: a live composer whose sends fail every third
 * time (watch the draft come back with the error instead of vanishing),
 * and a disabled one explaining itself — the read-only room the component
 * was split from the log to make possible.
 */
export default function ChatComposerDemo() {
  const [sent, setSent] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);

  async function send(body: string) {
    const attempt = attempts + 1;
    setAttempts(attempt);
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (attempt % 3 === 0) throw new Error("dropped");
    setSent((current) => [...current.slice(-4), body]);
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="border border-white/10">
        <div className="px-4 py-3">
          {sent.length === 0 ? (
            <p className="text-[13px] text-white/30">
              sends land here. every third one fails on purpose — watch the
              draft come back instead of vanishing.
            </p>
          ) : (
            <ul className="space-y-1">
              {sent.map((body, index) => (
                <li key={index} className="text-[15px] leading-6 text-white/80">
                  {body}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ChatComposer onSend={send} />
      </div>

      <div className="border border-white/10">
        <ChatComposer
          onSend={() => {}}
          disabled
          disabledHint="chat opens when the stream does."
        />
      </div>
    </div>
  );
}
