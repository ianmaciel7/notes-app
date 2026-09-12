import type { Story, StoryDefault } from "@ladle/react";
import { Badge } from "./badge";

export default {
  title: "UI / Badge",
} satisfies StoryDefault;

export const Default: Story = () => <Badge>Badge</Badge>;

export const Variants: Story = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge variant="default">Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="ghost">Ghost</Badge>
    <Badge variant="link">Link</Badge>
  </div>
);
