import assert from "node:assert/strict";
import test from "node:test";
import {
  SUGGESTION_TRIGGER_DEFINITIONS,
  canOpenSuggestionTrigger,
  deleteSuggestionTriggerRange,
  resolveSuggestionTrigger,
} from "../src/editor/shared-suggestion-controller.ts";

test("suggestion trigger definitions keep one owner per Capacities-style token", () => {
  assert.deepEqual(
    SUGGESTION_TRIGGER_DEFINITIONS.map((trigger) => [
      trigger.token,
      trigger.owner,
      trigger.priority,
    ]),
    [
      ["[[", "object-reference", 40],
      ["((", "block-reference", 40],
      ["/", "slash-command", 20],
      ["+", "plus-quick-action", 20],
      ["#", "tag-reference", 20],
      ["@", "object-reference", 20],
    ],
  );
});

test("trigger arbitration resolves valid text boundaries and overlapping tokens", () => {
  assert.deepEqual(resolveSuggestionTrigger({ textBeforeCursor: "/" }), {
    owner: "slash-command",
    query: "",
    range: { from: 0, to: 1 },
    token: "/",
  });
  assert.deepEqual(resolveSuggestionTrigger({ textBeforeCursor: "Meet @atl" }), {
    owner: "object-reference",
    query: "atl",
    range: { from: 5, to: 9 },
    token: "@",
  });
  assert.deepEqual(resolveSuggestionTrigger({ textBeforeCursor: "See [[Atl" }), {
    owner: "object-reference",
    query: "Atl",
    range: { from: 4, to: 9 },
    token: "[[",
  });
  assert.deepEqual(resolveSuggestionTrigger({ textBeforeCursor: "Quote ((block" }), {
    owner: "block-reference",
    query: "block",
    range: { from: 6, to: 13 },
    token: "((",
  });
  assert.deepEqual(resolveSuggestionTrigger({ textBeforeCursor: "Add +page" }), {
    owner: "plus-quick-action",
    query: "page",
    range: { from: 4, to: 9 },
    token: "+",
  });
  assert.deepEqual(resolveSuggestionTrigger({ textBeforeCursor: "Tag #Curio" }), {
    owner: "tag-reference",
    query: "Curio",
    range: { from: 4, to: 10 },
    token: "#",
  });
  assert.equal(resolveSuggestionTrigger({ textBeforeCursor: "Already [[@" }), null);
  assert.equal(resolveSuggestionTrigger({ textBeforeCursor: "email@domain" }), null);
  assert.equal(resolveSuggestionTrigger({ textBeforeCursor: "word+page" }), null);
  assert.equal(resolveSuggestionTrigger({ textBeforeCursor: "https://x.test/#tag" }), null);
  assert.equal(resolveSuggestionTrigger({ textBeforeCursor: "# " }), null);
});

test("trigger arbitration blocks unsupported nodes, marks, selections, and IME composition", () => {
  const valid = { selectionEmpty: true, textblock: true };
  assert.equal(canOpenSuggestionTrigger({ ...valid, nodeName: "paragraph" }), true);
  assert.equal(canOpenSuggestionTrigger({ ...valid, nodeName: "codeBlock" }), false);
  assert.equal(canOpenSuggestionTrigger({ ...valid, markNames: ["code"] }), false);
  assert.equal(canOpenSuggestionTrigger({ ...valid, selectionEmpty: false }), false);
  assert.equal(canOpenSuggestionTrigger({ ...valid, textblock: false }), false);
  assert.equal(canOpenSuggestionTrigger({ ...valid, composing: true }), false);
});

test("accepted suggestions delete exactly the active trigger range", () => {
  assert.equal(
    deleteSuggestionTriggerRange("Meet @atl please", { from: 5, to: 9 }, "Atlas"),
    "Meet Atlas please",
  );
  assert.equal(
    deleteSuggestionTriggerRange("See [[Atl", { from: 4, to: 9 }, "Atlas"),
    "See Atlas",
  );
});
