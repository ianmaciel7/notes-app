# Architecture

## Intent

The application should stay idiomatic to the current Next.js App Router while keeping infrastructure replaceable. Product features should not depend directly on local filesystem, Firebase, S3, Cloudflare R2, MinIO, or any other concrete provider.

The goal is low coupling, simple boundaries, and easy provider replacement without changing UI or business rules.

## Foundation Persistence Decision

The first product foundation is a single-user application running with a local SQLite database. "Local" describes the deployment and ownership model; it does not promise browser-only or offline-first persistence.

SQLite access stays behind a server-only DAL. It uses numbered migrations, foreign keys, WAL, and transactions where workflows require atomic writes. The default database path is the ignored `var/notes-app.sqlite`, configurable through `NOTES_APP_DB_PATH`. Feature code depends on application-oriented data functions, so a later remote database can replace SQLite without changing UI components or workflow rules.

Uploaded binaries are separate from SQLite and use an ignored local filesystem directory, `var/uploads` by default and configurable through `NOTES_APP_UPLOAD_DIR`. This local persistence is suitable for the single-user product foundation and is not a claim of durable Firebase App Hosting or other hosted storage.

## Next.js Guidance

Use official Next.js guidance as the primary source for framework behavior:

- Server Components are the default place to read server data.
- Client Components are for interactivity, browser APIs, effects, and local UI state.
- Server Components should call server-side data functions directly instead of fetching internal Route Handlers.
- Server Actions are mutation entry points from the UI.
- Route Handlers are for real HTTP boundaries, such as external APIs, webhooks, callbacks, integrations, or non-Next.js clients.
- Sensitive server-only code should use `import "server-only"`.

## Application Data

Use a DAL for persisted application data.

The DAL should:

- run only on the server;
- hide provider SDKs and infrastructure details;
- return only the data needed by callers;
- keep authorization and validation server-side when applicable;
- expose operations named around application needs, not provider APIs.

Do not create a repository layer automatically. Add repositories only when the DAL is not enough, such as when multiple structured-data providers need the same contract.

## Storage

Files and blobs are separate from structured application data.

Use a storage contract for uploaded documents and any future attachments, generated files, audio, PDFs, or other blobs.

Features should depend on a contract such as:

```ts
export interface BlobStorage {
  store(input: { data: Uint8Array; contentType: string }): Promise<{ key: string }>
  open(key: string): Promise<ReadableStream<Uint8Array>>
  remove(key: string): Promise<void>
}
```

Keys are opaque to callers. The foundation adapter stores content on the local filesystem; later adapters can use Firebase, S3, Cloudflare R2, or MinIO. Provider selection belongs in one composition root.

`POST /api/sources` is the multipart/binary upload boundary and `GET /api/sources/[id]/content` is the content-streaming boundary. Server Components do not call these handlers for ordinary reads; they call DAL functions directly. Uploaded PDF and UTF-8 text content is validated against `NOTES_APP_MAX_UPLOAD_BYTES` and its signature or encoding before registration.

## Provider Boundaries

UI, feature components, Server Components, and Server Actions should not directly import privileged or provider-specific modules such as:

- `firebase-admin`
- AWS SDK
- Cloudflare SDK
- `node:fs`

Provider code belongs in infrastructure adapters. The rest of the app should depend on DAL functions, use cases when justified, or storage contracts.

## Gemini Boundary

The product foundation uses a server-only Gemini adapter. Runtime configuration comes from:

- `GEMINI_API_KEY`: secret API credential;
- `GEMINI_MODEL`: current supported model identifier selected through configuration.

The API key must not enter Client Components, browser bundles, prompts, source records, logs, analytics, errors, or persisted generation output. Missing configuration should fail before document processing starts.

Do not hard-code a model name across feature code. The configured model must be checked against the provider's currently supported models during implementation. If the application later calls Firebase AI Logic directly from the browser, provision Firebase AI Logic and enforce Firebase App Check before enabling client traffic; do not expose a raw Gemini API key.

## Use Cases And Services

Do not create Services or Use Cases just to pass calls through.

Simple flow:

```text
Server Component -> DAL -> data source
```

Mutation flow:

```text
Client Component -> Server Action -> DAL or justified Use Case -> infrastructure
```

Create a Use Case when a workflow combines meaningful business rules, validation, storage, structured persistence, AI calls, retries, or multiple side effects.

## Enforcement

Prefer simple automated checks when they are reliable:

- TypeScript contracts for adapters;
- tests for scheduling, spaced repetition, AI-output validation, and storage contracts;
- import restrictions only when the project has enough infrastructure code for the rule to be useful;
- CI verification through `pnpm verify`.

Do not add heavy architectural tooling before there is real code for it to protect.
