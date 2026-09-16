"use client";

import {
  Archive,
  BookOpen,
  ChevronRight,
  Library,
  Plus,
  Settings2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface DeckSummary {
  id: string;
  name: string;
  description?: string;
  cardCount: number;
  dueCount: number;
  newCount: number;
}

interface LibraryShellProps {
  decks: DeckSummary[];
  dueCount: number;
  newCount: number;
  onCreateDeck: () => void;
}

export function LibraryShell({ decks, dueCount, newCount, onCreateDeck }: LibraryShellProps) {
  return (
    <div className="app-shell">
      <aside className="side-nav" aria-label="Navegação principal">
        <Link className="brand" href="/" aria-label="Revisa, início">
          <span className="brand-mark"><Sparkles size={17} strokeWidth={2.4} /></span>
          <span>Revisa</span>
        </Link>
        <nav className="nav-list">
          <Link className="nav-item nav-item-active" href="/"><Library size={18} /><span>Baralhos</span></Link>
          <Link className="nav-item" href="/backup"><Archive size={18} /><span>Backup</span></Link>
        </nav>
        <div className="nav-footer"><Settings2 size={16} /><span>Dados salvos neste dispositivo</span></div>
      </aside>

      <main className="main-area">
        <header className="mobile-header">
          <Link className="brand" href="/" aria-label="Revisa, início">
            <span className="brand-mark"><Sparkles size={16} /></span><span>Revisa</span>
          </Link>
          <Button render={<Link href="/backup" />} variant="outline" size="icon-lg" aria-label="Abrir backup"><Archive /></Button>
        </header>

        <div className="content-wrap">
          <section className="page-heading">
            <div>
              <p className="eyebrow">Biblioteca</p>
              <h1>Seus baralhos</h1>
              <p className="page-subtitle">Escolha um assunto e continue de onde parou.</p>
            </div>
            <Button type="button" onClick={onCreateDeck}>
              <Plus size={18} />Criar baralho
            </Button>
          </section>

          <section className="study-overview" aria-label="Resumo de estudos">
            <div className="overview-intro">
              <span className="overview-icon"><BookOpen size={20} /></span>
              <div><strong>Pronto para hoje</strong><span>{dueCount + newCount === 0 ? "Tudo em dia" : "Cartões aguardando revisão"}</span></div>
            </div>
            <dl className="overview-stats">
              <div><dt>Pendentes</dt><dd>{dueCount}</dd></div>
              <div><dt>Novos</dt><dd>{newCount}</dd></div>
            </dl>
          </section>

          {decks.length === 0 ? (
            <section className="empty-state">
              <span className="empty-icon"><Library size={28} /></span>
              <h2>Sua biblioteca está vazia</h2>
              <p>Crie um baralho para começar a transformar conteúdo em memória.</p>
              <Button variant="secondary" type="button" onClick={onCreateDeck}><Plus />Criar baralho</Button>
            </section>
          ) : (
            <section className="deck-grid" aria-label="Baralhos">
              {decks.map((deck) => (
                <Card className="deck-card" key={deck.id}>
                  <Link className="deck-card-link" href={`/baralhos/${deck.id}`}>
                    <div className="deck-card-top"><span className="deck-icon"><BookOpen size={19} /></span><ChevronRight size={18} className="deck-arrow" /></div>
                    <div><h2>{deck.name}</h2><p>{deck.description || `${deck.cardCount} cartões`}</p></div>
                    <div className="deck-meta"><span><strong>{deck.dueCount}</strong> pendentes</span><span><strong>{deck.newCount}</strong> novos</span></div>
                  </Link>
                </Card>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
