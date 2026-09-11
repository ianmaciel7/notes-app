import { ObjectBody } from "@/components/objects/detail/object-blocks";
import { ObjectHeading } from "@/components/objects/detail/object-heading";
import { ObjectProperties } from "@/components/objects/detail/object-properties";
import {
  ObjectDetail,
  ObjectDetailContent,
  ObjectDetailHeader,
} from "@/components/objects/object-detail";
import type { ObjectTypeDetailProps } from "@/components/objects/object-view-types";
import { StudyGoalProgress } from "@/components/objects/types/study-goal/study-goal-progress";

export function StudyGoalDetail(props: ObjectTypeDetailProps) {
  return (
    <ObjectDetail data-object-view="study-goal-detail">
      <ObjectDetailHeader>
        <ObjectHeading {...props} />
      </ObjectDetailHeader>
      <ObjectDetailContent>
        <StudyGoalProgress entity={props.entity} />
        <ObjectBody entity={props.entity} />
        <ObjectProperties entity={props.entity} />
      </ObjectDetailContent>
    </ObjectDetail>
  );
}
