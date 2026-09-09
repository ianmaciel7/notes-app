# Deployment

This document describes how to deploy the Notes App to Firebase App Hosting and keep the cloud environment aligned with the local-first architecture.

## Deployment Target

The production target is Firebase App Hosting for a full-stack Next.js App Router application.

The deployed system uses:

- Firebase App Hosting for the Next.js server runtime.
- Cloud Run-backed scale-to-zero compute.
- Firebase Auth for user identity.
- Cloud Firestore for remote workspace sync.
- Firebase Storage for uploaded reader documents.
- Google Cloud Secret Manager or App Hosting secrets for provider keys.

## Prerequisites

Before deploying, confirm:

- The Firebase project is on the Blaze plan.
- Firebase Auth is enabled for the intended providers.
- Firestore is created in the intended database and region.
- Firebase Storage is available if document upload is enabled.
- Firebase CLI access is configured for the target project.
- App Hosting backend access is configured for this repository.
- Runtime secrets exist for all enabled AI providers.

Use `pnpm` for all local project commands. Do not use `npm` or `yarn`.

## Configuration Files

Deployment-related files:

- `apphosting.yaml`: App Hosting resource profile and runtime environment variables.
- `firebase.json`: Firebase App Hosting and Firestore configuration.
- `firestore.rules`: Firestore authorization policy.
- `.env.example`: Placeholder-only reference for local/server environment variables.
- `SECURITY.md`: Security policy and deployment-sensitive invariants.
- `ARCHITECTURE.md`: System boundaries and runtime architecture.

## Runtime Environment

The application expects server-side environment values for Firebase and AI provider behavior.

Configured in `apphosting.yaml`:

- `FIRESTORE_DATABASE_ID`: Firestore database id, usually `(default)`.
- `GEMINI_API_KEY`: Secret-backed Gemini provider key.
- `GROQ_API_KEY`: Secret-backed Groq provider key.

Other server-side values may be provided by Firebase or Google Cloud runtime:

- `FIREBASE_PROJECT_ID`
- `GOOGLE_CLOUD_PROJECT`
- `GCLOUD_PROJECT`
- `FIREBASE_STORAGE_BUCKET`
- Application Default Credentials for Google Cloud access tokens.

Optional local/server testing override:

- `FIRESTORE_ACCESS_TOKEN`

Do not expose provider keys, Firebase Admin credentials, Firestore bearer tokens, or storage credentials to client components.

## Build

Install dependencies with:

```bash
pnpm install
```

Build the application with:

```bash
pnpm build
```

The build should be run from the repository root.

## Firestore Rules

Firestore rules are defined in `firestore.rules`.

The expected remote data model is user-scoped:

```text
users/{uid}/spaces/{spaceId}/entities/{entityId}
```

Rules must deny by default and allow access only when `request.auth.uid` matches the top-level user namespace.

Deploy rules with the Firebase CLI when needed:

```bash
firebase deploy --only firestore:rules
```

Any new shared, team, public, or admin data path requires an explicit authorization design and matching rules update before deployment.

## App Hosting

`apphosting.yaml` currently defines a small scale-to-zero runtime profile:

```yaml
runConfig:
  cpu: 1
  memoryMiB: 512
  minInstances: 0
  maxInstances: 2
  concurrency: 80
```

This profile is intended for MVP-scale usage and low operating cost. Increase resources only when there is measured pressure from build/runtime metrics, parser workloads, sync volume, or AI gateway latency.

Deploy App Hosting through the Firebase/App Hosting workflow configured for the repository. If deploying through the Firebase CLI, use the project and backend selected for this app:

```bash
firebase deploy --only apphosting
```

## Storage

Reader document uploads should be stored under authenticated user paths:

```text
users/{uid}/spaces/{spaceId}/media/{blobId}-{fileName}
```

Storage object paths must derive `uid` from the verified Firebase token. Do not trust caller-supplied user ids for storage ownership.

If Storage rules are added later, keep them aligned with this namespace model.

## AI Providers

The AI gateway calls Gemini or Groq from the server runtime.

Provider keys must be configured as runtime secrets. The client may select provider behavior, but it must not receive production provider keys.

AI generation should send the smallest useful source text chunk and must preserve the grounding invariant described in `SECURITY.md`: generated cards are persisted only when their `exactQuote` matches source text verbatim.

## Deployment Checklist

- Confirm dependencies install with `pnpm install`.
- Run `pnpm build`.
- Confirm required runtime secrets are provisioned.
- Confirm Firebase Auth providers are enabled.
- Confirm Firestore database id matches `FIRESTORE_DATABASE_ID`.
- Deploy or verify `firestore.rules`.
- Deploy App Hosting.
- Smoke test authenticated sync and storage upload paths.
- Smoke test `/api/ai/generate` only with configured provider secrets.
- Confirm client bundles do not contain server-only secrets.

## Rollback

Use Firebase/App Hosting release history to roll back application deployments.

For urgent security response:

- Rotate affected secrets.
- Temporarily disable affected provider secrets or routes when possible.
- Tighten Firestore or Storage rules before restoring risky app behavior.
- Preserve minimal logs needed for incident review without exposing private document content or secrets.

## Operational Notes

- Keep `minInstances: 0` unless latency or reliability data justifies warm instances.
- Monitor Firestore read/write volume, Storage object growth, App Hosting request volume, and AI provider errors.
- Treat parser failures, repeated rejected sync payloads, rejected uploads, and auth failures as security-relevant signals.
- Update this document when deployment targets, runtime secrets, cloud paths, rules, or provider boundaries change.
