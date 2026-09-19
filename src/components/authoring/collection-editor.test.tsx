import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ObjectRecord } from "@/domain/objects/object";
import * as collectionActions from "@/lib/actions/collection-actions";
import {
  type AvailableObject,
  CollectionEditor,
  type CollectionItem,
} from "./collection-editor";

describe("CollectionEditor", () => {
  const initialCollections: CollectionItem[] = [
    {
      id: "col-1",
      title: "Unit 1: Biology",
      lifecycle: "draft",
      memberIds: ["q-1", "q-2"],
      updatedAt: "2026-09-18T00:00:00Z",
    },
    {
      id: "col-2",
      title: "Unit 2: Chemistry",
      lifecycle: "published",
      memberIds: ["exam-1"],
      updatedAt: "2026-09-18T00:00:00Z",
    },
  ];

  const availableObjects: AvailableObject[] = [
    { id: "q-1", title: "Question 1", type: "question", lifecycle: "draft" },
    {
      id: "q-2",
      title: "Question 2",
      type: "question",
      lifecycle: "published",
    },
    { id: "q-3", title: "Question 3", type: "question", lifecycle: "draft" },
    {
      id: "exam-1",
      title: "Midterm Exam",
      type: "exam",
      lifecycle: "published",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders collection list and displays selected collection members", () => {
    render(
      <CollectionEditor
        spaceId="space-1"
        initialCollections={initialCollections}
        availableObjects={availableObjects}
      />,
    );

    expect(
      screen.getAllByText("Unit 1: Biology").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Unit 2: Chemistry")).toBeDefined();
    expect(screen.getByText("Question 1")).toBeDefined();
    expect(screen.getByText("Question 2")).toBeDefined();
    expect(screen.getByText("Available Objects (2)")).toBeDefined();
  });

  it("allows creating a new collection and calls createCollectionAction", async () => {
    const createdCol: ObjectRecord = {
      id: "col-3",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "collection",
      title: "Unit 3: Physics",
      lifecycle: "draft",
      latestRevisionId: "",
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createSpy = vi
      .spyOn(collectionActions, "createCollectionAction")
      .mockResolvedValue({
        ok: true,
        data: createdCol,
      });

    render(
      <CollectionEditor
        spaceId="space-1"
        initialCollections={initialCollections}
        availableObjects={availableObjects}
      />,
    );

    const input = screen.getByLabelText("Collection Title");
    fireEvent.change(input, { target: { value: "Unit 3: Physics" } });

    const submitBtn = screen.getByRole("button", {
      name: /Create Collection/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        title: "Unit 3: Physics",
      });
      expect(
        screen.getAllByText("Unit 3: Physics").length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it("allows adding and removing members, then saving members", async () => {
    const updateSpy = vi
      .spyOn(collectionActions, "updateCollectionMembersAction")
      .mockResolvedValue({
        ok: true,
        data: undefined,
      });

    render(
      <CollectionEditor
        spaceId="space-1"
        initialCollections={initialCollections}
        availableObjects={availableObjects}
      />,
    );

    // Add Question 3 to collection
    const addBtns = screen.getAllByRole("button", { name: /Add/i });
    fireEvent.click(addBtns[0]); // Adds the first unassigned object

    // Save members
    const saveBtn = screen.getByRole("button", {
      name: /Save Collection Members/i,
    });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        collectionId: "col-1",
        memberObjectIds: expect.arrayContaining(["q-1", "q-2"]),
      });
    });
  });

  it("allows archiving a collection", async () => {
    const archiveSpy = vi
      .spyOn(collectionActions, "archiveCollectionAction")
      .mockResolvedValue({
        ok: true,
        data: {
          id: "col-1",
          spaceId: "space-1",
          ownerId: "user-1",
          type: "collection",
          title: "Unit 1: Biology",
          lifecycle: "archived",
          latestRevisionId: "",
          schemaVersion: 1,
          createdAt: "2026-09-18T00:00:00Z",
          updatedAt: "2026-09-18T00:00:00Z",
        },
      });

    render(
      <CollectionEditor
        spaceId="space-1"
        initialCollections={initialCollections}
        availableObjects={availableObjects}
      />,
    );

    const archiveBtn = screen.getByRole("button", { name: /Archive/i });
    fireEvent.click(archiveBtn);

    await waitFor(() => {
      expect(archiveSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        collectionId: "col-1",
      });
    });
  });
});
