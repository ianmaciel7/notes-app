# ADR-0005: Bancada de Componentes Ladle e Visualizador de Documentação

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 12-09-2026

## Contexto e Declaração do Problema

O repositório utiliza o Ladle para renderização rápida e sem configuração de componentes e para visualização interativa da documentação. Anteriormente, o Ladle servia principalmente como um visualizador interativo para documentações em markdown e especificações arquiteturais sob `docs/`. No entanto, o desenvolvimento de componentes e os testes visuais foram prejudicados porque as histórias de UI isoladas originalmente localizadas em `.worktrees/old-5` não estavam presentes em `src/`.

Precisávamos estabelecer uma estratégia unificada que suportasse tanto a renderização interativa da documentação de arquitetura quanto o desenvolvimento isolado de componentes de UI sem sobrecarga ou necessidade de iniciar um servidor Next.js completo.

## Direcionadores da Decisão

* **Dupla Funcionalidade**: Servir tanto como visualizador interativo de documentação de arquitetura (`docs/**/*.stories.tsx`) quanto como bancada de trabalho de componentes de UI isolados (`src/**/*.stories.tsx`).
* **Experiência do Desenvolvedor**: Fornecer HMR (Hot Module Replacement) quase instantâneo alimentado pelo Vite sem exigir a inicialização do servidor Next.js.
* **Isolamento de Componentes**: Restaurar as histórias de componentes de UI de `.worktrees/old-5` para `src/` para permitir testes visuais isolados para elementos de UI (ex: componentes shadcn em `src/components/ui/`).
* **Escaneamento Sem Configuração**: Aproveitar os padrões de busca em `.ladle/config.mjs` (`src/**/*.stories.@(js|jsx|ts|tsx|mdx)` e `docs/**/*.stories.@(js|jsx|ts|tsx|mdx)`) para detecção unificada de histórias.

## Opções Consideradas

1. **Configuração do Ladle com Dupla Função com histórias de componentes restauradas em `src/` ao lado de histórias de documentação em `docs/`**
2. **Configuração do Storybook para propósito único de componentes com gerador separado de documentação estática**
3. **Configuração do Ladle exclusiva para documentação sem histórias de componentes em `src/`**

## Resultado da Decisão

Opção escolhida: **Configuração do Ladle com Dupla Função com histórias de componentes restauradas em `src/` ao lado de histórias de documentação em `docs/`** porque o Ladle fornece inicialização extremamente rápida e HMR via Vite, lida perfeitamente com especificações em Markdown/MDX e histórias de componentes React, e consolidar o isolamento de componentes e visualização de documentação em uma única ferramenta elimina complexidade desnecessária de ferramentas.

### Consequências Positivas

* Restaura histórias de componentes de UI de `.worktrees/old-5` para `src/` (ex: `src/components/ui/button.stories.tsx`), permitindo verificação visual isolada.
* Desenvolvedores podem inspecionar tanto diagramas/especificações de arquitetura do sistema quanto estados de componentes de UI em uma única interface de bancada no Ladle.
* Ciclos rápidos de build e dev alimentados pelo Vite reduzem os loops de feedback durante a iteração de componentes.

### Consequências Negativas

* Histórias de componentes em `src/` devem ser mantidas junto com as atualizações de código dos componentes.
* A configuração do Ladle deve manter padrões multi-glob (`src/**` e `docs/**`).

## Prós e Contras das Opções

### Configuração do Ladle com Dupla Função com histórias de componentes restauradas em `src/` ao lado de histórias de documentação em `docs/`

* Bom, porque fornece inicialização rápida e HMR para testes de documentação e de estado de componentes.
* Bom, porque unifica especificações de arquitetura e bibliotecas de componentes de UI em um único visualizador.
* Ruim, porque os desenvolvedores devem manter os arquivos de história de componentes sincronizados com as alterações de propriedades dos componentes.

### Configuração do Storybook para propósito único de componentes com gerador separado de documentação estática

* Bom, porque o Storybook possui um grande ecossistema de plugins.
* Ruim, porque o Storybook introduz dependências pesadas, tempos de build mais lentos e exige o gerenciamento de ferramentas separadas para docs vs. componentes.
* **Rejeitado porque**: A sobrecarga de build e a complexidade conflitam com os requisitos de desempenho do repositório e a filosofia de ferramentas leves.

### Configuração do Ladle exclusiva para documentação sem histórias de componentes em `src/`

* Bom, porque menos arquivos de história precisam de manutenção em `src/`.
* Ruim, porque os componentes de UI só podem ser testados dentro de layouts de página completos do Next.js, dificultando o teste isolado de componentes.
* **Rejeitado porque**: Testar componentes exclusivamente em contextos de página leva a loops de iteração mais lentos e estados de borda não verificados.
