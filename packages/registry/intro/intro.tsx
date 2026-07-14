"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type IntroProps = {
  /** Lines that fade in one by one under the hero and stay visible. */
  lines: React.ReactNode[];
  /** Optional visual rendered above the lines (e.g. ascii art). */
  hero?: React.ReactNode;
  /** How long the finished scene holds before fading out, in ms. */
  holdDuration?: number;
  /** Called once after the overlay finishes fading out (also on skip). */
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

// Timeline (seconds). Lines accumulate: each fades in and stays put while the
// next one appears below it, mirroring the justin06lee.dev homepage stagger.
const HERO_DELAY = 0.4;
const LINE_STEP = 0.3;
const ENTER_DURATION = 0.8;
const EXIT_DURATION = 0.7;

/**
 * Full-screen intro/splash overlay rendered as one scene: an optional hero on
 * top with lines fading in one by one beneath it. Once the last line has held
 * for `holdDuration`, the whole overlay fades out (never snaps), then calls
 * onComplete and unmounts. Locks body scroll while visible. Dark-only. An
 * optional persistKey gates it to play only once via localStorage.
 */
export function Intro({
  lines,
  hero,
  holdDuration = 1400,
  onComplete,
  skippable = true,
  skipLabel = "skip",
  persistKey,
  className,
}: IntroProps) {
  // null = gate undetermined (waiting on localStorage); avoids a replay flash.
  const [visible, setVisible] = useState<boolean | null>(persistKey ? null : true);
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

  // Starts the fade-out; completion is settled in AnimatePresence's
  // onExitComplete so onComplete only fires once the fade has finished.
  const beginExit = useCallback(() => {
    setVisible(false);
  }, []);

  const handleExited = useCallback(() => {
    if (persistKey && typeof window !== "undefined") {
      window.localStorage.setItem(persistKey, "true");
    }
    onCompleteRef.current?.();
  }, [persistKey]);

  const hasHero = hero != null;
  // First line waits for the hero to be underway; without a hero it leads.
  const lineBase = hasHero ? HERO_DELAY + 0.6 : HERO_DELAY;

  // Hold the finished scene, then fade the whole overlay out.
  useEffect(() => {
    if (visible !== true) return;
    if (lines.length === 0 && !hasHero) {
      beginExit();
      return;
    }
    const lastDelay =
      lines.length > 0 ? lineBase + (lines.length - 1) * LINE_STEP : HERO_DELAY;
    const settleMs = reduceMotion ? 0 : (lastDelay + ENTER_DURATION) * 1000;
    const id = window.setTimeout(beginExit, settleMs + holdDuration);
    return () => window.clearTimeout(id);
  }, [visible, lines.length, hasHero, lineBase, holdDuration, reduceMotion, beginExit]);

  // Body scroll lock while visible.
  useEffect(() => {
    if (visible !== true) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (visible === null) return null;

  const duration = reduceMotion ? 0 : ENTER_DURATION;
  const offset = reduceMotion ? 0 : 10;
  const delay = (d: number) => (reduceMotion ? 0 : d);

  return (
    <AnimatePresence onExitComplete={handleExited}>
      {visible && (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : EXIT_DURATION,
            ease: "easeInOut",
          }}
          className={cn(
            "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white",
            className,
          )}
        >
          <div className="flex flex-col items-center gap-8 px-6 text-center">
            {hasHero && (
              <motion.div
                initial={{ opacity: 0, y: offset }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay: delay(HERO_DELAY) }}
              >
                {hero}
              </motion.div>
            )}

            {lines.length > 0 && (
              <div className="flex flex-col items-center gap-4 text-lg leading-tight">
                {lines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: offset }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration, delay: delay(lineBase + i * LINE_STEP) }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {skippable && (
            <motion.button
              type="button"
              onClick={beginExit}
              aria-label={skipLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration, delay: delay(HERO_DELAY) }}
              className="fixed bottom-12 text-sm text-white/80 underline-offset-4 transition hover:text-white hover:underline"
            >
              {skipLabel}
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
