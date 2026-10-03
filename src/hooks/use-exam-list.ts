"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/firestore";
import type { Card } from "@/types/card";
import type { QuestionObject } from "@/types/object";

export const SCROLL_TO_TOP_THRESHOLD = 400;

export interface UseExamListOptions {
  spaceId: string;
  examId: string;
}

export interface UseExamListResult {
  questions: QuestionObject[];
  cardsByQuestionId: ReadonlyMap<string, Card>;
  loading: boolean;
  error: Error | null;
  showScrollToTop: boolean;
  scrollToTop: () => void;
}

export function useExamList({
  spaceId,
  examId,
}: UseExamListOptions): UseExamListResult {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionObject[]>([]);
  const [cardsByQuestionId, setCardsByQuestionId] = useState<
    ReadonlyMap<string, Card>
  >(new Map());
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState<Error | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const uid = user?.uid;

  useEffect(() => {
    if (!uid) {
      setQuestions([]);
      setCardsByQuestionId(new Map());
      setLoading(false);
      return;
    }

    setLoading(true);
    const spaceRoot = ["users", uid, "spaces", spaceId] as const;

    const questionsQuery = query(
      collection(db, ...spaceRoot, "objects"),
      where("objectTypeId", "==", "question"),
      where("properties.examId", "==", examId),
      orderBy("properties.orderIndex", "asc"),
    );
    const unsubscribeQuestions = onSnapshot(
      questionsQuery,
      (snapshot) => {
        setQuestions(
          snapshot.docs.map(
            (docSnap) =>
              ({ ...docSnap.data(), id: docSnap.id }) as QuestionObject,
          ),
        );
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    const unsubscribeCards = onSnapshot(
      collection(db, ...spaceRoot, "cards"),
      (snapshot) => {
        const next = new Map<string, Card>();
        for (const docSnap of snapshot.docs) {
          const card = { ...docSnap.data(), id: docSnap.id } as Card;
          next.set(card.questionId, card);
        }
        setCardsByQuestionId(next);
      },
      (err) => setError(err),
    );

    return () => {
      unsubscribeQuestions();
      unsubscribeCards();
    };
  }, [uid, spaceId, examId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > SCROLL_TO_TOP_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    questions,
    cardsByQuestionId,
    loading,
    error,
    showScrollToTop,
    scrollToTop,
  };
}
