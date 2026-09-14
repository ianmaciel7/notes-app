# ADR-0007: Integração do Editor Rich-Text BlockNote e Bancada de Histórias Ladle

> **Substituído**: Esta decisão foi substituída pelo [ADR-0008: Migração para a Estrutura do Editor de Texto Rico Plate](0008-plate-rich-text-editor-framework-migration.md). O Plate substitui o BlockNote para a edição de texto rico em toda a aplicação.

* **Status**: Substituído pelo ADR-0008
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 12-09-2026

## Contexto e Declaração do Problema

No `notes-app`, alcançar a paridade de recursos com ferramentas modernas de gerenciamento de conhecimento orientadas a blocos (especificamente modelos de interação de objetos e blocos tipo Capacities, sintetizados a partir da base de código histórica em `.worktrees/old-5`) requer um editor de blocos de texto rico modular. Os usuários exigem manipulação intuitiva de blocos no estilo Notion/Capacities, incluindo cabeçalhos, parágrafos, listas de marcadores e numeradas, destaques, alças de arrastar e soltar blocos, formatação inline, menus de comando slash, barras de ferramentas flutuantes e blocos customizados de incorporação de objetos.

Ao mesmo tempo, o ambiente técnico impõe restrições arquiteturais explícitas:
1. **Compatibilidade com React 19 & Next.js 16**: O editor deve executar suavemente dentro do Next.js 16 App Router. Editores de texto rico dependem fortemente de APIs DOM do navegador (`window`, `document`, APIs de seleção DOM, contentEditable), que falham durante a Renderização no Lado do Servidor (SSR). Eles exigem carregamento dinâmico no cliente com `ssr: false` ou limites estritos de componentes cliente (`"use client"`).
2. **Alinhamento com o Design System & Estilização**: O editor deve integrar-se perfeitamente com a nossa biblioteca de componentes shadcn/ui, primitivas Base UI e tokens de design do Tailwind CSS v4 (`@blocknote/shadcn`, `@source "../../node_modules/@blocknote/shadcn"`).
3. **Bancada de Trabalho Isolada & Verificação Visual**: Sob o ADR-0005, todos os componentes centrais de UI e documentações são verificados em isolamento usando o Ladle sem a latência de inicialização ou restrições de roteamento do servidor Next.js. O editor deve ser renderizável e testável em histórias do Ladle com estados simulados, interações de menu slash e temas escuro/claro.

## Direcionadores da Decisão

* **Hierarquia Baseada em Blocos**: Esquema nativo de blocos (blocos como entidades JSON de primeira classe com IDs, tipos, conteúdo e propriedades) permitindo manipulação modular de blocos, reordenação por arrastar e soltar e serialização bidirecional compatível com esquemas de entidades delimitadas por espaço.
* **Fundação ProseMirror & Confiabilidade**: Alimentado por ProseMirror/TipTap sob o capô, garantindo primitivas sólidas de edição colaborativa, histórico robusto de desfazer/refazer transações e manipulação de seleção entre navegadores.
* **Integração de Tema shadcn/ui & Tailwind v4 de Primeira Classe**: Suporte para `@blocknote/shadcn` fornecendo menus slash, barras de ferramentas, menus laterais e itens de sugestão pré-construídos e personalizáveis que se conformam diretamente aos tokens de CSS da aplicação.
* **Bancada de Histórias Isolada (Ladle)**: A capacidade de desenvolver, testar sob estresse e inspecionar visualmente estados do editor, extensões de bloco customizadas e comandos slash dentro de histórias do Ladle sem a sobrecarga do servidor Next.js.
* **Isolamento Limpo de SSR**: Limites previsíveis de componentes cliente usando importações dinâmicas (`next/dynamic` com `ssr: false`) e hooks do ciclo de vida do cliente no Next.js 16 / React 19.

## Opções Consideradas

1. **BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) com Bancada Ladle**
2. **Estrutura Customizada TipTap / Slate / Plate**
3. **Lexical (`@lexical/react`)**

## Resultado da Decisão

Opção escolhida: **BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) com Bancada Ladle**.

O BlockNote fornece um equilíbrio ideal entre abstrações de bloco de alto nível e extensibilidade de baixo nível:
* Ele abstrai as APIs complexas de esquema e transação do ProseMirror em um modelo intuitivo de árvore de blocos (`editor.document`, `editor.insertBlocks`, `editor.updateBlock`).
* O pacote `@blocknote/shadcn` alinha-se perfeitamente com os tokens do nosso design system e configuração do Tailwind CSS v4 (`@source "../../node_modules/@blocknote/shadcn"` em `globals.css`).
* Os riscos de SSR no Next.js 16 são resolvidos de forma limpa encapsulando o editor em um componente cliente carregado via importação dinâmica (`dynamic(() => import('./blocknote-editor'), { ssr: false })`).
* O design visual e de interação é acelerado criando histórias dedicadas no Ladle para verificar manipulação de blocos, troca de temas e interações de menu slash de forma independente.

### Consequências Positivas

* **Desenvolvimento Acelerado**: Comandos slash prontos (`/heading`, `/bullet`, `/code`, `/table`), barras de formatação flutuantes, alças de arrastar e aninhamento de blocos eliminam centenas de horas de desenvolvimento de editor customizado.
* **Consistência de Design**: Padroniza a UI do editor em primitivas shadcn (menus, diálogos, tooltips, popovers) e variáveis de tema Tailwind v4 tanto nos modos claro quanto escuro.
* **Paridade Estilo Capacities**: Atende diretamente aos requisitos de edição de blocos estabelecidos nos worktrees de referência histórica em `.worktrees/old-5`, permitindo blocos customizados (ex: menções de objeto, flashcards embutidos, consultas de banco de dados) via API de esquema customizado do BlockNote.
* **Testes Visuais Sem Atrito**: Histórias no Ladle permitem testes rápidos de variantes do editor, estados somente leitura, estados iniciais do documento e mudanças de tema com HMR instantâneo via Vite.
* **Limites Arquiteturais Limpos**: O carregamento dinâmico puro no cliente protege os React Server Components do Next.js 16 contra travamentos do ProseMirror/BlockNote dependentes de DOM durante o SSR.

### Consequências Negativas

* **Tamanho do Bundle**: Os pacotes BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) trazem dependências do ProseMirror para os bundles do cliente; o code-splitting dinâmico é obrigatório para evitar o aumento do tamanho inicial da página.
* **Restrições de Abstração**: Customizar regras internas do esquema do ProseMirror ou eventos DOM de baixo nível requer trabalhar através das APIs de especificação de blocos e plugins do BlockNote em vez de transformações puras do ProseMirror.
* **Incompatibilidade com SSR**: O editor não consegue renderizar HTML estático completo diretamente no servidor sem utilitários de parser headless; seletores de carregamento ou esqueletos de placeholder devem ser fornecidos durante a montagem dinâmica.

## Prós e Contras das Opções

### BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) com Bancada Ladle

* Bom, porque fornece um modelo nativo de blocos, menu slash, alças de arrastar e soltar e esquema de blocos pronto para uso.
* Bom, porque o `@blocknote/shadcn` adota perfeitamente nossas variáveis de tema e estilos Tailwind CSS v4.
* Bom, porque se isola de forma limpa em histórias no Ladle para iteração rápida de UI sem a sobrecarga do servidor Next.js.
* Ruim, porque as dependências do ProseMirror contribuem com peso significativo de bundle.
* Ruim, porque layouts customizados de blocos avançados devem conformar-se à API de especificação de blocos customizados do BlockNote.

### Estrutura Customizada TipTap / Slate / Plate

* Bom, porque fornece controle de nível mais baixo sobre cada nó do editor, comando e definição de esquema.
* Ruim, porque construir interações robustas em nível de bloco no estilo Notion/Capacities (alças laterais de arrastar, seleção de múltiplos blocos, aninhamento hierárquico, menus de comando slash) requer grandes quantidades de código customizado complexo.
* Ruim, porque manter lógica de seleção de blocos e drag-and-drop customizada cria um encargo substancial de manutenção.
* **Rejeitado porque**: Construir um mecanismo de blocos do zero duplica um esforço de engenharia substancial já resolvido pelo BlockNote e desacelera a entrega de recursos para a paridade com o Capacities.

### Lexical (`@lexical/react`)

* Bom, porque é mantido pela Meta com alto desempenho e tipagem forte.
* Ruim, porque o Lexical é fundamentalmente um editor de árvore de documentos e não um editor de blocos opinativo; transformá-lo em um editor estilo Capacities/Notion requer transformações de nós customizados, blocos decoradores e UI customizada para comandos slash e alças laterais.
* Ruim, porque protótipos históricos em `.worktrees/old-5` mostraram alta complexidade ao tentar conectar nós do Lexical em cartões de entidades delimitadas por espaço e menus de bloco.
* **Rejeitado porque**: O Lexical requer código boilerplate excessivo e engenharia de plugins customizados para atingir paridade de UI baseada em blocos em comparação com o BlockNote.
