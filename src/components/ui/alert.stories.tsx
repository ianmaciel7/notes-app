import type { Story, StoryDefault } from "@ladle/react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export default { title: "Components / UI / Alert" } satisfies StoryDefault;

export const Default: Story = () => (
  <Alert className="max-w-xl">
    <AlertTitle>Heads up</AlertTitle>
    <AlertDescription>This is a standard informational alert.</AlertDescription>
  </Alert>
);
