# Competitive Intelligence & Parity Reference: Capacities

> **Source Audit Baseline:** Audited snapshot from `.worktrees/reference-urls (2).json` (154 total unique URL records, including official documentation, developer platform, machine indexes, service endpoints, and legacy/unavailable routes).

---

## 1. Executive Summary & Product Positioning

**Capacities** is an object-based personal knowledge management (PKM) system built around structured object types (such as *Page*, *Weblink*, *Image*, *PDF*, *Audio*, *Table*, and custom user-defined object types) rather than raw text files or hierarchical folder trees.

### Core Architectural Pillars
1. **Object-Based Architecture vs. Traditional Folders**: Content items are typed entities with explicit properties (metadata schema), backlink networks, and flexible visual views (Gallery, Table, List, Wall).
2. **Daily Notes & Temporal Grounding**: Integrated daily notes serving as an operational landing page for quick capture, calendar integration, task tracking, and time-stamped activity.
3. **Multi-Channel Input Integrations**: Native input pipelines via Readwise, Telegram, WhatsApp, Email, Web Extension, Raycast, and mobile quick-capture apps.
4. **AI Assistant & Deep Media Analysis**: Contextual AI assistant with chat connectors, media analysis (PDF/audio/image transcription & query), and Model Context Protocol (MCP) integration.
5. **Open Developer Platform & Protocol Specs**: Modern REST API, MCP endpoints (`https://api.capacities.io/mcp`), X-Callback URL protocol for mobile/desktop automation, and structured JSON/Markdown schemas.

---

## 2. Complete URL Inventory & Taxonomy

The 154 audited URLs for Capacities from `reference-urls (2).json` are categorized below into functional domains.

### 2.1 Official Roots, Indexes & Service Endpoints

* **Official Documentation Root:** `https://docs.capacities.io/`
* **Developer Portal Root:** `https://developers.capacities.io/`
* **API Service Endpoint:** `https://api.capacities.io`
* **MCP Service Endpoint:** `https://api.capacities.io/mcp`

#### Machine Discovery & Crawl Indexes
* `https://docs.capacities.io/robots.txt`
* `https://docs.capacities.io/sitemap.xml`
* `https://docs.capacities.io/llms.txt`
* `https://docs.capacities.io/llms-full.txt`

#### Legacy / Deprecated / 404 Endpoints
* `https://developers.capacities.io/api/reference` *(Audited HTTP 404)*

---

### 2.2 Core Concepts, Object Architecture & UI Fundamentals

#### Tutorials & Fundamentals
* `https://docs.capacities.io/tutorials/getting-started` — Initial onboarding & workspace setup
* `https://docs.capacities.io/tutorials/creating-new-objects` — Creating object instances across types
* `https://docs.capacities.io/tutorials/networked-note-taking` — Interlinking & bi-directional connections
* `https://docs.capacities.io/tutorials/tags` — Tagging mechanics across object types
* `https://docs.capacities.io/tutorials/custom-content-types` — Schema design for custom object types
* `https://docs.capacities.io/tutorials/using-the-editor` — Block-based editing interface
* `https://docs.capacities.io/tutorials/input-integrations` — Ingestion workflows
* `https://docs.capacities.io/tutorials/tags-vs-collections` — Structural taxonomy: Tags vs. Collections
* `https://docs.capacities.io/tutorials/sharing` — Space & object sharing
* `https://docs.capacities.io/tutorials/object-types-vs-folders` — Paradigm shift: Object types over folder hierarchies
* `https://docs.capacities.io/tutorials/capacities-for-writing` — Long-form writing & publishing workflows
* `https://docs.capacities.io/tutorials/when-to-create-new-object-type` — Domain modeling guidelines

#### System Reference & Structural Elements
* `https://docs.capacities.io/reference` — Master reference index
* `https://docs.capacities.io/reference/content-types` — Object type system overview
* `https://docs.capacities.io/reference/blocks` — Block types and block manipulation
* `https://docs.capacities.io/reference/properties` — Metadata schema fields & custom properties
* `https://docs.capacities.io/reference/organizational-structures` — Spaces, Collections, Tags, and Queries
* `https://docs.capacities.io/reference/views` — View modes (Table, List, Wall, Gallery)
* `https://docs.capacities.io/reference/search` — Global search & filtering
* `https://docs.capacities.io/reference/navigation` — Workspace navigation & sidebars
* `https://docs.capacities.io/reference/bulk-actions` — Multi-object operations
* `https://docs.capacities.io/reference/user-interface` — Layout breakdown & panel mechanics
* `https://docs.capacities.io/reference/page-layouts` — Customizable page header & view layouts
* `https://docs.capacities.io/reference/presentation-mode` — Fullscreen / distraction-free presentation mode
* `https://docs.capacities.io/reference/templates` — Object & page templating engine
* `https://docs.capacities.io/reference/block-based-linking` — Granular block-level transclusion & references
* `https://docs.capacities.io/reference/unlinked-mentions` — Implicit reference detection & backlink discovery
* `https://docs.capacities.io/reference/shortcuts` — Keyboard shortcut registry
* `https://docs.capacities.io/reference/glossary` — Capacities domain terminology
* `https://docs.capacities.io/reference/group-by` — Grouping and visual categorization in views
* `https://docs.capacities.io/reference/tables` — Native inline tables vs Table objects
* `https://docs.capacities.io/reference/spaces` — Workspace isolation & multi-space management

#### Basic Built-in Object Types
* `https://docs.capacities.io/reference/basic-types/pages` — Standard document pages
* `https://docs.capacities.io/reference/basic-types/images` — Image objects & gallery views
* `https://docs.capacities.io/reference/basic-types/weblinks` — Web bookmarks & web metadata parsing
* `https://docs.capacities.io/reference/basic-types/audio` — Audio files & voice memo objects
* `https://docs.capacities.io/reference/basic-types/pdfs` — PDF document objects & reader
* `https://docs.capacities.io/reference/basic-types/files` — General file attachment objects
* `https://docs.capacities.io/reference/basic-types/table-object` — Structured table object types

---

### 2.3 Task Management, Time & Workflow Engines

* `https://docs.capacities.io/reference/task-management` — Centralized task aggregator & query engine
* `https://docs.capacities.io/reference/task-actions` — Inline task status toggling, schedule & assign actions
* `https://docs.capacities.io/reference/dates-and-daily-notes` — Daily note creation, date properties, and calendar binding
* `https://docs.capacities.io/reference/calendar-integrations` — External calendar syncing (Google, Outlook, iCal)
* `https://docs.capacities.io/reference/queries` — Dynamic query builder & query blocks

#### Applied Workflow Patterns & Use Cases
* `https://docs.capacities.io/reference/use-cases` — Use case directory
* `https://docs.capacities.io/reference/use-cases/queries-in-practice` — Advanced search & query examples
* `https://docs.capacities.io/reference/use-cases/meeting-notes` — Meeting note workflows with attendee object links
* `https://docs.capacities.io/reference/use-cases/daily-notes` — Daily journaling & task execution
* `https://docs.capacities.io/reference/use-cases/network-of-people` — Contact & CRM relationship graphs
* `https://docs.capacities.io/reference/use-cases/reading-workflow` — Book/article ingestion to literature notes
* `https://docs.capacities.io/reference/use-cases/getting-things-done` — GTD implementation in Capacities
* `https://docs.capacities.io/reference/use-cases/para-in-capacities` — Projects, Areas, Resources, Archives (PARA) mapping

---

### 2.4 AI Assistant, Media Analysis & Intelligence

* `https://docs.capacities.io/reference/ai-assistant` — AI workspace chat, context injection & inline generation
* `https://docs.capacities.io/reference/ai-chat-connectors` — External LLM model selection (OpenAI, Anthropic, etc.)
* `https://docs.capacities.io/reference/media-analysis` — AI OCR, audio transcription, and PDF document Q&A
* `https://docs.capacities.io/more/ai-privacy` — Data privacy controls for AI processing

---

### 2.5 Integrations, Extension & Mobile Ecosystem

#### Official Channel & Hardware Integrations
* `https://docs.capacities.io/reference/web-extension` — Web clipper browser extension
* `https://docs.capacities.io/reference/integrations` — Integrations directory
* `https://docs.capacities.io/reference/integrations/twitter` — Tweet clipping & thread conversion
* `https://docs.capacities.io/reference/integrations/readwise` — Bi-directional Readwise highlight sync
* `https://docs.capacities.io/reference/integrations/whatsapp` — Mobile WhatsApp messaging bot quick capture
* `https://docs.capacities.io/reference/integrations/telegram` — Telegram quick capture bot
* `https://docs.capacities.io/reference/integrations/email` — Email to note forwarding inbox
* `https://docs.capacities.io/reference/integrations/kindle` — Kindle highlight import
* `https://docs.capacities.io/reference/integrations/raycast` — Raycast launcher extension

#### Community Integrations & Ecosystem Tools
* `https://docs.capacities.io/reference/integrations/community/web-highlights` — Web Highlights sync
* `https://docs.capacities.io/reference/integrations/community/funnel-quick-capture` — Funnel mobile capture app
* `https://docs.capacities.io/reference/integrations/community/hookmark` — Hookmark deep link integration
* `https://docs.capacities.io/reference/integrations/community/supasend` — Supasend capture integration
* `https://docs.capacities.io/reference/integrations/community/quick-note-pro` — Quick Note Pro menu bar utility
* `https://docs.capacities.io/reference/integrations/community/mellilex` — Mellilex AI extension
* `https://docs.capacities.io/reference/integrations/community/cap-note` — Cap-Note helper tool
* `https://docs.capacities.io/reference/integrations/community/contribute` — Community integration submission guidelines

#### Platforms & Devices
* `https://docs.capacities.io/reference/mobile` — iOS & Android mobile application specs
* `https://docs.capacities.io/reference/tablet` — iPad & Android tablet optimized layouts

---

### 2.6 Developer Platform, REST API & MCP

#### Developer Documentation Roots
* `https://docs.capacities.io/developer/api` — General API introduction & key management
* `https://docs.capacities.io/developer/x-callback-urls` — X-Callback URL scheme documentation
* `https://docs.capacities.io/developer/model-context-protocol` — MCP integration & server specs
* `https://docs.capacities.io/developer/contribute` — Open developer contributions
* `https://docs.capacities.io/developer/responsible-disclosure` — Security vulnerability disclosure policy

#### Developers Portal Deep-Dive (`developers.capacities.io`)
* `https://developers.capacities.io/` — Developer hub landing page
* `https://developers.capacities.io/api/overview` — REST API architecture Overview
* `https://developers.capacities.io/api/overview/authentication` — Bearer Token authentication & scopes
* `https://developers.capacities.io/api/overview/sdks` — Official & community SDKs
* `https://developers.capacities.io/api/overview/versioning` — API versioning strategy
* `https://developers.capacities.io/api/overview/rate-limiting` — Rate limits & quota management
* `https://developers.capacities.io/api/overview/errors` — Standard HTTP status error payloads
* `https://developers.capacities.io/api/overview/migration` — API breaking changes & version migration guides
* `https://developers.capacities.io/api/overview/concurrency` — Optimistic locking & concurrent mutation handling
* `https://developers.capacities.io/api/concepts/structures` — Space, Collection, and Object Type models
* `https://developers.capacities.io/api/concepts/properties` — Dynamic object properties and value types
* `https://developers.capacities.io/api/concepts/objects` — Object CRUD endpoints & payload structures
* `https://developers.capacities.io/api/concepts/blocks` — Rich-text block trees & manipulation
* `https://developers.capacities.io/api/concepts/text-tokens` — Mention, tag, link, and formatting inline tokens
* `https://developers.capacities.io/api/concepts/markdown` — Markdown AST export/import specifications

---

### 2.7 Data Management, Sync, Security & Operations

#### Sync & Storage Engineering
* `https://docs.capacities.io/misc/offline-support` — Local-first IndexedDB database & offline queueing
* `https://docs.capacities.io/misc/sync` — Real-time websocket & background sync engine
* `https://docs.capacities.io/misc/media-upload` — Cloud media asset storage & CDN delivery
* `https://docs.capacities.io/reference/import` — Markdown, CSV, and HTML document import
* `https://docs.capacities.io/reference/bulk-import` — Large-scale vault & folder migration
* `https://docs.capacities.io/reference/export` — JSON, Markdown, and PDF export standards

#### Data Protection & Security Policies
* `https://docs.capacities.io/more/data-protection` — Security overview & data isolation
* `https://docs.capacities.io/more/data-protection-memo` — Data protection architecture memo
* `https://docs.capacities.io/more/data-processing-agreement` — GDPR DPA compliance terms
* `https://docs.capacities.io/more/collaboration` — Real-time co-editing permissions & presence
* `https://docs.capacities.io/more/end-to-end-encryption` — Vault encryption models

---

### 2.8 Migration Pathways

Official migration guides from major PKM and note-taking competitors:
* `https://docs.capacities.io/migration` — Master migration Hub
* `https://docs.capacities.io/migration/switching-from-apple-notes` — Importing Apple Notes via HTML/textbundle
* `https://docs.capacities.io/migration/switching-from-evernote` — Importing Evernote ENEX files into structured object types
* `https://docs.capacities.io/migration/switching-from-notion` — Mapping Notion database pages to Capacities object types
* `https://docs.capacities.io/migration/switching-from-obsidian` — Converting Obsidian frontmatter tags and wikilinks
* `https://docs.capacities.io/migration/switching-from-tana` — Mapping Tana supertags and fields to Capacities object schemas

---

### 2.9 Frequently Asked Questions (FAQ)

#### Account & Billing FAQs
* `https://docs.capacities.io/faq` — Master FAQ index
* `https://docs.capacities.io/reference/account` — Account management & workspace settings
* `https://docs.capacities.io/faq/account` — Account security & login assistance
* `https://docs.capacities.io/faq/account/unable-to-login` — OAuth & credential troubleshooting
* `https://docs.capacities.io/faq/account/email-not-verified` — Verification loop resolution
* `https://docs.capacities.io/faq/account/login-with-google` — SSO authentication behavior
* `https://docs.capacities.io/faq/account/merge-accounts` — Account consolidation
* `https://docs.capacities.io/faq/account/cancel-subscription` — Subscription cancellation policy
* `https://docs.capacities.io/faq/account/cancel-paid-subscription` — Refund & downgrade rules
* `https://docs.capacities.io/faq/account/free-trial-credit-card` — Trial billing details
* `https://docs.capacities.io/faq/account/affiliate-code-free-trial` — Referral discount rules
* `https://docs.capacities.io/faq/account/content-not-downloaded` — Media offline cache sync troubleshooting
* `https://docs.capacities.io/faq/account/storage-limits` — Storage quota tiers
* `https://docs.capacities.io/faq/account/fresh-start` — Full workspace wipe / reset
* `https://docs.capacities.io/faq/account/delete-account-and-data` — Data deletion compliance
* `https://docs.capacities.io/faq/account/data-about-me` — Personal data export (GDPR Art. 15)
* `https://docs.capacities.io/faq/account/remove-all-content` — Content purging without deleting account

#### General Product FAQs
* `https://docs.capacities.io/faq/general` — Platform capabilities FAQ
* `https://docs.capacities.io/faq/general/device-support` — Minimum hardware & OS requirements
* `https://docs.capacities.io/faq/general/language-support` — Localization roadmap & i18n support
* `https://docs.capacities.io/faq/general/capacities-at-work` — Enterprise & team usage guidance
* `https://docs.capacities.io/faq/general/create-object-types-mobile` — Mobile schema editor constraints
* `https://docs.capacities.io/faq/general/pin-today-sidebar` — Navigation customization
* `https://docs.capacities.io/faq/general/global-font-size` — Typography accessibility controls
* `https://docs.capacities.io/faq/general/where-is-graph-view` — Graph visualization access & status
* `https://docs.capacities.io/faq/general/capacities-development` — Product roadmap & release cadence
* `https://docs.capacities.io/faq/general/cant-find-space-id` — Finding Space UUIDs for API access
* `https://docs.capacities.io/faq/general/display-of-tweets` — Twitter embed rendering logic
* `https://docs.capacities.io/faq/general/space-missing-mcp-consent` — Resolving MCP access permissions per space

#### Editing & Structure FAQs
* `https://docs.capacities.io/faq/editing` — Rich-text editing troubleshooting
* `https://docs.capacities.io/faq/editing/structure-without-folders` — Best practices for folderless knowledge organization

#### Community & Affiliates
* `https://docs.capacities.io/more/community` — Discord & Believer community links
* `https://docs.capacities.io/more/discount` — Student & non-profit discounts
* `https://docs.capacities.io/more/affiliate` — Affiliate program terms

---

## 3. Key Feature Matrix for Competitive Parity

| Feature Domain | Capacities Implementation | Benchmark Requirement for `notes-app` |
| :--- | :--- | :--- |
| **Data Model** | Object-based types (Pages, Weblinks, Books, Custom Types) with dynamic property schemas. | Support structured note types with typed metadata fields alongside raw text notes. |
| **Organization** | Collections, Tags, Spaces, and Dynamic Queries (no rigid directory tree). | Provide multi-view collections, tags, and graph-based bidirectional links. |
| **Temporal Engine** | Integrated Daily Notes page bound to calendar events & tasks. | Daily note workspace view with task aggregation and schedule shortcuts. |
| **Extensibility** | REST API, Model Context Protocol (MCP) server, and X-Callback URL scheme. | Expose local API/MCP capabilities for LLM agent integration and external extensions. |
| **Ingestion Pipeline** | Multi-channel bots (WhatsApp/Telegram/Email), Readwise sync, Web Clipper. | Native Readwise highlight sync and structured Web Clipper support. |
| **Offline Sync** | Local-first storage with background websocket sync engine. | Offline local database storage (IndexedDB/PWA) with transparent background sync. |

---

## 4. Verification & Source Provenance

* **Audited Snapshot File:** `.worktrees/reference-urls (2).json`
* **Coverage:** 154 unique Capacities URLs cataloged across documentation, API portals, machine discovery indexes, and service endpoints.
* **Audit Timestamp:** 2026-08-22 snapshot.
