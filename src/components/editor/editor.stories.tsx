"use client";

import type { Story, StoryDefault } from "@ladle/react";
import { BasicBlocksPlugin, BasicMarksPlugin } from "@platejs/basic-nodes/react";
import { Plate, usePlateEditor } from "platejs/react";
import { Editor, EditorContainer } from "@/components/ui/editor";

export default {
  title: "Editor / Plate",
} satisfies StoryDefault;

export const Default: Story = () => {
  const editor = usePlateEditor({
    plugins: [BasicBlocksPlugin, BasicMarksPlugin],
    value: [
      {
        type: "h1",
        children: [{ text: "Welcome to Plate in Ladle" }],
      },
      {
        type: "p",
        children: [
          {
            text: "This is a live rich-text editor powered by Plate and Slate, rendering seamlessly in the Ladle component workbench with shadcn/ui styling.",
          },
        ],
      },
      {
        type: "p",
        children: [
          {
            text: "It supports rich text marks like ",
          },
          {
            bold: true,
            text: "bold text",
          },
          {
            text: ", ",
          },
          {
            italic: true,
            text: "italic text",
          },
          {
            text: ", and full block management.",
          },
        ],
      },
    ],
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Plate editor={editor}>
        <EditorContainer className="border rounded-xl p-4 bg-background shadow-xs min-h-[300px]">
          <Editor placeholder="Type your notes here..." />
        </EditorContainer>
      </Plate>
    </div>
  );
};
