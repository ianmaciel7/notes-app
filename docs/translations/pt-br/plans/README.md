# Planos de Implementação

Este diretório contém planos de execução, sequências de implantação e listas de verificação de implementação.

## Política do Diretório

- **Arquitetura Baseada em ADRs**: Todos os designs técnicos, esquemas de dados e escolhas arquiteturais devem ser de autoria como ADRs sob `docs/decisions/`.
- **Localização dos Planos**: O detalhamento de tarefas, sequências de implementação passo a passo ou checklists que não estejam incorporados diretamente em uma ADR devem residir aqui (`docs/plans/`).
- **Proibição Estrita de Superpowers**: Nunca crie ou use `docs/superpowers/` ou `docs/superpowers/plans/`.
- **Invariante de Visibilidade do Ladle**: Todo arquivo markdown em `docs/plans/` deve ser importado e registrado como uma história em `docs/plans/plans.stories.tsx` usando o `DocViewer`.
