"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import type { Story, StoryDefault } from "@ladle/react";

export default {
  title: "Editor / BlockNote",
} satisfies StoryDefault;

export const Default: Story = () => {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        props: {
          level: 1,
        },
        content: "Welcome to BlockNote in Ladle",
      },
      {
        type: "paragraph",
        content:
          "This is a live, block-based rich text editor running inside the Ladle component workbench. You can type slash '/' to open block commands, edit text inline, and structure notes dynamically.",
      },
      {
        type: "bulletListItem",
        content: "First block item with fast Vite HMR",
      },
      {
        type: "bulletListItem",
        content: "Styled seamlessly with shadcn/ui & Tailwind CSS v4",
      },
      {
        type: "paragraph",
        content: "Try highlighting this text to test the formatting bubble menu!",
      },
    ],
  });

  return (
    <div className="p-6 max-w-3xl mx-auto border rounded-xl bg-background shadow-xs">
      <BlockNoteView editor={editor} />
    </div>
  );
};
