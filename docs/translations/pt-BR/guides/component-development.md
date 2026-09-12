# Guia de Desenvolvimento de Componentes & Ladle

Este projeto utiliza **Ladle** (`@ladle/react`) para desenvolvimento rápido de componentes, isolamento de histórias e renderização da documentação arquitetural.

---

## Comandos

- `pnpm ladle:dev` / `npm run ladle:dev`: Inicia o servidor de desenvolvimento do Ladle em `http://localhost:61000`.
- `pnpm ladle:build` / `npm run ladle:build`: Compila um catálogo estático do Ladle.
- `pnpm ladle:preview` / `npm run ladle:preview`: Visualiza localmente o site compilado do Ladle.

---

## Recursos e Convenções

1. **Suporte a Markdown & Mermaid**:
   - Histórias de componentes em `docs/**/*.stories.tsx` podem renderizar arquivos Markdown (com importações raw `?raw`) usando `<ArchitectureDocViewer />`.
   - Diagramas Mermaid (` ```mermaid `) em Markdown são renderizados interativamente com adaptação automática de tema claro/escuro.

2. **Seletor Global de Idioma (`pt-BR` / `en`)**:
   - As histórias do Ladle incluem um controle de rádio para alternar o `locale` ativo entre Português do Brasil (`pt-BR`) e Inglês (`en`).
   - Obtido através da configuração do `next-intl` e `src/lib/i18n-locale.ts`.

3. **Estrutura de Diretórios de Histórias**:
   - Coloque histórias arquiteturais ao lado de suas respectivas documentações em `docs/architecture/<feature>/`.
