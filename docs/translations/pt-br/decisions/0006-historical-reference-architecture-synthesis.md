# ADR-0006: Síntese da Arquitetura Histórica de Referência & Especificações Base

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 12-09-2026

## Contexto e Declaração do Problema

O repositório contém múltiplas implementações históricas de referência em worktrees somente leitura (`.worktrees/old`, `.worktrees/old-2`, `.worktrees/old-3`, `.worktrees/old-4` e `.worktrees/old-5`). Esses worktrees contêm iterações em evolução de quatro subsistemas arquiteturais centrais:
1. **Evolução de Entidades**: Migração de entidades de estudo específicas do domínio (`StudyGoal`, `Question`, `Flashcard`) para modelos genéricos de objetos `SpaceStructure` e entidades delimitadas por espaço multi-tenant (`SpaceEntityRecord`).
2. **Modelos de Objetos em Paridade com Capacities**: Design de estúdio de objetos com definições de propriedades tipadas, 13 presets de objetos nativos do Capacities, sistema de cores para ícones/tons e visões de apresentação em Tabela, Galeria e Lista.
3. **Esquemas de Burndown no SRS**: Motor de repetição espaçada FSRS matemático com equações de decaimento de retenção e cálculos de ritmo de burndown para metas de exames (`dailyNewCardQuota`).
4. **Estruturas do Protocolo de Sincronização**: Fila de operações outbox offline-first (`SpaceOperation`), replicação baseada em sequências push/pull (`SpaceRemoteChange`, `SpaceSyncCursor`), controle otimista de concorrência (`SpaceConflict`), rastreamento de tombstones (`SpaceTombstone`) e estados de sincronização de ativos binários de mídia.

Precisávamos sintetizar essas descobertas históricas em uma documentação arquitetural autoritativa e estabelecer uma especificação formal de referência em `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` para o desenvolvimento atual e futuro.

## Direcionadores da Decisão

* **Integridade da Especificação**: Consolidar o conhecimento arquitetural disperso nos worktrees históricos em uma especificação de referência única e autoritativa.
* **Alinhamento de Paridade de Funcionalidades**: Esclarecer esquemas do estúdio de objetos e requisitos visuais de paridade com o Capacities.
* **Precisão Algorítmica**: Documentar formalmente as equações exatas de decaimento de memória FSRS e a matemática de burndown para metas de exame.
* **Padrões de Replicação**: Documentar o padrão de outbox de sincronização offline-first, candidatos a resolução de conflitos e mecanismos de tombstone.

## Opções Consideradas

1. **Sintetizar descobertas históricas de referência em `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` e indexar via ADR-0006**
2. **Manter o código histórico de referência disperso em `.worktrees/` sem documentação arquitetural centralizada**
3. **Reimplementar funcionalidades do zero sem documentar as especificações históricas**

## Resultado da Decisão

Opção escolhida: **Sintetizar descobertas históricas de referência em `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` e indexar via ADR-0006** porque estabelecer uma especificação comparativa explícita previne reinventar designs passados, garante consistência matemática nos cálculos do SRS e fornece diretrizes claras para entidades delimitadas por espaço e protocolos de sincronização.

### Consequências Positivas

* Centraliza a evolução de entidades, a paridade com o modelo de objetos Capacities, a matemática FSRS e os protocolos de sincronização em [`docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md`](../architecture/HISTORICAL_REFERENCE_SYNTHESIS.md).
* Serve como um guia inequívoco para a implementação ativa de funcionalidades em `src/`.
* Sincroniza especificações de arquitetura e registros de decisão em `DECISIONS.md`, `docs/decisions/README.md` e `ARCHITECTURE.md`.

### Consequências Negativas

* A documentação deve ser atualizada se futuros payloads do protocolo de sincronização ou parâmetros padrão do FSRS forem modificados.

## Prós e Contras das Opções

### Sintetizar descobertas históricas de referência em `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` e indexar via ADR-0006

* Bom, porque fornece especificações matemáticas e estruturais claras derivadas de código de referência validado empiricamente.
* Bom, porque alinha os agentes de IA e desenvolvedores em torno dos invariantes estabelecidos do sistema.
* Ruim, porque manter a documentação exige sincronização quando os esquemas mudam.

### Manter o código histórico de referência disperso em `.worktrees/` sem documentação arquitetural centralizada

* Bom, requer zero escrita imediata de documentação.
* Ruim, leva a perda de contexto, algoritmos inconsistentes e trabalho duplicado entre worktrees.
* **Rejeitado porque**: Confiar em código não indexado nos worktrees cria atrito e riscos de regressão.

### Reimplementar funcionalidades do zero sem documentar as especificações históricas

* Bom, dá total liberdade para redesenhar modelos arbitrariamente.
* Ruim, descarta a matemática de ritmo FSRS validada, designs de outbox de sincronização offline e contratos de paridade com o Capacities.
* **Rejeitado porque**: Abandonar implementações validadas de worktrees aumenta o risco de bugs e quebra a paridade visual/funcional.
