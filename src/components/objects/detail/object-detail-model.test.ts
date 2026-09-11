import { expect, it } from "vitest";
import { objectEntityFixture } from "@/components/objects/object-view-fixtures";
import {
  getReadableProperties,
  getWeblinkUrl,
  hasObjectBody,
} from "@/components/objects/detail/object-detail-model";

it.each(["javascript:alert(1)", "data:text/html,hello", "file:///tmp/a", "invalid"])(
  "does not expose an unsafe URL: %s",
  (url) => {
    expect(getWeblinkUrl(objectEntityFixture({ properties: { url } }))).toBeUndefined();
  },
);

it("preserves HTTP(S) links and the legacy trailing-slash normalization", () => {
  expect(getWeblinkUrl(objectEntityFixture({ properties: { url: "https://example.com/" } })))
    .toBe("https://example.com");
  expect(getWeblinkUrl(objectEntityFixture({ properties: { href: "http://example.com/a" } })))
    .toBe("http://example.com/a");
});

it("keeps false and zero properties and hides URL keys case-insensitively", () => {
  const entity = objectEntityFixture({
    properties: { URL: "https://example.com", complete: false, count: 0, blank: "" },
  });
  expect(getReadableProperties(entity, ["url"]))
    .toEqual([["complete", "false"], ["count", "0"]]);
});

it("distinguishes a divider from a whitespace-only block", () => {
  expect(hasObjectBody(objectEntityFixture({
    blocks: [{ id: "a", type: "divider", content: "" }],
  }))).toBe(true);
  expect(hasObjectBody(objectEntityFixture({
    blocks: [{ id: "a", type: "paragraph", content: " " }],
  }))).toBe(false);
});
