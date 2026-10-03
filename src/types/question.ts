export const QUESTION_TYPES = [
  "single-choice",
  "multiple-choice",
  "true-false",
  "fill-blank",
  "matching",
  "drag-and-drop",
  "hotspot",
  "case-study",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export type AnswerProvenance =
  | "official"
  | "suggested"
  | "community"
  | "user"
  | "ai";

export interface GroundedExplanation {
  text: string;
  referenceUrls: string[];
  answerProvenance: AnswerProvenance;
}

export interface QuestionImage {
  url: string;
  alt: string;
}

export interface QuestionSource {
  label: string;
  url?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  explanation?: string;
  imageUrl?: string;
  imageAlt?: string;
}

/** A selectable or draggable entry in matching and drag-and-drop questions. */
export interface QuestionItem {
  id: string;
  text: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface QuestionSlot {
  id: string;
  label: string;
}

/** Hotspot geometry in percentages (0-100) of the image width and height. */
export type HotspotShape =
  | { kind: "rect"; x: number; y: number; width: number; height: number }
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "polygon"; points: { x: number; y: number }[] };

export interface HotspotArea {
  id: string;
  label: string;
  shape: HotspotShape;
  explanation?: string;
}

export interface CaseStudySection {
  id: string;
  title: string;
  content: string;
}

export type QuestionDifficulty = "easy" | "medium" | "hard";

/** Fields shared by every question type. */
export interface QuestionBase {
  prompt: string;
  promptImage?: QuestionImage;
  explanation?: GroundedExplanation;
  source?: QuestionSource;
  examId: string;
  orderIndex: number;
  difficulty?: QuestionDifficulty;
  tags?: string[];
}

export type TrueFalseValue = "true" | "false";

/** A case-study sub-question: a stem without its key (the key lives in `correctAnswer`). */
export type CaseStudyPart = {
  id: string;
  prompt: string;
  explanation?: string;
} & (
  | { type: "single-choice"; options: QuestionOption[] }
  | { type: "multiple-choice"; options: QuestionOption[] }
  | { type: "true-false"; options: QuestionOption[] }
  | { type: "fill-blank" }
);

/** Answer for one case-study part: option id(s), accepted answers, or typed text. */
export type CaseStudyPartAnswer = string | string[];

export type QuestionBody =
  | {
      type: "single-choice";
      options: QuestionOption[];
      correctAnswer: string;
    }
  | {
      type: "multiple-choice";
      options: QuestionOption[];
      correctAnswer: string[];
    }
  | {
      type: "true-false";
      options: QuestionOption[];
      correctAnswer: TrueFalseValue;
    }
  | { type: "fill-blank"; correctAnswer: string[] }
  | {
      type: "matching";
      leftItems: QuestionItem[];
      rightItems: QuestionItem[];
      correctAnswer: Record<string, string>;
    }
  | {
      type: "drag-and-drop";
      items: QuestionItem[];
      slots: QuestionSlot[];
      correctAnswer: Record<string, string>;
    }
  | {
      type: "hotspot";
      image: QuestionImage;
      areas: HotspotArea[];
      correctAnswer: string[];
    }
  | {
      type: "case-study";
      title: string;
      context: string;
      sections: CaseStudySection[];
      parts: CaseStudyPart[];
      correctAnswer: Record<string, CaseStudyPartAnswer>;
    };

export type QuestionProperties = QuestionBase & QuestionBody;

export type QuestionPropertiesOf<T extends QuestionType> = Extract<
  QuestionProperties,
  { type: T }
>;

/** The answer a learner sent, tagged with the question type it answers. */
export type SubmittedAnswer =
  | { type: "single-choice"; value: string }
  | { type: "multiple-choice"; value: string[] }
  | { type: "true-false"; value: TrueFalseValue }
  | { type: "fill-blank"; value: string }
  | { type: "matching"; value: Record<string, string> }
  | { type: "drag-and-drop"; value: Record<string, string> }
  | { type: "hotspot"; value: string[] }
  | { type: "case-study"; value: Record<string, CaseStudyPartAnswer> };
