import type {
  ObjectRecord,
  ObjectRevision,
  SpaceObjectType,
} from "@/domain/objects/object";
import {
  parseQuestionRevision,
  type QuestionRevisionPayload,
} from "@/domain/questions/question";

export interface QuestionRepositoryPort {
  createDraft(
    ownerId: string,
    spaceId: string,
    type: SpaceObjectType,
    title: string,
  ): Promise<ObjectRecord>;
  saveRevision(
    ownerId: string,
    spaceId: string,
    objectId: string,
    payload: QuestionRevisionPayload,
  ): Promise<ObjectRevision<QuestionRevisionPayload>>;
  publish(
    ownerId: string,
    spaceId: string,
    objectId: string,
  ): Promise<ObjectRevision<unknown>>;
  archive(
    ownerId: string,
    spaceId: string,
    objectId: string,
  ): Promise<ObjectRecord>;
}

export class QuestionService {
  constructor(private readonly repo: QuestionRepositoryPort) {}

  async create(command: {
    ownerId: string;
    spaceId: string;
    title: string;
    payload?: unknown;
  }): Promise<ObjectRecord> {
    const object = await this.repo.createDraft(
      command.ownerId,
      command.spaceId,
      "question",
      command.title,
    );

    if (command.payload !== undefined) {
      const validatedPayload = parseQuestionRevision(command.payload);
      await this.repo.saveRevision(
        command.ownerId,
        command.spaceId,
        object.id,
        validatedPayload,
      );
    }

    return object;
  }

  async saveDraft(command: {
    ownerId: string;
    spaceId: string;
    questionId: string;
    payload: unknown;
  }): Promise<ObjectRevision<QuestionRevisionPayload>> {
    const validatedPayload = parseQuestionRevision(command.payload);
    return await this.repo.saveRevision(
      command.ownerId,
      command.spaceId,
      command.questionId,
      validatedPayload,
    );
  }

  async publish(command: {
    ownerId: string;
    spaceId: string;
    questionId: string;
  }): Promise<ObjectRevision<unknown>> {
    return await this.repo.publish(
      command.ownerId,
      command.spaceId,
      command.questionId,
    );
  }

  async archive(command: {
    ownerId: string;
    spaceId: string;
    questionId: string;
  }): Promise<ObjectRecord> {
    return await this.repo.archive(
      command.ownerId,
      command.spaceId,
      command.questionId,
    );
  }
}
