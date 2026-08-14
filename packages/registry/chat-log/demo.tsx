"use client";

import { useEffect, useRef, useState } from "react";
import { ChatLog, type ChatMessage } from "./chat-log";

/**
 * The room fills in on its own so the component's actual contract is
 * visible: stay at the bottom and it follows each arrival; scroll up to
 * read and it holds still, offering the jump-back pill instead.
 *
 * Seeded on mount rather than at render — timestamps are wall-clock, and
 * stamping them during render would make the server and client disagree.
 */
const SCRIPT: { name: string; body: string; mine?: boolean }[] = [
  { name: "june", body: "is the kettle on again" },
  { name: "june", body: "third time today by my count" },
  { name: "aki", body: "the cat has claimed the warm spot on the desk" },
  { name: "you", body: "leave the cat alone, it pays rent in appearances", mine: true },
  { name: "aki", body: "it just knocked a pen off. rent overdue" },
  { name: "june", body: "scroll up while these arrive — the log holds still for you" },
  { name: "aki", body: "and the pill brings you back when you're done reading" },
];

export default function ChatLogDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const cursor = useRef(0);

  useEffect(() => {
    const tick = () => {
      const next = SCRIPT[cursor.current % SCRIPT.length];
      if (!next) return;
      cursor.current += 1;
      setMessages((current) => [
        ...current.slice(-30),
        { id: cursor.current, createdAt: Date.now(), ...next },
      ]);
    };
    tick();
    tick();
    const timer = setInterval(tick, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-72 w-full max-w-md flex-col border border-white/10">
      <ChatLog
        messages={messages}
        empty={
          <p className="py-8 text-center text-[13px] text-white/30">
            nobody has said anything yet.
          </p>
        }
      />
    </div>
  );
}
