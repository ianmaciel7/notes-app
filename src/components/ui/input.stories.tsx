import type { Story, StoryDefault } from "@ladle/react";
import { Input } from "./input";

export default {
  title: "UI / Input",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div className="max-w-xs space-y-2">
    <label htmlFor="default-input" className="text-sm font-medium">
      Username
    </label>
    <Input id="default-input" placeholder="Enter your username..." />
  </div>
);

export const Disabled: Story = () => (
  <div className="max-w-xs space-y-2">
    <label htmlFor="disabled-input" className="text-sm font-medium text-muted-foreground">
      Disabled Input
    </label>
    <Input id="disabled-input" disabled readOnly value="Read only value" />
  </div>
);

export const InputTypes: Story = () => (
  <div className="max-w-xs space-y-4">
    <div className="space-y-1">
      <label htmlFor="type-text" className="text-xs font-medium">Text</label>
      <Input id="type-text" type="text" placeholder="Standard text" />
    </div>
    <div className="space-y-1">
      <label htmlFor="type-email" className="text-xs font-medium">Email</label>
      <Input id="type-email" type="email" placeholder="user@example.com" />
    </div>
    <div className="space-y-1">
      <label htmlFor="type-password" className="text-xs font-medium">Password</label>
      <Input id="type-password" type="password" placeholder="••••••••" />
    </div>
  </div>
);
