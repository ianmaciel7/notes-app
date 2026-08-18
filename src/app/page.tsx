export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-12">
        <header className="space-y-3">
          <p className="text-sm text-muted-foreground">Starter template</p>
          <h1 className="text-3xl font-semibold">Next.js + ShadCN</h1>
          <p className="text-sm text-muted-foreground">
            Clean starter project. Replace this page content and start building your app.
          </p>
        </header>

        <div className="space-y-3 rounded-lg border border-border p-4">
          <h2 className="text-lg font-medium">Quick start</h2>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>Open <code>src/app/page.tsx</code> and edit this homepage.</li>
            <li>Create new components in <code>src/components</code>.</li>
            <li>Run <code>pnpm dev</code> and open <code>localhost:3000</code>.</li>
          </ol>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border p-4 transition hover:bg-muted"
          >
            <h3 className="font-medium">Next.js Docs</h3>
            <p className="mt-1 text-sm text-muted-foreground">Official App Router documentation.</p>
          </a>
          <a
            href="https://ui.shadcn.com/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border p-4 transition hover:bg-muted"
          >
            <h3 className="font-medium">ShadCN Docs</h3>
            <p className="mt-1 text-sm text-muted-foreground">Component and design token conventions.</p>
          </a>
        </div>
      </section>
    </main>
  );
}
