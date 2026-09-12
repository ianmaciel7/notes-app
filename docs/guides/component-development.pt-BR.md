# Guia de Desenvolvimento de Componentes & Ladle

Este projeto utiliza o **Ladle** (`@ladle/react`) para desenvolvimento rápido de componentes, isolamento de stories e renderização de documentações arquiteturais.

---

## Comandos

- `pnpm ladle:dev` / `npm run ladle:dev`: Inicia o servidor de desenvolvimento do Ladle em `http://localhost:61000`.
- `pnpm ladle:build` / `npm run ladle:build`: Gera o catálogo estático do Ladle.
- `pnpm ladle:preview` / `npm run ladle:preview`: Executa a visualização prévia local do catálogo do Ladle.

---

## Recursos & Convenções

1. **Suporte a Markdown & Mermaid**:
   - Stories de componentes sob `docs/**/*.stories.tsx` podem renderizar arquivos Markdown (com imports brutos `?raw`) utilizando o componente `<DocViewer />`.
   - Diagramas Mermaid (` ```mermaid `) dentro do Markdown são renderizados de forma interativa com adaptação automática ao tema claro/escuro.

2. **Seletor Global de Idioma (`pt-BR` / `en`)**:
   - As stories no Ladle incluem um controle por rádio para alternar o `locale` ativo entre Português do Brasil (`pt-BR`) e Inglês (`en`).
   - Configurado via `next-intl` e `src/lib/i18n-locale.ts`.

3. **Estrutura de Diretórios das Stories**:
   - Organize as stories arquiteturais junto com suas documentações de funcionalidade correspondentes em `docs/architecture/<funcionalidade>/`.
