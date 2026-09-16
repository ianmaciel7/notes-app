---
trigger: glob
globs:
  - "src/components/**/*.tsx"
  - "src/app/_components/**/*.tsx"
  - "src/app/**/_components/**/*.tsx"
description: >-
  Regras obrigatórias para componentes shadcn/ui, Base UI, composição,
  tokens, acessibilidade, estados, stories e testes.
---

# shadcn-first

Estas regras se aplicam a todo componente, primitiva, bloco e subcomponente novo ou alterado.

## Descoberta e composição

- Leia `AGENTS.md`, `components.json`, `package.json`, o lockfile e os consumidores afetados antes de editar.
- Siga esta ordem: reutilizar `@/components/ui`; adicionar o componente oficial ausente com `pnpm exec shadcn add <component>`; compor primitivas existentes; criar uma primitiva nova somente quando as opções anteriores não atenderem.
- Pesquise por funcionalidade e sinônimos antes de criar markup próprio; inspecione documentação, implementação, dependências, acessibilidade e compatibilidade do candidato.
- Revise o diff gerado e preserve versões, configuração e customizações existentes. Não reinstale tudo nem migre `style`/`base` fora do escopo.
- Mantenha primitivas genéricas separadas da lógica de negócio. Use partes nomeadas e `children`/slots suportados; evite wrappers que apenas renomeiam APIs ou adicionam DOM desnecessário.
- Não use barrels `index.ts` para shadcn; importe cada componente diretamente do arquivo que o define.

## Contrato técnico

- Derive props de `React.ComponentProps`, `React.ComponentPropsWithRef` ou da primitiva; use `VariantProps`/CVA quando houver variantes reutilizáveis. Não use `any`, casts inseguros ou tipos duplicados.
- Preserve atributos HTML/ARIA, eventos, refs, comportamento de formulários e APIs controlada/não controlada. Não encaminhe props visuais para o DOM.
- Em Base UI, use `render`/`useRender` quando suportados, não `asChild`; combine props com `mergeProps` e preserve ordem de handlers e refs.
- Preserve a hierarquia e os providers exigidos pela primitiva. Delegue foco, teclado, seleção e posicionamento à primitiva, em vez de reimplementá-los.
- Mantenha estado local e uma única fonte de verdade; preserve `value`/`defaultValue`, `open`/`defaultOpen` e callbacks suportados.

## Estilo e estados

- Use tokens semânticos existentes (`bg-background`, `text-foreground`, `border-border`, `ring-ring` etc.) e `cn` de `@/lib/utils`.
- Não use cores hex/RGB/HSL, palette classes (`bg-blue-500`), `!important` ou valores arbitrários quando houver token equivalente.
- Não altere `globals.css`, tema, tipografia ou estilo global para corrigir um componente local sem escopo explícito.
- Preserve `data-slot` existentes; novos componentes reutilizáveis devem usar slots estáveis em kebab-case. Preserve os atributos de estado reais da primitiva (`data-open`, `data-checked`, `data-disabled` etc.), sem presumir convenções Radix.
- Use ícones explicitamente de `lucide-react`; ícones decorativos devem ser ocultos para leitores de tela e controles somente com ícone devem ter nome acessível no próprio controle.

## Acessibilidade, overlays e verificação

- Preserve semântica HTML, teclado, foco visível, ARIA, labels, descrições, associação de erros, estados disabled/loading e tipos de botão. Não crie elementos interativos aninhados.
- Para dialog, sheet, popover, menu e tooltip, preserve portal/positioner/partes, Escape, clique externo, restauração de foco, clipping, rolagem e reduced motion conforme o contrato da primitiva.
- Stories devem usar componentes de produção, CSS, tokens, fontes e providers reais; teste comportamento sem mockar a interação da primitiva.
- Verifique cada componente e parte afetada com lint, typecheck, testes focados e, quando houver mudança visual/interativa, navegador. Não alegue conformidade sem evidência.

