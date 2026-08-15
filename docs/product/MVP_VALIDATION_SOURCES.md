# MVP Validation Sources

## Purpose

This guide records the documents selected to validate the first object-studio workflow. The dataset is specific to the owner's first real use case; it does not define the product as an assessment-only or DATAPREV-only application.

Versioned reference and acceptance copies are stored under `data/mvp-validation-sources`. Original files remain under `C:\Users\ianma\Downloads`.

These files are documentation and acceptance fixtures only. The application must not scan or auto-ingest this directory, and runtime uploads must never be written into it. During acceptance testing, a fixture is selected in the browser and uploaded through the same PDF/text flow available for arbitrary user documents; the runtime copy is stored under the configured upload directory.

Last structure and integrity verification: 2026-08-14.

## Source Classification

The source set contains three distinct contexts:

- **Target:** DATAPREV Edital 001/2026 defines the active goal and scope.
- **Related:** five 2025 proof documents from Pre-Sal Petroleo S.A. (PPSA), not DATAPREV, provide current related practice material across IT profiles.
- **Historical:** prior DATAPREV proof and answer-key pairs provide organization-specific question material and answer validation.

This distinction must be preserved as source metadata so related PPSA questions are not presented as historical DATAPREV questions.

## First End-to-End Validation Set

Use this smallest set first to validate the complete flow from browser upload to reviewed objects, questions, attempts, flashcards, and the Today view.

The acceptance goal is **DATAPREV 2026, Perfil 3 - Desenvolvimento de Software**, with target date **11 October 2026**, target question volume **70**, and study days **Monday through Friday**. The target edital defines that goal and scope. The related PPSA development proof is a separate 60-question extraction fixture and must retain its related, non-DATAPREV classification.

1. Target scope:
   `data\mvp-validation-sources\target\2026-dataprev\edital-001.pdf`
2. Related proof:
   `data\mvp-validation-sources\related\2025-ppsa\analista-ti-desenvolvimento-sistemas\prova.pdf`
3. Historical DATAPREV proof:
   `data\mvp-validation-sources\historical\2024-fgv-dataprev-desenvolvimento-software\prova-tipo-1.pdf`
4. Answer validation:
   `data\mvp-validation-sources\historical\2024-fgv-dataprev-desenvolvimento-software\gabarito-definitivo.pdf`

The proof document must be used to generate question drafts before its answer key is consulted. The answer key validates or corrects the extracted answer during review; it must not silently overwrite a user-approved answer.

## Related PPSA Proofs

The related source set comes from PPSA Edital 001/2025. Use all five profiles to test topic classification and cross-area extraction:

| Profile | Normalized document | Intended use |
| --- | --- | --- |
| Development of Systems | `related\2025-ppsa\analista-ti-desenvolvimento-sistemas\prova.pdf` | Primary related proof and first workflow validation |
| Information Security | `related\2025-ppsa\analista-ti-seguranca-informacao\prova.pdf` | Cross-area topic and question extraction |
| IT Infrastructure | `related\2025-ppsa\analista-ti-infraestrutura-ti\prova.pdf` | Cross-area topic and question extraction |
| IT Governance | `related\2025-ppsa\analista-ti-governanca-ti\prova.pdf` | Cross-area topic and question extraction |
| IT Projects | `related\2025-ppsa\analista-ti-projetos-ti\prova.pdf` | Cross-area topic and question extraction |

Paths in this and later sections are relative to `data\mvp-validation-sources` unless stated otherwise.

## Historical DATAPREV Corpus

Use the available proof and answer-key pairs in this order after the first set:

| Priority | Year and provider | Directory | Proof | Answer validation |
| --- | --- | --- | --- | --- |
| 1 | 2023 CEBRASPE | `historical\2023-cebraspe-dataprev-desenvolvimento-software` | `prova.pdf` | `gabarito-definitivo.pdf` |
| 2 | 2012 QUADRIX | `historical\2012-quadrix-dataprev-desenvolvimento` | `prova.pdf` | `gabarito-definitivo.pdf` |
| 3 | 2011 QUADRIX | `historical\2011-quadrix-dataprev-desenvolvimento-sistemas` | `prova.pdf` | `gabarito.pdf` |
| 4 | 2009 COSEAC/UFF | `historical\2009-coseac-dataprev-desenvolvimento-sistemas` | `prova.pdf` | `gabarito.pdf` |
| 5 | 2006 CESPE | `historical\2006-cespe-dataprev-desenvolvimento-sistemas` | `prova.pdf` | `gabarito-preliminar.pdf` plus `comunicado-gabarito-definitivo.pdf` |
| 6 | 2001 CESPE | `historical\2001-cespe-dataprev-desenvolvimento-manutencao-sistemas` | `prova.pdf` | `gabarito-definitivo.pdf` |

Use `historical\2014-quadrix-dataprev-analista-ti` only as a conditional compatibility sample. The original package notes that the available proof has an Infrastructure and Applications profile while its answer key also contains other profiles, so profile alignment must be confirmed during review.

The 2016 CETRO directory contains an edital and a note explaining that its corresponding proof was not recovered. It is context, not a question source.

## Catalog, Exclusions, And Unavailable Sources

- `catalog\fontes-originais.txt`: original source URLs and references.
- `catalog\leia-me-original.txt`: original package inventory and caveats.
- `catalog\sha256sums-originais.txt`: checksums using the pre-normalization paths.
- `excluded\2010-quadrix-dataprev-desenvolvimento-pessoas`: excluded because it is not a software or systems development profile.
- `excluded\2013-quadrix-dataprev-progressao-funcional`: preserved as a different assessment context and excluded from the initial analytics.
- `unavailable\1997-nce-ufrj-dataprev-analista-sistemas-suporte`: source reference preserved, but the proof download was blocked.

Excluded material may later test the generic object model with other workflows, but it must not enter initial question analytics accidentally.

## Ingestion Rules

- Treat every browser upload as a Source candidate with a stable content hash, opaque runtime storage key, and original filename.
- Preserve source organization, year, provider, profile, document role, original provenance, page reference when available, and source excerpt.
- Detect duplicate content before sending text to Gemini.
- Keep proof text and answer-key text as distinct source roles.
- Never scan or automatically ingest the versioned validation collection, including `excluded` and `unavailable`.
- Validate Gemini structured output before showing drafts.
- Require review before saving generated objects.
- Make approval idempotent so retries do not duplicate questions or flashcards.
- Record extraction failures without losing source registration or user corrections.

## Completion Evidence

The dataset has served its MVP purpose when the owner can:

- upload and register the DATAPREV edital and related sources as connected objects;
- distinguish target, related, historical, excluded, and duplicate import attempts;
- generate and review topics, questions, and flashcards from the first validation set;
- validate extracted answers against the paired answer key;
- complete question attempts and flashcard reviews without overwriting history;
- see source provenance, weak-topic analytics, and the Today queue;
- import another related profile without changing application code or the database schema.
