# Security Policy

This Security Policy defines the threat model, trust boundaries, secure coding standards, and security invariants for this repository. It serves as an authoritative guide for human developers and AI coding agents.

## Supported Versions

This project is in active pre-1.0 development (`0.1.x`). Security fixes are backported to the supported versions listed below.

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |
| < 0.1   | No        |

## Reporting a Vulnerability

Do **not** open public issues, discussions, or pull requests for suspected vulnerabilities or leaked secrets. Report security concerns privately to the repository owner or through the hosting platform's private security reporting channel.

Please include the following details in your report:
- Affected component or route handler.
- Clear reproduction steps and proof-of-concept (without using destructive payloads or exposing live credentials).
- Potential impact on user data, authentication state, or cloud infrastructure.

**Response & Triage Timeline:**
- **Acknowledgement:** Within 48 hours of receipt.
- **Assessment:** Triage severity based on reachability, asset sensitivity, and exploitability.
- **Remediation & Disclosure:** Coordinate fix timeline prior to public release.

## System Architecture & Scope

This repository implements a local-first study and knowledge-management web application built with Next.js App Router, React 19, TypeScript, Dexie/IndexedDB, Firebase Auth, Firestore, Firebase Storage, and AI provider route handlers.

### Covered Scope
- **Client Application:** Browser UI, local IndexedDB state, reader components, and quote anchoring.
- **Document Ingestion:** Ingestion & parsing pipelines for text, Markdown, HTML, PDF, and EPUB files.
- **Spaced Repetition & Study:** Flashcard queue state, FSRS engine, and quote-grounding metadata.
- **AI Gateway:** Server-side route handlers for AI-assisted flashcard generation and parsing.
- **Remote Sync & Media:** Authenticated sync pipelines writing to user-scoped Firestore paths and Firebase Storage buckets.
- **Agent Guidelines:** Rules governing human developers and AI coding agents operating on the codebase.

## Asset Classification & Sensitivity

| Asset | Sensitivity | Description |
| ----- | ----------- | ----------- |
| Secrets & API Keys | **Critical** | Firebase Admin keys, AI provider credentials (Gemini, Groq), OAuth tokens, and production environment secrets. |
| Auth Tokens | **Critical** | Firebase ID tokens and delegated bearer credentials. |
| User Workspace Data | **High** | Notes, knowledge graphs, tags, relations, backlinks, flashcards, and study goals. |
| Document Payloads | **High** | Uploaded PDFs/EPUBs, extracted text, verbatim quotes, and generated text chunks. |
| Local Storage | **High** | IndexedDB database holding local workspace state and pending sync mutations. |
| Firestore & Storage Paths | **High** | User-scoped remote Firestore documents and media storage blobs. |
| Dependencies & Config | **Medium** | Lockfiles (`pnpm-lock.yaml`), Next.js config, build manifests, and security rules. |

## Threat Model & Trust Boundaries

1. **Browser to Server Handlers:** All incoming HTTP requests, headers, query parameters, uploaded files, and text selections are untrusted input.
2. **Local Storage to Remote Sync:** Client IndexedDB state is stored in the browser and must be validated before triggering server-side sync mutations.
3. **Firebase ID Tokens:** Server routes must verify ID tokens server-side before mutating user-scoped resources.
4. **Server Runtime to External AI Providers:** AI provider calls must execute server-side using server-only environment variables. Provider API keys must never be exposed to client components.
5. **Untrusted User Content to AI Context:** Documents, text selections, and scraped web content must be treated as data, never as executable instructions (mitigating prompt injection).
6. **User Isolation:** Firestore and Storage paths must enforce strict tenant isolation (`users/{uid}/spaces/{spaceId}/...`).

## Core Security Invariants

- **Server-Only Credentials:** Client components must never import `firebase-admin`, AI provider API keys, or production secrets.
- **Strict Authorization Verification:** Route handlers mutating remote state must verify Firebase ID tokens and restrict writes strictly to `request.auth.uid`.
- **Verbatim Quote Grounding:** AI-generated flashcards must be verifiably grounded in source text via an `exactQuote` match before being saved as grounded cards.
- **Non-Mutating DOM Highlighting:** Highlighting and quote anchoring in reader interfaces must not directly mutate React-rendered DOM text nodes.
- **Deny-by-Default Cloud Rules:** Firestore and Storage security rules must default to denying access unless `request.auth.uid` matches the entity's owner namespace.
- **Sanitized Errors:** Server error responses returned to clients must never leak stack traces, internal file paths, bearer tokens, or provider credentials.

## Secret Management

- Keep credentials, API keys, tokens, and private keys out of version control.
- Use `.env` (git-ignored) for local secrets and `.env.example` for non-sensitive placeholders.
- Do not store secrets in `.agents/mcp-servers.json`, documentation, artifacts, or generated agent output.
- Enable secret scanning and push protection on the hosting platform.

## Dependencies & Package Integrity

- Package Manager: Always use `pnpm`. Keep `pnpm-lock.yaml` committed and updated.
- Prefer standard library and platform web APIs over adding external third-party dependencies.
- Review third-party libraries for active maintenance, transitive dependencies, and secure handling of untrusted input.

## Secure Coding & Input Handling

- **Type Safety & Validation:** Use TypeScript types alongside runtime schema validation at network, parser, sync, and storage boundaries.
- **Injection Prevention:** Treat uploaded files, EPUB archives, PDF bytes, and HTML payloads as untrusted data. Enforce strict MIME type and file size limits.
- **XSS Prevention:** Do not use `dangerouslySetInnerHTML`, `eval`, dynamic `Function`, or unsanitized DOM rendering for user or AI-generated content.

## Hard Rules for AI Coding Agents

AI agents (such as Antigravity, Codex, etc.) working in this repository MUST strictly follow these rules:

1. **Read Core Policy First:** Always consult `AGENTS.md` and `SECURITY.md` before attempting security-sensitive modifications.
2. **Never Commit Secrets:** Do not hardcode, expose, or generate mock secrets in tracked code or agent artifacts.
3. **Preserve Authority Boundaries:** Do not move server credentials, `firebase-admin`, or route authority into browser/client components.
4. **Preserve Invariants:** Do not weaken auth checks, quote-grounding requirements, sync validation, or Firestore rules for convenience.
5. **No Mock Bypasses:** Do not create fake production queues or mock review states that bypass security or validation rules.
6. **Request Human Review:** Always request human developer review before modifying authentication logic, permission structures, cloud rules, secret handling, or document parsing pipelines.
