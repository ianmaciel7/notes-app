# Referência do Design System

> **Nota**: Esta especificação de referência é adaptada de [`DESIGN.md`](../../DESIGN.md).

---

## 1. Tema Visual & Atmosfera
A identidade visual do Notes App é ultra-minimalista, focada e livre de distrações. Construída com tipografia monocromática limpa e grids de layout espaçosos, utiliza contrastes nítidos e adaptação suave ao modo escuro (dark mode) para fornecer um ambiente sem esforço para leitura e anotações.

O design apoia-se nos pares de fontes Geist e Geist Mono para evocar uma estética moderna e de alta precisão para desenvolvedores, combinada com espaçamento vertical generoso e controles de ação arredondados em formato de pílula (pill-shaped).

## 2. Paleta de Cores & Papéis
### Base Primária
- **Branco de Tela Puro (`#ffffff`)** — Fundo padrão no modo claro (light mode).
- **Preto Meia-Noite Profundo (`#0a0a0a` / `#000000`)** — Fundo no modo escuro & texto primário de alto contraste.

### Tipografia & Hierarquia de Texto
- **Tinta Primária (`#171717`)** — Texto do corpo de alto contraste no modo claro.
- **Off-White Suave (`#ededed`)** — Texto do corpo primário no modo escuro.
- **Corpo Grafite Atenuado (`#52525b` / `zinc-600`)** — Texto secundário de descrição.
- **Grafite do Modo Escuro (`#a1a1aa` / `zinc-400`)** — Texto secundário no modo escuro.

### Estados Funcionais & Elementos Interativos
- **Botão de Ação Destacado (`#171717` / `#ffffff`)** — Fundo do CTA principal com raio estilo pílula.
- **Borda Sutil (`rgba(0,0,0,0.08)`)** — Bordas finas de componentes e divisores sutis.

## 3. Regras de Tipografia
### Hierarquia & Pesos
- **Fonte Sans**: Geist (`var(--font-geist-sans)`), sans-serif geométrica limpa.
- **Fonte Mono**: Geist Mono (`var(--font-geist-mono)`), monospace nítida para blocos e código inline.
- **H1 Display**: `3xl` (30px), peso da fonte `600` (semibold), altura de linha `1.25`, tracking `tight`.
- **Corpo Grande**: `lg` (18px), altura de linha `1.75` (relaxada), cor secundária.
- **Trecho de Código**: `font-mono`, tamanho `0.9em`, sobreposição de fundo estilo pílula.

## 4. Estilização de Componentes
### Botões
- Formato de pílula (`rounded-full`), altura `48px` (`h-12`), preenchimento horizontal `20px` (`px-5`).
- Botão primário: Fundo preto sólido com texto branco (invertido no modo escuro), transição suave de hover para `#383838`.
- Botão secundário: Fundo transparente com borda fina (`border-black/[.08]`), estado de hover com fundo suave (`hover:bg-black/[.04]`).
