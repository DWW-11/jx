export type ThinkingGroupId = 'user' | 'scenario' | 'flow' | 'exception';

export type MemoryObjectData = {
  id: string;
  type: 'coffee' | 'document' | 'message' | 'meeting' | 'custom';
  position: { x: number; y: number; depth?: number };
  title?: string;
  text: string[];
  sound?: string;
  accent?: string;
};

export const mentorStory = {
  eyebrow: '一点记忆',
  mentor: { name: 'MENTOR_NAME' },
  intro: {
    quote: '有些东西，是离开以后才慢慢看清的',
    hint: '微光在视线之外',
  },
  firstDay: {
    chapter: '01 / 第一天',
    title: '那时我还不认识这张桌子',
    body: '空间很大，问题很小\n我只知道先坐下来，把手边的事情做好',
    documentLabel: '一份还没有被看懂的文档',
    documentHint: '靠近它',
  },
  review: {
    dragHint: '一切都很新鲜，但也总会考虑不全面',
    chapter: '02 / 第一次写需求文档',
    title: '纸面之外，还有另一层工作',
    annotations: [
      { text: '如果用户在这里退出呢？', path: 'M 96 166 C 150 140, 230 144, 290 163' },
      { text: '这个状态之后会去哪里？', path: 'M 424 276 C 496 248, 574 250, 644 279' },
      { text: '为什么一定要这样做？', path: 'M 184 409 C 258 382, 348 390, 424 416' },
    ],
    narration: ['当时我只看到页面', '你看到的是它背后的问题'],
    floatingWords: [],
  },
  thinking: {
    chapter: '03 / 学会看见',
    title: '问题还在，只是开始有了方向',
    hint: '面对不同问题，考虑方向也有所不同',
    questions: [
      { id: 'user-who', text: '用户是谁？', group: 'user' as ThinkingGroupId, position: { x: 11, y: 24, rotate: -8, depth: 0 } },
      { id: 'user-why', text: '为什么需要它？', group: 'user' as ThinkingGroupId, position: { x: 29, y: 72, rotate: 5, depth: 1 } },
      { id: 'scenario-when', text: '什么时候会发生？', group: 'scenario' as ThinkingGroupId, position: { x: 48, y: 12, rotate: 3, depth: 2 } },
      { id: 'scenario-other', text: '还有其他场景吗？', group: 'scenario' as ThinkingGroupId, position: { x: 70, y: 62, rotate: -5, depth: 0 } },
      { id: 'flow-next', text: '下一步是什么？', group: 'flow' as ThinkingGroupId, position: { x: 86, y: 29, rotate: 7, depth: 1 } },
      { id: 'flow-after', text: '这个状态之后去哪？', group: 'flow' as ThinkingGroupId, position: { x: 48, y: 84, rotate: -2, depth: 2 } },
      { id: 'exception-fail', text: '失败了怎么办？', group: 'exception' as ThinkingGroupId, position: { x: 70, y: 51, rotate: -8, depth: 1 } },
      { id: 'exception-missing', text: '有没有遗漏？', group: 'exception' as ThinkingGroupId, position: { x: 12, y: 56, rotate: 6, depth: 2 } },
    ],
    groups: {
      user: { label: '用户', position: { x: 26, y: 45 } },
      scenario: { label: '场景', position: { x: 60, y: 23 } },
      flow: { label: '流程', position: { x: 82, y: 45 } },
      exception: { label: '异常', position: { x: 60, y: 71 } },
    } satisfies Record<ThinkingGroupId, { label: string; position: { x: number; y: number } }>,
    introNarration: ['那时候，我以为这些只是零散的问题', '后来才发现，它们是在让我看见同一件事情的不同部分'],
    narration: ['后来才明白', '你教我的，并不是某一个答案', '而是怎么把一个问题想完整'],
  },
  memories: [
    {
      id: 'coffee',
      type: 'coffee' as const,
      position: { x: 30, y: 30, depth: 0 },
      title: '一杯放凉的咖啡',
      text: ['那天编舞到了很晚', '你路过的时候说', '“做不完就和他们说！”'],
      sound: 'paper-and-room',
      accent: '#E9B96E',
    },
    {
      id: 'document',
      type: 'document' as const,
      position: { x: 36, y: 73, depth: 2 },
      title: '一份修改过很多次的文档',
      text: ['第一版后来改了很多次', '但你很少直接告诉我应该怎么改', '更多时候，你只是说明方向，让我可以自己发挥'],
      sound: 'pencil',
      accent: '#748899',
    },
     {
      id: 'message',
      type: 'message' as const,
      position: { x: 76, y: 70, depth: 1 },
      title: '一句看起来很普通的话',
      text: ['有些话当时看起来很普通', '“先想清楚用户怎么用，带入用户视角”', '后来我发现自己也开始这样问'],
      sound: 'distant-keyboard',
      accent: '#D7C39A',
    },
    {
      id: 'meeting',
      type: 'meeting' as const,
      position: { x: 75, y: 28, depth: 1 },
      title: '第一次正式评审会',
      text: ['需要自己讲整个方案', '那时候其实挺紧张的', '但你坐在旁边，替我补充并扛下对方的询问'],
      sound: 'room-tone',
      accent: '#C9584C',
    },
  ] satisfies MemoryObjectData[],
  memoriesScene: {
    chapter: '04 / 小小的记忆',
    title: ['有些事情，', '可能过于平常'],
    body: '它们只是留了下来',
  },
  internalizedQuestions: ['用户为什么需要它？', '如果这里失败呢？', '还有其他状态吗？', '这个流程真的走得通吗？', '是不是漏了什么？'],
  internalizedNarration: ['后来，有一天', '我发现这些问题开始自己出现在脑子里', '那时候我才意识到——有些东西已经留下来了'],
  departure: {
    lines: ['后来，这段工作结束了', '很多具体的事情也慢慢记不清了', '但好像总有一些东西，没有一起离开'],
    envelopeLabel: 'To.家贤',
  },
  letter: {
    eyebrow: '一封有点矫情的信🤣',
    returnText: '回到开始',
    salutation: '家贤姐，你好：',
    paragraphs: [
      '这段实习真的要结束了。回头看，刚来的时候很多事情都还很陌生，现在多少已经能自己把一些事情想清楚、做下去了。',
      '刚来的时候，我其实对很多东西都没有概念。从完全不同的专业走到产品这边，第一次真正参与需求、第一次跟完整的流程、第一次发现“把一个功能想出来”和“真正让它能用”其实差得很远。我现在还挺能想起刚开始做需求时的状态，很多东西想得很表面，自己觉得差不多了，一聊才发现还有一堆场景、异常和前后逻辑没有考虑到。虽然有这个意识，但是还是因为基础概念的缺乏考虑不周全。很多时候我拿着一个自认为已经比较完整的方案过去，你问几个问题之后，我才会发现自己还是有所欠缺，刚开始有时候会觉得自己怎么什么都没想到，后来反而慢慢习惯了先自己多问几遍“为什么”“如果这样呢”“还有没有别的情况”。后来做新的需求时，我开始会下意识地先把这些问题问一遍自己。这个变化可能是我在这段实习里觉得最重要的收获之一（虽然还是不能游刃有余的面对所有工作，仍需努力！）。',
      '在这里也遇到了很多很好的小伙伴，每个人都好优秀，也都很有趣很温暖。虽然我平时不是特别会主动参加活动，很多时候也比较安静，但能感觉到大家一直都挺友好，也让我慢慢没有了刚来时那种拘谨。现在回想起来，除了具体做过的事情，能够遇到这样一群小伙伴反而感觉是更需要珍惜的一部分。',
      '其实对我来说，这段实习的意义可能更多的是让我真正确认了一件事：我愿意继续做这件事情，也开始知道自己接下来还需要补什么、学什么。很感谢你在我刚开始的时候愿意给我机会、给我时间，也愿意认真回答那些现在回头看可能很基础的问题。很多东西当时没有特别意识到，反而是快结束的时候才发现，它们已经慢慢变成了我现在做事情时的一部分。',
      '写在最后：这是第一次做网页，还是有点心有余而力不足，肯定和专业的设计+技术比不了，希望不要嫌弃吖~',
    ],
    closing: '谢谢你让我有机会拥有这样一段意想不到的旅程，并带我走过最开始这一段。',
    signature: 'DW',
    finalLine: '很幸运，那段路上遇见了你。',
    date: '2026.9.30',
  },
};

export type MentorStory = typeof mentorStory;
