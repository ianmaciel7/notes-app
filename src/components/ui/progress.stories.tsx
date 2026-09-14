import type { Story, StoryDefault } from "@ladle/react";
import { Progress } from "./progress";

export default { title: "Componentes / UI / Progress" } satisfies StoryDefault;

export const Default: Story = () => <Progress value={64} className="max-w-xl" />;
export const Empty: Story = () => <Progress value={0} className="max-w-xl" />;
