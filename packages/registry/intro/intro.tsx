"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type IntroProps = {
  /** Each entry is rendered as one full-screen step, in order. */
  steps: React.ReactNode[];
  /** How long each step stays on screen before auto-advancing, in ms. */
  stepDuration?: number;
  /** Called once after the last step finishes (or on skip). */
  onComplete?: () => void;
  /** Whether to show the skip button. Defaults to true. */
  skippable?: boolean;
  /** Label for the skip button. Defaults to "skip". */
  skipLabel?: string;
  /**
   * When set, the intro writes `localStorage[persistKey] = "true"` after
   * completing and will not replay on subsequent mounts. Omit to always play.
   */
  persistKey?: string;
  /** Extra classes for the overlay. */
  className?: string;
};

/**
 * Full-screen timed multi-step intro/splash overlay. Steps come in as props and
 * each is rendered full screen with a staggered enter/exit. Auto-advances, calls
 * onComplete, then unmounts. Locks body scroll while visible. Dark-only. An
 * optional persistKey gates it to play only once via localStorage.
 */
export function Intro({
  steps,
  stepDuration = 2200,
  onComplete,
  skippable = true,
  skipLabel = "skip",
  persistKey,
  className,
}: IntroProps) {
  // null = gate undetermined (waiting on localStorage); avoids a replay flash.
  const [visible, setVisible] = useState<boolean | null>(persistKey ? null : true);
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  // Keep the latest onComplete without re-running timers when it changes.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // localStorage gate.
  useEffect(() => {
    if (!persistKey) return;
    const played =
      typeof window !== "undefined" &&
      window.localStorage.getItem(persistKey) === "true";
    setVisible(!played);
  }, [persistKey]);

  const finish = useCallback(() => {
    setVisible(false);
    if (persistKey && typeof window !== "undefined") {
      window.localStorage.setItem(persistKey, "true");
    }
    onCompleteRef.current?.();
  }, [persistKey]);

  // Auto-advance through the steps, then finish.
  useEffect(() => {
    if (visible !== true) return;
    if (steps.length === 0) {
      finish();
      return;
    }
    const isLast = index >= steps.length - 1;
    const id = window.setTimeout(() => {
      if (isLast) finish();
      else setIndex((i) => i + 1);
    }, stepDuration);
    return () => window.clearTimeout(id);
  }, [visible, index, steps.length, stepDuration, finish]);

  // Body scroll lock while visible.
  useEffect(() => {
    if (visible !== true) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (visible !== true) return null;

  const duration = reduceMotion ? 0 : 0.5;
  const offset = reduceMotion ? 0 : 10;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -offset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: offset }}
          transition={{ duration, ease: "easeInOut" }}
          className="flex items-center justify-center px-6 text-center text-lg leading-tight"
        >
          {steps[index] ?? null}
        </motion.div>
      </AnimatePresence>

      {skippable && (
        <button
          type="button"
          onClick={finish}
          aria-label={skipLabel}
          className="fixed bottom-12 text-sm text-white/80 underline-offset-4 transition hover:text-white hover:underline"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}
