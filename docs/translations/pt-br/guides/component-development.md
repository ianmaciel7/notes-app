# Guia de Desenvolvimento de Componentes & Ladle

Este projeto utiliza o **Ladle** (`@ladle/react`) para desenvolvimento rápido de componentes, isolamento de stories e renderização de documentação arquitetural.

---

## Comandos

- `pnpm ladle:dev` / `npm run ladle:dev`: Inicia o servidor de desenvolvimento do Ladle em `http://localhost:61000`.
- `pnpm ladle:build` / `npm run ladle:build`: Gera o catálogo estático do Ladle.
- `pnpm ladle:preview` / `npm run ladle:preview`: Visualiza o site estático do Ladle construído localmente.

---

## Recursos & Convenções

1. **Suporte a Markdown & Mermaid**:
   - Stories de componentes sob `docs/**/*.stories.tsx` podem renderizar arquivos Markdown (com imports brutos `?raw`) usando `<ArchitectureDocViewer />`.
   - Diagramas Mermaid (` ```mermaid `) dentro do Markdown são renderizados interativamente com adaptação automática a temas claro/escuro (light/dark).

2. **Seletor Global de Idioma (`pt-BR` / `en`)**:
   - As stories do Ladle incluem um controle de rádio para alternar o `locale` ativo entre Português do Brasil (`pt-BR`) e Inglês (`en`).
   - Integrado via configuração do `next-intl` e `src/lib/i18n-locale.ts`.

3. **Estrutura de Diretórios de Stories**:
   - Aloje stories arquiteturais junto com a documentação de funcionalidades correspondente em `docs/architecture/<funcionalidade>/`.
