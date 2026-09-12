# Visão Geral da Arquitetura (Padrão Matklad)

Este documento fornece uma visão geral de alto nível da arquitetura do **Notes App**, estrutura de diretórios, abstrações principais e invariantes de engenharia. Foi escrito seguindo o padrão **Matklad ARCHITECTURE.md** para ajudar novos colaboradores e agentes automatizados a se orientarem rapidamente na base de código.

---

## 1. Visão Geral

O **Notes App** é uma aplicação web unificada de estudos e gerenciamento de conhecimento local-first com custo operacional zero. Ele unifica três domínios principais:
1. **Arquitetura de Objetos (Estilo Capacities)**: Notas interconectadas, tipos de objetos flexíveis e links bidirecionais.
2. **Ingestão de Documentos (Estilo Readwise)**: Destacamento, parsing de documentos e importação de leituras externas.
3. **Sistema de Repetição Espaçada (Estilo Anki/FSRS)**: Flashcards, gerenciamento de fila de revisão e algoritmos de retenção de memória.

A aplicação foi construída sobre **Next.js (App Router)**, **React 19**, **TypeScript** e **shadcn/ui** (estilizado com Tailwind CSS), otimizada para velocidade, armazenamento local e desempenho de Server Components.

---

## 2. Mapa do Código & Estrutura Oficial de Pastas

O projeto segue estritamente as **convenções oficiais do Next.js App Router** combinadas com a estrutura de componentes padrão do **shadcn/ui**.

```text
.
├── app/                      # Next.js App Router (Rotas, Layouts, Páginas, Server Actions)
│   ├── (auth)/               # Grupo de rotas para autenticação (login, cadastro)
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/          # Grupo de rotas para a interface principal
│   │   ├── notes/            # Página /notes e rotas dinâmicas de detalhes
│   │   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── srs/              # Interface de estudo de repetição espaçada /srs
│   │   ├── layout.tsx        # Shell do dashboard (layout Sidebar + Header)
│   │   └── page.tsx          # Página principal do dashboard
│   ├── api/                  # Route Handlers para endpoints REST externos / webhooks
│   │   └── route.ts
│   ├── globals.css           # Variáveis CSS globais do Tailwind CSS & shadcn/ui
│   ├── layout.tsx            # Layout Raiz (Provedores de tema, fontes, metadados)
│   ├── loading.tsx           # UI global de carregamento (fronteira React Suspense)
│   ├── error.tsx             # Error Boundary global para erros não tratados
│   └── not-found.tsx         # Página 404 personalizada
│
├── components/               # Componentes React de UI (Server & Client)
│   ├── ui/                   # Componentes primitivos shadcn/ui (Gerados via CLI)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   ├── common/               # Componentes de layout compartilhados (Navbar, Sidebar)
│   │   ├── navbar.tsx
│   │   └── sidebar.tsx
│   └── features/             # Componentes de domínio (Encapsulados por domínio)
│       ├── notes/            # Editor de notas, cards de nota, listas de tags
│       ├── srs/              # Visualizador de flashcards, botões de classificação
│       └── ingestion/        # Importador de documentos, parser de destaques
│
├── lib/                      # Utilitários puros, clientes de banco e motores de lógica
│   ├── utils.ts              # Utilitário de junção de classes `cn()` (clsx + tailwind-merge)
│   ├── db/                   # Cliente de banco de dados (SQLite/IndexedDB/ORM)
│   ├── srs/                  # Algoritmo matemático FSRS e motor de agendamento
│   └── validations/          # Esqueletos de validação Zod para formulários e Server Actions
│
├── actions/                  # Next.js Server Actions (Mutações no backend)
│   ├── notes.ts              # Server Actions CRUD para notas e objetos
│   └── srs.ts                # Server Actions para submissão de revisões SRS
│
├── hooks/                    # Hooks React reutilizáveis no lado do cliente
│   ├── use-debounce.ts
│   └── use-local-storage.ts
│
├── types/                    # Interfaces globais TypeScript e definições de tipos
│   ├── note.ts               # DTOs de notas e modelos de banco de dados
│   └── srs.ts                # Tipos de estado dos flashcards e FSRS
│
├── public/                   # Arquivos estáticos públicos (imagens, ícones, SVGs)
├── .agents/                  # Configurações, regras e skills do agente de IA
├── graphify-out/             # Grafo de conhecimento e topologia gerados pelo Graphify
└── .worktrees/               # Implementações históricas de referência para paridade
```

---

## 3. Invariantes Arquiteturais

Qualquer colaborador (e assistente de IA) deve manter estritamente as seguintes regras de engenharia:

1. **React Server Components (RSC) por Padrão**:
   - Todos os componentes dentro de `app/` e `components/` são Server Components por padrão.
   - Adicione `"use client"` **apenas nas folhas** da árvore de componentes onde a interatividade no navegador (estado do React, manipuladores de eventos, APIs de cliente) for necessária.

2. **Isolamento de Primitivos em `components/ui/` (Primitivos shadcn)**:
   - Arquivos dentro de `components/ui/` pertencem exclusivamente ao **shadcn/ui**.
   - **Invariante**: Nunca embutir lógica de domínio, chamadas de API ou estado específico da aplicação em `components/ui/`. Eles devem permanecer como primitivos puramente apresentacionais.

3. **Encapsulamento de Domínio em `components/features/`**:
   - A lógica de UI específica de um domínio deve ser organizada sob `components/features/<feature-name>/`.
   - Nunca vazar componentes de domínio para os diretórios globais `components/common/` ou `components/ui/`.

4. **Validação Estrita de Fronteiras (Zod)**:
   - Todo payload de entrada que chegar via Server Actions ou Route Handlers deve ser validado usando esquemas Zod localizados em `lib/validations/`.

5. **Lógica de Negócios Desacoplada em `lib/`**:
   - A lógica computacional central (ex: algoritmos de repetição espaçada FSRS) deve ser implementada como funções TypeScript puras e agnósticas de framework em `lib/`. Isso permite testes unitários sem overhead e execução local-first.

---

## 4. Fluxos Principais de Dados

### A. Busca de Dados (Acesso Direto RSC)
```mermaid
flowchart TD
    Req["Navegador / Requisição do Usuário"] -->|Requisição HTTP| Router[Next.js App Router]
    Router --> Layout[app/layout.tsx]
    Layout --> Page["app/(dashboard)/notes/page.tsx (RSC)"]
    Page -->|Consulta Direta| DB[(Local Storage / Cliente DB)]
    DB -->|Retorna Registros| Page
    Page -->|Renderiza Stream HTML| UI[Componentes shadcn/ui]
    UI -->|Resposta Hidratada| Req
```

### B. Mutação de Dados (Fluxo de Server Actions)
```mermaid
flowchart LR
    ClientUI[Componente Cliente] -->|Invoca Action| Action[actions/notes.ts]
    Action -->|1. Valida Payload| Zod[lib/validations/notes.ts]
    Zod -->|2. Persiste Dados| DB[(Storage / DB)]
    DB -->|3. Dispara Revalidação| Cache[revalidatePath / revalidateTag]
    Cache -->|4. Atualiza Stream| ClientUI
```

---

## 5. Questões Transversais (Cross-Cutting Concerns)

### Estilização & Temas
- Estilizado usando **Tailwind CSS** com **Variáveis CSS** definidas em `app/globals.css`.
- Cores e tokens de design mapeiam diretamente para as variáveis CSS do shadcn (`--background`, `--foreground`, `--primary`, etc.).
- Use o utilitário `cn(...)` em `lib/utils.ts` para junção condicional de classes.

### Tratamento de Erros & Estados de Carregamento
- **`loading.tsx`**: Utiliza primitivos `Skeleton` do shadcn para fallbacks de carregamento instantâneo via React Suspense.
- **`error.tsx`**: Captura exceções não tratadas em tempo de execução no nível de segmento de rota sem derrubar a aplicação.

### Gerenciamento de Estado
- **Estado de Servidor**: Gerenciado nativamente por Next.js RSC, Server Actions e revalidação de cache.
- **Estado de Cliente**: Mantido localmente nos componentes interativos (`useState`, `useReducer`) ou em Contextos React mínimos para sinalizadores de UI.

---

## 6. Worktrees de Referência & Topologia do Código

- **Bases de Código Históricas**: Inspecione `.worktrees/` (`old`, `old-2`, `old-3`, `old-4`, `old-5`) para implementações de referência ao portar algoritmos ou paridade de funcionalidades do Capacities.
- **Topologia de Dependências**: Consulte `graphify-out/GRAPH_REPORT.md` e `graphify-out/graph.json` para consultas sobre relacionamentos arquiteturais.

---

## 7. Governança do Projeto & Matriz de Decisões

Para manter a integridade da base de código, ergonomia de desenvolvimento e alinhamento de agentes, os artefatos de governança são divididos em quatro camadas:

| Camada de Governança | Arquivo / Localização Principal | Objetivo Central | Quando Usar / Atualizar |
| --- | --- | --- | --- |
| **Diretivas de Agente** | [`AGENTS.md`](../../AGENTS.md) | Ponto de entrada para assistentes de IA | Visão geral de regras do repositório, mapa, referências a worktrees e comandos. |
| **Regras Operacionais** | [`.agents/rules/*.md`](../../.agents/rules/) | Políticas de código de responsabilidade única | Restrições granulares (*"Como escrever código/configs"*), ex: `portable-paths.md`, `language.md`. |
| **Decisões Arquiteturais** | [`docs/decisions/`](../decisions/README.md) | Registro de Decisões MADR (ADRs) | Documentação de **POR QUE** uma escolha técnica foi feita, trade-offs e opções rejeitadas. |
| **Políticas de Segurança** | [`SECURITY.md`](../../SECURITY.md) | Modelo de ameaças, limites de confiança e segurança | Documentação de **COMO** credenciais, dados de usuário, rotas e permissões são isolados. |
