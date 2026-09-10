import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type PendingImplementationProps = {
  area?: string;
  className?: string;
  description?: string;
  name: string;
  variant?: "default" | "workspace";
};

export function PendingImplementation({
  area,
  className,
  description,
  name,
  variant = "default",
}: PendingImplementationProps) {
  const content = (
    <>
      <EmptyHeader>
        {area ? (
          <p className="text-xs font-medium uppercase text-muted-foreground">{area}</p>
        ) : null}
        <EmptyTitle>{name}</EmptyTitle>
        <EmptyDescription>Implementation pending</EmptyDescription>
      </EmptyHeader>
      {description ? <EmptyDescription>{description}</EmptyDescription> : null}
    </>
  );

  if (variant === "workspace") {
    return (
      <div
        className={cn(
          "flex h-full min-h-0 w-full items-center justify-center border-0 bg-transparent p-6 text-center",
          className,
        )}
        data-slot="pending-implementation"
        data-variant="workspace"
      >
        <div
          className="max-w-sm text-sm italic leading-6 text-[var(--app-text-subtle)]"
          data-slot="pending-implementation-caption"
        >
          {area ? (
            <p className="text-xs font-medium uppercase not-italic text-[var(--app-text-subtle)]">
              {area}
            </p>
          ) : null}
          <p className="mt-1 font-medium not-italic text-[var(--app-text-secondary)]">{name}</p>
          <p className="mt-1">Implementation pending</p>
          {description ? <p className="mt-1">{description}</p> : null}
        </div>
      </div>
    );
  }

  const variantClassName = "border border-border bg-muted/25";

  return (
    <Empty
      className={cn(variantClassName, className)}
      data-slot="pending-implementation"
      data-variant={variant}
    >
      {content}
    </Empty>
  );
}
