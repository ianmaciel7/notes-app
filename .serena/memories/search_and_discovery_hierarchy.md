Hierarquia canônica de ferramentas de busca e descoberta no projeto notes-app:
1. Arquitetura e Módulos: Graphify MCP (query_graph, shortest_path, graphify-out/wiki/index.md).
2. Símbolos e Referências de Código: Serena MCP (find_symbol, find_referencing_symbols, get_symbols_overview).
3. Padrões Sintáticos e Outlines: ast-grep (outline para visão geral sem dump, scan/run para AST).
4. Localização de Arquivos e Strings: ripgrep via RTK (rtk rg --files, rtk rg "<termo>"), Filesystem MCP (search_files).
5. Documentação de Terceiros: Context7 CLI (npx ctx7 library -> ctx7 docs).
6. Snapshot Completo: Repomix (repomix.config.json).
Documentado formalmente em .agents/rules/search-and-discovery.md e referenciado em AGENTS.md.