# Codex Prompt — Add Private Password Gate + Redesign Scene 03 Interaction

Modify the existing Mentor Interactive Story project.

Do not redesign the existing visual identity or narrative structure.

This update has two goals:

1. Add a private password gate before the story begins.
2. Redesign Scene 03 because the current free-form floating-question interaction is not sufficiently understandable.

The user should never feel confused about how to continue.

At the same time, avoid conventional tutorial UI.

The environment itself should teach the interaction.

---

# Part A — Private Password Gate

Add a new scene before the sound-selection screen.

Flow:

PasswordGate
→ SoundChoice
→ Scene 00
→ Scene 01
→ ...

The password gate must feel like the beginning of the narrative rather than a login page.

Do NOT use:

- login card
- username field
- large submit button
- dashboard-style authentication
- bright red error alerts
- generic login UI

---

## Visual Direction

Start with an almost dark environment.

Use the existing project's visual palette and atmosphere.

Display a single line:

“有些话，只想留给特定的人。”

Below it, show a minimal password input.

Placeholder:

“输入进入口令”

Use no visible card around the input.

Prefer a simple underline or extremely subtle field boundary.

Below it, use a small understated action:

“进入”

---

# Correct Password Transition

When the password is correct:

1. Disable the input.
2. Cursor caret disappears.
3. Entered password characters slowly lose opacity.
4. Password interface dissolves.
5. A faint warm light becomes visible in the distance.
6. The desk-lamp motif appears for the first time.
7. Transition into the existing sound-choice interaction.
8. Continue to Scene 00.

Do not abruptly route to another page.

The password gate must transform into the story world.

---

# Wrong Password Behaviour

Do not show a large validation error.

Instead:

1. Input moves horizontally a few pixels with restrained physical motion.
2. Show a temporary line:

“好像不是这一串。”

3. Remove the line after approximately 1.5 seconds.
4. Return focus to the password field.

Avoid aggressive red UI.

---

# Password Security

Do NOT store the password in client-side source code.

Do NOT implement:

```ts
const PASSWORD = "..."
```

The site may contain private personal writing.

Implement server-side verification.

Recommended architecture when deployed on Vercel:

Frontend:

POST `/api/auth`

Body:

```json
{
  "password": "..."
}
```

Server:

Read:

`process.env.MENTOR_PASSWORD`

If valid:

create a secure session.

Prefer an HttpOnly cookie.

Suggested properties:

- HttpOnly
- Secure in production
- SameSite=Lax
- reasonable expiration

Protected story content should require a valid session.

Do not send the configured password back to the client.

The password must be configurable only through environment variables.

Provide:

`.env.example`

containing:

```text
MENTOR_PASSWORD=
SESSION_SECRET=
```

Do not commit real secrets.

---

# Part B — Scene 03 Interaction Redesign

The current Scene 03 places floating questions into empty space and expects the visitor to understand that they should organise them.

This interaction is too ambiguous.

Redesign Scene 03 around:

## Guided Semantic Arrangement

The narrative meaning remains:

> The mentor was not teaching individual answers.
> The mentor was teaching how different dimensions of a problem fit together.

But interaction clarity must significantly improve.

---

# Scene 03 Starting State

Continue directly from Scene 02.

Mentor annotations detach from the reviewed document.

Example questions:

- 用户是谁？
- 为什么需要它？
- 还有其他场景吗？
- 什么时候会发生？
- 下一步是什么？
- 这个状态之后去哪？
- 失败了怎么办？
- 有没有遗漏？

They float gently in space.

The document moves backward and becomes visually secondary.

---

# Introduce Semantic Anchors

Four subtle conceptual anchors gradually become visible around the space:

USER

SCENARIO

FLOW

EXCEPTION

Chinese visual labels may be:

用户
场景
流程
异常

Do NOT render them as cards.

Represent each as a minimal environmental symbol.

Suggested visual metaphors:

User:
abstract human silhouette / circular figure

Scenario:
spatial rings / surrounding field

Flow:
continuous directional line

Exception:
broken line / interrupted geometry

The four areas should feel like parts of the environment.

Their boundaries should not be visibly drawn.

---

# Narrative Introduction

Before interaction begins, display:

“那时候，我以为这些只是零散的问题。”

Pause.

Then allow the semantic anchors to appear.

Display:

“后来才发现，它们是在让我看见同一件事情的不同部分。”

Do not show instructional modal text.

---

# First Interaction Must Be Demonstrated

The visitor must NOT be expected to discover the mechanic from nothing.

Temporarily disable manual interaction.

Take the first fragment:

“用户是谁？”

Animate it slowly toward the User anchor.

As it approaches:

- User anchor slightly brightens
- a very subtle attraction line may appear
- fragment naturally settles near the anchor

This animation teaches the interaction.

After it settles:

enable visitor interaction for the remaining fragments.

Do not show:

“Drag the questions”

unless usability fallback is required.

---

# Drag Behaviour

When hovering a question fragment:

- fragment rises slightly
- depth becomes clearer
- cursor subtly changes
- nearby fragments react minimally

When dragging:

question should retain physical inertia.

When approaching the appropriate anchor:

- anchor slightly increases brightness
- fragment movement becomes magnetically attracted

Use generous target zones.

The visitor should not need precise placement.

Suggested attraction radius:

approximately 250–350px depending on viewport.

Do not reject imperfect drops aggressively.

---

# Click Fallback

Every draggable fragment must also support click interaction.

On first click:

- fragment becomes focused
- appropriate anchor subtly responds

On second click, or after a short intentional delay:

the fragment may automatically travel toward the appropriate anchor.

This ensures that visitors who do not understand dragging can still continue.

On touch devices:

prefer tap-to-organise over precise dragging.

---

# Interaction Completion

Do NOT require the visitor to manually arrange every question.

Recommended structure:

Question 1:
automatic demonstration

Questions 2–4:
visitor participation

Remaining questions:
automatically organise once the visitor demonstrates understanding

The experience must not feel like:

“8 tasks remaining”

Do not show counters.

Do not show progress percentages.

Do not show success states.

---

# Automatic Organisation

After three visitor-assisted fragments have been organised:

Pause briefly.

Then remaining fragments begin slowly moving toward their conceptual anchors.

The visitor watches the structure emerge.

As they settle:

thin hand-drawn connecting lines appear.

The final structure may loosely resemble:

              用户
               │

       场景 ── 核心 ── 流程

               │
              异常

Do NOT make it symmetrical or corporate.

Avoid flowchart aesthetics.

Use:

- hand-drawn line variation
- irregular spacing
- spatial depth
- restrained movement

---

# Final Narrative Beat

When the complete structure has settled:

Allow approximately one second of silence.

Then:

“后来才明白。”

Pause.

“你教我的，并不是某一个答案。”

Longer pause.

“而是怎么把一个问题想完整。”

Do not wrap these sentences inside UI containers.

They should exist directly in the environment.

---

# Transition to Scene 04

After the final sentence:

1. connecting lines begin to fade
2. conceptual anchor symbols dissolve
3. question fragments shrink
4. fragments become small points of warm light
5. several lights drift toward different areas of the environment
6. each light eventually illuminates a memory object
7. this becomes the entrance to Scene 04

The transition should communicate:

abstract lessons
→ concrete remembered moments

without a page cut.

---

# Contextual Hint System

Create a reusable environmental hint system for the whole story.

Do NOT use conventional tutorials by default.

Rule:

The visitor should normally:

- discover the interactive focus within approximately 3 seconds
- understand how to progress within approximately 8 seconds

If no meaningful interaction occurs:

provide an environmental hint.

Examples:

Scene 01:
desk lamp subtly directs light toward the document.

Scene 02:
first annotation begins drawing itself slightly.

Scene 03:
one floating fragment moves 20–30px toward its matching anchor and returns.

Scene 04:
one memory object briefly catches warm light.

Scene 06:
lamp shadow gradually reveals more of the hidden envelope.

Hints must belong to the environment.

Avoid:

“点击这里”

“请拖动”

“下一步”

whenever environmental guidance is sufficient.

---

# Reusable Hint Architecture

Create a lightweight hook or controller such as:

```ts
useIdleHint({
  delay: 8000,
  onHint: () => {},
  resetOn: [
    "pointermove",
    "pointerdown",
    "keydown",
    "touchstart"
  ]
})
```

The idle timer should reset after meaningful visitor interaction.

Do not repeatedly show the same hint aggressively.

Each scene should support increasingly clearer hints only if necessary.

Example Scene 03:

Hint level 1:
fragment subtly moves toward anchor.

Hint level 2:
matching anchor briefly brightens.

Hint level 3:
optional minimal text near the fragment:

“试着移动它。”

Only use level 3 if the visitor remains stuck for a long time.

---

# UX Quality Requirement

This is an emotional gift website.

The recipient must never feel that they failed an interaction.

There are:

- no wrong answers
- no puzzle failure
- no scores
- no countdown
- no completion percentages

Interaction exists to create participation in the story, not challenge.

Every scene must have a graceful path forward even if the visitor does not immediately understand the intended gesture.

---

# Before coding

First provide:

1. updated flow including PasswordGate
2. password-auth technical architecture
3. revised Scene 03 storyboard
4. Scene 03 interaction state machine
5. idle-hint behaviour
6. desktop and mobile interaction differences
7. files that need modification

Then implement the changes.