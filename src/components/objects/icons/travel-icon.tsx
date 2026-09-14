import * as React from "react";
import type { ObjectIconProps } from "../../../lib/space-object-types";
import { IconBase } from "./icon-base";

export const TravelIcon = React.forwardRef<SVGSVGElement, ObjectIconProps>(
  function TravelIcon(props, ref) {
    return (
      <IconBase ref={ref} data-icon="travel" {...props}>
        <path
          fill="currentColor"
          d="M104,88v96a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm24-8a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,128,80Zm32,0a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V88A8,8,0,0,0,160,80Zm48-16V208a16,16,0,0,1-16,16H176v16a8,8,0,0,1-16,0V224H96v16a8,8,0,0,1-16,0V224H64a16,16,0,0,1-16-16V64A16,16,0,0,1,64,48H88V24A24,24,0,0,1,112,0h32a24,24,0,0,1,24,24V48h24A16,16,0,0,1,208,64ZM104,48h48V24a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8Zm88,160V64H64V208H192Z"
        />
      </IconBase>
    );
  },
);

TravelIcon.displayName = "TravelIcon";
export const ObjectTravelIcon = TravelIcon;
