# ADR-0004: Regra Estrita de Portabilidade de Caminhos & Configurações

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 2026-09-11

## Contexto e Declaração do Problema

Arquivos de configuração como `.codex/hooks.json` anteriormente continham caminhos absolutos de usuário hardcoded (ex: `C:/Users/<nome-do-usuario>/...`), quebrando a portabilidade entre diferentes máquinas e ambientes de CI.

## Direcionadores da Decisão

* O repositório deve compilar e executar perfeitamente em diferentes ambientes de desenvolvimento (Windows, macOS, Linux, CI).
* Nenhum caminho de sistema específico de usuário em configurações commitadas.

## Opções Consideradas

1. **Caminhos relativos & nomes de comandos portáveis** em todos os arquivos de configuração + aplicação estrita de regras de agente em `AGENTS.md` & `.agents/rules/portable-paths.md`.
2. Scripts de resolução de caminhos absolutos.

## Resultado da Decisão

Opção escolhida: **Caminhos relativos & nomes de comandos portáveis** (ex: `graphify hook-check`) porque garante 100% de portabilidade em todos os sistemas operacionais e setups de usuários.

### Consequências Positivas

* Arquivos de configuração podem ser commitados com segurança sem conflitos de ambiente de usuário.
* Aplicado entre agentes de IA via `.agents/rules/portable-paths.md`.

### Consequências Negativas

* Comandos de CLI devem estar presentes na variável `PATH` do ambiente do usuário ou ser invocados de forma relativa.
