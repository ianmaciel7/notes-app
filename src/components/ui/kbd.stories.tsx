import type { Story, StoryDefault } from "@ladle/react";
import { Kbd, KbdGroup } from "./kbd";

export default { title: "Componentes / UI / Keyboard" } satisfies StoryDefault;

export const Default: Story = () => <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>;
