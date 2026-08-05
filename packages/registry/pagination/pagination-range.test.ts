import { describe, expect, test } from "bun:test";
import { GAP, paginationRange } from "./pagination-range";

describe("paginationRange", () => {
  test("lists every page when they all fit", () => {
    expect(paginationRange(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(paginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("keeps a constant width at both ends", () => {
    // The window shifts rather than shrinking, so paging from one end to the
    // other never changes how many cells are rendered.
    const first = paginationRange(1, 20);
    const last = paginationRange(20, 20);
    expect(first).toEqual([1, 2, 3, 4, GAP, 20]);
    expect(last).toEqual([1, GAP, 17, 18, 19, 20]);
    expect(first.length).toBe(last.length);
    expect(paginationRange(10, 20).length).toBe(7);
  });

  test("never elides a single page behind an ellipsis", () => {
    // Page 4 of 20: the run before the window is just page 2, so it is shown
    // rather than replaced by a gap that costs the same width.
    expect(paginationRange(4, 20)).toEqual([1, 2, 3, 4, 5, GAP, 20]);
    expect(paginationRange(17, 20)).toEqual([1, GAP, 16, 17, 18, 19, 20]);
  });

  test("puts a gap on both sides in the middle", () => {
    expect(paginationRange(10, 20)).toEqual([1, GAP, 9, 10, 11, GAP, 20]);
  });

  test("honours siblings and boundaries", () => {
    expect(paginationRange(10, 30, 2)).toEqual([1, GAP, 8, 9, 10, 11, 12, GAP, 30]);
    expect(paginationRange(15, 30, 1, 2)).toEqual([1, 2, GAP, 14, 15, 16, GAP, 29, 30]);
  });

  test("clamps an out-of-range page instead of producing junk", () => {
    expect(paginationRange(0, 20)).toEqual(paginationRange(1, 20));
    expect(paginationRange(99, 20)).toEqual(paginationRange(20, 20));
  });

  test("returns nothing for a non-positive page count", () => {
    expect(paginationRange(1, 0)).toEqual([]);
    expect(paginationRange(1, -3)).toEqual([]);
  });
});
