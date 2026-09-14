import type { Story, StoryDefault } from "@ladle/react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

export default { title: "Componentes / UI / Toggle Group" } satisfies StoryDefault;

export const Default: Story = () => (
  <ToggleGroup defaultValue={["left"]} aria-label="Text alignment">
    <ToggleGroupItem value="left">Left</ToggleGroupItem>
    <ToggleGroupItem value="center">Center</ToggleGroupItem>
    <ToggleGroupItem value="right">Right</ToggleGroupItem>
  </ToggleGroup>
);
