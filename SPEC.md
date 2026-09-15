# Product specification

## MVP

KnowledgeOS is a read-first study space with preinstalled static decks.
Each card has a stable GUID and can be opened at `/study/{cardGuid}`. The
catch-all space route preserves future paths without putting locale in the
URL.

## Access model

| Capability | Visitor | Google-authenticated user |
| --- | --- | --- |
| Browse decks and cards | Yes | Yes |
| Reveal a card answer | Yes | Yes |
| Submit Again/Hard/Good/Easy | No | Yes |
| Persist FSRS review state | No | Yes |
| Edit content | No | Future milestone |

The access rule applies to both UI and data behavior: visitors receive a calm
sign-in explanation at blocked actions, while every server mutation and private
data read independently verifies Firebase authentication. Hidden controls,
URLs, feature flags, and client state are never authorization mechanisms.

Firebase projects and web credentials are separate for development, Vercel
preview, and production. Vercel feature flags may control rollout, but never
replace Firebase environment separation or server authorization.

## Future seams

The `StudyDeck`/`StudyCard` DTOs and `/api/reviews` boundary leave room for a
repository layer and adapters for Capacities or Notion. Import/export is
intentionally out of scope until the local study flow is stable.
