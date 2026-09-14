import type { Story, StoryDefault } from "@ladle/react";
import { Separator } from "./separator";

export default { title: "Componentes / UI / Separator" } satisfies StoryDefault;

export const Horizontal: Story = () => <Separator className="max-w-xl" />;
export const Vertical: Story = () => <Separator orientation="vertical" className="h-8" />;
