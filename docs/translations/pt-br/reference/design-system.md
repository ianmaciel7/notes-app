---
name: Referência do Design System Notes App
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  dark-background: "oklch(0.145 0 0)"
  dark-foreground: "oklch(0.985 0 0)"
  bg-back: "oklch(0.985 0 0)"
  bg-base: "oklch(1 0 0)"
  bg-front: "oklch(1 0 0)"
  border-base: "oklch(0.922 0 0)"
  dark-bg-back: "oklch(0.12 0 0)"
  dark-bg-base: "oklch(0.145 0 0)"
  dark-bg-front: "oklch(0.205 0 0)"
  dark-border-base: "oklch(1 0 0 / 10%)"
---

# Referência do Design System: Notes App

> **Status**: Referência Autoritativa  
> **Origem**: Sincronizado diretamente com [`DESIGN.md`](../../../../DESIGN.md)  
> **Arquitetura**: Grafo de Conhecimento Local-First & Object Studio  
> **Direção Visual**: Minimalismo Editorial, Santuário Monástico de Conhecimento, Paridade com Capacities  
> **Stack de UI**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Primitivas Base UI, Editor Rich-Text Plate  

---

## 1. Identidade do Produto & Filosofia de Design

A identidade visual e a experiência de produto do Notes App fundamentam-se nos princípios de um **santuário monástico de conhecimento editorial**—um estúdio digital contemplativo e de alta precisão projetado para foco profundo, síntese estruturada e composição contínua de conhecimento.

### Pilares Fundamentais

1. **Minimalismo Editorial**: A tipografia, a proporção áurea e o espaço negativo são os principais elementos estruturais. Não utilizamos ilustrações supérfluas, gradientes berrantes ou ruídos visuais decorativos.
2. **Santuário de Conhecimento Monástico**: O espaço pessoal de notas deve transmitir a serenidade de uma biblioteca silenciosa. Todas as ferramentas e painéis secundários recuam suavemente para priorizar a leitura e a escrita.
3. **Conteúdo em Primeiro Lugar (Content-First)**: Painéis laterais, trilhos de propriedades e botões de comando existem exclusivamente para apoiar o objeto de conhecimento ativo.
4. **Densidade Silenciosa (Quiet Density)**: Controles compactos (22px, 28px, 32px, 36px) proporcionam alta capacidade informativa mantendo uma leitura limpa e descansada.
5. **Geometria Estável (Anti-Layout Shift)**: Estados de hover, seleção, contadores dinâmicos e carregamento nunca alteram as dimensões físicas dos elementos (Cumulative Layout Shift = 0).
6. **Foco e Acessibilidade (WCAG 2.2 AA/AAA)**: Alto contraste de texto, anéis de foco visíveis (`--space-focus`) e suporte completo a leitores de tela e navegação por teclado.

---

## 2. Paleta de Cores Semântica & Tokens OKLCH

O sistema utiliza o espaço de cor **OKLCH** para garantir fidelidade de luminosidade perceptiva e transições perfeitas entre os modos Claro (*Light*) e Escuro (*Dark*).

### Estrutura de Superfícies & Fundo

| Token | Modo Claro (OKLCH) | Modo Escuro (OKLCH) | Função Semântica |
| :--- | :--- | :--- | :--- |
| `--bg-back` / `--space` | `oklch(0.9856 0.0016 67)` | `oklch(0.1605 0.0063 285.63)` | Fundo geral da aplicação e tela de fundo |
| `--bg-base` / `--space-surface` | `oklch(1 0.0001 263.28)` | `oklch(0.1971 0.006 285.78)` | Superfície emoldurada da janela ativa / editor |
| `--bg-front` | `oklch(1 0.0001 263.28)` | `oklch(0.2191 0.0058 285.84)` | Cartões elevados, menus dropdown, popovers e modais |
| `--bg-el` / `--space-hover` | `oklch(0.9676 0.0016 67.02)` | `oklch(0.2987 0.0072 285.88)` | Hover em linhas de lista, preenchimento de itens selecionados |
| `--bg-el-strong` | `oklch(0.9163 0.0017 67.07)` | `oklch(0.3688 0.0051 286.01)` | Controles ativos de alto contraste |
| `--border-base` | `oklch(0.9163 0.0017 67.07)` | `oklch(0.2987 0.0072 285.88)` | Bordas finas de painéis e divisores estruturais (1px) |
| `--border-front` | `oklch(0.9163 0.0017 67.07)` | `oklch(0.2987 0.0072 285.88)` | Borda hairline para popovers, preview cards e superfícies frontais |
| `--border-base-strong` | `oklch(0.8643 0.0017 67.13)` | `oklch(0.3461 0.0069 285.94)` | Divisores destacados e contornos de controles |
| `--border-strong` / `--ring` | `oklch(0.7161 0.006 30.59)` | `oklch(0.8643 0.0017 67.13)` | Anéis de foco e seleções de alto contraste |

### Hierarquia de Tinta & Tipografia

| Token | Modo Claro (OKLCH) | Modo Escuro (OKLCH) | Função Semântica |
| :--- | :--- | :--- | :--- |
| `--text-primary` | `oklch(0.2191 0.0058 285.84)` | `oklch(1 0.0001 263.28)` | Títulos de documentos, cabeçalhos, corpo principal |
| `--text-secondary` | `oklch(0.3887 0.0052 301.05)` | `oklch(0.9163 0.0017 67.07)` | Rótulos de navegação, subtítulos, botões inativos |
| `--text-subtle` | `oklch(0.5725 0.0051 33.89)` | `oklch(0.7161 0.006 30.59)` | Placeholders, contadores secundários, timestamps |
| `--space-focus` | `oklch(0.54 0.14 250)` | `oklch(0.72 0.12 245)` | Indicador de foco por teclado de alta visibilidade |
| `--destructive` | `oklch(0.6272 0.1917 24.54)` | `oklch(0.6693 0.1818 23.36)` | Ações destrutivas, exclusão e alertas de erro |

### Contrato de Aliases em Runtime

`src/app/globals.css` expõe a paleta de paridade Capacities tanto pelos tokens compatíveis com shadcn (`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--border`, `--input`, `--ring`) quanto pelos aliases específicos do app (`--app-bg-*`, `--app-border-*`, `--app-text-*`, `--app-shadow-*`). Componentes devem consumir esses aliases em vez de repetir valores OKLCH literais.

O token shadcn `--primary` usa intencionalmente a tinta de ação medida no Capacities (`oklch(0.3887 0.0052 301.05)` no modo claro), não uma cor de marca saturada. Azul, vermelho, verde, âmbar e violeta ficam reservados para foco, ações destrutivas, status, avisos e relações.

---

## 3. Sistema de 18 Tons Semânticos Capacities

Cada tipo de objeto ou tag possui uma tonalidade semântica associada com fórmulas exatas de texto, fundo e borda:

| Tom (*Tone*) | Cor de Texto | Fundo de Badge | Entidades Padrão Associadas |
| :--- | :--- | :--- | :--- |
| **Amber** | `oklch(0.5708 0.1192 59.46)` | `oklch(0.9746 0.0399 94.73)` | `atomic-note`, `idea`, notas de rascunho |
| **Blue** | `oklch(0.5035 0.1579 264.41)` | `oklch(0.9513 0.0235 256.13)` | `page`, `weblink`, `table`, `area` |
| **Cyan** | `oklch(0.4954 0.0774 186.74)` | `oklch(0.9678 0.0321 182.40)` | `media`, `audio`, transcrições |
| **Emerald** | `oklch(0.4933 0.0939 167.09)` | `oklch(0.9660 0.0361 163.39)` | `project`, `place`, entidades ativas |
| **Fuchsia** | `oklch(0.5082 0.1955 304.61)` | `oklch(0.9630 0.0229 308.05)` | `ai-chat`, sínteses criativas |
| **Gray** | `oklch(0.4289 0.0021 324.71)` | `oklch(0.9766 0.0016 67.01)` | `file`, `archive`, itens sem categoria |
| **Green** | `oklch(0.5327 0.1221 151.70)` | `oklch(0.9732 0.0311 157.36)` | `query`, `task (concluída)`, verificações |
| **Indigo** | `oklch(0.4850 0.1820 278.40)` | `oklch(0.9540 0.0240 276.10)` | `collection`, visões de banco de dados |
| **Lime** | `oklch(0.5420 0.1410 132.80)` | `oklch(0.9710 0.0340 130.20)` | `study_goal`, metas de estudo |
| **Neutral** | `oklch(0.4100 0.0050 280.00)` | `oklch(0.9700 0.0020 280.00)` | Texto padrão, anotação pura |
| **Orange** | `oklch(0.5570 0.1387 43.21)` | `oklch(0.9668 0.0264 74.74)` | `person`, `tag`, `task (em andamento)` |
| **Pink** | `oklch(0.5210 0.1730 348.10)` | `oklch(0.9610 0.0230 350.40)` | Destaques rosa, inspirações |
| **Purple** | `oklch(0.5047 0.2017 295.51)` | `oklch(0.9564 0.0229 293.96)` | `book`, `definition`, `travel`, tópicos de estudo |
| **Red** | `oklch(0.5060 0.1552 24.58)` | `oklch(0.9530 0.0218 17.35)` | `meeting`, `organization`, `image`, `pdf` |
| **Rose** | `oklch(0.5096 0.1640 12.19)` | `oklch(0.9563 0.0218 13.86)` | `quote`, citações acadêmicas, favoritos |
| **Sky** | `oklch(0.4914 0.0976 237.18)` | `oklch(0.9654 0.0192 235.84)` | Artigos em nuvem, PDFs externos |
| **Teal** | `oklch(0.4920 0.1050 198.50)` | `oklch(0.9660 0.0290 196.20)` | `flashcard`, repetição espaçada (FSRS) |
| **Yellow** | `oklch(0.5820 0.1280 82.30)` | `oklch(0.9750 0.0380 85.10)` | Insights, conceitos em validação |

---

## 4. Escala Tipográfica & Fontes

- **Fonte Sans Primária**: `Inter` (`/fonts/inter-*.woff2`)
- **Fonte Monospaced**: `Overpass Mono`, `JetBrains Mono`
- **Regra de Espaçamento**: `letter-spacing: 0`
- **Escala de Texto**:
  - `text-xxs` (10px / 14px): Micro badges, atalhos de teclado `<kbd>`
  - `text-xs` (12px / 16px): Rótulos de propriedades, contadores na barra lateral
  - `text-sm` (13.5px–14px / 20px): Itens de menu, botões de ação, células de tabela
  - `text-base` (15px–16px / 24px): Corpo do editor e leitura confortável
  - `text-lg` (18px / 28px) a `text-3xl` (30px / 38px, bold): Cabeçalhos H3, H2, H1 e título do objeto

---

## 5. Estrutura do Shell em 3 Painéis

```
+-------------------------------------------------------------------------------+
| Top Rail (46px) — Abas de Documentos, Histórico, Ações Rápidas, Inspetor      |
+-------------------+---------------------------------------+-------------------+
| Barra Lateral     | Área Central de Leitura / Editor      | Painel Inspetor   |
| (240px – 288px)   | Margem de 10px, Raio de 12px,         | (320px – 496px)   |
| Seletor de Espaço | Superfície Branca Isolada             | Grafo, Relações,  |
| Tipos de Objeto   | Max-Width: 760px (leitura) ou Fluido  | Backlinks, AI Chat|
+-------------------+---------------------------------------+-------------------+
```

### Regras de Responsividade

- **$\ge$ 1280px (Desktop)**: Visualização completa dos 3 painéis simultâneos.
- **1024px – 1279px (Laptop)**: Painel inspetor colapsa em gaveta sobreposta (drawer).
- **768px – 1023px (Tablet)**: Barra lateral colapsa em trilho de ícones ou gaveta acessível.
- **$<$ 768px (Mobile)**: Modo de foco em painel único com barra de navegação inferior e slide sheets controladas por gestos táteis com suporte ao `visualViewport` do teclado.

---

## 6. Vistas de Objetos & Apresentação de Coleções

### Formatos Individuais de Objeto
1. **Inline Pill**: Pílula compacta para referências no meio do texto com ícone e hovercard.
2. **Link-Block**: Linha única em formato de cartão com badge e título truncado.
3. **Small-Card**: Cartão retangular com badge, título em negrito, pré-visualização de 3 linhas e tags.
4. **Wide-Card**: Cartão horizontal em 2 colunas para exibição em listas densas.
5. **Embed**: Transclusão embutida com moldura sutil.
6. **Page View**: Visualização completa de página com larguras configuráveis (*narrow* 680px, *standard* 760px, *wide* 1080px).

### Formatos de Coleção & Listagem
1. **Lista (*List View*)**: Linhas organizadas com alinhamento uniforme, data de modificação e ações em hover.
2. **Tabela (*Table View*)**: Tabela interativa com colunas redimensionáveis, reordenação e edição rápida de células.
3. **Galeria (*Gallery View*)**: Grid responsivo auto-ajustável de cartões (`minmax(19rem, 1fr)`).
4. **Mural de Conteúdo (*Wall of Content / Masonry*)**: Colunas fluidas em CSS masonry (`columns-1` a `columns-4`) com quebra evitada entre cartões (`break-inside-avoid`).

---

## 7. Editor de Blocos & Contrato de Interação

- **Editor Base**: Plate (`@platejs/basic-nodes` v53 com Slate foundation).
- **Blocos Suportados**: Parágrafos, Títulos H1–H3, Listas de Tarefas, Toggles colapsáveis, Callouts (7 estados: Info, Nota, Sucesso, Alerta, Perigo, Dica, Citação), Fórmulas KaTeX, Diagramas Mermaid, Blocos de Código com syntax highlighting.
- **Comandos Rápidos**:
  - `/`: Menu de inserção de blocos.
  - `[[` ou `@`: Menção e vinculação de objetos de conhecimento.
  - `#`: Seletor rápido de tags.
- **Contrato de Tempo de Animações**:
  - *Tooltips*: Atraso de 200ms, não interativo (`pointer-events: none`).
  - *HoverCards (Pré-visualizações)*: Atraso de 330ms, interativo (`pointer-events: auto`, tolerância de 150ms ao sair).
  - *Menus Compactos & Popovers*: Disparo imediato (0ms), animação de fade suave em 150ms.
