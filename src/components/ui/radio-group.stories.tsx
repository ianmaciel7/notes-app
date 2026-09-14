import type { Story, StoryDefault } from "@ladle/react";
import { RadioGroup, RadioGroupItem } from "./radio-group";

export default { title: "Componentes / UI / Radio Group" } satisfies StoryDefault;

export const Default: Story = () => (
  <RadioGroup defaultValue="comfortable" aria-label="Density" className="gap-3">
    <label className="flex items-center gap-2"><RadioGroupItem value="compact" /> Compact</label>
    <label className="flex items-center gap-2"><RadioGroupItem value="comfortable" /> Comfortable</label>
  </RadioGroup>
);
