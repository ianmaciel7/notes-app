import type { Story, StoryDefault } from "@ladle/react";
import { AspectRatio } from "./aspect-ratio";

export default { title: "UI / Aspect Ratio" } satisfies StoryDefault;

export const Default: Story = () => (
  <AspectRatio ratio={16 / 9} className="max-w-xl rounded-lg bg-muted">
    <div className="flex size-full items-center justify-center text-sm text-muted-foreground">16:9 content</div>
  </AspectRatio>
);

