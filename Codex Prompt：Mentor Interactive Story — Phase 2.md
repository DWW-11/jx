# Codex Prompt：Mentor Interactive Story — Phase 2

Continue the existing Mentor Interactive Story project.

Do NOT redesign the visual system.

Phase 2 must continue seamlessly from the final frame of Scene 02:

> The reviewed document is open.  
> Mentor annotations have detached from the paper.  
> Several question fragments are now floating slowly in space.

The second half of the experience should gradually shift from:

**what the mentor said**

to:

**what remained after the mentor stopped saying it.**

The emotional sequence is:

**理解 → 回忆 → 内化 → 离开 → 信**

Do not make the story increasingly dramatic.

The experience should actually become quieter toward the ending.

---

# Overall Phase 2 Structure

Implement:

- Scene 03 — Learning to See
- Scene 04 — Small Memories
- Scene 05 — It Stayed
- Scene 06 — Leaving
- Scene 07 — The Letter

Do not add unrelated features.

The entire project should feel like one continuous spatial journey rather than five different pages.

---

# Scene 03 — Learning to See

## Narrative purpose

This scene represents the mentor teaching a way of thinking rather than providing answers.

The visitor should slowly realise:

> The important thing was not the solution itself.  
> It was learning how to look at a problem.

---

## Starting state

Continue directly from Scene 02.

Floating annotation fragments include placeholder questions such as:

- “用户是谁？”
- “为什么需要它？”
- “还有其他场景吗？”
- “失败了怎么办？”
- “下一步是什么？”
- “有没有遗漏的状态？”

These phrases must remain editable inside:

`src/content/mentor.ts`

Do not hardcode narrative text inside components.

---

## Visual composition

The document slowly fades into the background.

The paper remains visible but loses visual priority.

The floating questions move into a large empty spatial field.

Do not place them in conventional cards.

They should feel like physical fragments suspended in space.

Use:

- different depth levels
- slight rotation
- subtle blur according to depth
- gentle inertia
- slow ambient drift

The surrounding environment should be darker and quieter than Scene 02.

The desk lamp is still visible far behind the scene.

---

## Interaction

The visitor can gently drag the question fragments.

This is NOT a difficult puzzle.

The interaction should feel exploratory.

As the visitor moves the fragments, invisible attraction zones subtly guide them into conceptual groups.

Possible groups:

### User
- 用户是谁
- 用户为什么需要它

### Scenario
- 在什么情况下发生
- 还有其他情况吗

### Flow
- 下一步是什么
- 状态之后去哪里

### Exception
- 失败怎么办
- 网络断开怎么办
- 有没有遗漏

Do not display these group names immediately.

The visitor should first feel that previously scattered questions are becoming organised.

Use magnetic easing rather than snapping abruptly.

---

## Completion state

When enough fragments are approximately organised, do not show:

“Completed”
“Success”
“Next”

Instead, the fragments naturally settle.

Thin hand-drawn lines gradually appear between them.

The structure becomes readable as a thinking framework.

Example visual structure:

              用户
               │
      场景 ─────┼───── 目标
               │
              方案
               │
              异常

Keep it visually loose and organic.

Avoid diagrams that look like enterprise flowcharts.

---

## Narrative text

After the structure settles:

Display slowly:

“后来才明白。”

Pause.

Then:

“你教我的，并不是某一个答案。”

Pause longer.

Then:

“而是怎么把一个问题想完整。”

Do not put the sentence inside a modal or container.

Typography exists directly inside the environment.

---

## Transition

After the final sentence:

The diagram begins to dissolve.

Individual fragments become small points of light.

A few of them drift toward different directions.

Each light leads toward an object.

These objects belong to Scene 04.

The visitor should feel that abstract learning is transforming back into concrete memories.

---

# Scene 04 — Small Memories

## Narrative purpose

This scene should deliberately become more personal and less conceptual.

It represents ordinary moments that did not seem important at the time.

The emotional goal is:

> “原来这些小事情，他也记得。”

Avoid summarising the mentor's qualities.

Never say:

- “你非常耐心”
- “你对我帮助很大”
- “你教会了我很多”

Instead show specific events that allow the visitor to infer those qualities.

---

# Environment

Create a quiet abstract memory room.

It can loosely resemble the original workspace but should feel incomplete.

Only a few objects exist.

Recommended objects:

1. coffee cup
2. meeting note
3. chat bubble / message
4. draft document
5. chair or desk corner

Do not overcrowd the scene.

Use large negative space.

Each memory object should have its own subtle pool of light.

The rest remains muted.

---

# Memory Object System

Create a reusable component:

`MemoryObject`

Props:

```ts
type MemoryObjectData = {
  id: string
  type: "coffee" | "document" | "message" | "meeting" | "custom"
  position: {
    x: number
    y: number
    depth?: number
  }
  title?: string
  text: string[]
  sound?: string
  accent?: string
}
```

Content must come from:

`mentor.ts`

---

# Interaction principle

The visitor discovers memories in any order.

Do NOT force a fixed sequence inside this scene.

Hover:

- slight movement
- light increases
- environmental sound subtly focuses

Click:

The environment around the object softens.

A short memory appears.

Never display more than approximately 2–4 lines at once.

---

# Example placeholders

## Coffee

Possible text:

“那天下午改到很晚。”

Pause.

“你路过的时候说：”

Pause.

“‘这个不用今天一定做完。’”

Do NOT exaggerate this moment.

Allow silence afterwards.

---

## Meeting

Possible text:

“第一次让我自己讲完整个方案。”

Then:

“你坐在旁边，没有接过去讲。”

Then:

“那时候其实挺紧张的。”

---

## Document

Possible text:

“这一版后来改了很多次。”

Then:

“但你好像很少直接告诉我应该怎么改。”

Then:

“更多时候，你只是继续问。”

---

## Message

Possible text:

“有些话当时看起来很普通。”

Then show the actual placeholder quote.

Example:

“先想清楚用户为什么要用。”

Then:

“后来我发现自己也开始这样问。”

---

# Memory completion behaviour

Each opened memory leaves behind one small glowing mark.

The marks should remain subtle.

After the visitor has opened at least 3 memories:

The marks begin slowly connecting.

Do not form a literal constellation.

Instead they loosely create a visual path toward another desk.

The visitor follows the path.

This leads into Scene 05.

---

# Scene 05 — It Stayed

## Narrative purpose

This is the emotional peak.

The scene shows that the mentor is no longer present, but their way of thinking remains.

Do NOT show a mentor character.

Do NOT display a photo.

Absence is important.

---

# Environment

Create a new workspace.

It should feel related to Scene 01 but not identical.

Visual differences:

Scene 01:
- unfamiliar
- empty
- small narrator
- warm mentor light

Scene 05:
- more organised
- clearer
- brighter
- narrator has ownership of the space

The same desk lamp motif may appear, but it is now switched off initially.

---

# Main interaction

There is a new clean document.

No annotations.

No mentor feedback.

The visitor opens it.

For several seconds, nothing happens.

This silence matters.

Then questions begin appearing automatically.

But unlike Scene 02:

they are NOT written in red.

Use the narrator's own ink colour:

`#18212B`

Questions appear one by one:

“用户为什么需要它？”

“如果这里失败呢？”

“还有其他状态吗？”

“这个流程真的走得通吗？”

“是不是漏了什么？”

These questions should visually echo the earlier mentor annotations without copying them exactly.

The visitor should recognise the relationship.

---

# Key visual moment

While the questions appear:

The original red mentor annotations from Scene 02 briefly appear as very faint ghost traces underneath.

Then disappear.

Only the narrator's own dark writing remains.

This visual transformation should communicate:

> learned behaviour has become internal behaviour.

Do not explain this directly beforehand.

---

# Narrative text

After the final question appears:

Display:

“后来有一天。”

Pause.

“我发现这些问题开始自己出现在脑子里。”

Long pause.

Then:

“那时候我才意识到——”

Pause.

“有些东西已经留下来了。”

Keep this moment extremely restrained.

No dramatic explosion.

No huge particle effect.

No strong music crescendo.

Instead:

The desk lamp slowly turns on by itself.

Use very subtle warm light.

---

# Transition

The camera slowly pulls backwards.

For the first time, the visitor sees the entire workspace.

Several objects from previous scenes are faintly visible.

Then the environment begins preparing for departure.

---

# Scene 06 — Leaving

## Narrative purpose

Represent the end of this period of work.

Do not portray departure as tragedy.

The emotion should be:

- quiet
- reflective
- slightly empty
- grateful

The scene should feel like finishing a normal workday, except this is the last one.

---

# Visual state

Use the same workspace.

Slowly remove objects one by one.

Possible sequence:

1. meeting notes fade
2. documents disappear
3. laptop screen turns off
4. messages disappear
5. chair moves slightly back
6. work badge remains
7. finally the badge disappears

Do not remove everything simultaneously.

Allow approximately 1–2 seconds between meaningful changes.

---

# Sound design

Gradually simplify sound.

Start with:

- distant keyboard
- room ambience
- air conditioning
- occasional chair movement

Then remove:

keyboard

Then:

office activity

Finally leave:

room tone

Then almost silence.

---

# Optional interaction

Do not make the user click a “离开” button.

Instead, allow the visitor to move toward the edge of the workspace.

The camera follows slowly.

As the visitor moves:

the room becomes darker behind them.

The original desk lamp remains visible.

The visitor eventually realises:

the lamp did not turn off.

---

# Narrative text

Use very little text.

Possible sequence:

“后来，这段工作结束了。”

Pause.

“很多具体的事情也慢慢记不清了。”

Pause.

Then avoid text for several seconds.

The visitor looks back.

The lamp is still on.

Final line:

“但好像总有一些东西，没有一起离开。”

---

# Return to the desk

The visitor's attention is naturally drawn back toward the lamp.

Do not show an arrow.

Use:

- contrast
- light
- sound
- camera composition

to guide attention.

As the visitor approaches:

the desk becomes visible again.

Everything else is gone.

Only:

- desk
- lamp
- shadow

At first the desk appears empty.

---

# Discovering the envelope

The envelope must NOT automatically appear in the center.

It should be partially hidden near the edge of the lamp's shadow.

Only a small corner is visible.

Cursor proximity slowly changes the shadow.

The envelope becomes easier to notice.

When the visitor approaches:

it slides outward approximately 20–30px.

Very subtly.

No bouncing.

No glowing outline.

No “点击查看”.

The user should understand through behaviour.

Envelope text:

“To. [mentor name]”

Use mentor content configuration.

---

# Scene 07 — The Letter

## Narrative purpose

Everything before this scene exists to earn the right to show the letter.

Therefore:

This scene must be the simplest scene in the entire experience.

---

# Opening interaction

Click the envelope.

Do NOT instantly cut to a letter.

Sequence:

1. camera gently moves closer
2. environment softens
3. lamp remains visible
4. envelope rotates slightly
5. flap opens
6. paper slides out
7. world gradually loses depth
8. screen becomes warm paper background

The transition should feel as if the visitor physically moves from the world into the letter.

---

# Letter view

Background:

`#F6F1E7`

Text:

`#18212B`

Do not use a conventional card.

Do not place a white rectangle on another background.

The entire screen becomes the letter.

Typography should feel editorial and intimate.

Recommended content width:

560–680px desktop.

Large margins.

Line height:

1.8–2.0.

The letter may be long.

Scrolling is allowed here.

This is the only scene where normal scrolling should feel natural.

---

# Letter content

Store the full letter in:

`mentor.ts`

Example structure:

```ts
letter: {
  salutation: "XX，你好：",
  paragraphs: [
    "...",
    "...",
    "...",
    "..."
  ],
  closing: "谢谢你陪我走过这一段。",
  signature: "...",
  date: "..."
}
```

Do not write fake personal content.

Use placeholders until real content is provided.

---

# Letter reveal

Do not typewriter-render the entire letter.

Long typewriter effects are annoying.

Instead:

Each paragraph may gently become visible as it enters the viewport.

Animation should be almost imperceptible.

Reading must take priority.

---

# Final moment

At the end of the letter:

leave generous empty space.

Then display one final sentence.

Example placeholder:

“很幸运，那段路遇见了你。”

Do not show:

THE END

Do not show confetti.

Do not show fireworks.

Do not immediately show navigation.

Allow the visitor to remain there.

---

# Ending interaction

After several seconds, a small unobtrusive text may appear:

“回到开始”

or:

“再走一次”

Position it away from the emotional closing line.

It should never compete with the letter.

---

# Global Progress Design

Do NOT use a traditional progress bar.

The recurring desk lamp itself acts as the narrative progress indicator.

Suggested behaviour:

Scene 00:
one weak light

Scene 01:
desk illuminated

Scene 02:
document illuminated

Scene 03:
questions illuminated

Scene 04:
multiple small memory lights

Scene 05:
new lamp lights automatically

Scene 06:
all lights disappear except one

Scene 07:
light becomes the paper background

This creates a visual narrative loop.

---

# Global Cursor Design

Use a custom cursor only if it improves interaction clarity.

Default state:

small dark dot.

Near interactive memory:

slightly expands.

Near draggable content:

shows subtle ring.

Near the envelope:

slightly contracts as if focusing.

Do NOT display text such as:

“CLICK”

“DRAG”

unless usability testing shows it is necessary.

---

# Ambient Particle System

Use very restrained ambient particles.

Possible forms:

- dust in lamp light
- tiny paper fibres
- very subtle floating specks

Particles should never resemble:

- stars
- magical sparkles
- celebration effects

The environment is a memory, not a fantasy game.

---

# Scene Transitions

All scenes must exist inside one continuous application.

Avoid URL route transitions.

Recommended architecture:

```ts
type SceneId =
  | "intro"
  | "first-day"
  | "document"
  | "thinking"
  | "memories"
  | "internalized"
  | "departure"
  | "letter"
```

Use one global story state.

Example:

```ts
type StoryState = {
  currentScene: SceneId
  soundEnabled: boolean
  discoveredMemories: string[]
  annotationsRevealed: number
  thinkingProgress: number
  letterOpened: boolean
}
```

Prefer controlled scene transitions through GSAP timelines.

---

# Transition Timing

Do not rush transitions.

Suggested timing philosophy:

micro interaction:
200–500ms

physical object response:
500–1000ms

scene transformation:
1.5–3s

important narrative pause:
1–3s

departure:
4–8s

letter opening:
3–5s

Do not mechanically use these exact durations everywhere.

Use them as pacing guidance.

---

# Typography

Chinese typography must be treated carefully.

Use a high-quality Chinese sans or serif font available through web-safe or licensed public web font sources.

Suggested combination:

Narrative:
serif or humanist typeface

UI hints:
sans-serif

Do not use decorative handwriting fonts for large bodies of Chinese text.

Handwritten feeling should primarily come from:

- annotation strokes
- lines
- small marks

rather than illegible handwriting fonts.

---

# Accessibility

Even though this is an experimental narrative website:

Support:

- prefers-reduced-motion
- keyboard activation for primary interactions
- subtitles / text equivalents for meaningful audio
- mute control always accessible
- sufficient contrast

If `prefers-reduced-motion` is active:

replace large camera movement with crossfade and depth changes.

Do not remove narrative content.

---

# Mobile Adaptation

Desktop remains the primary experience.

For mobile:

Scene 03:
tap fragments instead of precise dragging.

Scene 04:
tap objects.

Scene 06:
scroll / swipe to move toward departure.

Envelope:
tap to open.

Do not attempt to reproduce every desktop parallax effect on mobile.

Preserve narrative rather than interaction complexity.

---

# Performance Requirements

Target:

60fps on modern desktop browsers where possible.

Avoid unnecessarily large video backgrounds.

Prefer:

SVG
WebP / AVIF
CSS transforms
GPU-friendly opacity / transform animations

Lazy-load assets for later scenes.

Do not load the full letter and all scene assets before Scene 00 becomes interactive.

---

# Content Configuration

Expand:

`src/content/mentor.ts`

Example:

```ts
export const mentorStory = {
  mentor: {
    name: "MENTOR_NAME",
  },

  intro: {
    line: "有些东西，是离开以后才慢慢看清的。"
  },

  annotations: [
    "如果用户在这里退出呢？",
    "这个状态之后会去哪里？",
    "为什么一定要这样做？"
  ],

  thinkingQuestions: [
    {
      text: "用户是谁？",
      group: "user"
    },
    {
      text: "为什么需要它？",
      group: "user"
    },
    {
      text: "还有其他场景吗？",
      group: "scenario"
    },
    {
      text: "失败了怎么办？",
      group: "exception"
    }
  ],

  memories: [
    {
      id: "coffee",
      type: "coffee",
      text: [
        "MEMORY_PLACEHOLDER"
      ]
    },
    {
      id: "meeting",
      type: "meeting",
      text: [
        "MEMORY_PLACEHOLDER"
      ]
    },
    {
      id: "document",
      type: "document",
      text: [
        "MEMORY_PLACEHOLDER"
      ]
    }
  ],

  internalizedQuestions: [
    "用户为什么需要它？",
    "如果这里失败呢？",
    "还有其他状态吗？",
    "是不是漏了什么？"
  ],

  departure: {
    lines: [
      "后来，这段工作结束了。",
      "很多具体的事情也慢慢记不清了。",
      "但好像总有一些东西，没有一起离开。"
    ]
  },

  letter: {
    salutation: "MENTOR_NAME，你好：",
    paragraphs: [
      "LETTER_PLACEHOLDER"
    ],
    closing: "谢谢你陪我走过这一段。",
    signature: "YOUR_NAME",
    date: ""
  }
}
```

All personalised content must remain editable from this single file.

---

# Phase 2 Development Order

Do NOT implement everything simultaneously.

Implement in this order:

## Step 1
Scene 03 only.

Verify:

- dragging feels physical
- question hierarchy is understandable
- completion does not feel like a game puzzle

## Step 2
Scene 04.

Verify:

- memories feel intimate
- objects do not look like UI cards
- scene has enough negative space

## Step 3
Scene 05.

Spend the most visual and narrative attention here.

The transformation from mentor annotations to internal questions must be immediately understandable without explanatory UI.

## Step 4
Scene 06.

Focus almost entirely on pacing, sound reduction and lighting.

## Step 5
Scene 07.

Focus on reading quality.

Do not over-design it.

---

# Before implementation

Before writing Phase 2 code, output:

1. Scene 03–07 storyboard
2. exact transition relationship between every scene
3. reusable component list
4. required temporary assets
5. animation timeline
6. expected performance risks
7. which effects will use CSS / SVG / GSAP / Canvas
8. any places where Three.js appears necessary

If Three.js is suggested, justify exactly why.

Do not introduce Three.js simply because the reference project used 3D.

---

# Final quality test

Before considering the experience finished, check each scene against this question:

> “If the animation were removed, would this interaction still have narrative meaning?”

If the answer is no, reconsider the interaction.

Also check:

> “Is this scene telling the visitor something new?”

If not, remove it.

The final website should feel less like:

“A website made to thank my mentor.”

and more like:

“A small place containing things I wanted my mentor to know.”