import * as React from "react";
import type { ObjectIconProps } from "@/lib/space-object-types";
import { ObjectIcon } from "./object-icon";

export const AudioIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function AudioIcon(props, ref) {
    return (
      <ObjectIcon ref={ref} data-icon="audio" {...props}>
        <path
          fill="currentColor"
          d="M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z"
        />
      </ObjectIcon>
    );
  },
);

AudioIcon.displayName = "AudioIcon";
export const ObjectAudioIcon = AudioIcon;
