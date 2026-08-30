import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Lamp } from '../../components/Lamp/Lamp';
import { QuestionFragment, type QuestionFragmentData } from '../../components/QuestionFragment/QuestionFragment';
import { mentorStory, type ThinkingGroupId } from '../../content/mentor';
import { playSoundEffect } from '../../components/AmbientSound/AmbientSound';
import { enterScene } from '../../animation/timeline';
import { useIdleHint } from '../../hooks/useIdleHint';

type ThinkingSceneProps = { active: boolean; onComplete: () => void };
type Position = { x: number; y: number; rotate: number };
type Phase = 'intro' | 'demo' | 'guided' | 'narration' | 'dissolve';

const groupOffsets: Record<ThinkingGroupId, Position[]> = {
  user: [{ x: -17, y: -12, rotate: -4 }, { x: -17, y: 12, rotate: 3 }],
  scenario: [{ x: -16, y: -12, rotate: 4 }, { x: 16, y: 16, rotate: -3 }],
  flow: [{ x: 15, y: -12, rotate: -2 }, { x: 15, y: 14, rotate: 4 }],
  exception: [{ x: -16, y: -12, rotate: 3 }, { x: -16, y: 16, rotate: -4 }],
};

const alignedGroupPositions: Record<ThinkingGroupId, { x: number; y: number }> = {
  user: { x: 28, y: 37 },
  scenario: { x: 54, y: 28 },
  flow: { x: 75, y: 44 },
  exception: { x: 54, y: 68 },
};

const initialQuestionPositions: Record<string, Position> = {
  'user-who': { x: 11, y: 24, rotate: -8 },
  'user-why': { x: 29, y: 72, rotate: 5 },
  'scenario-when': { x: 48, y: 12, rotate: 3 },
  'scenario-other': { x: 72, y: 22, rotate: -5 },
  'flow-next': { x: 86, y: 38, rotate: 7 },
  'flow-after': { x: 48, y: 84, rotate: -2 },
  'exception-fail': { x: 70, y: 56, rotate: -8 },
  'exception-missing': { x: 12, y: 56, rotate: 6 },
};

const anchorSymbols: Record<ThinkingGroupId, string> = {
  user: '○',
  scenario: '◎',
  flow: '→',
  exception: '⌁',
};

export function ThinkingScene({ active, onComplete }: ThinkingSceneProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ id: string; moved: boolean } | null>(null);
  const settledIdsRef = useRef<string[]>([]);
  const settlingIdsRef = useRef(new Set<string>());
  const timersRef = useRef<number[]>([]);
  const transitionStartedRef = useRef(false);
  const dragMoveFrameRef = useRef<number | null>(null);
  const dragPointRef = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const questions = mentorStory.thinking.questions as QuestionFragmentData[];
  const introNarration = mentorStory.thinking.introNarration;
  const [positions, setPositions] = useState<Record<string, Position>>(() => Object.fromEntries(
    questions.map((question) => [question.id, initialQuestionPositions[question.id] ?? question.position]),
  ));
  const [settledIds, setSettledIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [focusedGroup, setFocusedGroup] = useState<ThinkingGroupId | null>(null);
  const [hintGroup, setHintGroup] = useState<ThinkingGroupId | null>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [introNarrationStage, setIntroNarrationStage] = useState(0);
  const [narrationStage, setNarrationStage] = useState(0);
  const [anchorsVisible, setAnchorsVisible] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [hintQuestionId, setHintQuestionId] = useState<string | null>(null);
  const idleHintLevel = useIdleHint({ active: active && phase === 'guided', delay: 5000 });

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  }

  function clearSceneTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function cancelPendingDragMove() {
    if (dragMoveFrameRef.current !== null) window.cancelAnimationFrame(dragMoveFrameRef.current);
    dragMoveFrameRef.current = null;
    dragPointRef.current = null;
  }

  useEffect(() => {
    if (active) enterScene(sceneRef.current);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    clearSceneTimers();
    settledIdsRef.current = [];
    settlingIdsRef.current.clear();
    transitionStartedRef.current = false;
    setPositions(Object.fromEntries(questions.map((question) => [question.id, initialQuestionPositions[question.id] ?? question.position])));
    setSettledIds([]);
    setDraggingId(null);
    setFocusedId(null);
    setFocusedGroup(null);
    setHintGroup(null);
    setPhase('intro');
    setIntroNarrationStage(1);
    setNarrationStage(0);
    setAnchorsVisible(false);
    setDissolving(false);
    setHintQuestionId(null);

    schedule(() => setIntroNarrationStage(2), reducedMotion ? 350 : 1900);
    schedule(() => {
      setAnchorsVisible(true);
      setPhase('demo');
      setIntroNarrationStage(0);
    }, reducedMotion ? 700 : 3500);
    schedule(() => settleFragment('user-who', 'demo'), reducedMotion ? 900 : 4300);

    return () => {
      clearSceneTimers();
      cancelPendingDragMove();
    };
  }, [active, reducedMotion]);

  useEffect(() => {
    if (!active || phase !== 'guided' || settledIds.length < questions.length || transitionStartedRef.current) return;
    transitionStartedRef.current = true;
    schedule(startFinalNarration, reducedMotion ? 120 : 900);
  }, [active, phase, reducedMotion, settledIds.length, questions.length]);

  useEffect(() => {
    if (!active || phase !== 'guided') return;
    if (idleHintLevel === 0) {
      setHintGroup(null);
      setHintQuestionId(null);
      return;
    }
    const nextUnsettled = questions.find((q) => !settledIdsRef.current.includes(q.id) && !settlingIdsRef.current.has(q.id));
    const targetQuestion = nextUnsettled ?? questions[0];
    const element = sceneRef.current?.querySelector(`[data-question-id="${targetQuestion.id}"]`);
    if (idleHintLevel === 1 && element) {
      gsap.fromTo(element, { x: 0, y: 0 }, { x: 28, y: -12, duration: reducedMotion ? 0.1 : 0.8, yoyo: true, repeat: 1, ease: 'sine.inOut' });
    }
    if (idleHintLevel >= 2) {
      setHintGroup(targetQuestion.group);
      setHintQuestionId(targetQuestion.id);
    }
    if (idleHintLevel >= 3) setFocusedId(targetQuestion.id);
  }, [active, idleHintLevel, phase, questions, reducedMotion]);

  function markSettled(id: string) {
    setSettledIds((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      settledIdsRef.current = next;
      return next;
    });
  }

  function settleFragment(id: string, source: 'demo' | 'visitor' | 'group') {
    if (settledIdsRef.current.includes(id) || settlingIdsRef.current.has(id)) return;
    const data = questions.find((question) => question.id === id);
    const element = sceneRef.current?.querySelector(`[data-question-id="${id}"]`);
    if (!data || !element) return;

    settlingIdsRef.current.add(id);
    const groupMembers = questions.filter((question) => question.group === data.group);
    const offsetIndex = Math.max(0, groupMembers.findIndex((question) => question.id === id));
    const offset = groupOffsets[data.group][offsetIndex] ?? { x: 0, y: 0, rotate: 0 };
    const group = alignedGroupPositions[data.group];
    const target = { x: group.x + offset.x, y: group.y + offset.y, rotate: offset.rotate };

    gsap.killTweensOf(element);
    gsap.set(element, { x: 0, y: 0 });
    gsap.to(element, {
      left: `${target.x}%`,
      top: `${target.y}%`,
      rotate: target.rotate,
      duration: reducedMotion ? 0.1 : source === 'demo' ? 1.9 : source === 'group' ? 1.2 : 1.05,
      delay: source === 'group' ? offsetIndex * 0.14 : 0,
      ease: 'power3.out',
      onComplete: () => {
        settlingIdsRef.current.delete(id);
        playSoundEffect('paper-settle');
        setPositions((current) => ({ ...current, [id]: target }));
        markSettled(id);
        if (source === 'demo') {
          setPhase('guided');
          setFocusedGroup(null);
        }
        if (source === 'visitor') {
          setFocusedId(null);
          setFocusedGroup(null);
        }
      },
    });
  }

  function settleGroup(groupId: ThinkingGroupId) {
    const hasPending = questions.some((question) => question.group === groupId
      && !settledIdsRef.current.includes(question.id)
      && !settlingIdsRef.current.has(question.id));
    if (!['demo', 'guided'].includes(phase) || !hasPending) return;
    setFocusedId(null);
    setFocusedGroup(groupId);
    questions
      .filter((question) => question.group === groupId)
      .forEach((question) => settleFragment(question.id, 'group'));
  }

  function startFinalNarration() {
    setPhase('narration');
    setNarrationStage(1);
    // Let every line of the conclusion settle before the questions converge.
    // The previous timing started the dissolve while the second line was still
    // entering, which made the ending feel abrupt.
    schedule(() => setNarrationStage(2), reducedMotion ? 300 : 1800);
    schedule(() => setNarrationStage(3), reducedMotion ? 600 : 3600);
    schedule(() => {
      setDissolving(true);
      setPhase('dissolve');
    }, reducedMotion ? 1050 : 5600);
    schedule(onComplete, reducedMotion ? 2000 : 8500);
  }

  function getStagePoint(clientX: number, clientY: number) {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.min(92, Math.max(14, ((clientY - rect.top) / rect.height) * 100)),
    };
  }

  function handlePointerDown(id: string, event: React.PointerEvent<HTMLButtonElement>) {
    if (phase !== 'guided') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const data = questions.find((question) => question.id === id);
    dragRef.current = { id, moved: false };
    playSoundEffect('paper-lift');
    setDraggingId(id);
    setFocusedId(id);
    setFocusedGroup(data?.group ?? null);
  }

  function applyDragPosition() {
    const drag = dragRef.current;
    const pointer = dragPointRef.current;
    if (!drag || !pointer || !sceneRef.current) return;
    const point = getStagePoint(pointer.x, pointer.y);
    const data = questions.find((question) => question.id === drag.id);
    if (!point || !data) return;
    drag.moved = true;
    const target = mentorStory.thinking.groups[data.group].position;
    const rect = sceneRef.current.getBoundingClientRect();
    const attractionRadius = Math.max(14, Math.min(30, (320 / rect.width) * 100));
    const distance = Math.hypot(point.x - target.x, point.y - target.y);
    const attraction = distance < attractionRadius ? Math.min(0.72, ((attractionRadius - distance) / attractionRadius) * 0.72) : 0;
    const attractedPoint = {
      x: point.x + (target.x - point.x) * attraction,
      y: point.y + (target.y - point.y) * attraction,
    };
    setFocusedGroup(distance < attractionRadius ? data.group : null);
    setPositions((current) => ({ ...current, [drag.id]: { ...current[drag.id], ...attractedPoint } }));
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    drag.moved = true;
    dragPointRef.current = { x: event.clientX, y: event.clientY };
    if (dragMoveFrameRef.current !== null) return;
    dragMoveFrameRef.current = window.requestAnimationFrame(() => {
      dragMoveFrameRef.current = null;
      applyDragPosition();
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    if (dragMoveFrameRef.current !== null) {
      window.cancelAnimationFrame(dragMoveFrameRef.current);
      dragMoveFrameRef.current = null;
      applyDragPosition();
    }
    dragPointRef.current = null;
    dragRef.current = null;
    setDraggingId(null);
    if (drag.moved) {
      settleFragment(drag.id, 'visitor');
      return;
    }
    const point = getStagePoint(event.clientX, event.clientY);
    if (!point) return;
  }

  function handleTap(id: string) {
    if (phase !== 'guided' || settledIdsRef.current.includes(id) || settlingIdsRef.current.has(id)) return;
    const data = questions.find((question) => question.id === id);
    if (!data) return;
    if (focusedId === id) {
      settleFragment(id, 'visitor');
      return;
    }
    setFocusedId(id);
    setFocusedGroup(data.group);
  }

  const settledGroups = new Set<ThinkingGroupId>(
    (Object.keys(mentorStory.thinking.groups) as ThinkingGroupId[])
      .filter((groupId) => questions
        .filter((question) => question.group === groupId)
        .every((question) => settledIds.includes(question.id))),
  );
  const interactionEnabled = phase === 'guided';
  const groupingEnabled = phase === 'demo' || phase === 'guided';

  return (
    <section ref={sceneRef} className={`scene scene--thinking phase--${phase} ${active ? 'is-active' : ''} ${dissolving ? 'is-dissolving' : ''}`}>
      <div className="thinking__grain" aria-hidden="true" />
      <div className="thinking__deep-light" aria-hidden="true" />
      <Lamp className="thinking__lamp" dimmed />
      <div className="thinking__copy">
        <p className="eyebrow">{mentorStory.thinking.chapter}</p>
        <h2>{mentorStory.thinking.title}</h2>
        <p>{mentorStory.thinking.hint}</p>
      </div>
      <div className="thinking__space" aria-label="问题碎片与概念锚点">
        {questions.map((question) => {
          const position = positions[question.id];
          return (
            <QuestionFragment
              key={question.id}
              data={question}
              style={{ left: `${position.x}%`, top: `${position.y}%`, transform: `translate(-50%, -50%) rotate(${position.rotate}deg)` }}
              isSettled={settledIds.includes(question.id)}
              isDragging={draggingId === question.id}
              isFocused={focusedId === question.id}
              isHint={hintQuestionId === question.id}
              interactionEnabled={interactionEnabled}
              onPointerDown={(event) => handlePointerDown(question.id, event)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onTap={() => handleTap(question.id)}
            />
          );
        })}
        <svg className={`thinking__framework ${anchorsVisible ? 'is-visible' : ''}`} viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
          <path d="M280 260 C380 220 450 205 540 195 M540 195 C625 220 695 250 750 310 M750 310 C695 410 620 470 540 475 M540 475 C450 430 370 365 280 260" />
          <path d="M280 260 C300 300 320 340 350 385 M540 195 C540 285 540 385 540 475 M750 310 C690 305 620 300 540 295" />
        </svg>
        {Object.entries(mentorStory.thinking.groups).map(([id, group]) => {
          const groupId = id as ThinkingGroupId;
          const activeAnchor = focusedGroup === groupId || hintGroup === groupId;
          const isHintAnchor = hintGroup === groupId;
          return (
            <button
              type="button"
              key={id}
              className={`thinking__anchor thinking__anchor--${id} ${anchorsVisible ? 'is-visible' : ''} ${activeAnchor ? 'is-focused' : ''} ${isHintAnchor ? 'is-hint' : ''} ${settledGroups.has(groupId) ? 'is-populated' : ''}`}
              style={{ left: `${alignedGroupPositions[groupId].x}%`, top: `${alignedGroupPositions[groupId].y}%` }}
              disabled={!groupingEnabled || settledGroups.has(groupId)}
              onClick={() => settleGroup(groupId)}
              aria-label={`点击${group.label}，自动归类相关问题`}
            >
              <span className="thinking__anchor-symbol" aria-hidden="true">{anchorSymbols[groupId]}</span>
              <span className="thinking__anchor-label"><b>{group.label}</b><small>{groupId.toUpperCase()}</small></span>
            </button>
          );
        })}
      </div>
      <div className={`thinking__intro-narration ${introNarrationStage > 0 ? 'is-visible' : ''}`} aria-live="polite">
        {introNarrationStage > 0 && <p>{introNarration[0]}</p>}
        {introNarrationStage > 1 && <p>{introNarration[1]}</p>}
      </div>
      {false && idleHintLevel >= 3 && interactionEnabled && (
        <p className="thinking__idle-hint" aria-live="polite">试着点击主题</p>
      )}
      <div className={`thinking__narration ${narrationStage > 0 ? 'is-visible' : ''}`} aria-live="polite">
        {narrationStage > 0 && <p>{mentorStory.thinking.narration[0]}</p>}
        {narrationStage > 1 && <p>{mentorStory.thinking.narration[1]}</p>}
        {narrationStage > 2 && <p>{mentorStory.thinking.narration[2]}</p>}
      </div>
      <div className="scene-index">03 / 07</div>
    </section>
  );
}
