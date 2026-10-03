import Image from "next/image";
import type { ComponentProps } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

type QuestionImageItemProps = Omit<
  ComponentProps<typeof AspectRatio>,
  "children" | "ratio"
> & {
  url: string;
  alt: string;
};

/**
 * A fixed-ratio frame so a remote image never shifts the layout while loading.
 * Author-supplied hosts are not known ahead of time, so the image is served
 * as-is (`unoptimized`) instead of through the optimizer.
 */
function QuestionImageItem({
  url,
  alt,
  className,
  ...props
}: QuestionImageItemProps) {
  return (
    <AspectRatio
      data-slot="question-image-item"
      ratio={16 / 9}
      {...props}
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border bg-muted/30",
        className,
      )}
    >
      <Image
        src={url}
        alt={alt}
        fill
        unoptimized
        sizes="(min-width: 768px) 42rem, 100vw"
        className="object-contain"
      />
    </AspectRatio>
  );
}

export { QuestionImageItem, type QuestionImageItemProps };
