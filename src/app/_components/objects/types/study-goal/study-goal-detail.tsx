import { ObjectBody } from "@/app/_components/objects/detail/object-blocks";
import { ObjectHeading } from "@/app/_components/objects/detail/object-heading";
import { ObjectProperties } from "@/app/_components/objects/detail/object-properties";
import {
  ObjectDetail,
  ObjectDetailContent,
  ObjectDetailHeader,
} from "@/app/_components/objects/object-detail";
import type { ObjectTypeDetailProps } from "@/app/_components/objects/object-view-types";
import { StudyGoalProgress } from "@/app/_components/objects/types/study-goal/study-goal-progress";

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
