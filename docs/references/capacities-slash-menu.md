---
title: Capacities slash-command menu reference
reference_type: authenticated-product
source_type: user-supplied-screenshot-and-archived-source
updated: 2026-08-24
confidence: confirmed
---

# Capacities slash-command menu reference

This document records the user-supplied Capacities slash-command screenshot and the archived-source behavior used for Notes App editor acceptance.

## Screenshot evidence

- Source screenshot: supplied in the Notes App project conversation on 2026-08-24.
- Source dimensions: **619 × 545 px**.
- Source PNG SHA-256: `c16d002a2c7caff2918edbec40ae915f52454ab3a557e2637591a31ddc3dc1de`.
- Stored asset: `docs/references/assets/capacities-slash-menu-2026-08-24.webp`.
- Stored WebP SHA-256: `f2ac5edd1c7ed1b75e39bc9935c73cd1550fe73a2ee489bf0be9d86c84cd0676`.

The screenshot confirms the visible menu surface, ordering, labels, active row treatment, icon style, footer legend, and that `/` can open after existing text followed by whitespace.

## Archived source evidence

The canonical project archive confirms these independent first-slice block commands and labels:

- hierarchy: `Padrão`, `Pequeno`, `Cabeçalho 1`, `Cabeçalho 2`, `Cabeçalho 3`, `Cabeçalho 4`;
- list styles: markers, numerical, alphabetical, and roman;
- task/todo and quote commands;
- additional toggle/group/icon/color/AI behaviors remain outside this first slice where the neutral Notes App schema cannot represent them safely yet.

The archived source models hierarchy and list style independently. Notes App keeps a vendor-neutral schema and reproduces only behavior the current first-slice document can persist without loss.

## Trigger contract

- `/` at the beginning of a text block opens the command menu.
- `/` after whitespace in an existing text block opens the command menu, e.g. `aaa /`.
- `/` typed directly inside a word does not open the menu, e.g. `aaa/`.
- The command query begins after `/` and remains keyboard-operable with Arrow Up/Down, Enter, and Escape.

## Surface contract

The screenshot baseline is approximately **440 px** wide with a white surface, subtle neutral border, approximately 14 px radius, 40 px command rows, muted unboxed glyph icons, a subtle warm-gray active row, and a footer containing navigation/cancel/select keyboard hints.

Leading visible order:

1. Padrão
2. Pequeno
3. Cabeçalho 1
4. Cabeçalho 2
5. Cabeçalho 3
6. Cabeçalho 4
7. Lista de marcadores
8. Lista alfabética

The remaining supported list/task/quote/code commands follow the same shared catalog and are scrollable rather than changing the leading reference order.
