import type { Story, StoryDefault } from "@ladle/react";
import * as React from "react";
import { WorkspaceObjectRenderer, WorkspaceObjectTypeListView } from "./workspace-object-renderer";
import { workspaceEntityFixture, workspaceObjectTypeFixture } from "./workspace-story-fixtures";

export default {
  title: "Components / Workspace object renderer",
} satisfies StoryDefault;

function ObjectRendererFrame({ children }: { children: React.ReactNode }) {
  return <div className="h-screen min-h-0 w-full overflow-hidden bg-card">{children}</div>;
}

function ObjectTypeListFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen min-h-0 w-full overflow-hidden bg-[var(--app-bg-base)] p-6">
      <div className="h-[38rem] w-[34rem] overflow-hidden">{children}</div>
    </div>
  );
}

function ObjectTypeListStoryPreferences({
  children,
  objectTypeId,
}: {
  children: React.ReactNode;
  objectTypeId: string;
}) {
  const preferenceKey = `knowledgeos.workspace.objectTypeList.personal.${objectTypeId}`;
  const previousPreferenceRef = React.useRef<string | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    previousPreferenceRef.current = window.localStorage.getItem(preferenceKey);
    window.localStorage.setItem(
      preferenceKey,
      JSON.stringify({
        allLayout: "cards",
        filter: "all",
        groupBy: "none",
        mode: "overview",
        query: "",
        sort: "updated-desc",
      }),
    );
    setReady(true);

    return () => {
      if (previousPreferenceRef.current === null) {
        window.localStorage.removeItem(preferenceKey);
      } else {
        window.localStorage.setItem(preferenceKey, previousPreferenceRef.current);
      }
    };
  }, [preferenceKey]);

  return ready ? children : null;
}

const pageType = workspaceObjectTypeFixture({
  id: "page",
  pluralName: "Pages",
  singularName: "Page",
  tone: "blue",
});

const pageEntities = [
  workspaceEntityFixture({
    id: "page-empty-title",
    title: "ffffffffff",
    tags: [],
    updatedAt: "2026-09-10T13:10:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-clean-value",
    title: "valorlimpo123",
    tags: [],
    updatedAt: "2026-09-10T13:09:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-untitled-long",
    title: "Untitled ffffffffff",
    tags: [],
    updatedAt: "2026-09-10T13:08:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-untitled",
    title: "Untitled Page",
    tags: [],
    updatedAt: "2026-09-10T13:07:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-study-outline",
    title: "Study outline",
    blocks: [
      {
        id: "study-outline-block",
        type: "paragraph",
        content: "Draft questions for the next review session.",
      },
    ],
    tags: ["Study"],
    updatedAt: "2026-09-10T13:06:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-reader-notes",
    title: "Reader notes",
    blocks: [
      {
        id: "reader-notes-block",
        type: "paragraph",
        content: "Quotes to turn into grounded flashcards.",
      },
    ],
    tags: ["Reading"],
    updatedAt: "2026-09-10T13:05:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-exam-plan",
    title: "Exam plan",
    tags: ["Study"],
    updatedAt: "2026-09-10T13:04:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-daily-log",
    title: "Daily log",
    tags: [],
    updatedAt: "2026-09-10T13:03:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-project-ideas",
    title: "Project ideas",
    tags: ["Ideas"],
    updatedAt: "2026-09-10T13:02:00.000Z",
  }),
  workspaceEntityFixture({
    id: "page-source-map",
    title: "Source map",
    tags: ["Reading", "Study"],
    updatedAt: "2026-09-10T13:01:00.000Z",
  }),
];

export const WeblinkWithUrl: Story = () => (
  <ObjectRendererFrame>
    <WorkspaceObjectRenderer
      entity={workspaceEntityFixture({
        id: "entity-weblink",
        objectTypeId: "weblink",
        properties: {
          description: "A saved reference with notes still pending.",
          url: "https://example.com/research/article",
        },
        title: "Research article",
      })}
      tabName="Research article"
    />
  </ObjectRendererFrame>
);

export const WeblinkMissingUrl: Story = () => (
  <ObjectRendererFrame>
    <WorkspaceObjectRenderer
      entity={workspaceEntityFixture({
        id: "entity-weblink-missing-url",
        objectTypeId: "weblink",
        title: "Saved link without URL",
      })}
      tabName="Saved link without URL"
    />
  </ObjectRendererFrame>
);

export const PagePending: Story = () => (
  <ObjectRendererFrame>
    <WorkspaceObjectRenderer
      entity={workspaceEntityFixture({
        id: "entity-page",
        objectTypeId: "page",
        title: "Project notes",
      })}
      objectType={pageType}
      tabName="Project notes"
    />
  </ObjectRendererFrame>
);

export const PagesOverviewGrid: Story = () => (
  <ObjectTypeListFrame>
    <ObjectTypeListStoryPreferences objectTypeId={pageType.id}>
      <WorkspaceObjectTypeListView
        entities={pageEntities}
        objectType={pageType}
        tabName="Pages"
        onCreateEntity={() => undefined}
        onOpenEntity={() => undefined}
      />
    </ObjectTypeListStoryPreferences>
  </ObjectTypeListFrame>
);
