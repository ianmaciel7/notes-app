import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { resolveObjectComponents } from "@/app/_components/objects/object-components";
import { ObjectDetailResolver } from "@/app/_components/objects/object-detail-resolver";
import { objectEntityFixture, objectTypeFixture } from "@/app/_components/objects/object-view-fixtures";
import {
  CustomObjectDetail,
} from "@/app/_components/objects/types/custom-object/custom-object-detail";
import { CustomObjectList } from "@/app/_components/objects/types/custom-object/custom-object-list";
import { BUILT_IN_STRUCTURES, OBJECT_TYPE_PRESETS } from "@/lib/space-object-types";

const knownTypes = [...BUILT_IN_STRUCTURES, ...OBJECT_TYPE_PRESETS];

it.each(knownTypes)("resolves a dedicated list and detail for $id", (type) => {
  const pair = resolveObjectComponents(type.id);
  expect(pair.List).not.toBe(CustomObjectList);
  expect(pair.Detail).not.toBe(CustomObjectDetail);
  const listMarkup = renderToStaticMarkup(
    <pair.List entities={[]} objectType={type} tabName={type.pluralName} />,
  );
  expect(listMarkup).toContain('data-slot="workspace-object-type-list-view"');
  expect(listMarkup).toContain(`data-object-view="${type.id.replaceAll("_", "-")}-list"`);
});

it("uses the custom pair for dynamic and prototype-like type ids", () => {
  for (const id of ["custom-123", "constructor", "__proto__"]) {
    const pair = resolveObjectComponents(id);
    expect(pair.List).toBe(CustomObjectList);
    expect(pair.Detail).toBe(CustomObjectDetail);
  }
});

it("does not use metadata belonging to another space in a detail", () => {
  const markup = renderToStaticMarkup(
    <ObjectDetailResolver
      entity={objectEntityFixture()}
      objectType={objectTypeFixture({ spaceId: "work", singularName: "Private foreign label" })}
      tabName="Notes"
    />,
  );
  expect(markup).toContain("Research notes");
  expect(markup).not.toContain("Private foreign label");
});
