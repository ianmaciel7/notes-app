import { ObjectDetail, ObjectDetailContent, ObjectDetailHeader } from "./object-detail";
import { ObjectList, ObjectListContent, ObjectListHeader } from "./object-list";

export const ListAnatomy = () => (
  <ObjectList aria-label="Example object list">
    <ObjectListHeader><h1>Object list</h1></ObjectListHeader>
    <ObjectListContent><p>The type supplies its own results.</p></ObjectListContent>
  </ObjectList>
);

export const DetailAnatomy = () => (
  <ObjectDetail aria-label="Example object detail">
    <ObjectDetailHeader><h1>Object detail</h1></ObjectDetailHeader>
    <ObjectDetailContent><p>The type supplies its own content.</p></ObjectDetailContent>
  </ObjectDetail>
);
