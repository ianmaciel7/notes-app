"use client";

import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const workspaceCompoundControlClass =
  "transition-[background-color,border-color,color,opacity,transform] duration-250 ease-out motion-reduce:transition-none";

function CompoundChip({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="compound-chip"
      className={cn(
        "inline-flex shrink-0 items-stretch overflow-hidden whitespace-nowrap rounded-[0.475em] border leading-[1.3]",
        workspaceCompoundControlClass,
        className,
      )}
      {...props}
    />
  );
}

function CompoundChipPrimary({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-slot="compound-chip-primary"
      type={type}
      className={cn(
        "inline-flex min-h-6 min-w-0 items-center py-[0.2em] pl-[0.49em] pr-[0.214em] outline-none hover:brightness-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 active:brightness-[0.94]",
        workspaceCompoundControlClass,
        className,
      )}
      {...props}
    />
  );
}

function CompoundChipDisclosure({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      data-slot="compound-chip-disclosure"
      type={type}
      className={cn(
        "inline-flex min-h-6 items-center justify-center self-stretch border-l border-current/25 px-[0.43em] outline-none hover:brightness-[0.97] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 active:brightness-[0.94]",
        workspaceCompoundControlClass,
        className,
      )}
      {...props}
    />
  );
}

export { CompoundChip, CompoundChipDisclosure, CompoundChipPrimary };
