import * as React from "react";
import type { ObjectIconProps } from "../../../lib/space-object-types";
import { ObjectIcon } from "./object-icon";

export const ImageIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function ImageIcon(props, ref) {
    return (
      <ObjectIcon ref={ref} data-icon="image" {...props}>
        <path
          fill="currentColor"
          d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"
        />
      </ObjectIcon>
    );
  },
);

ImageIcon.displayName = "ImageIcon";
export const ObjectImageIcon = ImageIcon;
