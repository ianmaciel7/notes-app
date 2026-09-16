import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StudyCard } from "@/components/study/study-card";
import type { CardRecord } from "@/data/types";

const ankiCard: CardRecord = {
  id: "card-1",
  deckId: "deck-1",
  type: "anki",
  front: "Qual é a capital do Brasil?",
  back: "Brasília",
  createdAt: "2026-09-15T12:00:00.000Z",
  updatedAt: "2026-09-15T12:00:00.000Z",
};

const readwiseCard: CardRecord = {
  id: "card-2",
  deckId: "deck-1",
  type: "readwise",
  front: "Você não atinge o nível dos seus objetivos. Você cai para o nível dos seus sistemas.",
  back: "Focar em processos diários e hábitos ao invés de apenas metas finais.",
  sourceTitle: "Hábitos Atômicos",
  sourceAuthor: "James Clear",
  sourceUrl: "https://jamesclear.com",
  createdAt: "2026-09-15T12:00:00.000Z",
  updatedAt: "2026-09-15T12:00:00.000Z",
};

const examTopicCard: CardRecord = {
  id: "card-3",
  deckId: "deck-1",
  type: "exam_topic",
  front: "Qual serviço AWS é ideal para computação serverless baseada em eventos?",
  back: "AWS Lambda",
  options: [
    { id: "opt-1", text: "Amazon EC2", isCorrect: false },
    { id: "opt-2", text: "AWS Lambda", isCorrect: true },
    { id: "opt-3", text: "Amazon RDS", isCorrect: false },
  ],
  explanation: "O AWS Lambda executa código sem provisionamento ou gerenciamento de servidores.",
  createdAt: "2026-09-15T12:00:00.000Z",
  updatedAt: "2026-09-15T12:00:00.000Z",
};

describe("StudyCard", () => {
  describe("Anki mode", () => {
    it("reveals the answer before accepting a rating", async () => {
      const onRate = vi.fn();
      const user = userEvent.setup();

      render(<StudyCard card={ankiCard} now={new Date("2026-09-15T12:00:00.000Z")} onRate={onRate} />);

      expect(screen.getByText(ankiCard.front)).toBeInTheDocument();
      expect(screen.queryByText(ankiCard.back)).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Mostrar resposta" }));
      expect(screen.getByText(ankiCard.back)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /Bom/ }));
      expect(onRate).toHaveBeenCalledWith("good");
    });

    it("blocks rating controls while a review is being saved", async () => {
      const onRate = vi.fn();
      const user = userEvent.setup();

      render(<StudyCard card={ankiCard} now={new Date("2026-09-15T12:00:00.000Z")} onRate={onRate} disabled />);

      expect(screen.getByRole("button", { name: "Mostrar resposta" })).toBeDisabled();
      await user.keyboard(" ");
      expect(screen.queryByText(ankiCard.back)).not.toBeInTheDocument();
      expect(onRate).not.toHaveBeenCalled();
    });

    it("reveals and rates card using keyboard shortcuts (Space and keys 1-4)", async () => {
      const onRate = vi.fn();
      const user = userEvent.setup();

      render(<StudyCard card={ankiCard} now={new Date("2026-09-15T12:00:00.000Z")} onRate={onRate} />);

      expect(screen.queryByText(ankiCard.back)).not.toBeInTheDocument();

      // Space reveals answer
      await user.keyboard(" ");
      expect(screen.getByText(ankiCard.back)).toBeInTheDocument();

      // Key '3' triggers 'good' rating
      await user.keyboard("3");
      expect(onRate).toHaveBeenCalledWith("good");
    });
  });

  describe("Readwise mode", () => {
    it("renders quote, source, author and reveals reflection notes", async () => {
      const onRate = vi.fn();
      const user = userEvent.setup();

      render(<StudyCard card={readwiseCard} now={new Date("2026-09-15T12:00:00.000Z")} onRate={onRate} />);

      expect(screen.getByText(/Você não atinge o nível dos seus objetivos/)).toBeInTheDocument();
      expect(screen.getByText(/Hábitos Atômicos/)).toBeInTheDocument();
      expect(screen.getByText(/James Clear/)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /Ver anotações & avaliar/ }));
      expect(screen.getByText(readwiseCard.back)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /Fácil/ }));
      expect(onRate).toHaveBeenCalledWith("easy");
    });
  });

  describe("ExamTopics mode", () => {
    it("renders options, validates selection and reveals technical explanation", async () => {
      const onRate = vi.fn();
      const user = userEvent.setup();

      render(<StudyCard card={examTopicCard} now={new Date("2026-09-15T12:00:00.000Z")} onRate={onRate} />);

      expect(screen.getByText(examTopicCard.front)).toBeInTheDocument();
      expect(screen.getByText("Amazon EC2")).toBeInTheDocument();
      expect(screen.getByText("AWS Lambda")).toBeInTheDocument();

      // Click option AWS Lambda
      await user.click(screen.getByText("AWS Lambda"));

      // Click verify answer
      await user.click(screen.getByRole("button", { name: "Verificar resposta" }));

      // Check feedback and explanation
      expect(screen.getByText("Acertou!")).toBeInTheDocument();
      expect(screen.getByText(examTopicCard.explanation!)).toBeInTheDocument();

      // Rating bar is now available
      await user.click(screen.getByRole("button", { name: /Bom/ }));
      expect(onRate).toHaveBeenCalledWith("good");
    });
  });
});
