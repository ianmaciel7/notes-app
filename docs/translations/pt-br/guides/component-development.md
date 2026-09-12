# Desenvolvimento de Componentes & Guia do Ladle

Este projeto utiliza o **Ladle** (`@ladle/react`) para desenvolvimento rápido de componentes, isolamento de stories e renderização de documentação arquitetural.

---

## Comandos

- `pnpm ladle:dev` / `npm run ladle:dev`: Inicia o servidor de desenvolvimento do Ladle em `http://localhost:61000`.
- `pnpm ladle:build` / `npm run ladle:build`: Gera o catálogo estático do Ladle.
- `pnpm ladle:preview` / `npm run ladle:preview`: Visualiza o site estático do Ladle construído localmente.

---

## Recursos & Convenções

1. **Suporte a Markdown & Mermaid**:
   - Stories de componentes sob `docs/**/*.stories.tsx` podem renderizar arquivos Markdown (usando imports raw `?raw`) através do `<DocViewer />`.
   - Diagramas Mermaid (` ```mermaid `) dentro do Markdown são renderizados interativamente com adaptação automática de temas claro/escuro.

2. **Seletor de Idioma Global (`pt-BR` / `en`)**:
   - Stories do Ladle incluem um controle de rádio para alternar o `locale` ativo entre Português do Brasil (`pt-BR`) e Inglês (`en`).
   - Integrado via configuração do `next-intl` e `src/lib/i18n-locale.ts`.

3. **Estrutura de Diretórios dos Stories**:
   - Posicione stories arquiteturais juntamente com suas respectivas documentações em `docs/architecture/<feature>/`.
