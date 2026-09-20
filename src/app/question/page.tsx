import { ObjectList } from "@/components/recall/object-list";
import { WorkspaceFrame } from "@/components/workspace-frame";
import { requireSnapshot } from "@/lib/workspace";

export default async function QuestionPage() {
  const data = await requireSnapshot();
  return (
    <WorkspaceFrame
      title="Questions"
      eyebrow="All objects"
      data={data}
      active="question"
    >
      {!data.spaceId ? (
        <p className="mt-10 rounded-lg border border-hairline bg-surface-soft p-6 text-sm text-muted-foreground">
          Create a Space first, then add your first object.
        </p>
      ) : (
        <ObjectList data={data} />
      )}
    </WorkspaceFrame>
  );
}
