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
      <Empty
        className={cn("border-0 bg-transparent p-6", className)}
        data-slot="pending-implementation"
        data-variant="workspace"
      >
        <div
          className="flex w-[min(100%,19rem)] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center"
          data-slot="pending-implementation-card"
        >
          {content}
        </div>
      </Empty>
    );
  }

  const variantClassName =
    variant === "workspace" ? "border-0 bg-transparent" : "border border-border bg-muted/25";

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
