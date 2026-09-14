import type { Story, StoryDefault } from "@ladle/react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AspectRatio } from "./aspect-ratio";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "./avatar";
import { Checkbox } from "./checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "./empty";
import { Kbd, KbdGroup } from "./kbd";
import { Label } from "./label";
import { Progress } from "./progress";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Slider } from "./slider";
import { Spinner } from "./spinner";
import { Switch } from "./switch";
import { Textarea } from "./textarea";
import { Toggle } from "./toggle";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

export default {
  title: "UI / Components",
} satisfies StoryDefault;

export const Feedback: Story = () => (
  <div className="grid max-w-xl gap-6">
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>This is a standard informational alert.</AlertDescription>
    </Alert>
    <div className="flex items-center gap-3">
      <Spinner aria-label="Loading" />
      <Progress value={64} className="max-w-sm" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export const FormControls: Story = () => (
  <div className="grid max-w-xl gap-6">
    <div className="grid gap-2">
      <Label htmlFor="story-textarea">Notes</Label>
      <Textarea id="story-textarea" placeholder="Write a short note..." />
    </div>
    <div className="flex items-center gap-3">
      <Checkbox id="story-checkbox" />
      <Label htmlFor="story-checkbox">Remember this preference</Label>
    </div>
    <div className="flex items-center justify-between rounded-lg border p-4">
      <Label htmlFor="story-switch">Notifications</Label>
      <Switch id="story-switch" defaultChecked />
    </div>
    <Slider defaultValue={[45]} aria-label="Volume" />
    <RadioGroup defaultValue="comfortable" aria-label="Density" className="gap-3">
      <label className="flex items-center gap-2">
        <RadioGroupItem value="compact" /> Compact
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" /> Comfortable
      </label>
    </RadioGroup>
  </div>
);

export const SelectionControls: Story = () => (
  <div className="grid gap-6">
    <div className="flex flex-wrap gap-3">
      <Toggle>Bold</Toggle>
      <Toggle variant="outline">Italic</Toggle>
      <Toggle size="sm">Small</Toggle>
    </div>
    <ToggleGroup defaultValue={["left"]} aria-label="Text alignment">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  </div>
);

export const ContentPrimitives: Story = () => (
  <div className="grid max-w-xl gap-6">
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>IM</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
    <div className="flex items-center gap-3 text-sm">
      <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
      <Separator orientation="vertical" className="h-5" />
      Keyboard shortcut
    </div>
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>No notes yet</EmptyTitle>
        <EmptyDescription>Create your first note to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent />
    </Empty>
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
      <div className="flex size-full items-center justify-center text-sm text-muted-foreground">16:9 content</div>
    </AspectRatio>
  </div>
);
