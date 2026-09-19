export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "true-false"
  | "drag-and-drop"
  | "hotspot"
  | "case-study";

export interface CaseStudyTab {
  id?: string;
  title: string;
  content: string;
}

export interface CaseStudyContext {
  title: string;
  tabs: CaseStudyTab[];
}

export interface QuestionOption {
  id: string;
  text: string;
  explanation?: string;
}

/**
 * Bounding box coordinates expressed as percentage [x, y, width, height]
 * where values are between 0 and 100.
 */
export type HotspotBoundingBox = [
  x: number,
  y: number,
  width: number,
  height: number,
];

export interface HotspotArea {
  id: string;
  label?: string;
  coordinates: HotspotBoundingBox;
}

export interface DragAndDropItem {
  id: string;
  text: string;
}

export interface DragAndDropSlot {
  id: string;
  label: string;
  acceptedItemIds?: string[];
}

export type SingleChoiceAnswer = string;
export type MultipleChoiceAnswer = string[];
export type DragAndDropAnswer = Record<string, string>;
export type HotspotAnswer = string[];
export type CaseStudyAnswer = string | string[] | Record<string, string>;

export type CorrectAnswer =
  | SingleChoiceAnswer
  | MultipleChoiceAnswer
  | DragAndDropAnswer
  | HotspotAnswer
  | CaseStudyAnswer;

export interface QuestionExplanation {
  general: string;
  options?: Record<string, string>;
  references?: Array<{ title: string; url: string }>;
}

export interface Question {
  id: string;
  examId: string;
  domainId: string;
  type: QuestionType;
  prompt: string;
  options?: QuestionOption[];
  caseStudy?: CaseStudyContext;
  hotspotImage?: string;
  hotspotAreas?: HotspotArea[];
  dragDropItems?: DragAndDropItem[];
  dragDropSlots?: DragAndDropSlot[];
  correctAnswer: CorrectAnswer;
  explanation: QuestionExplanation;
  order?: number;
  difficulty?: "easy" | "medium" | "hard";
  createdAt?: string;
  updatedAt?: string;
}
