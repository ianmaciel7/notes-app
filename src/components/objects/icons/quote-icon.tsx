import * as React from "react";
import type { ObjectIconProps } from "../../../lib/space-object-types";
import { IconBase } from "./icon-base";

export const QuoteIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function QuoteIcon(props, ref) {
    return (
      <IconBase ref={ref} data-icon="quote" {...props}>
        <path
          fill="currentColor"
          d="M100,56H40A16,16,0,0,0,24,72v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,100,56Zm0,80H40V72h60ZM216,56H156a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,216,56Zm0,80H156V72h60Z"
        />
      </IconBase>
    );
  },
);

QuoteIcon.displayName = "QuoteIcon";
export const ObjectQuoteIcon = QuoteIcon;
