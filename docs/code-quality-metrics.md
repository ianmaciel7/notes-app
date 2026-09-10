# Code Quality Metrics

Este projeto usa um fluxo exclusivamente local para qualidade estrutural e manutenibilidade. O
analisador deste fluxo e somente o Biome 2.5.11, conforme `package.json`,
`pnpm-lock.yaml`, `biome.json` e `node_modules/@biomejs/biome/package.json`.

## Comandos

| Comando | Comportamento |
| --- | --- |
| `pnpm metrics` | Executa `biome lint` apenas com as regras selecionadas e falha em erros ou avisos. |
| `pnpm metrics:report` | Executa as mesmas regras, valida o JSON do Biome e salva `reports/code-quality-metrics/latest.json`. |

Os comandos nao rodam formatacao, testes, cobertura, seguranca, build, Git hooks, CI ou comparacao
com branch. O escopo padrao e o codigo salvo incluido por `biome.json`.

## Regras Selecionadas

| Regra Biome | Limite | Papel |
| --- | --- | --- |
| `complexity/noExcessiveCognitiveComplexity` | 15, erro | Indicador nativo de complexidade cognitiva por funcao. |
| `complexity/useMaxParams` | 4, aviso | Indicador nativo de quantidade de parametros por funcao/metodo. |
| `complexity/noExcessiveLinesPerFunction` | 80, erro | Indicador nativo de tamanho de funcao. |
| `style/noExcessiveLinesPerFile` | 600, aviso | Indicador nativo de tamanho de arquivo. |

`metrics` usa `--error-on-warnings`, entao avisos selecionados tambem tornam o comando reprovado.
Isso preserva a severidade do `lint` geral e torna o fluxo de metricas mais estrito.

## Convencao De Manutenibilidade

O numero agregado no relatorio se chama:

> Ocorrencias das regras de manutenibilidade selecionadas no Biome.

Ele conta somente diagnosticos emitidos pelas quatro regras acima. Nao representa todos os problemas
de qualidade, nao inclui formatacao e nao substitui revisao humana.

## Matriz De Suporte

| Metrica | Unidade de analise | Definicao | Aplicabilidade | Suporte | Evidencia | Resultado | Limitacao |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Complexidade cognitiva | Funcao | Pontuacao cognitiva calculada pelo Biome. | Aplicavel a funcoes TS/TSX/JS/JSX incluidas. | Nativo do Biome | `lint/complexity/noExcessiveCognitiveComplexity`; `pnpm metrics`. | Violacao de limite quando emitida; nao lista valores de funcoes aprovadas. | Nao e complexidade ciclomatica, percebida ou WMC. |
| Quantidade de parametros | Funcao/metodo | Numero de parametros na assinatura. | Aplicavel a funcoes e metodos. | Nativo do Biome | `lint/complexity/useMaxParams`; max 4. | Violacao de limite quando emitida. | Nao mede variaveis locais nem qualidade da API. |
| Linhas por funcao | Funcao | Linhas no corpo da funcao, ignorando linhas em branco. | Aplicavel a funcoes analisadas pelo Biome. | Nativo do Biome | `lint/complexity/noExcessiveLinesPerFunction`; max 80. | Violacao de limite quando emitida. | Nao mede responsabilidade, coesao ou complexidade logica. |
| Linhas por arquivo | Arquivo | Linhas no arquivo, ignorando linhas em branco. | Aplicavel a arquivos suportados pelo Biome. | Nativo do Biome | `lint/style/noExcessiveLinesPerFile`; max 600. | Violacao de limite quando emitida. | Nao equivale a modulo, pacote ou arquitetura. |
| Tamanho ABC | Funcao/metodo | Assignments, branches e conditions segundo uma variante documentada. | Faz sentido para codigo TS, mas requer contador AST proprio. | Nao suportado no fluxo atual | Nenhuma regra nativa selecionada no Biome 2.5.11. | NAO MEDIDO | Nao ha contagem separada de assignments, calls e conditions via Biome. |
| Complexidade percebida | Funcao/metodo | Metrica especifica do RuboCop Metrics/PerceivedComplexity. | Conceitualmente aplicavel, mas definida para outro ecossistema. | Nao suportado no fluxo atual | Sem regra Biome equivalente. | NAO MEDIDO | Nao confundir com complexidade cognitiva. |
| Quantidade de variaveis locais | Funcao/metodo | Contagem total de locais, com politica para parametros, destructuring e escopos internos. | Aplicavel a TS, mas requer definicao e analise AST. | Nao suportado no fluxo atual | Biome pode detectar variaveis nao usadas, mas isso nao e total de locais. | NAO MEDIDO | Nao converter ausencia de unused vars em quantidade zero. |
| Numero de metodos por classe | Classe | Contagem de construtores, metodos, estaticos, getters/setters conforme convencao. | Aplicavel apenas a classes presentes. | Nao suportado no fluxo atual | Sem regra Biome selecionada para contagem por classe. | NAO MEDIDO | Nao conta propriedades-funcao nem metodos herdados. |
| Numero de atributos por classe | Classe | Contagem de campos/propriedades conforme convencao. | Aplicavel apenas a classes presentes. | Nao suportado no fluxo atual | Sem regra Biome selecionada. | NAO MEDIDO | Campos estaticos, herdados e inferidos nao sao tratados. |
| Numero de sobrecargas por metodo | Metodo/funcao TS | Assinaturas de overload separadas da implementacao. | Aplicavel a TypeScript quando houver overloads. | Nao suportado no fluxo atual | Sem regra Biome selecionada. | NAO MEDIDO | Nao contar assinaturas por regex. |
| Fan-in | Arquivo/modulo/pacote | Dependencias de entrada por granularidade definida. | Aplicavel a grafo de imports TS. | Nao suportado no fluxo atual | Biome nao calcula fan-in no comando selecionado. | NAO MEDIDO | Linhas de import nao sao fan-in. |
| Fan-out | Arquivo/modulo/pacote | Dependencias de saida por granularidade definida. | Aplicavel a grafo de imports TS. | Nao suportado no fluxo atual | Biome nao calcula fan-out no comando selecionado. | NAO MEDIDO | Linhas de import nao sao fan-out. |
| Acoplamento aferente (Ca) | Pacote/modulo | Dependentes externos a fronteira analisada. | Requer fronteiras explicitas. | Nao suportado no fluxo atual | Sem metrica Biome equivalente. | NAO MEDIDO | Ciclos/imports restritos seriam verificacoes, nao Ca. |
| Acoplamento eferente (Ce) | Pacote/modulo | Dependencias externas a fronteira analisada. | Requer fronteiras explicitas. | Nao suportado no fluxo atual | Sem metrica Biome equivalente. | NAO MEDIDO | Import restrito nao e Ce. |
| Instabilidade (I) | Pacote/modulo | `Ce / (Ca + Ce)`, com denominador zero definido. | Requer Ca e Ce. | Nao suportado no fluxo atual | Sem Ca/Ce medidos. | NAO MEDIDO | Nao calcular com dados ausentes. |
| Grau de abstracao (A) | Pacote/modulo | Proporcao de tipos abstratos em universo definido. | Pouco aplicavel ao estilo funcional/React dominante. | Nao suportado no fluxo atual | Sem metrica Biome equivalente. | NAO MEDIDO | Nao criar interfaces para melhorar indicador. |
| Distancia da sequencia principal (D) | Pacote/modulo | Distancia calculada a partir de A e I. | Requer A e I. | Nao suportado no fluxo atual | A e I nao medidos. | NAO MEDIDO | Nao calcular com dados ausentes. |
| Coesao relacional (H) | Modulo/pacote | Relacoes internas e formula escolhida. | Requer modelo de relacoes. | Nao suportado no fluxo atual | Sem metrica Biome equivalente. | NAO MEDIDO | Nao inferir coesao qualitativa como H. |
| CBO | Classe | Relacoes entre classes que contam como acoplamento. | Aplicavel somente a classes reais. | Nao suportado no fluxo atual | Sem regra Biome equivalente. | NAO MEDIDO | Projeto e majoritariamente funcional/React. |
| WMC | Classe | Soma de metodos com peso definido, normalmente complexidade ciclomatica. | Aplicavel somente a classes reais. | Nao suportado no fluxo atual | Biome nao mede complexidade ciclomatica nem WMC. | NAO MEDIDO | Nao somar complexidade cognitiva e chamar de WMC. |
| RFC | Classe | Conjunto de metodos de resposta e chamadas resolvidas. | Aplicavel somente a classes reais. | Nao suportado no fluxo atual | Sem resolvedor de chamadas no fluxo Biome. | NAO MEDIDO | Chamadas dinamicas/imports nao resolvidos ficam fora. |
| NOC | Classe | Numero de subclasses diretas. | Aplicavel somente a hierarquias de classes. | Nao suportado no fluxo atual | Sem regra Biome equivalente. | NAO MEDIDO | Nao transforma componentes em classes. |
| LCOM | Classe | Variante especifica de falta de coesao. | Aplicavel somente a classes reais. | Nao suportado no fluxo atual | Sem regra Biome equivalente. | NAO MEDIDO | Variante nao definida no Biome. |
| LCOM-HS | Classe | Henderson-Sellers, com casos degenerados. | Aplicavel somente a classes reais. | Nao suportado no fluxo atual | Sem regra Biome equivalente. | NAO MEDIDO | Requer modelo de uso de atributos por metodo. |
| TCC | Classe | Conexao direta entre metodos. | Aplicavel somente a classes reais. | Nao suportado no fluxo atual | Sem regra Biome equivalente. | NAO MEDIDO | Requer analise de acesso a estado. |
| LCC | Classe | Conexao indireta entre metodos. | Aplicavel somente a classes reais. | Nao suportado no fluxo atual | Sem regra Biome equivalente. | NAO MEDIDO | Requer grafo interno de metodos. |
| Technical Debt Ratio | Projeto | Razao entre custo de remediacao e custo de desenvolvimento. | Requer modelo de custo. | Nao suportado no fluxo atual | Sem modelo configurado. | NAO MEDIDO | Nao atribuir minutos arbitrarios. |
| Maintainability Rating | Projeto | Nota derivada de proporcao de divida tecnica. | Requer Technical Debt Ratio. | Nao suportado no fluxo atual | Sem TDR medido. | NAO MEDIDO | Nao gerar notas A-E a partir de diagnosticos. |

## Verificacoes Arquiteturais

Biome possui regras de importacao e ciclo, mas este fluxo nao as usa como metricas de acoplamento.
Caso sejam habilitadas no futuro, documente-as como verificacoes arquiteturais pelo nome da regra,
nao como Ca, Ce, CBO, fan-in ou fan-out.

## Revisao Qualitativa Da IA

A IA pode apontar funcoes longas, responsabilidades misturadas e oportunidades de refatoracao com
arquivo e trecho. Isso deve ficar separado do relatorio automatico e nao pode receber pontuacao,
percentual ou nome de metrica que o Biome nao mediu.

## Fontes Consultadas

- Biome JavaScript rules: https://biomejs.dev/linter/javascript/rules/
- Biome `noExcessiveCognitiveComplexity`: https://biomejs.dev/linter/rules/no-excessive-cognitive-complexity/
- Biome `useMaxParams`: https://biomejs.dev/linter/rules/use-max-params/
- Biome `noExcessiveLinesPerFunction`: https://biomejs.dev/linter/rules/no-excessive-lines-per-function/javascript/
- Biome `noExcessiveLinesPerFile`: https://biomejs.dev/linter/rules/no-excessive-lines-per-file/javascript/
- Biome CLI: https://biomejs.dev/reference/cli/
- Biome plugins: https://biomejs.dev/linter/plugins/
