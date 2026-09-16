# Revisa

Aplicativo web local para criar baralhos, estudar cartões de frente e verso com FSRS e manter backups em JSON.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Verificação

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Os dados ficam no IndexedDB do navegador. Use a tela **Backup** para exportar ou restaurar a biblioteca.
