# Guia de Interface de Usuário do Workspace

Este documento descreve os elementos visuais, fluxos de experiência de usuário (UX) e o layout de interface do workspace principal do Notes App.

## Visão Geral do Layout da Interface

A interface do Workspace é organizada em cinco zonas visuais principais:

1. **Cabeçalho e Barra de Navegação**: Barra fixada no topo contendo a marca da aplicação, indicador de status e o botão de ação principal "+ Nova Nota".
2. **Barra de Busca e Filtros**: Controles para pesquisa em tempo real e filtragem por abas de categorias (`Todos`, `Trabalho`, `Pessoal`, `Ideias`).
3. **Grade de Cartões de Notas**: Layout em grade responsivo que exibe os cartões de notas ordenados, mantendo as notas fixadas no topo.
4. **Diálogo Modal de Criação de Nota**: Modal para captura de títulos, seleção de categoria e inserção de conteúdo das notas.
5. **Componente de Estado Vazio**: Exibição visual de feedback com botão de ação rápida quando nenhuma nota atende aos filtros ou quando o workspace está vazio.

## Componentes Visuais e Detalhes do Layout

### 1. Barra de Cabeçalho
- **Marca da Aplicação**: Ícone com o título da aplicação ("Notes App") e legenda informativa ("Powered by shadcn/ui").
- **Botão CTA Principal**: Botão de alta visibilidade com ícone de adição para abrir o diálogo modal de criação de nota.

### 2. Barra de Busca e Ferramentas
- **Campo de Busca**: Barra de pesquisa alinhada à esquerda com ícone de lupa para filtragem dinâmica de títulos e conteúdos.
- **Navegação por Abas de Categoria**: Abas para alternância rápida entre categorias:
  - `Todos`: Exibe todas as notas.
  - `Trabalho`: Filtra notas marcadas para o trabalho.
  - `Pessoal`: Filtra itens pessoais e listas.
  - `Ideias`: Filtra pensamentos criativos ou arquiteturais.

### 3. Componente de Cartão de Nota
Cada cartão de nota exibe os seguintes elementos visuais e controles:
- **Cabeçalho**:
  - **Título**: Título em texto destacado com limite de linha.
  - **Botão de Fixar**: Ação rápida para fixar/desfixar notas. Cartões fixados possuem borda de destaque e fundo diferenciado.
- **Badge de Metadados**: Data de criação e etiqueta de categoria (`Trabalho`, `Pessoal` ou `Ideias`).
- **Conteúdo Principal**: Prévia do texto da nota com limitação visual de linhas (até 4 linhas).
- **Controles do Rodapé**: Botão de ação destrutiva (ícone de lixeira) para remover a nota do workspace.

### 4. Diálogo Modal de Criação de Nota
- **Cabeçalho do Diálogo**: Título claro ("Criar Nova Nota") e instruções contextuais.
- **Campos do Formulário**:
  - Campo de entrada para título.
  - Grupo de botões para seleção de categoria (`trabalho`, `pessoal`, `ideias`).
  - Área de texto (textarea) para o conteúdo da nota.
- **Ações do Rodapé**: Botões padrão de `Cancelar` e `Salvar Nota`.

### 5. Visualização de Estado Vazio
- Exibido quando nenhuma nota atende à busca ou quando a coleção está vazia.
- Apresenta um ícone de pasta, mensagem explicativa e um botão direto para "Criar Nota".

## Tema e Comportamento Responsivo

- **Grade Responsiva**:
  - **Mobile (< 768px)**: Layout em coluna única ocupando toda a largura.
  - **Tablet (768px – 1024px)**: Layout em grade de 2 colunas.
  - **Desktop (> 1024px)**: Layout em grade de 3 colunas.
- **Suporte a Tema Escuro**: Adaptação perfeita entre temas escuro e claro utilizando variáveis CSS e tokens de cor do Tailwind.
