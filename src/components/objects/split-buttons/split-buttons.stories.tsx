import type { Story, StoryDefault } from "@ladle/react";
import { ObjectSplitButtonDynamic, objectSplitButtonRegistry } from "./split-button-registry";
import { PageSplitButton } from "./page-split-button";
import { TaskSplitButton } from "./task-split-button";
import { WeblinkSplitButton } from "./weblink-split-button";

export default {
  title: "Objects / Split Buttons",
} satisfies StoryDefault;

export const AllSplitButtonsGrid: Story = () => {
  const splitButtonEntries = Object.entries(objectSplitButtonRegistry).filter(
    ([key]) => !key.includes("_") && key !== "calendar",
  );

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Space Object Split Buttons (32 types)</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {splitButtonEntries.map(([name, Component]) => (
          <div
            key={name}
            className="flex flex-col items-start justify-center gap-2 rounded-lg border border-border p-4 hover:bg-muted/50"
          >
            <span className="text-xs font-mono text-muted-foreground">{name}</span>
            <Component
              onLabelClick={() => alert(`Clicked ${name}`)}
              options={[
                { id: "1", label: "Abrir em nova aba" },
                { id: "2", label: "Editar propriedades" },
                { id: "3", label: "Excluir" },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SizeVariants: Story = () => (
  <div className="flex flex-col gap-6 p-6">
    <h2 className="text-xl font-semibold">Size Variants (Small, Medium, Large)</h2>
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-start gap-2">
        <PageSplitButton size="sm" label="Página (Small)" tone="blue" />
        <span className="text-xs text-muted-foreground">h-6 (sm)</span>
      </div>
      <div className="flex flex-col items-start gap-2">
        <TaskSplitButton size="md" label="Tarefa (Medium)" tone="red" />
        <span className="text-xs text-muted-foreground">h-7 (md)</span>
      </div>
      <div className="flex flex-col items-start gap-2">
        <WeblinkSplitButton size="lg" label="Weblink (Large)" tone="cyan" />
        <span className="text-xs text-muted-foreground">h-8 (lg)</span>
      </div>
    </div>
  </div>
);

export const DynamicObjectSplitButtonStory: Story = () => (
  <div className="flex flex-col gap-6 p-6">
    <h2 className="text-xl font-semibold">Dynamic ObjectSplitButton Component</h2>
    <div className="flex flex-wrap items-center gap-4">
      <ObjectSplitButtonDynamic type="weblink" />
      <ObjectSplitButtonDynamic type="task" />
      <ObjectSplitButtonDynamic type="daily-note" />
      <ObjectSplitButtonDynamic type="study-goal" />
    </div>
  </div>
);
