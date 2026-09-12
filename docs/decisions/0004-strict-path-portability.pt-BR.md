# ADR-0004: Regra Estrita de Portabilidade de Caminhos & Configurações

* **Status**: Aceito
* **Decisores**: Equipe de Engenharia & Produto
* **Data**: 11/09/2026

## Contexto e Declaração do Problema

Arquivos de configuração como `.codex/hooks.json` anteriormente continham caminhos absolutos definidos para usuários específicos (ex.: `C:/Users/ianma/...`), quebrando a portabilidade entre diferentes máquinas e ambientes de CI.

## Direcionadores da Decisão

* O repositório deve ser construído e executado sem problemas em diferentes ambientes de desenvolvedores (Windows, macOS, Linux, CI).
* Nenhum caminho de sistema específico do usuário deve ser incluído em configurações versionadas no Git.

## Opções Consideradas

1. **Caminhos relativos & nomes de comandos portáveis** em todos os arquivos de configuração + aplicação explícita de regras de agentes em `AGENTS.md` e `.agents/rules/portable-paths.md`.
2. Scripts de resolução de caminho absoluto.

## Resultado da Decisão

Opção escolhida: **Caminhos relativos & nomes de comandos portáveis** (ex.: `graphify hook-check`) porque garante 100% de portabilidade em todos os sistemas operacionais e setups de usuários.

### Consequências Positivas

* Arquivos de configuração podem ser commitados com segurança sem conflitos de ambiente do usuário.
* Aplicado rigorosamente nos agentes de IA via `.agents/rules/portable-paths.md`.

### Consequências Negativas

* Comandos CLI devem estar presentes na variável de ambiente `PATH` do usuário ou ser invocados de forma relativa.
