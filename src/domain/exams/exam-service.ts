import type {
  ExamQuestionReference,
  ExamRevisionPayload,
} from "@/domain/exams/exam";
import type { ObjectRecord, ObjectRevision } from "@/domain/objects/object";

export interface ExamRepositoryPort {
  createDraft(
    ownerId: string,
    spaceId: string,
    title: string,
  ): Promise<ObjectRecord>;
  saveRevision(
    ownerId: string,
    spaceId: string,
    objectId: string,
    payload: ExamRevisionPayload,
  ): Promise<ObjectRevision<ExamRevisionPayload>>;
  replaceQuestions(
    ownerId: string,
    spaceId: string,
    objectId: string,
    questionRefs: ExamQuestionReference[],
  ): Promise<void>;
  publish(
    ownerId: string,
    spaceId: string,
    objectId: string,
  ): Promise<ObjectRevision<ExamRevisionPayload>>;
  archive(
    ownerId: string,
    spaceId: string,
    objectId: string,
  ): Promise<ObjectRecord>;
}

export class ExamService {
  constructor(private readonly repo: ExamRepositoryPort) {}

  async create(command: {
    ownerId: string;
    spaceId: string;
    title: string;
  }): Promise<ObjectRecord> {
    return await this.repo.createDraft(
      command.ownerId,
      command.spaceId,
      command.title,
    );
  }

  async saveDraft(command: {
    ownerId: string;
    spaceId: string;
    examId: string;
    payload: ExamRevisionPayload;
  }): Promise<ObjectRevision<ExamRevisionPayload>> {
    return await this.repo.saveRevision(
      command.ownerId,
      command.spaceId,
      command.examId,
      command.payload,
    );
  }

  async replaceQuestions(command: {
    ownerId: string;
    spaceId: string;
    examId: string;
    questionRefs: ExamQuestionReference[];
  }): Promise<void> {
    return await this.repo.replaceQuestions(
      command.ownerId,
      command.spaceId,
      command.examId,
      command.questionRefs,
    );
  }

  async publish(command: {
    ownerId: string;
    spaceId: string;
    examId: string;
  }): Promise<ObjectRevision<ExamRevisionPayload>> {
    return await this.repo.publish(
      command.ownerId,
      command.spaceId,
      command.examId,
    );
  }

  async archive(command: {
    ownerId: string;
    spaceId: string;
    examId: string;
  }): Promise<ObjectRecord> {
    return await this.repo.archive(
      command.ownerId,
      command.spaceId,
      command.examId,
    );
  }
}
