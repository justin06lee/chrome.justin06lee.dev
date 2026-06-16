"use client";

import { useEffect, useState } from "react";

export type UseInlineEditOptions = {
  /** Source of truth, owned by the caller. */
  value: string;
  /**
   * Commit the next value. Throw to signal failure — the draft rolls back to
   * `value`. May be sync or async; while it runs the field is pending.
   */
  onCommit: (next: string) => void | Promise<void>;
  /** Trim before comparing / committing. Default true. */
  trim?: boolean;
};

export type UseInlineEditReturn = {
  draft: string;
  setDraft: (next: string) => void;
  pending: boolean;
  /** Commit the draft (onBlur / Enter). No-op if unchanged or empty. */
  commit: () => Promise<void>;
  /** Discard the draft and snap back to `value` (Escape). */
  cancel: () => void;
  /** Convenience handler: Enter commits, Escape cancels. */
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * Headless blur-to-save editor. Holds a local draft over a controlled `value`,
 * commits via an injected onCommit, shows a pending flag while committing, and
 * ROLLS BACK to the previous value if onCommit throws.
 */
export function useInlineEdit({
  value,
  onCommit,
  trim = true,
}: UseInlineEditOptions): UseInlineEditReturn {
  const [draft, setDraft] = useState(value);
  const [pending, setPending] = useState(false);

  // Keep the draft in sync when the source of truth changes externally
  // (e.g. a successful commit updates `value`), but never while mid-edit.
  useEffect(() => {
    if (!pending) setDraft(value);
  }, [value, pending]);

  const cancel = () => setDraft(value);

  const commit = async () => {
    const next = trim ? draft.trim() : draft;
    if (next.length === 0 || next === value) {
      // Nothing to do — revert to the source of truth.
      setDraft(value);
      return;
    }
    setPending(true);
    try {
      await onCommit(next);
      setDraft(next);
    } catch {
      // Roll back to the previous value on failure.
      setDraft(value);
    } finally {
      setPending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
      e.currentTarget.blur();
    }
  };

  return { draft, setDraft, pending, commit, cancel, onKeyDown };
}
