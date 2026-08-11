# Trust, Provenance, and Safety Model

Keep these dimensions separate.

## 1. Trust

Use only:

### OFFICIAL
First-party integration verified through an official platform/vendor source.

### VERIFIED_PUBLISHER
Third-party integration whose publisher identity is verified by an official platform/marketplace or independently tied to the legitimate publisher.

### COMMUNITY
Candidate from a known community catalog with visible provenance but no first-party status.

### UNVERIFIED
Ownership/provenance cannot be sufficiently established.

### NOT_FOUND
No relevant candidate was found.

### UNAVAILABLE
A configured source could not be queried.

Never use `SAFE` as a trust label.

## 2. Format / schema status

Use separately:

### VALID
The candidate's manifest/schema was verified against the current applicable specification or by a reliable schema-validating source.

### INVALID
A verified schema check failed.

### NOT_CHECKED
No reliable schema verification was performed.

Schema validity proves format conformance only.
It does not prove:
- safety;
- official status;
- publisher identity;
- absence of malicious behavior.

## 3. Provenance chain

For important candidates, establish:

`catalog listing -> original repository/publisher -> official/vendor evidence`

Record:
- canonical name;
- original publisher;
- original repository;
- catalogs where found;
- official/vendor evidence;
- metadata mismatches.

## 4. Official-status evidence

Mark `OFFICIAL` only when at least one strong condition is verified:
- first-party listing in the official marketplace;
- official vendor documentation links to it;
- official vendor organization maintains it;
- the platform itself identifies the publisher/integration as first-party.

Do not infer official status from:
- stars;
- downloads;
- popularity;
- naming;
- README claims;
- schema validation;
- presence in a community registry.

## 5. Read-only safety boundary

Never:
- execute plugin code;
- install anything;
- run package managers;
- run community discovery or plugin-manager CLIs;
- run shell or PowerShell commands except documented read-only official vendor CLI discovery commands allowed by policy;
- run shell/PowerShell install commands;
- clone repositories;
- download packages/binaries/archives;
- inspect secrets;
- modify configuration or project files.

Official vendor CLIs may be used only for documented read-only discovery or inspection when all conditions are true:
- official vendor;
- documented command;
- read-only operation;
- no plugin execution;
- no installation;
- no configuration modification.

Allowed CLI families are only `codex`, `claude`, `cursor` / `cursor-agent`, `gemini`, and `agy`.

If current official documentation cannot verify the command, fail closed and do not run it.

Public text/metadata inspection through safe web/research tools is allowed.

## 6. Metadata mismatch

Compare strong candidates across sources.

Flag mismatches such as:

`METADATA_MISMATCH`

Examples:
- marketplace publisher differs from repository owner;
- repository differs across catalogs;
- claimed platforms differ from original manifest;
- integration type differs across sources.

A mismatch lowers confidence until resolved.

## 7. Popularity

Popularity may be shown as secondary context only.

It must never outrank:
- provenance;
- official status;
- verified publisher identity;
- compatibility evidence.

## Core principle

`PROVENANCE > POPULARITY`
`EVIDENCE > CLAIMS`
`READ-ONLY > CONVENIENCE`
