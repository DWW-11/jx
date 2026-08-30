# Mentor Interactive Story — Phase 2

Phase 2 延续 Phase 1 的纸张、蓝灰空间和台灯，不引入新的视觉系统。情绪路径是：理解 → 回忆 → 内化 → 离开 → 信。

## Storyboard and transitions

| Scene | Spatial state | Interaction | Transition out |
| --- | --- | --- | --- |
| 03 / 学会看见 | 纸张退到深色背景，问题碎片漂浮，远处仍有灯 | 拖动或点击碎片，靠近隐藏的概念组 | 结构线出现，旁白后碎片变成微光，进入记忆室 |
| 04 / 小小的记忆 | 不完整的安静房间，四个物件各有一小块光 | 任意顺序点击咖啡、汇报、文件、消息 | 三个记忆标记连成松散光路，点击光路进入下一张桌子 |
| 05 / 它留下来了 | 更清晰、更有秩序的新工作台，台灯初始关闭 | 打开空白文件，等待自问逐条出现 | 淡红旧批注短暂出现后消失，台灯亮起，进入离开 |
| 06 / 离开 | 同一空间逐件撤走，后方变暗 | 鼠标/触摸向空间边缘移动，移动端也支持向下滚动 | 空间只剩桌、灯、影子；靠近影子中的信封并打开 |
| 07 / 一封信 | 整个视口变成纸张，不再有卡片或外框 | 点击信封后物理打开，之后自然滚动阅读 | 末尾只留下最终句和一个很轻的回到开始入口 |

## Reusable components

- `QuestionFragment`：可拖动/点击的问题碎片，支持深度、旋转和磁性归位。
- `MemoryObject`：统一承载咖啡、文件、消息和汇报物件，数据来自 `mentor.ts`。
- `WorkspaceIllustration`：复用 Scene 05/06 的桌面、窗、电脑、文件、工牌和台灯。
- `Envelope`：按指针距离改变阴影与位置，再以按钮语义打开信件。
- `Lamp`：继续作为全局叙事进度隐喻。

## Animation timeline

- Scene 03：拖拽跟手；归组使用约 1 秒的 `power3.out` 磁性缓动；结构线渐显；旁白分三次出现；碎片最后缩小成光点。
- Scene 04：物件 hover/聚焦只做轻微上移和光量变化；记忆文本每约 2 秒换一行；第三个记忆完成后光路缓慢显现。
- Scene 05：打开文件后先保留约 2 秒空白；五个问题逐条出现；红色批注只做低透明度 ghost trace；台灯缓慢自亮。
- Scene 06：向边缘移动后，便签、文件、电脑、消息、椅子、工牌按约 1 秒间隔离开；只保留房间底噪和灯；信封被靠近时平移约 28px。
- Scene 07：镜头靠近、信封旋转、翻盖、纸张抽出，最终淡入整页纸；段落使用 IntersectionObserver 的近乎不可察觉的显现。

## Temporary assets and implementation

本阶段继续不依赖外部栅格素材：

- CSS：空间、家具、物件轮廓、纸张纹理、光晕和轻微噪声。
- SVG：Scene 03 思考结构、批注 ghost trace 和手绘连接线。
- GSAP：物理归位、叙事时间线、场景切换。
- Canvas：不需要；粒子量很少，用 CSS 光点和伪元素更轻。
- Three.js：不需要。当前 2.5D 层级、CSS transform 和 SVG 已足够表达深度，而且更利于移动端与 reduced-motion。

## Performance and accessibility risks

- 所有移动效果优先 transform/opacity，避免布局重排。
- 问题碎片在移动端可直接点击归组，拖动不是唯一入口。
- 信件场景才开放自然滚动，避免前面出现 nested scroll。
- 继承 `prefers-reduced-motion`，保留所有文字和叙事结果，只缩短或取消位移。
- 台灯、信封和声音控制使用原生按钮语义与可见 focus 状态。
