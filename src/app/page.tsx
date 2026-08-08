const notes = [
  {
    title: "Launch checklist",
    tag: "Planning",
    tint: "bg-card-tint-lavender text-[#391c57]",
    body: "Finalize release notes, check onboarding copy, and confirm quality gates.",
  },
  {
    title: "Research clips",
    tag: "Inbox",
    tint: "bg-card-tint-mint text-brand-green",
    body: "Group design references, customer quotes, and product screenshots.",
  },
  {
    title: "Team sync",
    tag: "Meeting",
    tint: "bg-card-tint-peach text-[#793400]",
    body: "Capture blockers, owners, and the next review date.",
  },
];

const tasks = [
  ["Docs", "Design system added", "Done"],
  ["UI", "Token pass", "In review"],
  ["Release", "Staging PR", "Next"],
];

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <nav className="sticky top-0 z-10 border-hairline border-b bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="flex items-center gap-3 font-semibold text-ink"
          >
            <span className="grid size-8 place-items-center rounded-md border border-hairline-strong bg-canvas text-lg shadow-sm">
              N
            </span>
            Notes
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate md:flex">
            <a href="#workspace">Workspace</a>
            <a href="#notes">Notes</a>
            <a href="#tasks">Tasks</a>
          </div>
          <a
            href="#workspace"
            className="rounded-md bg-primary px-[18px] py-2.5 text-sm font-medium text-on-primary transition active:translate-y-px"
          >
            Open workspace
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-brand-navy text-on-dark">
        <div className="absolute left-[8%] top-16 size-3 rounded bg-brand-pink" />
        <div className="absolute right-[12%] top-28 size-4 rounded bg-card-tint-yellow-bold" />
        <div className="absolute bottom-20 left-[18%] size-3 rounded bg-brand-green" />
        <div className="absolute bottom-36 right-[22%] size-2.5 rounded bg-brand-teal" />

        <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-medium text-on-dark-muted">
              Notes, projects, and decisions
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Meet your focused workspace.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#d7d4cd]">
              Capture notes, shape plans, and keep project context in one calm
              place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#workspace"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-[18px] text-sm font-medium text-on-primary transition hover:bg-primary-pressed active:translate-y-px"
              >
                Start writing
              </a>
              <a
                href="#notes"
                className="inline-flex h-11 items-center justify-center rounded-md border border-on-dark-muted px-[18px] text-sm font-medium text-white transition active:translate-y-px"
              >
                View notes
              </a>
            </div>
          </div>

          <section
            id="workspace"
            aria-label="Notes workspace"
            className="rounded-lg border border-hairline bg-canvas text-foreground shadow-[var(--shadow-mockup)]"
          >
            <div className="grid min-h-[560px] overflow-hidden rounded-lg md:grid-cols-[220px_1fr]">
              <aside className="border-hairline border-b bg-surface p-4 md:border-b-0 md:border-r">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-charcoal">
                    Team space
                  </span>
                  <span className="rounded bg-card-tint-lavender px-2 py-1 text-xs font-semibold text-[#391c57]">
                    Live
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate">
                  {["Home", "Projects", "Reading", "Archive"].map((item) => (
                    <a
                      href="#workspace"
                      key={item}
                      className="block rounded-md px-3 py-2 transition hover:bg-canvas"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </aside>

              <div className="grid bg-canvas md:grid-cols-[1fr_260px]">
                <section className="p-5 sm:p-6" id="notes">
                  <div className="mb-6">
                    <p className="text-sm font-medium text-steel">Today</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-charcoal">
                      Product notes
                    </h2>
                  </div>

                  <article className="rounded-lg border border-hairline bg-surface-soft p-5">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded bg-card-tint-yellow-bold px-2 py-1 text-xs font-semibold text-charcoal">
                        Draft
                      </span>
                      <span className="rounded bg-card-tint-sky px-2 py-1 text-xs font-semibold text-link-blue">
                        Product
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-[-0.01em] text-charcoal">
                      One place for the work around the work
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate">
                      Keep decisions, tasks, and references close to the notes
                      that explain them.
                    </p>
                  </article>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {notes.map((note) => (
                      <article
                        key={note.title}
                        className="rounded-lg border border-hairline bg-canvas p-4"
                      >
                        <span
                          className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${note.tint}`}
                        >
                          {note.tag}
                        </span>
                        <h4 className="mt-4 text-base font-semibold text-charcoal">
                          {note.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate">
                          {note.body}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <aside
                  id="tasks"
                  className="border-hairline border-t bg-surface p-5 md:border-l md:border-t-0"
                >
                  <h2 className="text-lg font-semibold text-charcoal">
                    Progress
                  </h2>
                  <div className="mt-5 space-y-3">
                    {tasks.map(([area, title, status]) => (
                      <article
                        key={title}
                        className="rounded-lg border border-hairline bg-canvas p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-steel">
                            {area}
                          </span>
                          <span className="rounded-full bg-card-tint-mint px-2 py-1 text-xs font-semibold text-brand-green">
                            {status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-medium leading-6 text-charcoal">
                          {title}
                        </p>
                      </article>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
