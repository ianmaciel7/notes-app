import type { Story, StoryDefault } from "@ladle/react";

import { ObjectDetail, ObjectDetailContent, ObjectDetailHeader } from "./object-detail";
import { ObjectList, ObjectListContent, ObjectListHeader } from "./object-list";

export default {
  title: "Components / Objects / Primitives",
} satisfies StoryDefault;

export const ListAnatomy: Story = () => (
  <ObjectList aria-label="Example object list">
    <ObjectListHeader>
      <h1>Object list</h1>
    </ObjectListHeader>
    <ObjectListContent>
      <p>The type supplies its own results.</p>
    </ObjectListContent>
  </ObjectList>
);

export const DetailAnatomy: Story = () => (
  <ObjectDetail aria-label="Example object detail">
    <ObjectDetailHeader>
      <h1>Object detail</h1>
    </ObjectDetailHeader>
    <ObjectDetailContent>
      <p>The type supplies its own content.</p>
    </ObjectDetailContent>
  </ObjectDetail>
);
