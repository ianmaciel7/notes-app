import type { Story, StoryDefault } from "@ladle/react";
import { Checkbox } from "./checkbox";

export default { title: "UI / Checkbox" } satisfies StoryDefault;

export const Default: Story = () => <Checkbox aria-label="Accept terms" />;
export const Checked: Story = () => <Checkbox defaultChecked aria-label="Accepted" />;
export const Disabled: Story = () => <Checkbox disabled aria-label="Unavailable" />;

