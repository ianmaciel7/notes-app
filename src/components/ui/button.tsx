import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workspace-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        ghost:
          "text-workspace-muted hover:bg-workspace-hover hover:text-workspace-text",
        outline:
          "border border-workspace-border bg-workspace-surface text-workspace-muted hover:bg-workspace-hover hover:text-workspace-text",
        selected:
          "bg-workspace-selected text-workspace-text hover:bg-workspace-selected",
      },
      size: {
        default: "h-8 px-3",
        icon: "size-8",
        sm: "h-7 px-2.5 text-xs",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "ghost",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
