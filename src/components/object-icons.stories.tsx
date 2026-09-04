import type { Story } from "@ladle/react";

import { ObjectIconBadge, objectTypeDefinitions } from "./object-icons";

export const ObjectIconBadgeGallery: Story = () => (
  <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {objectTypeDefinitions.map(({ id, label, icon: Icon, tone }) => (
      <div
        key={id}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center hover:bg-muted"
      >
        <ObjectIconBadge icon={Icon} tone={tone} variant="default" />
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{tone}</span>
      </div>
    ))}
  </div>
);

export const BadgeVariants: Story = () => {
  const sample = objectTypeDefinitions[0];
  if (!sample) return null;
  const Icon = sample.icon;

  return (
    <div className="flex items-center gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <ObjectIconBadge icon={Icon} tone={sample.tone} variant="default" />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ObjectIconBadge icon={Icon} tone={sample.tone} variant="menu" />
        <span className="text-xs text-muted-foreground">Menu</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ObjectIconBadge icon={Icon} tone={sample.tone} variant="sidebar" />
        <span className="text-xs text-muted-foreground">Sidebar</span>
      </div>
    </div>
  );
};
