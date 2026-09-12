# Convenções & Diretrizes da Base de Código

Este documento descreve as regras estruturais, convenções de nomenclatura e padrões de organização de arquivos para o `notes-app`.

---

## 1. Convenções de Diretórios

- **`src/app/`**: Segmentos de rota do Next.js App Router, layouts, páginas e route handlers de API.
- **`src/components/ui/`**: Componentes primitivos shadcn/ui sem estilos de domínio. UI puramente apresentacional com zero lógica de negócio.
- **`src/components/common/`**: Componentes de layout compartilhado (Navbar, Sidebar, Shell).
- **`src/components/features/`**: Componentes de UI de domínio encapsulados por funcionalidade (`notes/`, `srs/`, `ingestion/`).
- **`src/lib/`**: Motores de lógica pura agnósticos de framework, cálculos matemáticos e clientes de banco de dados.
- **`src/actions/`**: Server Actions do Next.js para mutações de dados.
- **`src/types/`**: Interfaces TypeScript globais e DTOs.

---

## 2. Regras & Princípios de Código

1. **React Server Components (RSC) por Padrão**:
   - Mantenha os componentes no lado do servidor a menos que estado ou hooks do navegador sejam estritamente necessários. Adicione `"use client"` apenas em nós interativos folha.

2. **Requisito de Idioma**:
   - Todo código, comentários, docstrings e mensagens de commit devem ser escritos em **Inglês**.

3. **Caminhos Portáveis**:
   - Nunca defina caminhos absolutos específicos do usuário. Use sempre caminhos relativos ou variáveis de ambiente portáveis.

4. **Linting & Formatação**:
   - Gerenciado via Biome (`biome.json`). Execute `pnpm check` antes de commitar código.

5. **Grafo de Conhecimento (`graphify`)**:
   - O grafo de conhecimento AST é mantido em `graphify-out/`. Mantenha o grafo atualizado via `graphify update .`.
