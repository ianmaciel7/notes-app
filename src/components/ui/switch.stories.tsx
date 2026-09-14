import type { Story, StoryDefault } from "@ladle/react";
import { Switch } from "./switch";

export default { title: "UI / Switch" } satisfies StoryDefault;

export const Default: Story = () => <Switch aria-label="Notifications" />;
export const Checked: Story = () => <Switch defaultChecked aria-label="Notifications enabled" />;
export const Disabled: Story = () => <Switch disabled aria-label="Unavailable" />;

