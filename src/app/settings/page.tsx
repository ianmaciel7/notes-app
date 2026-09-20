import { listSpaceApiKeys } from "@/actions/api-keys";
import { ApiKeysCard } from "@/components/recall/api-keys-card";
import { Card, CardContent } from "@/components/ui/card";
import { WorkspaceFrame } from "@/components/workspace-frame";
import { requireSnapshot } from "@/lib/workspace";

export default async function SettingsPage() {
  const data = await requireSnapshot();
  const isOwner =
    data.spaces.find((space) => space.id === data.spaceId)?.ownerId ===
    data.uid;
  const keys = isOwner ? await listSpaceApiKeys(data.spaceId) : [];
  return (
    <WorkspaceFrame
      title="Settings"
      eyebrow="Space settings"
      data={data}
      active="settings"
    >
      {isOwner ? (
        <ApiKeysCard spaceId={data.spaceId} keys={keys} />
      ) : (
        <Card className="mt-8 border-hairline bg-surface-soft shadow-none">
          <CardContent className="p-6 text-sm text-muted-foreground">
            {data.spaceId
              ? "Only the Space owner can manage API keys."
              : "Create a Space first — settings apply per Space."}
          </CardContent>
        </Card>
      )}
    </WorkspaceFrame>
  );
}
