import { ObjectBody } from "@/components/objects/detail/object-blocks";
import { ObjectHeading } from "@/components/objects/detail/object-heading";
import { ObjectProperties } from "@/components/objects/detail/object-properties";
import {
  ObjectDetail,
  ObjectDetailContent,
  ObjectDetailHeader,
} from "@/components/objects/object-detail";
import type { ObjectTypeDetailProps } from "@/components/objects/object-view-types";
import { TaskStatus } from "@/components/objects/types/task/task-status";

export function TaskDetail(props: ObjectTypeDetailProps) {
  return (
    <ObjectDetail data-object-view="task-detail">
      <ObjectDetailHeader>
        <ObjectHeading {...props} />
      </ObjectDetailHeader>
      <ObjectDetailContent>
        <TaskStatus entity={props.entity} />
        <ObjectBody entity={props.entity} />
        <ObjectProperties entity={props.entity} />
      </ObjectDetailContent>
    </ObjectDetail>
  );
}
