---
trigger: model_decision
description: Rules for Firebase App Hosting deployment, Cloud Firestore sync, server-side authentication, and AI Gateway security.
---

# Firebase Backend, Sync & Security Rules

## 1. Firebase App Hosting & Server Compute
- App runs full-stack Next.js on Google Cloud Run via Firebase App Hosting on the **Blaze Plan**.
- Guardrails: `minInstances: 0` (scale-to-zero) and `maxInstances: 2` to prevent unexpected charges.
- Configuration file is `apphosting.yaml`.

## 2. Server vs Client Security Boundary
- **Never import `firebase-admin` in client components (`'use client'`)**.
- Administrative tasks and token verification must run strictly within Next.js Route Handlers (`/api/*`) or Server Actions.
- Client components use the Firebase Web SDK (`firebase/auth`, `firebase/firestore`) guarded by Firestore Security Rules.

## 3. AI Gateway & API Key Protection
- The production AI generation gateway lives at `/api/ai/generate` (Server Route Handler).
- Google Gemini 2.0 Flash and Groq API keys reside exclusively in Secret Manager / server environment variables.
- Never prefix server AI API keys with `NEXT_PUBLIC_`.
- Enforce structured JSON output (`exactQuote`, `cardType`, `front`, `back`) from LLM responses.

## 4. Offline Sync Architecture
- All client mutations write immediately to local Dexie.js (`_syncStatus = 'pending'`).
- The background sync engine uses Firestore `writeBatch()` (up to 500 mutations) with Last-Write-Wins (LWW) conflict resolution based on `updatedAt` timestamps.
