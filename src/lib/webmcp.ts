"use client";

import { useEffect } from "react";
import { z } from "zod";

import { createDeck, db } from "@/lib/db";

interface ModelContext {
  registerTool(tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: object;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute(input: unknown): unknown | Promise<unknown>;
  }, options?: { signal?: AbortSignal }): void | Promise<void>;
}

declare global {
  interface Document { readonly modelContext?: ModelContext; }
}

const createDeckInput = z.object({ name: z.string().min(1).max(80), description: z.string().max(180).default("") });

export function useRevisaWebMcp() {
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = async () => {
      await context.registerTool({
        name: "list_decks",
        title: "Listar baralhos",
        description: "Lista os baralhos armazenados neste dispositivo e a quantidade de cartões em cada um.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        async execute() {
          const decks = await db.decks.toArray();
          return Promise.all(decks.map(async (deck) => ({ id: deck.id, name: deck.name, cardCount: await db.cards.where("deckId").equals(deck.id).count() })));
        },
      }, { signal: lifecycle.signal });
      await context.registerTool({
        name: "create_deck",
        title: "Criar baralho",
        description: "Cria um novo baralho vazio na biblioteca local do Revisa.",
        inputSchema: { type: "object", properties: { name: { type: "string", minLength: 1, maxLength: 80 }, description: { type: "string", maxLength: 180 } }, required: ["name"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          const value = createDeckInput.parse(input);
          const deck = await createDeck(db, value);
          return { id: deck.id, name: deck.name };
        },
      }, { signal: lifecycle.signal });
    };
    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
}
