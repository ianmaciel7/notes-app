import type { Story, StoryDefault } from "@ladle/react";
import { Toggle } from "./toggle";

export default { title: "Components / UI / Toggle" } satisfies StoryDefault;

export const Default: Story = () => <Toggle>Bold</Toggle>;
export const Variants: Story = () => <div className="flex gap-3"><Toggle variant="outline">Outline</Toggle><Toggle size="sm">Small</Toggle></div>;
