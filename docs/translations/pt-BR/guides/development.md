# Guia de Desenvolvimento Local & Workflow

Este guia cobre as tarefas recorrentes para desenvolvedores que trabalham no `notes-app`.

---

## 1. Pré-requisitos & Instalação

* **Node.js**: v20 ou superior
* **Gerenciador de Pacotes**: `pnpm` (versão 9+)

Instale as dependências:

```bash
pnpm install
```

---

## 2. Executando o Servidor de Desenvolvimento

Inicie o Next.js em modo de desenvolvimento com Turbopack:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 3. Qualidade de Código & Verificação

Utilizamos o **Biome** para linting e formatação rápidos e unificados, juntamente com a checagem de tipos TypeScript.

Execute a verificação de qualidade de código:

```bash
pnpm check
```

Aplique automaticamente a formatação e correções seguras de lint:

```bash
pnpm check:fix
```

Verificação de build (executa o build de produção):

```bash
pnpm build
```

---

## 4. Grafo de Conhecimento (`graphify`)

O projeto utiliza o `graphify` para manter a estrutura de AST e os relacionamentos entre arquivos:

* Consultar o grafo: `graphify query "<pergunta>"`
* Visualizar o caminho mais curto: `graphify path "<A>" "<B>"`
* Atualizar o grafo após edições: `graphify update .`

---

## 5. Trabalhando com Agentes de IA

Ao interagir com assistentes de IA nesta base de código:

* Consulte [`AGENTS.md`](../../AGENTS.md) para obter as instruções primárias.
* Garanta que todas as regras de caminhos de sistema sigam [.agents/rules/portable-paths.md](../../.agents/rules/portable-paths.md).
