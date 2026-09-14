import type { Story, StoryDefault } from "@ladle/react";
import { Textarea } from "./textarea";

export default { title: "Componentes / UI / Textarea" } satisfies StoryDefault;

export const Default: Story = () => <Textarea placeholder="Write a short note..." className="max-w-xl" />;
export const Filled: Story = () => <Textarea defaultValue="A note with existing content." className="max-w-xl" />;
export const Disabled: Story = () => <Textarea disabled placeholder="Unavailable" className="max-w-xl" />;
