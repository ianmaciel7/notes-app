import type { Story, StoryDefault } from "@ladle/react";
import { WorkspaceListRenderer } from "./workspace-object-renderer";
import { workspaceEntityFixture, workspaceObjectTypeFixture } from "./workspace-story-fixtures";

export default {
  title: "Components / Workspace list renderer",
} satisfies StoryDefault;

function ListRendererFrame({ children }: { children: React.ReactNode }) {
  return <div className="h-screen min-h-0 w-full overflow-hidden bg-card">{children}</div>;
}

const objectTypes = [
  workspaceObjectTypeFixture({
    id: "weblink",
    iconName: "weblink",
    singularName: "Weblink",
    tone: "blue",
  }),
  workspaceObjectTypeFixture({
    id: "page",
    singularName: "Page",
    tone: "blue",
  }),
  workspaceObjectTypeFixture({
    id: "flashcard",
    iconName: "flashcard",
    singularName: "Flashcard",
    tone: "violet",
  }),
  workspaceObjectTypeFixture({
    id: "study_goal",
    iconName: "study-goal",
    singularName: "Study goal",
    tone: "lime",
  }),
];

export const MixedObjectList: Story = () => (
  <ListRendererFrame>
    <WorkspaceListRenderer
      entities={[
        workspaceEntityFixture({
          id: "entity-weblink",
          objectTypeId: "weblink",
          properties: {
            description: "A saved reference with notes still pending.",
            url: "https://example.com/research/article",
          },
          title: "Research article",
        }),
        workspaceEntityFixture({
          id: "entity-page",
          objectTypeId: "page",
          title: "Project notes",
        }),
      ]}
      objectTypes={objectTypes}
      tabName="Mixed objects"
    />
  </ListRendererFrame>
);

export const StudyObjectTypesPendingList: Story = () => (
  <ListRendererFrame>
    <WorkspaceListRenderer
      entities={[
        workspaceEntityFixture({
          id: "entity-flashcard",
          objectTypeId: "flashcard",
          title: "Photosynthesis card",
        }),
        workspaceEntityFixture({
          id: "entity-study-goal",
          objectTypeId: "study_goal",
          title: "Biology final",
        }),
      ]}
      objectTypes={objectTypes}
      tabName="Study objects"
    />
  </ListRendererFrame>
);

export const EmptyObjectList: Story = () => (
  <ListRendererFrame>
    <WorkspaceListRenderer entities={[]} objectTypes={objectTypes} tabName="Pages" />
  </ListRendererFrame>
);
