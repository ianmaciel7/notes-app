import type { Story, StoryDefault } from "@ladle/react";

import { AppFocusModeControls, AppHeader, AppHeaderAction, AppHeaderHistory } from "./app-header";
import { AppHeaderCircleDashedIcon } from "./app-header-icons";

export default {
  title: "Components / App Header",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div className="w-full overflow-hidden rounded-lg border bg-background">
    <AppHeader
      backDisabled={false}
      forwardDisabled={true}
      onBack={() => alert("Back clicked")}
      onForward={() => alert("Forward clicked")}
      onFocus={() => alert("Focus mode clicked")}
    >
      <div className="px-4 text-sm font-medium text-muted-foreground">Header Center Title</div>
    </AppHeader>
  </div>
);

export const HistoryControls: Story = () => (
  <div className="flex items-center gap-4 p-4">
    <AppHeaderHistory
      backDisabled={false}
      forwardDisabled={true}
      onBack={() => alert("Back")}
      onForward={() => alert("Forward")}
    />
  </div>
);

export const SingleAction: Story = () => (
  <div className="flex items-center gap-2 p-4">
    <AppHeaderAction tooltip="Custom Tooltip Action" onClick={() => alert("Clicked")}>
      <AppHeaderCircleDashedIcon className="size-4" />
    </AppHeaderAction>
  </div>
);

export const FocusMode: Story = () => (
  <div className="relative h-48 w-full rounded-lg border bg-muted/20 p-4">
    <AppFocusModeControls
      onBack={() => alert("Back")}
      onForward={() => alert("Forward")}
      onExit={() => alert("Exit focus mode")}
    />
  </div>
);
