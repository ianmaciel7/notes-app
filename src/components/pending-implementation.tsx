import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

type PendingImplementationProps = {
  area?: string;
  className?: string;
  description?: string;
  name: string;
};

export function PendingImplementation({
  area,
  className,
  description,
  name,
}: PendingImplementationProps) {
  return (
    <Empty
      className={["border border-border bg-muted/25", className].filter(Boolean).join(" ")}
      data-slot="pending-implementation"
    >
      <EmptyHeader>
        {area ? (
          <p className="text-xs font-medium uppercase text-muted-foreground">{area}</p>
        ) : null}
        <EmptyTitle>{name}</EmptyTitle>
        <EmptyDescription>Implementation pending</EmptyDescription>
      </EmptyHeader>
      {description ? <EmptyDescription>{description}</EmptyDescription> : null}
    </Empty>
  );
}
