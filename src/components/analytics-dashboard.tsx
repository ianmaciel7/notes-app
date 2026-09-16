"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Edit2,
  Filter,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { CardDialog } from "@/components/card-dialog";
import { GoalsCard } from "@/components/goals-card";
import { SpaceLayout } from "@/components/space-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { db, updateCard } from "@/data/db";
import type { CardRecord } from "@/data/types";
import {
  calculateErrorStats,
  identifyProblematicCards,
} from "@/domain/error-analysis";
import { calculateGoalsProgress } from "@/domain/goals";

export interface AnalyticsDashboardProps extends React.ComponentProps<typeof SpaceLayout> {}

export function AnalyticsDashboard({
  className,
  active = "analytics",
  ...props
}: AnalyticsDashboardProps = {}) {
  const [selectedDeckId, setSelectedDeckId] = useState<string>("all");
  const [editingCard, setEditingCard] = useState<CardRecord | null>(null);

  const decks = useLiveQuery(() => db.decks.toArray(), []);
  const cards = useLiveQuery(() => db.cards.toArray(), []);
  const schedules = useLiveQuery(() => db.schedules.toArray(), []);
  const reviewLogs = useLiveQuery(() => db.reviewLogs.toArray(), []);
  const settings = useLiveQuery(() => db.settings.get("global"), []);

  const now = useMemo(() => new Date(), []);

  const goalsProgress = useMemo(() => {
    return calculateGoalsProgress(reviewLogs || [], settings, now);
  }, [reviewLogs, settings, now]);

  const errorStats = useMemo(() => {
    return calculateErrorStats(reviewLogs || [], schedules || []);
  }, [reviewLogs, schedules]);

  const allProblematicCards = useMemo(() => {
    if (!cards || !schedules || !reviewLogs || !decks) return [];
    return identifyProblematicCards(cards, schedules, reviewLogs, decks);
  }, [cards, schedules, reviewLogs, decks]);

  const filteredCards = useMemo(() => {
    if (selectedDeckId === "all") return allProblematicCards;
    return allProblematicCards.filter((card) => card.deckId === selectedDeckId);
  }, [allProblematicCards, selectedDeckId]);

  if (!decks || !cards || !schedules || !reviewLogs) {
    return (
      <SpaceLayout active={active} className={className} {...props}>
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-12 text-center text-muted-foreground text-sm">
          Carregando dados de desempenho...
        </div>
      </SpaceLayout>
    );
  }

  const handleEditCardSubmit = async (values: { front: string; back: string }) => {
    if (!editingCard) return;
    await updateCard(db, editingCard.id, values);
    setEditingCard(null);
  };

  const totalLogs = errorStats.totalReviews;

  return (
    <SpaceLayout active={active} className={className} {...props}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
        {/* Page Heading */}
        <section className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Desempenho e Metas</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Análise de Estudos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acompanhe seu ritmo de revisões, retenção de memória e corrija as questões com mais erros.
            </p>
          </div>
          {allProblematicCards.length > 0 ? (
            <Button
              render={<Link href="/study/mistakes" />}
              nativeButton={false}
              className="gap-2 shrink-0"
            >
              <RotateCcw size={16} />
              <span>Praticar questões erradas</span>
            </Button>
          ) : null}
        </section>

        {/* Goals Progress Widget */}
        <section>
          <GoalsCard goalsProgress={goalsProgress} />
        </section>

        {/* KPI Metrics Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <CardHeader className="p-0 flex flex-row items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Taxa de Retenção</span>
              <TrendingUp size={16} className="text-primary" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-2xl font-bold text-foreground">
                {errorStats.retentionRate}%
              </div>
              <CardDescription className="text-[11px] mt-1">
                {errorStats.goodCount + errorStats.easyCount} acertos de {totalLogs} revisões
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 flex flex-row items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Revisões Totais</span>
              <BookOpen size={16} className="text-primary" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-2xl font-bold text-foreground">
                {errorStats.totalReviews}
              </div>
              <CardDescription className="text-[11px] mt-1">
                Histórico completo de repetições
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 flex flex-row items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Questões com Erro</span>
              <AlertTriangle size={16} className="text-amber-500" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-2xl font-bold text-foreground">
                {errorStats.problematicCardsCount}
              </div>
              <CardDescription className="text-[11px] mt-1">
                Cartões que precisam de reforço
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="p-0 flex flex-row items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Lapsos de Memória</span>
              <RotateCcw size={16} className="text-destructive" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-2xl font-bold text-foreground">
                {errorStats.totalLapses}
              </div>
              <CardDescription className="text-[11px] mt-1">
                Total de esquecimentos após aprender
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        {/* Rating Distribution Breakdown */}
        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm font-semibold">
              Distribuição de Respostas nas Revisões
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {totalLogs === 0 ? (
              <CardDescription className="text-xs">
                Nenhuma revisão realizada ainda. Comece a estudar para ver as estatísticas.
              </CardDescription>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <span className="text-xs text-destructive font-medium">Novamente (Errei)</span>
                  <div className="text-lg font-bold text-destructive mt-0.5">
                    {errorStats.againCount}{" "}
                    <span className="text-xs font-normal opacity-75">
                      ({Math.round((errorStats.againCount / totalLogs) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Difícil</span>
                  <div className="text-lg font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                    {errorStats.hardCount}{" "}
                    <span className="text-xs font-normal opacity-75">
                      ({Math.round((errorStats.hardCount / totalLogs) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="text-xs text-primary font-medium">Bom</span>
                  <div className="text-lg font-bold text-primary mt-0.5">
                    {errorStats.goodCount}{" "}
                    <span className="text-xs font-normal opacity-75">
                      ({Math.round((errorStats.goodCount / totalLogs) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-secondary border border-border">
                  <span className="text-xs text-secondary-foreground font-medium">Fácil</span>
                  <div className="text-lg font-bold text-secondary-foreground mt-0.5">
                    {errorStats.easyCount}{" "}
                    <span className="text-xs font-normal opacity-75">
                      ({Math.round((errorStats.easyCount / totalLogs) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Problematic Cards Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>Questões com Mais Erros</span>
                <Badge variant="secondary" className="text-xs">
                  {filteredCards.length}
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Identifique cartões difíceis ou mal formulados para editar ou reforçar.
              </p>
            </div>

            {decks.length > 1 ? (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted-foreground" />
                <NativeSelect
                  size="sm"
                  value={selectedDeckId}
                  onChange={(e) => setSelectedDeckId(e.target.value)}
                  aria-label="Filtrar por baralho"
                >
                  <NativeSelectOption value="all">Todos os baralhos</NativeSelectOption>
                  {decks.map((deck) => (
                    <NativeSelectOption key={deck.id} value={deck.id}>
                      {deck.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            ) : null}
          </div>

          {filteredCards.length === 0 ? (
            <Empty className="min-h-[280px] border border-dashed border-border rounded-xl">
              <EmptyMedia className="w-12 h-12 bg-secondary text-primary">
                <CheckCircle2 size={26} />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>Nenhuma questão com erro registrada</EmptyTitle>
                <EmptyDescription>
                  {totalLogs === 0
                    ? "Inicie suas sessões de estudo para começar a rastrear o desempenho."
                    : "Parabéns! Não há cartões com falhas ou lapsos no momento."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-3">
              {filteredCards.map((item) => {
                const card = cards.find((c) => c.id === item.cardId);
                return (
                  <Card
                    key={item.cardId}
                    className="p-4 transition-colors hover:border-foreground/20"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.deckName ? (
                            <Badge variant="outline" className="text-[11px] font-medium text-muted-foreground">
                              {item.deckName}
                            </Badge>
                          ) : null}
                          {item.errorCount > 0 ? (
                            <Badge variant="destructive" className="text-[11px]">
                              {item.errorCount} {item.errorCount === 1 ? "erro" : "erros"}
                            </Badge>
                          ) : null}
                          {item.lapses > 0 ? (
                            <Badge
                              variant="secondary"
                              className="text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                            >
                              {item.lapses} {item.lapses === 1 ? "lapso" : "lapsos"}
                            </Badge>
                          ) : null}
                          <span className="text-[11px] text-muted-foreground">
                            Taxa de erro: <strong className="text-foreground">{item.errorRate}%</strong> ({item.totalReviews}{" "}
                            {item.totalReviews === 1 ? "revisão" : "revisões"})
                          </span>
                        </div>

                        {/* Front & Back */}
                        <div className="pt-0.5 space-y-1">
                          <h3 className="text-sm font-semibold text-foreground whitespace-pre-wrap">
                            {item.front}
                          </h3>
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                            {item.back}
                          </p>
                        </div>
                      </div>

                      {/* Card Action */}
                      <CardAction className="flex items-center gap-2 shrink-0 self-auto">
                        {card ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCard(card)}
                            className="text-xs h-8 gap-1.5"
                          >
                            <Edit2 size={13} />
                            <span>Editar</span>
                          </Button>
                        ) : null}
                      </CardAction>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Edit Card Dialog */}
        {editingCard ? (
          <CardDialog
            open={Boolean(editingCard)}
            initial={{ front: editingCard.front, back: editingCard.back }}
            onClose={() => setEditingCard(null)}
            onSubmit={handleEditCardSubmit}
          />
        ) : null}
      </div>
    </SpaceLayout>
  );
}
