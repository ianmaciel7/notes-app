# ADR-0008: Migração para a Estrutura do Editor de Texto Rico Plate

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 12-09-2026

## Contexto e Declaração do Problema

No [ADR-0007](0007-blocknote-rich-text-editor-integration-and-ladle-story-workbench.md), o BlockNote foi adotado inicialmente para fornecer edição de texto rico baseada em blocos com comandos slash, barras de ferramentas de formatação e modelagem de documentos baseada em ProseMirror. No entanto, à medida que a arquitetura da aplicação evoluiu em direção a uma integração profunda com o Next.js 16 (App Router), React 19 Server Components, primitivas Base UI e o modelo de registro do shadcn/ui, vários pontos de atrito arquitetural e restrições surgiram com o BlockNote:

1. **Limites de Componentes Fechados vs. Registro de Código-Fonte Copiável**: O BlockNote encapsula seus elementos de UI dentro de pacotes pré-compilados (`@blocknote/shadcn`, `@blocknote/react`). Customizar comportamentos de interação, nós DOM, atalhos de teclado ou estilização exige sobrescrever hooks internos ou variáveis de tema CSS em vez de possuir e ajustar o código-fonte dos componentes. Em contraste, nossa arquitetura de UI é construída em torno da filosofia do shadcn/ui de primitivas de UI copiáveis e mantidas localmente.
2. **SSR Estático no Next.js 16 & Renderização Headless no Servidor**: O BlockNote depende fortemente de ambientes DOM do navegador (`window`, `document`, APIs de seleção DOM), impedindo a renderização estática de documentos no servidor sem importações dinâmicas no cliente (`ssr: false`) e esqueletos de placeholder. Para renderização de documentos somente leitura, carregamentos iniciais rápidos de página e desempenho de SEO/preview, é necessária uma arquitetura de editor capaz de renderização estática headless (`platejs/static` via `EditorStatic`) no servidor sem emulação de DOM.
3. **Alinhamento com o Design System & Primitivas Base UI**: Nosso design system está migrando para primitivas Base UI (`@base-ui/react`) e tokens de design do Tailwind CSS v4 gerenciados através do `components.json`. Integrar widgets de editores externos que ditam sua própria marcação interna cria um encargo de manutenção e discrepâncias de estilo entre os modos claro e escuro.
4. **Compatibilidade com React 19**: As dependências do wrapper ProseMirror do BlockNote exigiam ciclos de vida de montagem complexos no cliente para evitar falhas de hidratação e erros de timing de ref sob recursos concorrentes do React 19.

Para resolver esses desafios e estabelecer uma fundação de editor a longo prazo, decidimos migrar do BlockNote para o **Plate** (`platejs` v53, `@platejs/basic-nodes`, Slate) combinado com componentes de código-fonte do Plate UI derivados do registro `@plate` (`https://platejs.org/r/{name}.json`) configurado em `components.json`, sincronizados através da skill `sync-plate-ui`.

## Direcionadores da Decisão

* **Alinhamento Nativo com shadcn/ui & Base UI**: Paridade visual e arquitetural completa com nossos tokens de design system e primitivas Base UI existentes, eliminando marcações externas e wrappers de temas de terceiros.
* **Registro de Componentes com Código-Fonte Copiável (`@plate`)**: Adotar o padrão shadcn para componentes do editor, onde os elementos de UI (barras de ferramentas, menus, diálogos, alças de bloco) vivem diretamente em `src/components/ui/` como arquivos de código-fonte copiáveis, auditáveis e totalmente customizáveis em vez de dependências npm opacas.
* **Capacidades de SSR Estático Headless no Next.js 16**: A habilidade de renderizar estados estáticos de documentos no servidor usando `platejs/static` (`EditorStatic`), transmitindo HTML pré-renderizado para o cliente e hidratando interativamente sem alterações inesperadas de layout ou travamentos de SSR.
* **Compatibilidade Total com React 19**: Suporte de primeira classe para a concorrência do React 19, refs modernas e integração perfeita com limites de Server e Client Components.
* **Fundação Slate & Arquitetura de Plugins Granular**: Um modelo de documento limpo e focado em dados (árvores JSON com nós e marcas tipados) com uma arquitetura de plugins não opinativa (`BasicBlocksPlugin`, `BasicMarksPlugin`, plugins customizados de incorporação de objetos) sob medida para estruturas modulares de objetos no estilo Capacities.
* **Testes Isolados na Bancada do Ladle**: Verificação visual rápida, modelagem de estado e testes de interação no Ladle (`src/components/editor/editor.stories.tsx`) sem a sobrecarga do servidor Next.js.

## Opções Consideradas

1. **Plate (`platejs` v53 / registro `@plate` com `sync-plate-ui`)** [Selecionado]
2. **BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`)** [Substituído]
3. **Lexical (`@lexical/react`)**

## Resultado da Decisão

Opção escolhida: **Plate (`platejs` v53 / registro `@plate` com `sync-plate-ui`)**.

O Plate aborda todas as limitações centrais do BlockNote enquanto retém a edição de texto rico em blocos, plugins extensíveis e ergonomia intuitiva de edição:

* **Posse do Código-Fonte**: Configurado o registro `@plate` em `components.json` (`"registries": { "@plate": "https://platejs.org/r/{name}.json" }`). As primitivas do editor (`Editor`, `EditorContainer`, `EditorStatic` e futuros plugins) são instaladas diretamente em `src/components/ui/`, fornecendo controle total sobre marcação, acessibilidade e estilização.
* **SSR Estático via `platejs/static`**: Com o `EditorStatic`, notas e documentos podem ser renderizados no lado do servidor como HTML puro sem exigir uma janela do navegador ou fallbacks de limites de cliente dinâmicos, melhorando o Time to First Contentful Paint (FCP) e a experiência de leitura.
* **Estado e Extensibilidade Alimentados pelo Slate**: O Plate v53 oferece uma pipeline modular de plugins (`usePlateEditor`, `Plate`, `PlateContainer`, `PlateContent`) que opera em árvores Slate em JSON puro. Blocos customizados no estilo Capacities (referências a objetos, matemática inline, destaques, flashcards) são simples de implementar como plugins customizados do Plate.
* **Automação de Manutenção**: A skill `sync-plate-ui` garante a sincronização automatizada de componentes do Plate UI a partir dos registros de origem, preservando as customizações locais.
* **Integração com Histórias no Ladle**: O editor é demonstrado e verificado em `src/components/editor/editor.stories.tsx`, validando edição de blocos, marcas inline e troca de temas em uma bancada Vite isolada.

### Consequências Positivas

* **Stack de UI Unificada**: Componentes do editor usam exatamente as mesmas variáveis Tailwind CSS v4, primitivas Base UI e convenções da utilidade `cn()` que o restante da aplicação.
* **Zero Falhas de Hidratação**: Separação clara entre `EditorStatic` para renderização de Server Components e `Editor` para edição interativa no cliente.
* **Plugins Modulares Customizados**: Chips de objeto customizados, embeds de tags e blocos de links bidirecionais podem ser adicionados como plugins isolados do Plate sem disputar com um contêiner de blocos opinativo.
* **Atrito Reduzido de Dependências**: Elimina restrições de wrappers do ProseMirror e alinha-se diretamente com o React 19.
* **Atualizações Contínuas do Registro**: O registro `@plate` permite a instalação incremental de funcionalidades especializadas (tabelas, menções, comandos slash, mídia) sob demanda.

### Consequências Negativas

* **Esforço de Migração**: Conteúdos de notas existentes armazenados no formato JSON do BlockNote exigem mapeamento de serialização para as árvores de valores do Plate/Slate (`Array<{ type: string, children: Array<{ text: string }> }>`).
* **Manutenção do Código-Fonte**: Possuir o código-fonte dos componentes em `src/components/ui/` significa que correções de bugs ou melhorias upstream devem ser puxadas e revisadas usando `sync-plate-ui`.
* **Curva de Aprendizado**: As APIs de transformação e seleção do Slate exigem que os desenvolvedores entendam as primitivas de caminhos e pontos do Slate ao construir mutações complexas de blocos.

## Prós e Contras das Opções

### Plate (`platejs` v53 / registro `@plate` com `sync-plate-ui`)

* Bom, porque entrega o modelo de componentes do shadcn para edição de texto rico, colocando o código-fonte dos componentes em `src/components/ui/`.
* Bom, porque fornece `platejs/static` para renderização de HTML no lado do servidor no Next.js 16 sem simulações de DOM.
* Bom, porque suporta nativamente o React 19 e alinha-se com as primitivas Base UI.
* Bom, porque o registro `@plate` em `components.json` permite scaffolding fácil e atualizações automatizadas via `sync-plate-ui`.
* Bom, porque executa de forma limpa em histórias isoladas no Ladle (`src/components/editor/editor.stories.tsx`).
* Ruim, porque gerenciar componentes de código-fonte aumenta a contagem de linhas do repositório e exige sincronização disciplinada do registro.
* Ruim, porque as transformações no Slate exigem familiaridade com operações de cursor e nós no Slate.

### BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`)

* Bom, porque fornecia comandos slash e alças de arrastar no estilo Notion prontos para uso.
* Ruim, porque os componentes de UI eram pacotes npm empacotados em vez de código-fonte copiável, limitando a customização a variáveis CSS.
* Ruim, porque carecia de um pacote de renderização SSR estática headless, forçando todas as instâncias do editor a carregar dinamicamente no cliente (`ssr: false`).
* Ruim, porque a integração com ProseMirror introduziu atrito de hidratação e restrições de tempo de ciclo de vida no React 19.
* **Rejeitado / Substituído porque**: Conflitava com nosso mandato arquitetural para componentes copiáveis shadcn/Base UI, renderização estática no lado do servidor no Next.js 16 e posse total do código-fonte.

### Lexical (`@lexical/react`)

* Bom, porque é ativamente mantido pela Meta com alto desempenho e tipagem forte.
* Ruim, porque carece de um registro de componentes oficial alinhado com shadcn, exigindo que todas as primitivas de barras de ferramentas, menus e diálogos sejam construídas do zero.
* Ruim, porque construir interfaces baseadas em blocos com menus slash, alças laterais e SSR estático requer código boilerplate de plugins customizados substancial em comparação com o Plate.
* **Rejeitado porque**: O Plate oferece integração superior pronta para uso com shadcn/ui, um registro `@plate` dedicado e capacidades de primeira classe de SSR estático para o Next.js 16.
