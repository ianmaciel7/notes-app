---
name: component-animation-guidelines
description: Design guidelines for UI components, animations, and interaction systems, inspired by Apple, Duolingo, Revolut, and Phantom. Covers physics-based motion, micro-feedback for every user action, emotional feedback, first-impression polish, spatial continuity, consistency and design-system discipline, layered depth, success states, animation timing and easing (durations for micro-interactions, state transitions, page transitions), performance (60fps, non-blocking, interruptible), and anti-patterns to avoid. Apply whenever generating or reviewing UI components, animations, transitions, hover/press states, loading states, or interaction design.
---

# AI Component & Animation Design Rules

Mandatory guideline whenever generating UI components, animations, or interaction systems. Full rule-by-rule detail: [references/details.md](references/details.md).

## Core Philosophy

> Features make something usable. Emotion makes something lovable. Polish makes something trustworthy.

Every component must feel physical, responsive, and intentional; reduce friction; build trust; and reinforce emotional feedback. Animation is never decoration — it is communication.

## The Rules (condensed)

1. **Physics-based motion.** Use momentum, weight-mimicking easing, friction, and resistance. Never abrupt stops, instant appearance/disappearance, or sharp unnatural timing curves.
2. **Micro-feedback.** Every user action (tap, click, drag, submit, complete, fail) produces visual or motion feedback: subtle bounce, glow, scale on tap, soft fade, progress animation. The system must feel alive and responding.
3. **Emotional feedback.** Success → celebrate lightly. Progress → show momentum. Streaks → amplify reward. Mistakes → respond gently. Avoid sterile confirmation states.
4. **First impressions.** Onboarding and first interactions must feel premium: polished entry transitions, loading animations, form transitions, hover states. No boring static screens, harsh jumps, or abrupt context switches.
5. **Three-tap principle.** Common actions must be fast, predictable, and within 3 interactions. Prioritize primary action visibility; hide secondary actions; optimize for the most frequent action.
6. **Remove before adding.** Strip non-essential elements first, add back strategically. Design for clarity; reveal complexity progressively.
7. **Consistency.** Consistent spacing, corner radius (prefer smooth/squircle), motion timing, interaction patterns, and shared animation curves across the system.
8. **Spatial continuity.** Never teleport users between states. Use slides, card-to-page expansion, depth-layered fades, shared element transitions — preserve the user's mental map.
9. **Trust through polish.** Especially in finance, health, crypto, insurance, and enterprise tools: smooth loading states, clean transitions, intentional hover states. No jitter, layout shifts, or sloppy timing.
10. **Momentum & progress.** Progress animations, completion indicators, streak visuals, subtle animated counters. Motion should say "you're advancing."
11. **Performance.** 60fps minimum target; never block interaction or delay the core action; interruptible when appropriate. Avoid long unskippable animations and heavy motion on low-end devices. Smooth > flashy.
12. **Approachability.** For intimidating domains: warm visual language, friendly subtle animation, no harsh colors or sharp movement.
13. **Muscle memory.** Keep primary actions in consistent positions with consistent animation and predictable transitions. Never move primary navigation randomly.
14. **Layered depth.** Blur, translucency, subtle parallax, shadow depth for hierarchy and immersion. Subtle > dramatic.
15. **Success states.** Intentional, earned, slightly delightful: scale pop, soft glow, gentle burst. Not confetti explosions everywhere or loud over-animation.

## Animation Timing

Use natural easing: `ease-in-out` or cubic-bezier curves mimicking acceleration. Avoid linear/mechanical motion and overly bouncy cartoon physics (unless the brand requires it).

| Type | Duration |
| --- | --- |
| Micro-interactions | 120–200ms |
| State transitions | 200–350ms |
| Page transitions | 300–500ms |

## When Generating a Component, Always Ask

1. What emotion should this create?
2. What feedback confirms interaction?
3. Does this reduce friction?
4. Is this consistent with the system?
5. Is the motion physical?
6. Is anything unnecessary?
7. Does this build trust?

If any answer is weak → refine.

## Anti-Patterns (Never Generate)

- Static UI with zero feedback
- Instant state changes with no transition
- Over-animated distracting motion
- Inconsistent easing
- Jumpy layout shifts
- Animation without purpose
- Complex UI with no hierarchy

## The Golden Standard

The goal is not "looks cool." The goal is: feels alive, obvious, trustworthy, premium, effortless. Done correctly, users don't consciously notice the animation — they just feel "this is really good."

Design is not what users see. Design is what users feel. Animation is emotional infrastructure — treat it like a core feature.
