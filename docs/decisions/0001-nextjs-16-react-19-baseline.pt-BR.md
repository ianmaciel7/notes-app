# ADR-0001: Baseline do App Router com Next.js 16 + React 19

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 11/09/2026

## Contexto e Declaração do Problema

O `notes-app` requer um framework web full-stack moderno, de alta performance e *local-first*, capaz de lidar com edição rica de notas, visualização em grafo, leitura de documentos e proxy de APIs no servidor (gateways de IA, parsing).

## Direcionadores da Decisão

* Suporte a React 19 Server Components e navegação via App Router.
* Integração TypeScript de primeira classe e suporte a estilização com Tailwind CSS v4.
* Tempos rápidos de compilação e suporte ao Turbopack.

## Opções Consideradas

1. **Next.js 16 (App Router)** + React 19 + Tailwind CSS v4
2. SPA com Vite + React 19 com backend Node.js separado
3. Next.js Pages Router (legado)

## Resultado da Decisão

Opção escolhida: **Next.js 16 (App Router)** porque fornece Route Handlers full-stack para gateways de IA/parsing, Server Components para renderização de alto desempenho e compatibilidade nativa com Tailwind CSS v4.

### Consequências Positivas

* Separação clara entre componentes de cliente (banco offline Dexie) e handlers de servidor.
* Geração de rotas de primeira classe e velocidade de build com Turbopack.

### Consequências Negativas

* Mudanças incompatíveis do React 19 exigem validação cuidadosa de tipos em props de layout.
