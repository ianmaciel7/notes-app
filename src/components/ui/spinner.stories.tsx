import type { Story, StoryDefault } from "@ladle/react";
import { Spinner } from "./spinner";

export default { title: "Componentes / UI / Spinner" } satisfies StoryDefault;

export const Default: Story = () => <Spinner aria-label="Loading" />;
export const Large: Story = () => <Spinner className="size-8" aria-label="Loading" />;
