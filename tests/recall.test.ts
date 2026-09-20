import assert from "node:assert/strict";
import test from "node:test";
import { grade, objectInput, schedule } from "../src/domain/recall";

test("grade: single-choice evaluation", () => {
  const question = {
    format: "single-choice" as const,
    answers: ["Option B"],
  };
  assert.equal(grade(question, ["Option B"]), true);
  assert.equal(grade(question, ["option b "]), true); // case and whitespace insensitivity
  assert.equal(grade(question, ["Option A"]), false);
  assert.equal(grade(question, []), false);
});

test("grade: multiple-choice evaluation", () => {
  const question = {
    format: "multiple-choice" as const,
    answers: ["A", "C"],
  };
  assert.equal(grade(question, ["A", "C"]), true);
  assert.equal(grade(question, ["c", "a"]), true); // order independence
  assert.equal(grade(question, ["A"]), false);
  assert.equal(grade(question, ["A", "B"]), false);
  assert.equal(grade(question, ["A", "A", "C"]), false); // duplicates rejected
});

test("grade: fill-blank evaluation", () => {
  const question = {
    format: "fill-blank" as const,
    answers: ["mitochondria", "mitochondrion"],
  };
  assert.equal(grade(question, ["mitochondria"]), true);
  assert.equal(grade(question, [" Mitochondrion "]), true);
  assert.equal(grade(question, ["nucleus"]), false);
});

test("grade: matching evaluation", () => {
  const question = {
    format: "matching" as const,
    answers: ["first", "second"],
  };
  assert.equal(grade(question, ["first", "second"]), true);
  assert.equal(grade(question, ["second", "first"]), false); // order-sensitive
});

test("schedule: initial correct attempt", () => {
  const now = 1700000000000;
  const next = schedule(undefined, true, now);
  assert.equal(next.repetitions, 1);
  assert.equal(next.interval, 1);
  assert.equal(next.attempts, 1);
  assert.equal(next.correct, 1);
  assert.equal(next.due, now + 1 * 86400000);
});

test("schedule: subsequent correct attempts scale interval and ease", () => {
  const now = 1700000000000;
  const first = schedule(undefined, true, now);
  const second = schedule(first, true, now);
  assert.equal(second.repetitions, 2);
  assert.equal(second.interval, 6);
  assert.equal(second.due, now + 6 * 86400000);

  const third = schedule(second, true, now);
  assert.equal(third.repetitions, 3);
  assert.equal(third.interval, Math.round(6 * second.ease));
});

test("schedule: incorrect attempt resets repetitions and interval", () => {
  const now = 1700000000000;
  const first = schedule(undefined, true, now);
  const second = schedule(first, true, now);
  const failed = schedule(second, false, now);

  assert.equal(failed.repetitions, 0);
  assert.equal(failed.interval, 1);
  assert.equal(failed.attempts, 3);
  assert.equal(failed.correct, 2);
  assert.ok(failed.ease < second.ease);
});

test("objectInput: validates valid question object", () => {
  const validQuestion = {
    title: "What is 2 + 2?",
    kind: "question" as const,
    text: "Basic arithmetic question",
    url: "",
    format: "single-choice" as const,
    options: ["3", "4", "5"],
    answers: ["4"],
    links: [],
  };
  const parsed = objectInput.safeParse(validQuestion);
  assert.equal(parsed.success, true);
});
