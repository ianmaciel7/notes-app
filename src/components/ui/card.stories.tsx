import type { Story, StoryDefault } from "@ladle/react";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

export default {
  title: "UI / Card",
} satisfies StoryDefault;

export const Default: Story = () => (
  <Card className="max-w-md">
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>A brief description of this card component.</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">
        This is the main body content of the card showcasing default styling and typography.
      </p>
    </CardContent>
    <CardFooter className="flex justify-end gap-2">
      <Button variant="outline" size="sm">
        Cancel
      </Button>
      <Button size="sm">Action</Button>
    </CardFooter>
  </Card>
);

export const WithAction: Story = () => (
  <Card className="max-w-md">
    <CardHeader>
      <CardTitle>Card With Header Action</CardTitle>
      <CardDescription>Action placed directly in header</CardDescription>
      <CardAction>
        <Button variant="outline" size="xs">
          Settings
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">
        Header actions are neatly aligned to the upper right corner using container queries.
      </p>
    </CardContent>
  </Card>
);

export const SmallSize: Story = () => (
  <Card size="sm" className="max-w-sm">
    <CardHeader>
      <CardTitle>Compact Card</CardTitle>
      <CardDescription>Size variant set to sm</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-xs">
        Compact cards reduce spacing and font sizes for high-density dashboards.
      </p>
    </CardContent>
  </Card>
);
