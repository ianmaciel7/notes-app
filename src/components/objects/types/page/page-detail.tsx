import { ObjectBody } from "@/components/objects/detail/object-blocks";
import { ObjectHeading } from "@/components/objects/detail/object-heading";
import { ObjectProperties } from "@/components/objects/detail/object-properties";
import {
  ObjectDetail,
  ObjectDetailContent,
  ObjectDetailHeader,
} from "@/components/objects/object-detail";
import type { ObjectTypeDetailProps } from "@/components/objects/object-view-types";

export function PageDetail(props: ObjectTypeDetailProps) {
  return (
    <ObjectDetail data-object-view="page-detail">
      <ObjectDetailHeader>
        <ObjectHeading {...props} />
      </ObjectDetailHeader>
      <ObjectDetailContent>
        <ObjectBody entity={props.entity} />
        <ObjectProperties entity={props.entity} />
      </ObjectDetailContent>
    </ObjectDetail>
  );
}
