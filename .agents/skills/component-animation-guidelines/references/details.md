# AI Component & Animation Design Rules — Full Reference

## Inspired by Apple, Duolingo, Revolut & Phantom

Use this document as a mandatory guideline whenever generating UI components, animations, or interaction systems.

---

# 1. Core Philosophy

> Features make something usable.
> Emotion makes something lovable.
> Polish makes something trustworthy.

Every component must:

- Feel physical
- Feel responsive
- Feel intentional
- Reduce friction
- Build trust
- Reinforce emotional feedback

Animation is never decoration.
It is communication.

---

# 2. Physics-Based Interaction Rule

### Components must obey real-world physics.

When generating animations:

- Use momentum
- Use easing that mimics weight
- Include friction and resistance
- Avoid linear, robotic motion

### Examples

- Scroll should have elastic bounce
- Drag should feel weighted
- Cards should slightly tilt or respond to movement
- Modals should ease in with acceleration/deceleration

### Never

- Use abrupt stops
- Use instant appearance/disappearance without transition
- Use unnatural, sharp timing curves

---

# 3. Micro-Feedback Rule

Every user action must produce feedback.

If a user:

- Taps
- Clicks
- Drags
- Submits
- Completes
- Fails

There must be:

- Visual feedback
- Motion feedback
- Or subtle state change

### Acceptable Feedback

- Subtle bounce
- Glow
- Scale down/up on tap
- Haptic-like animation
- Soft fade
- Progress animation

### Purpose

Micro-feedback reassures the brain:

> "The system is alive and responding."

---

# 4. Emotional Feedback Rule

Functional feedback is not enough.
Feedback must feel human.

When user:

- Succeeds → celebrate lightly
- Makes progress → show momentum
- Completes streak → amplify reward
- Makes mistake → respond gently

### Examples

- Success state animation
- Progress bars with motion
- Streak animations
- Mascot reactions (if applicable)
- Encouraging microcopy paired with motion

Avoid sterile confirmation states.

---

# 5. First Impression Rule

Onboarding and first interactions must feel premium.

Polish:

- Entry transitions
- Loading animations
- Form transitions
- Button hover states

First 10 seconds = trust foundation.

No boring static screens.
No harsh jumps.
No abrupt context switches.

---

# 6. Three-Tap Principle

Common actions must be:

- Fast
- Predictable
- Within 3 interactions

When designing components:

- Prioritize primary action visibility
- Hide secondary actions
- Remove unnecessary steps

Optimize for:

> The most frequent action.

---

# 7. Remove Before Adding Rule

Before generating UI:

1. Remove all non-essential elements
2. Add back strategically

Avoid:

- Overcrowded layouts
- Too many visible options
- Decision paralysis

Design for clarity first.
Complexity reveals progressively.

---

# 8. Consistency Rule (Design System Discipline)

All components must:

- Use consistent spacing
- Use consistent corner radius
- Use consistent motion timing
- Use consistent interaction patterns
- Follow shared animation curves

### Mathematical Harmony

- Use consistent border radius (prefer smooth/squircle shapes)
- Use consistent scale increments
- Use proportional spacing
- Align animations across the system

Consistency builds trust.

---

# 9. Spatial Continuity Rule

Never teleport users between states.

Use animated transitions that:

- Show spatial movement
- Preserve mental model
- Indicate where the user came from

Examples:

- Slide transitions between screens
- Expand card into full page
- Fade with depth layering
- Shared element transitions

Users should build a mental map of the interface.

---

# 10. Trust Through Polish Rule

Especially important in:

- Finance
- Health
- Crypto
- Insurance
- Enterprise tools

Polish is not luxury — it is trust.

Include:

- Smooth loading states
- Clean transitions
- Soft fades
- Intentional hover states
- Clear feedback loops

No jitter.
No layout shifts.
No sloppy animation timing.

---

# 11. Momentum & Progress Rule

Users must feel they are building something.

Include:

- Progress animations
- Completion indicators
- Growing streak visuals
- Level indicators
- Subtle animated counters

Motion should reinforce:

> "You're advancing."

---

# 12. Performance Rule

Animations must:

- Be smooth (60fps minimum target)
- Never block interaction
- Never delay core action
- Be interruptible when appropriate

Avoid:

- Long unskippable animations
- Heavy motion on low-end devices
- Animation for decoration only

Smooth > flashy.

---

# 13. Approachability Rule

For complex or intimidating domains:

- Use warm visual language
- Use subtle friendly animation
- Reduce visual aggression
- Avoid harsh colors and sharp movement

Goal:

> Make heavy topics feel lighter.

---

# 14. Muscle Memory Rule

Keep primary actions:

- In consistent positions
- With consistent animation
- With predictable transitions

Users should navigate without thinking.

Never move primary navigation randomly.

---

# 15. Layered Depth Rule

Use:

- Blur
- Translucency
- Parallax (subtle)
- Shadow depth

To create hierarchy and immersion.

But:
Subtle > dramatic.

---

# 16. Success State Design Rule

Success should:

- Feel intentional
- Feel earned
- Be slightly delightful

Use:

- Scale pop
- Soft glow
- Gentle animation burst
- Brief motion accent

Not:

- Confetti explosions everywhere
- Loud over-animation

---

# 17. Animation Timing Guidelines

Use natural easing:

- ease-in-out
- cubic-bezier curves mimicking acceleration

Avoid:

- Linear motion
- Mechanical motion
- Overly bouncy cartoon physics (unless brand requires it)

Standard durations:

- Micro-interactions: 120–200ms
- State transitions: 200–350ms
- Page transitions: 300–500ms

---

# 18. When Generating a Component, Always Ask:

1. What emotion should this create?
2. What feedback confirms interaction?
3. Does this reduce friction?
4. Is this consistent with the system?
5. Is the motion physical?
6. Is anything unnecessary?
7. Does this build trust?

If any answer is weak → refine.

---

# 19. Anti-Patterns (Never Generate)

- Static UI with zero feedback
- Instant state changes with no transition
- Over-animated distracting motion
- Inconsistent easing
- Jumpy layout shifts
- Animation without purpose
- Complex UI with no hierarchy

---

# 20. The Golden Standard

The goal is not:
"Looks cool."

The goal is:

- Feels alive
- Feels obvious
- Feels trustworthy
- Feels premium
- Feels effortless

When done correctly:
Users should not notice the animation consciously.

They should just feel:
"This is really good."

---

# Final Principle

Design is not what users see.
Design is what users feel.

Animation is emotional infrastructure.
Treat it like a core feature.
