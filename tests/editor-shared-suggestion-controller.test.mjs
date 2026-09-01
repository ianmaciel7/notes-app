import assert from "node:assert/strict";
import test from "node:test";
import {
  computeSuggestionMenuPosition,
  getNextSuggestionIndex,
  installSuggestionOutsideDismissal,
  isUsableSuggestionAnchorRect,
  resolveSuggestionAnchorRect,
  SUGGESTION_MENU_MOTION_CLASS,
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

test("shared suggestion anchor falls back from decoration to selection and document position", () => {
  const origin = { bottom: 0, height: 0, left: 0, top: 0, width: 0 };
  const selection = { bottom: 42, height: 18, left: 120, top: 24, width: 1 };
  const documentPosition = {
    bottom: 84,
    height: 18,
    left: 160,
    top: 66,
    width: 1,
  };

  assert.equal(
    resolveSuggestionAnchorRect({
      decorationRect: origin,
      documentPositionRect: documentPosition,
      selectionRect: selection,
    }),
    selection,
  );
  assert.equal(
    resolveSuggestionAnchorRect({
      decorationRect: origin,
      documentPositionRect: documentPosition,
      selectionRect: null,
    }),
    documentPosition,
  );
  assert.equal(
    resolveSuggestionAnchorRect({
      decorationRect: selection,
      documentPositionRect: documentPosition,
      selectionRect: null,
    }),
    selection,
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

test("shared suggestion dismissal ignores the menu and removes its listener", () => {
  let listener;
  let removed;
  let dismissals = 0;
  const ownerDocument = {
    addEventListener: (type, nextListener, options) => {
      assert.equal(type, "pointerdown");
      assert.deepEqual(options, { capture: true });
      listener = nextListener;
    },
    removeEventListener: (type, nextListener, options) => {
      assert.equal(type, "pointerdown");
      assert.deepEqual(options, { capture: true });
      removed = nextListener;
    },
  };
  const inside = {};
  const cleanup = installSuggestionOutsideDismissal({
    menuContainsTarget: (target) => target === inside,
    onDismiss: () => {
      dismissals += 1;
    },
    ownerDocument,
  });

  listener({ target: inside });
  listener({ target: {} });
  assert.equal(dismissals, 1);
  cleanup();
  assert.equal(removed, listener);
});

test("shared suggestion surfaces disable motion for reduced-motion users", () => {
  assert.match(SUGGESTION_MENU_MOTION_CLASS, /transition-/);
  assert.match(SUGGESTION_MENU_MOTION_CLASS, /motion-reduce:transition-none/);
});

