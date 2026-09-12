# Guia de Desenvolvimento Local & Workflow

Este guia cobre tarefas recorrentes para desenvolvedores trabalhando no `notes-app`.

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

Inicie o Next.js no modo de desenvolvimento com Turbopack:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 3. Qualidade de Código & Verificação

Utilizamos o **Biome** para linting e formatação rápidos e unificados, juntamente com a checagem de tipos do TypeScript.

Execute a verificação de qualidade de código:

```bash
pnpm check
```

Aplique automaticamente formatação e correções seguras de linting:

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

Ao interagir com assistentes de código de IA nesta base de código:

* Consulte [`AGENTS.md`](../../AGENTS.md) para instruções primárias.
* Garanta que todas as regras de caminhos de sistema sigam [.agents/rules/portable-paths.md](../../.agents/rules/portable-paths.md).
