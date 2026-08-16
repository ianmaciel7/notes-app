# Browser Recovery Runbook

## Objetivo
Evitar a repetição de falhas de automação ao abrir o Capacities/Brave e definir uma forma reprodutível de continuar trabalhos de reverse-engineering sem perder contexto.

## Situação aplicada
Sempre que for necessário:
- abrir `app.capacities.io`,
- validar sessão autenticada,
- ou retomar captura baseada em cookies/sessão do navegador.

## Regras de prioridade

- Prioridade 1: usar o fluxo do navegador do Codex (`open_in_codex`) com a URL alvo.
- Prioridade 2: somente se necessário e autorizado, usar automação direta de navegador por shell.
- Proibição: evitar `Start-Process ... brave.exe` como passo padrão de recuperação.

## Procedimento operacional

1. Abrir a URL no navegador do Codex:
   - `https://app.capacities.io/`
2. Confirmar visualmente que a sessão está autenticada.
3. Só então executar as etapas de captura/requisição dependentes de autenticação.
4. Em erro de limite/uso da sessão da ferramenta:
   - não repetir workaround,
   - registrar o estado atual,
   - aguardar autorização ou continuar no fluxo não destrutivo.

## Resultado esperado
- Se autenticado, a captura pode seguir com o mesmo contexto da aba aberta.
- Se não autenticado, o processo deve ser pausado até o login manual.

## Histórico
- 2026-08-16: fluxo padronizado após bloqueios recorrentes de execução e falta de rede para `app.capacities.io`.
