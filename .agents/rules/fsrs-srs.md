---
trigger: model_decision
description: Rules for FSRS spaced repetition scheduler implementation, mathematical state machine, and goal-driven exam pacing burndown.
---

# Spaced Repetition (FSRS) & Exam Pacing Engine

## 1. Mathematical Principles
- **Algorithm**: Modern Free Spaced Repetition Scheduler (FSRS), not SM-2.
- **Four Rating Responses**:
  - `Again` (1): Complete lapse. Reset stability, increment lapses counter. Keyboard shortcut: `1`.
  - `Hard` (2): Difficult recall. Stability multiplier 1.2x. Keyboard shortcut: `2`.
  - `Good` (3): Normal recall. Standard stability update. Keyboard shortcut: `3`.
  - `Easy` (4): Effortless recall. Stability bonus 1.8x. Keyboard shortcut: `4`.
- **Card States**: `'new'`, `'learning'`, `'review'`, `'relearning'`.

## 2. Goal-Driven Exam Pacing Burndown
- Formula for dynamic daily new card quota:
  $$\text{DailyNewQuota} = \left\lceil \frac{N_{\text{unlearned}}}{\max(1, D_{\text{remaining}} - D_{\text{buffer}})} \right\rceil$$
  where $D_{\text{buffer}}$ defaults to 7 days (or 20% of remaining days) reserved for pre-exam consolidation.
- Pacing Status Indicators:
  - $\text{Completed} \ge \text{Expected} \cdot 1.05 \implies$ **Ahead 🚀**
  - $\text{Completed} \ge \text{Expected} \cdot 0.95 \implies$ **On Track ✅**
  - $\text{Completed} < \text{Expected} \cdot 0.95 \implies$ **Behind ⚠️**

## 3. Storage Model
- Store card SRS states on `Flashcard.srs` (`dueDate`, `interval`, `easeFactor`, `stability`, `difficulty`, `repetitionCount`, `lapses`).
- Primary Dexie index: `srs.dueDate, srs.state` for instantaneous review queries.
