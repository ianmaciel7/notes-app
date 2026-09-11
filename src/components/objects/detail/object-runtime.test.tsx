import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { objectEntityFixture } from "@/components/objects/object-view-fixtures";
import { FlashcardDetail } from "@/components/objects/types/flashcard/flashcard-detail";
import { TaskDetail } from "@/components/objects/types/task/task-detail";
import { createInitialSRSState } from "@/lib/srs/fsrs";

it("renders the stored flashcard question and answer-reveal action", () => {
  const entity = {
    ...objectEntityFixture({ objectTypeId: "flashcard", type: "flashcard" }),
    front: "What is retrieval practice?",
    back: "Recalling without looking.",
    srs: createInitialSRSState(new Date("2026-01-01T00:00:00.000Z")),
  };
  const markup = renderToStaticMarkup(<FlashcardDetail entity={entity} tabName="Card" />);
  expect(markup).toContain("What is retrieval practice?");
  expect(markup).toContain("Mostrar resposta");
  expect(markup).not.toContain("Recalling without looking.");
});

it("renders task completion and the shared persistent editor", () => {
  const entity = objectEntityFixture({
    objectTypeId: "task",
    type: "task",
    properties: { status: "done" },
  });
  const markup = renderToStaticMarkup(<TaskDetail entity={entity} tabName="Task" />);
  expect(markup).toContain("Reabrir tarefa");
  expect(markup).toContain("Editar objeto");
  expect(markup).toContain("Mover para a lixeira");
});

it("allows correcting a saved weblink with no URL instead of trapping it in a placeholder", async () => {
  const { WeblinkDetail } = await import("@/components/objects/types/weblink/weblink-detail");
  const entity = objectEntityFixture({ objectTypeId: "weblink", type: "weblink" });
  const markup = renderToStaticMarkup(<WeblinkDetail entity={entity} tabName="Link" />);
  expect(markup).toContain("Editar objeto");
  expect(markup).not.toContain("Implementation pending");
});
