import { describe, expect, test } from "bun:test";
import {
  offsetToLine,
  lineStartOffset,
  trimStreakRange,
  editorLineToPreviewLine,
  previewLineToEditorLine,
} from "./use-line-sync";

// lines (1-based):
// 1: "# Title"   offsets 0..6, "\n" at 7
// 2: ""          "\n" at 8
// 3: "para one"  offsets 9..16, "\n" at 17
// 4: ""          "\n" at 18
// 5: "para two"  offsets 19..26, "\n" at 27
const TEXT = "# Title\n\npara one\n\npara two\n";

describe("offsetToLine", () => {
  test("start of document is line 1", () => {
    expect(offsetToLine(TEXT, 0)).toBe(1);
  });
  test("offset inside the first line is line 1", () => {
    expect(offsetToLine(TEXT, 5)).toBe(1);
  });
  test("offset just past the first newline is line 2", () => {
    expect(offsetToLine(TEXT, 8)).toBe(2);
  });
  test("offset at the start of the third line is line 3", () => {
    expect(offsetToLine(TEXT, 9)).toBe(3);
  });
});

describe("lineStartOffset", () => {
  test("line 1 starts at 0", () => {
    expect(lineStartOffset(TEXT, 1)).toBe(0);
  });
  test("line <= 0 clamps to 0", () => {
    expect(lineStartOffset(TEXT, 0)).toBe(0);
  });
  test("line 3 starts after the second newline", () => {
    expect(lineStartOffset(TEXT, 3)).toBe(9);
  });
  test("line 5 starts after the fourth newline", () => {
    expect(lineStartOffset(TEXT, 5)).toBe(19);
  });
  test("line past the end clamps to text length", () => {
    expect(lineStartOffset(TEXT, 99)).toBe(TEXT.length);
  });

  test("round-trips with offsetToLine at line starts", () => {
    for (const line of [1, 2, 3, 4, 5]) {
      expect(offsetToLine(TEXT, lineStartOffset(TEXT, line))).toBe(line);
    }
  });
});

describe("trimStreakRange", () => {
  test("a middle block covers exactly its own text, no trailing blank", () => {
    // click "para one" (startLine 3); next block starts at line 5
    expect(trimStreakRange(TEXT, 3, 5)).toEqual({ start: 9, end: 17 });
  });
  test("the first block stops before its trailing blank", () => {
    expect(trimStreakRange(TEXT, 1, 3)).toEqual({ start: 0, end: 7 });
  });
  test("the last block (endLine null) trims the trailing blank line", () => {
    expect(trimStreakRange(TEXT, 5, null)).toEqual({ start: 19, end: 27 });
  });
  test("a single-line block with no trailing blank covers that line", () => {
    const t = "alpha\nbeta\ngamma";
    // click "beta" (line 2); next block line 3 -> covers "beta" only
    expect(trimStreakRange(t, 2, 3)).toEqual({ start: 6, end: 10 });
  });
});

// a stripped front-matter region: preview hides the first 5 source lines
// (1: "# title", 2: "cover:", 3: "excerpt:", 4: "tags:", 5: ""), so preview
// block line 1 corresponds to editor line 6.
const OFFSET = 5;

describe("editorLineToPreviewLine", () => {
  test("zero offset leaves lines unchanged", () => {
    for (const line of [1, 2, 7]) {
      expect(editorLineToPreviewLine(line, 0)).toBe(line);
    }
  });
  test("shifts body lines down by the offset", () => {
    expect(editorLineToPreviewLine(6, OFFSET)).toBe(1);
    expect(editorLineToPreviewLine(9, OFFSET)).toBe(4);
  });
  test("clamps at the boundary: the last front-matter line maps to block 1", () => {
    expect(editorLineToPreviewLine(OFFSET, OFFSET)).toBe(1);
  });
  test("clamps inside the front-matter region to the first block", () => {
    expect(editorLineToPreviewLine(1, OFFSET)).toBe(1);
    expect(editorLineToPreviewLine(3, OFFSET)).toBe(1);
  });
  test("a negative offset behaves like zero", () => {
    expect(editorLineToPreviewLine(4, -3)).toBe(4);
  });
});

describe("previewLineToEditorLine", () => {
  test("zero offset leaves lines unchanged", () => {
    for (const line of [1, 2, 7]) {
      expect(previewLineToEditorLine(line, 0)).toBe(line);
    }
  });
  test("shifts preview lines up by the offset", () => {
    expect(previewLineToEditorLine(1, OFFSET)).toBe(6);
    expect(previewLineToEditorLine(4, OFFSET)).toBe(9);
  });
  test("a negative offset behaves like zero", () => {
    expect(previewLineToEditorLine(4, -3)).toBe(4);
  });
  test("round-trips with editorLineToPreviewLine for lines past the region", () => {
    for (const editorLine of [6, 7, 20]) {
      expect(
        previewLineToEditorLine(editorLineToPreviewLine(editorLine, OFFSET), OFFSET),
      ).toBe(editorLine);
    }
  });
});
