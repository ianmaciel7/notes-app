import { ObjectBody } from "@/app/_components/objects/detail/object-blocks";
import { ObjectHeading } from "@/app/_components/objects/detail/object-heading";
import { ObjectProperties } from "@/app/_components/objects/detail/object-properties";
import {
  ObjectDetail,
  ObjectDetailContent,
  ObjectDetailHeader,
} from "@/app/_components/objects/object-detail";
import type { ObjectTypeDetailProps } from "@/app/_components/objects/object-view-types";

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
