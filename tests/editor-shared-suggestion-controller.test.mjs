import assert from "node:assert/strict";
import test from "node:test";
import {
  computeSuggestionMenuPosition,
  getNextSuggestionIndex,
  isUsableSuggestionAnchorRect,
} from "../src/editor/shared-suggestion-controller.ts";

test("shared suggestion selection wraps predictably for keyboard navigation", () => {
  assert.equal(getNextSuggestionIndex(-1, 3, 1), 0);
  assert.equal(getNextSuggestionIndex(0, 3, -1), 2);
  assert.equal(getNextSuggestionIndex(2, 3, 1), 0);
  assert.equal(getNextSuggestionIndex(0, 0, 1), -1);
});

test("shared suggestion geometry rejects viewport-origin flashes", () => {
  assert.equal(
    isUsableSuggestionAnchorRect({ bottom: 0, height: 0, left: 0, top: 0, width: 0 }),
    false,
  );
  assert.equal(
    isUsableSuggestionAnchorRect({ bottom: 42, height: 18, left: 120, top: 24, width: 1 }),
    true,
  );
});

test("shared suggestion menu position clamps to gutter and flips above when needed", () => {
  assert.deepEqual(
    computeSuggestionMenuPosition({
      anchor: { bottom: 590, height: 18, left: 790, top: 572, width: 1 },
      fallbackPosition: { x: 790, y: 590 },
      menu: { height: 160, width: 260 },
      viewport: { height: 640, width: 900 },
    }),
    { left: 632, top: 408 },
  );
  assert.deepEqual(
    computeSuggestionMenuPosition({
      anchor: null,
      fallbackPosition: { x: -10, y: -20 },
      menu: { height: 0, width: 440 },
      viewport: { height: 640, width: 390 },
    }),
    { left: 8, top: 8 },
  );
});

