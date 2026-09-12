# Convenções & Diretrizes da Base de Código

Este documento descreve as regras estruturais, convenções de nomenclatura e padrões de organização de arquivos para o `notes-app`.

---

## 1. Convenções de Diretórios

- **`src/app/`**: Segmentos de rota do Next.js App Router, layouts, páginas e handlers de rotas de API.
- **`src/components/ui/`**: Componentes primitivos shadcn/ui. UI apresentacional pura com zero lógica de domínio.
- **`src/components/common/`**: Componentes de layout compartilhados (Navbar, Sidebar, Shell).
- **`src/components/features/`**: Componentes de UI encapsulados por domínio (`notes/`, `srs/`, `ingestion/`).
- **`src/lib/`**: Motores de lógica puros e agnósticos de framework, cálculos matemáticos e clientes de banco de dados.
- **`src/actions/`**: Next.js Server Actions para mutações de dados.
- **`src/types/`**: Interfaces globais TypeScript e DTOs.

---

## 2. Regras & Princípios de Código

1. **React Server Components (RSC) por Padrão**:
   - Mantenha componentes no lado do servidor a menos que estado/hooks de navegador sejam estritamente necessários. Adicione `"use client"` apenas nos nós interativos das folhas.

2. **Requisito de Idioma**:
   - Todo o código, comentários, docstrings e mensagens de commit devem ser escritos em **Inglês**.

3. **Caminhos Portáveis**:
   - Nunca coloque caminhos absolutos hardcoded específicos de usuários. Sempre use caminhos relativos ou variáveis de ambiente portáveis.

4. **Linting & Formatação**:
   - Gerenciado via Biome (`biome.json`). Execute `pnpm check` antes de commitss.

5. **Grafo de Conhecimento (`graphify`)**:
   - O grafo de conhecimento AST é mantido em `graphify-out/`. Mantenha o grafo atualizado via `graphify update .`.
