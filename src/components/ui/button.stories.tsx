import type { Story } from "@ladle/react";
import { PlusIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "./button";

type ButtonStoryProps = ComponentProps<typeof Button>;

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

const sizes = ["default", "xs", "sm", "lg"] as const;

const iconSizes = ["icon", "icon-xs", "icon-sm", "icon-lg"] as const;

export const Default: Story<ButtonStoryProps> = (args) => (
  <Button {...args}>Button</Button>
);

Default.args = {
  variant: "default",
  size: "default",
};

export const Variants: Story = () => (
  <div className="flex flex-wrap items-center gap-3">
    {variants.map((variant) => (
      <Button key={variant} variant={variant}>
        {variant}
      </Button>
    ))}
  </div>
);

export const Sizes: Story = () => (
  <div className="flex flex-wrap items-center gap-3">
    {sizes.map((size) => (
      <Button key={size} size={size}>
        {size}
      </Button>
    ))}
    {iconSizes.map((size) => (
      <Button key={size} size={size} aria-label={`Add (${size})`}>
        <PlusIcon />
      </Button>
    ))}
  </div>
);
