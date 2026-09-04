import type { Story } from "@ladle/react";
import { Button } from "./button";

export const Default: Story = () => <Button>Default Button</Button>;

export const Variants: Story = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Button variant="default">Default</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="link">Link</Button>
  </div>
);

export const Sizes: Story = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Button size="xs">Extra Small</Button>
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
  </div>
);
