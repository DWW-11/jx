# Mentor Interactive Story — Phase 1

## Direction

这不是传统网页，而是一组可以被靠近、拖动和寻找的空间。视觉遵循附件指定的低饱和纸张世界：

- 背景：`#ECE6DA`
- 墨蓝：`#18212B`
- 纸张：`#F6F1E7`
- 批注红：`#C9584C`
- 灯光：`#E9B96E`
- 记忆蓝灰：`#748899`

字体使用 `Newsreader` 表现叙事文本，`Inter` 表现细小标记，`Caveat` 表现手写批注和旁白提示。字体加载失败时会回退到系统衬线、无衬线和楷体字体。

## Phase 1 scenes

### Scene 00 — The Light

画面从墨蓝黑场开始，引用文案保持克制。右侧偏离中心的位置存在一个很弱的台灯光池，鼠标靠近或触摸灯光目标时，光源、台灯和文字逐渐增强。没有传统 CTA，交互本身就是“发现故事入口”。

### Scene 01 — First Day

工作台由 CSS 图形与 SVG 友好的几何层构成：窗、桌面、电脑、咖啡杯、工牌、台灯和文档。指针移动带来不同深度层的微小视差。只有文档是主交互对象，点击或键盘聚焦后可进入下一幕。

### Scene 02 — The First Review

文档成为主空间。拖动纸张时按进度解锁三条批注，批注线使用 SVG path 的 stroke-dashoffset 绘制，文字使用手写字体。批注全部出现后，以时间线显示两句旁白，最后让四个关键词从纸面脱离并漂浮。

## Content editing

所有需要替换的故事文案都在 `src/content/mentor.ts`，包括：

- Scene 00 引导语
- Scene 01 初见工作台的旁白
- Scene 02 三条批注
- Scene 02 两句总结旁白
- 最后一组漂浮词语

## Interaction and accessibility

- 桌面端使用指针靠近、视差和拖动；移动端通过触摸事件获得同一套交互结果。
- Scene 02 同时提供“继续揭开”按钮，避免拖动成为唯一的输入方式。
- 重要控件使用原生 `button`，具备可见的键盘焦点和可访问名称。
- `prefers-reduced-motion: reduce` 下取消非必要位移与漂浮，保留最终可读内容。
- 音效必须由用户先选择开启，环境声音由 Web Audio 生成极低音量的房间底噪，不自动播放。

## Extension points

- 新场景放在 `src/scenes/<SceneName>`，通过 `App.tsx` 的 `Scene` 联合类型接入。
- 共享动效放在 `src/animation/timeline.ts`；不要把复杂时间线散落在页面组件中。
- 后续可以在 `src/components/MemoryObject` 增加与真实回忆对应的物件。
- Phase 2 可以接住 Scene 02 的 `floatingWords`，进入“思考方式”场景。
