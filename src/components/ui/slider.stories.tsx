import type { Story, StoryDefault } from "@ladle/react";
import { Slider } from "./slider";

export default { title: "UI / Slider" } satisfies StoryDefault;

export const Default: Story = () => <Slider defaultValue={[45]} aria-label="Volume" className="max-w-xl" />;
export const Range: Story = () => <Slider defaultValue={[25, 75]} aria-label="Range" className="max-w-xl" />;

