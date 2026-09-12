---
name: Notes App
colors:
  background: "#ffffff"
  foreground: "#171717"
  dark-background: "#0a0a0a"
  dark-foreground: "#ededed"
  zinc-50: "#fafafa"
  zinc-400: "#a1a1aa"
  zinc-600: "#52525b"
  zinc-950: "#09090b"
---

# Design System: Notes App

## 1. Tema Visual & Atmosfera
A identidade visual do Notes App é ultra-minimalista, focada e livre de distrações. Construída sobre tipografia monocromática limpa e grids de layout espaçosos, utiliza contrastes nítidos e adaptação suave ao modo escuro para oferecer um ambiente confortável para leitura e tomada de notas.

O design apoia-se nos pares de fontes Geist e Geist Mono para evocar uma estética moderna e de alta precisão para desenvolvedores, combinada com espaçamento vertical generoso e controles arredondados em formato de pílula.

## 2. Paleta de Cores & Papéis
### Fundação Primária
- **Branco Pura Tela (`#ffffff`)** — Fundo padrão do modo claro.
- **Preto Meia-Noite Profundo (`#0a0a0a` / `#000000`)** — Fundo do modo escuro & texto principal de alto contraste.

### Tipografia & Hierarquia de Texto
- **Tinta Primária (`#171717`)** — Texto do corpo de alto contraste no modo claro.
- **Branco Suave (`#ededed`)** — Texto principal do corpo no modo escuro.
- **Cinza Mudo (`#52525b` / `zinc-600`)** — Texto secundário de descrição.
- **Cinza Modo Escuro (`#a1a1aa` / `zinc-400`)** — Texto secundário no modo escuro.

### Estados Funcionais & Elementos Interativos
- **Botão de Ação Primário (`#171717` / `#ffffff`)** — Fundo do CTA principal com raio arredondado em pílula.
- **Borda Sutil (`rgba(0,0,0,0.08)`)** — Bordas finas de componentes e divisores sutis.

## 3. Regras de Tipografia
### Hierarquia & Pesos
- **Fonte Sans**: Geist (`var(--font-geist-sans)`), sans-serif geométrica limpa.
- **Fonte Mono**: Geist Mono (`var(--font-geist-mono)`), monoespaçada nítida para blocos de código inline.
- **H1 Display**: `3xl` (30px), peso `600` (semibold), altura de linha `1.25`, tracking `tight`.
- **Body Large**: `lg` (18px), altura de linha `1.75` (relaxado), cor secundária.
- **Trecho de Código**: `font-mono`, tamanho `0.9em`, camada de fundo em pílula.

## 4. Estilização de Componentes
### Botões
- Formato de pílula (`rounded-full`), altura de `48px` (`h-12`), espaçamento horizontal de `20px` (`px-5`).
- Botão primário: Fundo preto sólido com texto branco (invertido no modo escuro), transição sutil no hover para `#383838`.
- Botão secundário: Fundo transparente com borda fina (`border-black/[.08]`), estado suave de hover (`hover:bg-black/[.04]`).

### Cards & Container Principal
- Container de largura máxima sem bordas (`max-w-3xl`), espaçamento interno generoso (`py-32 px-16`).
- Layout flex em altura total com alinhamento responsivo ao centro no mobile e à esquerda no desktop (`sm:items-start`).

## 5. Princípios de Layout
### Grid & Estrutura
- Layout de coluna única centralizado limitado a `768px` (`max-w-3xl`).
- Espaçamento vertical utilizando gaps do flexbox (`gap-6`, `gap-4`).

### Comportamento Responsivo & Toque
- Centralização mobile-first (`items-center text-center`), ajustando para alinhamento à esquerda em desktops (`sm:items-start sm:text-left`).
- Botões de toque em largura total no mobile, ajustando para largura fixa (`md:w-[158px]`) em visões desktop.

## 6. Notas de Design System para Geração Open Design
### Linguagem a Utilizar
- Monocromático, minimalista, focado em desenvolvedores, alto contraste, tipografia limpa.
### Prompts para Componentes
- "Crie um componente de card de nota minimalista usando Geist sans-serif, bordas finas border-black/[.08], cards rounded-2xl e suporte a modo escuro."
