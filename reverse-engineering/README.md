# Reverse Engineering Knowledge Base

Objetivo: manter evidência estruturada para replicação da experiência da referência sem depender de memória de conversa.

Diretórios principais:
- `reference/`: manifesto e páginas/componentes/estilos observados.
- `local/`: evidência do que foi reproduzido localmente.
- `pages`, `states`, `flows`: superfície e automação de estado.
- `network/`: observações de fluxo e requests (quando disponíveis).
- `accessibility/`: roles e matriz de teclado.
- `styles/`, `tokens/`, `components/`: inferências de visual e estrutura.
- `screenshots/`: plano e índice de captura (ainda pendente de geração real).
- `comparisons/`: relatórios de cobertura e diferenças.
- `knowledge/`: grafo de entidades/transições para consulta rápida.
- `manifests/`: índices de rastreamento.

Checklist mínimo antes de abrir uma nova iteração:
1. Rodar captura de estados interativos não-botão.
2. Executar captura de teclado/movimentação.
3. Gerar screenshots de referência/local + diferença.
4. Atualizar `comparisons/coverage-report.json` e re-rodar Graphify.

## Extração de assets do Capacities (estado atual)

- Script de coleta: `node scripts/extract-capacities-assets.mjs`
- Manifesto de referência atual (`reference/assets/asset-manifest.json`) lista:
  - `92` assets descobertos (inclui `__vite__mapDeps` embutido em `index83139.js.download`)
  - `92` arquivos efetivamente baixados/localmente persistidos (sem falhas)
  - `0` pendentes
- O extração/atualização foi reexecutada com sucesso via:
  - `npx.cmd -y pnpm@11.20.0 reverse:assets --download`
- As rotas já mapeadas e capturadas cobrem: `/`, `/tipos/*` (14 rotas no total, incluindo `/tipos/audit-entities`).
