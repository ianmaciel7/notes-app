# ADR-0001: Baseline Next.js 16 + React 19 App Router

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 2026-09-11

## Contexto e Declaração do Problema

O `notes-app` requer um framework web full-stack moderno, de alto desempenho e local-first, capaz de suportar edição avançada de notas, visualização em grafo, leitura de documentos e proxying de APIs no servidor (gateways de IA, parsing).

## Direcionadores de Decisão

* Suporte a React 19 Server Components e navegação via App Router.
* Integração de primeira classe com TypeScript e suporte a estilos Tailwind CSS v4.
* Tempos de build rápidos e suporte ao Turbopack.

## Opções Consideradas

1. **Next.js 16 (App Router)** + React 19 + Tailwind CSS v4
2. Vite + React 19 SPA com backend Node.js separado
3. Next.js Pages Router (legado)

## Resultado da Decisão

Opção escolhida: **Next.js 16 (App Router)** porque fornece Route Handlers full-stack para gateways de IA/parsing, Server Components para renderização de alto desempenho e compatibilidade perfeita com Tailwind CSS v4.

### Consequências Positivas

* Separação clara entre componentes cliente (banco de dados offline Dexie) e handlers no servidor.
* Geração de rotas de primeira classe e velocidade de build com Turbopack.

### Consequências Negativas

* Mudanças incompatíveis (breaking changes) no React 19 exigem validação rigorosa de tipos nas props de layout.
