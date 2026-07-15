import { describe, expect, test } from "bun:test";
import { relXToFrame, seedEdge, stepEdge, type Edge } from "./scrub";

describe("relXToFrame", () => {
  test("maps the full width — no dead zones", () => {
    // 115 frames, reversed (the original cat sheet)
    expect(relXToFrame(0, 115, true)).toBe(114);
    expect(relXToFrame(1, 115, true)).toBe(0);
    // inside what used to be the 22% dead zone the sprite keeps sweeping
    expect(relXToFrame(0.1, 115, true)).toBe(103);
    expect(relXToFrame(0.9, 115, true)).toBe(11);
  });

  test("forward mapping when reverse is false", () => {
    expect(relXToFrame(0, 12, false)).toBe(0);
    expect(relXToFrame(1, 12, false)).toBe(11);
    expect(relXToFrame(0.5, 12, false)).toBe(6);
  });

  test("clamps positions outside [0,1]", () => {
    expect(relXToFrame(-0.5, 12, false)).toBe(0);
    expect(relXToFrame(1.5, 12, false)).toBe(11);
  });

  test("a single-frame sheet always maps to frame 0", () => {
    expect(relXToFrame(0.7, 1, false)).toBe(0);
    expect(relXToFrame(0.7, 1, true)).toBe(0);
  });
});

describe("stepEdge", () => {
  const L = 0.22;
  const R = 0.78;

  test("middle keeps the tracked edge and never sweeps", () => {
    expect(stepEdge(null, 0.5, L, R)).toEqual({ last: null, swept: null });
    expect(stepEdge("left", 0.5, L, R)).toEqual({ last: "left", swept: null });
    expect(stepEdge("right", 0.5, L, R)).toEqual({ last: "right", swept: null });
  });

  test("first edge visit arms the tracker without sweeping", () => {
    expect(stepEdge(null, 0.1, L, R)).toEqual({ last: "left", swept: null });
    expect(stepEdge(null, 0.9, L, R)).toEqual({ last: "right", swept: null });
  });

  test("reaching the opposite edge completes a sweep", () => {
    expect(stepEdge("left", 0.9, L, R)).toEqual({ last: "right", swept: "right" });
    expect(stepEdge("right", 0.1, L, R)).toEqual({ last: "left", swept: "left" });
  });

  test("lingering in the same zone does not re-fire", () => {
    expect(stepEdge("left", 0.05, L, R)).toEqual({ last: "left", swept: null });
    expect(stepEdge("right", 0.95, L, R)).toEqual({ last: "right", swept: null });
  });

  test("zone boundaries are inclusive", () => {
    expect(stepEdge(null, L, L, R).last).toBe("left");
    expect(stepEdge(null, R, L, R).last).toBe("right");
  });

  test("a back-and-forth drag counts one sweep per direction", () => {
    // simulate: enter mid, sweep left, sweep right, sweep left again
    const samples = [0.5, 0.3, 0.1, 0.3, 0.6, 0.9, 0.6, 0.2];
    let last: Edge | null = null;
    const sweeps: Edge[] = [];
    for (const relX of samples) {
      const next = stepEdge(last, relX, L, R);
      last = next.last;
      if (next.swept) sweeps.push(next.swept);
    }
    // first left visit only arms; then right and left complete sweeps
    expect(sweeps).toEqual(["right", "left"]);
  });
});

describe("seedEdge", () => {
  test("entering on the left half seeds left", () => {
    expect(seedEdge(0)).toBe("left");
    expect(seedEdge(0.49)).toBe("left");
  });
  test("entering on the right half seeds right", () => {
    expect(seedEdge(0.5)).toBe("right");
    expect(seedEdge(1)).toBe("right");
  });
  test("re-entry inside an edge zone never yields a sweep on the next sample", () => {
    // leave on the left, re-enter at the far right: seed says "right", so the
    // pointer sitting in the right zone does not count as a sweep
    const seeded = seedEdge(0.9);
    expect(stepEdge(seeded, 0.9, 0.22, 0.78)).toEqual({ last: "right", swept: null });
  });
});
