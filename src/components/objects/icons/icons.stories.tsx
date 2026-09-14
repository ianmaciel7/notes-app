import type { Story, StoryDefault } from "@ladle/react";
import { ObjectIcon, objectIconRegistry } from "./icon-registry";

export default {
  title: "Objects / Icons",
} satisfies StoryDefault;

export const AllIconsGrid: Story = () => {
  const iconEntries = Object.entries(objectIconRegistry).filter(
    ([key]) => !key.includes("_") && key !== "calendar",
  );

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Workspace Object Icons (32 types)</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {iconEntries.map(([name, Component]) => (
          <div
            key={name}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border p-4 text-center hover:bg-muted/50"
          >
            <Component className="size-6 text-foreground" />
            <span className="text-xs font-mono text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SizeVariants: Story = () => (
  <div className="flex flex-col gap-6 p-6">
    <h2 className="text-xl font-semibold">Size Variants (Page, Flashcard, Task)</h2>
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <ObjectIcon type="page" className="size-4" />
        <span className="text-xs text-muted-foreground">16px (size-4)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ObjectIcon type="flashcard" className="size-5" />
        <span className="text-xs text-muted-foreground">20px (size-5)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ObjectIcon type="task" className="size-6" />
        <span className="text-xs text-muted-foreground">24px (size-6)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ObjectIcon type="daily-note" className="size-8" />
        <span className="text-xs text-muted-foreground">32px (size-8)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ObjectIcon type="study-goal" className="size-12" />
        <span className="text-xs text-muted-foreground">48px (size-12)</span>
      </div>
    </div>
  </div>
);

export const ColorInheritance: Story = () => (
  <div className="flex flex-col gap-6 p-6">
    <h2 className="text-xl font-semibold">CurrentColor Tone Inheritance</h2>
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 rounded-md bg-blue-500/10 px-3 py-1.5 text-blue-500">
        <ObjectIcon type="page" className="size-5" />
        <span className="text-sm font-medium">Blue (page)</span>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-1.5 text-emerald-500">
        <ObjectIcon type="place" className="size-5" />
        <span className="text-sm font-medium">Emerald (place)</span>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-1.5 text-amber-500">
        <ObjectIcon type="atomic-note" className="size-5" />
        <span className="text-sm font-medium">Amber (atomic-note)</span>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-rose-500/10 px-3 py-1.5 text-rose-500">
        <ObjectIcon type="quote" className="size-5" />
        <span className="text-sm font-medium">Rose (quote)</span>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-purple-500/10 px-3 py-1.5 text-purple-500">
        <ObjectIcon type="book" className="size-5" />
        <span className="text-sm font-medium">Purple (book)</span>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-orange-500/10 px-3 py-1.5 text-orange-500">
        <ObjectIcon type="person" className="size-5" />
        <span className="text-sm font-medium">Orange (person)</span>
      </div>
    </div>
  </div>
);
