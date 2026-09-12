import * as React from "react";
import type { ObjectIconProps } from "../../../lib/space-object-types";

export const IconBase = React.forwardRef<SVGSVGElement, ObjectIconProps>(function IconBase(
  { children, className, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden="true"
      role="img"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
});

IconBase.displayName = "IconBase";
