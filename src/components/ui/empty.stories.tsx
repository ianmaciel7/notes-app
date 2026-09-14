import type { Story, StoryDefault } from "@ladle/react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./empty";

export default { title: "UI / Empty" } satisfies StoryDefault;

export const Default: Story = () => (
  <Empty className="max-w-xl border">
    <EmptyHeader>
      <EmptyTitle>No notes yet</EmptyTitle>
      <EmptyDescription>Create your first note to get started.</EmptyDescription>
    </EmptyHeader>
  </Empty>
);

