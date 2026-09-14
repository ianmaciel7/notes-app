import type { Story, StoryDefault } from "@ladle/react";
import { Skeleton } from "./skeleton";

export default { title: "Componentes / UI / Skeleton" } satisfies StoryDefault;

export const Default: Story = () => <Skeleton className="h-10 w-64" />;
export const Card: Story = () => <div className="grid w-80 gap-3"><Skeleton className="h-32 w-full" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></div>;
