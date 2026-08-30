# Codex Prompt：Mentor Interactive Story — Phase 1

Create an immersive interactive storytelling website inspired by the **interaction philosophy and visual atmosphere** of Nomadic Tribe by makemepulse, but DO NOT copy its scenes, characters, artwork, assets, or specific visual design.

The project is a personal web experience made for a mentor from a past period of work.

The final concept is:

> A letter that cannot be read immediately.  
> The visitor must travel through several memories before eventually discovering the letter.

## Core emotional idea

The visitor should gradually realize:

1. These small moments were remembered.
2. These moments changed how the narrator thinks and works.
3. The influence remained even after they stopped working together.
4. At the end, the visitor discovers a handwritten-style letter.

The experience should feel quiet, restrained, poetic and personal rather than sentimental or dramatic.

---

# Visual Direction

Do NOT design this like a normal website or SaaS interface.

Avoid:

- cards everywhere
- navigation bars
- dashboard layouts
- large conventional buttons
- glassmorphism
- generic gradient UI
- standard landing page sections

The scene itself is the interface.

Use a stylized 2.5D illustrated world inspired by:

- editorial illustration
- graphic novels
- soft 3D
- paper textures
- hand-drawn details
- subtle depth
- restrained cinematic composition

The space should feel real enough to understand but intentionally not photorealistic.

## Color palette

Background:
#ECE6DA

Dark navy / ink:
#18212B

Paper:
#F6F1E7

Annotation red:
#C9584C

Warm lamp light:
#E9B96E

Memory blue-grey:
#748899

Use low saturation.

Important memories may introduce stronger color.

---

# Main Visual Motif

A desk lamp is the recurring visual motif.

At the beginning only one lamp is visible.

As memories are discovered, different parts of the environment become illuminated.

At the end all environmental lights disappear except the original desk lamp.

The desk lamp finally illuminates an envelope.

---

# Motion Principles

Animation should feel physical.

Avoid generic:

- fade-in
- slide-up
- bounce
- exaggerated spring motion

Different objects should have different physical behaviours.

Paper:
unfolds, bends, shifts slightly.

Annotations:
appear as if they are being written.

Floating words:
have inertia and subtle drift.

Lamp:
changes intensity slowly.

Camera:
uses slow cinematic movement.

Envelope:
should feel like physical paper with weight.

Transitions should feel like the environment transforming rather than navigating between web pages.

---

# Interaction Principle

Every interaction must have narrative meaning.

Do not add interactions only because they look impressive.

Examples:

Moving toward a light =
discovering the beginning of the story.

Dragging across a document =
revealing mentor annotations.

Organising floating questions =
understanding a way of thinking.

Searching the final desk =
discovering the hidden letter.

---

# Technology

Use:

- React
- TypeScript
- Vite
- GSAP
- GSAP ScrollTrigger
- Framer Motion where appropriate
- SVG and CSS transforms
- Howler.js for optional sound

Do NOT introduce Three.js unless a specific effect genuinely requires it.

Prefer lightweight 2.5D composition over heavy real-time 3D.

Architecture should allow later scenes to be added independently.

Recommended structure:

src/
  scenes/
    IntroScene/
    FirstDayScene/
    DocumentScene/
    ThinkingScene/
    MemoryScene/
    ChangeScene/
    DepartureScene/
    LetterScene/

  components/
    Scene/
    AmbientSound/
    Lamp/
    Paper/
    Annotation/
    MemoryObject/

  animation/
    camera.ts
    transitions.ts
    timeline.ts

  content/
    mentor.ts

Keep narrative content separate from rendering logic.

---

# Phase 1

Only implement the first three scenes.

Do NOT build the complete website yet.

## Scene 00 — The Light

Start almost completely dark.

Use subtle office ambience.

Centered text slowly appears:

“有些东西，是离开以后才慢慢看清的。”

Do not show a traditional CTA.

A very weak warm light should exist somewhere away from the center.

The visitor discovers it through mouse movement.

When the pointer approaches the light, the light gradually grows brighter.

The environment begins to appear.

Transition naturally into Scene 01.

---

## Scene 01 — First Day

Reveal a large stylized workspace.

Composition:

- lots of negative space
- a small desk
- laptop
- work badge
- coffee cup
- one document
- window
- desk lamp

The scale of the environment should make the narrator initially feel small and unfamiliar.

Do not make every object interactive.

The main interactive object is the document.

Subtle parallax should respond to cursor movement.

The desk lamp provides the primary warm light.

When the visitor approaches the document, it subtly reacts.

Clicking the document transitions into Scene 02.

---

## Scene 02 — The First Review

The document expands until it becomes the primary environment.

It should not look like a PDF viewer.

It should feel like a large physical sheet of paper inside the world.

At first the document appears clean.

As the visitor slowly drags horizontally or vertically across it, handwritten annotation lines appear.

Example placeholder annotations:

“如果用户在这里退出呢？”

“这个状态之后会去哪里？”

“为什么一定要这样做？”

These are placeholders and must be stored in mentor.ts so they can be replaced later.

The annotations should look like they are physically being drawn rather than simply fading in.

After all annotations are revealed, display:

“当时我只看到页面。”

Pause.

Then:

“你看到的是它背后的问题。”

After this line, several annotation words detach from the page and slowly float into space.

These floating words will become the transition into the future Thinking Scene, but do not implement that scene yet.

End Phase 1 here.

---

# Sound

Before the experience begins, provide a minimal sound choice:

“开启声音”
“静音进入”

If sound is enabled, use extremely subtle:

- room tone
- distant keyboard
- paper movement
- pencil writing
- light ambient music texture

Never allow sound to dominate the experience.

---

# Responsive Behaviour

Desktop is the primary target.

The experience must still be viewable on mobile, but complex cursor interactions may be simplified to touch gestures.

Desktop target:
1440 × 900 and above.

Do not design it like a fixed presentation slide.

The environment must respond fluidly to different viewport sizes.

---

# Quality Requirement

Prioritize:

1. composition
2. pacing
3. typography
4. physical motion
5. atmosphere

over the number of features.

It is better to build three excellent scenes than eight mediocre scenes.

Before writing implementation code, first output:

1. proposed project structure
2. animation timeline for Scene 00–02
3. asset list
4. technical approach for each visual effect

Then begin implementation.