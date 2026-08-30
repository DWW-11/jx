import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { mentorStory } from '../../content/mentor';
import { Annotation } from '../../components/Paper/Annotation';
import { playSoundEffect } from '../../components/AmbientSound/AmbientSound';
import { enterScene } from '../../animation/timeline';

type DocumentSceneProps = { active: boolean; onComplete: () => void };

export function DocumentScene({ active, onComplete }: DocumentSceneProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [narration, setNarration] = useState(0);
  const [floating, setFloating] = useState(false);
  const transitionStartedRef = useRef(false);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const annotationCount = mentorStory.review.annotations.length;
  const progress = annotationCount > 0 ? revealedCount / annotationCount : 0;

  useEffect(() => {
    if (!active) {
      setRevealedCount(0);
      setNarration(0);
      setFloating(false);
      transitionStartedRef.current = false;
      return;
    }
    enterScene(sceneRef.current);
  }, [active]);

  function continueToThinking() {
    if (transitionStartedRef.current) return;
    if (revealedCount < annotationCount) {
      playSoundEffect('pencil');
      setRevealedCount((current) => Math.min(annotationCount, current + 1));
      return;
    }
    transitionStartedRef.current = true;
    playSoundEffect('paper-turn');
    setNarration(1);
    setFloating(true);
    const timeline = gsap.timeline({ delay: reducedMotion ? 0 : 0.35 });
    // Keep both narration slots in the layout so the first line never jumps
    // when the second line is revealed. Give the second line time to finish
    // fading in before the scene changes.
    timeline.call(() => setNarration(2), [], reducedMotion ? 0.35 : 2.4);
    timeline.call(onComplete, [], reducedMotion ? 1.8 : 5.4);
  }

  return (
    <section ref={sceneRef} className={`scene scene--document ${active ? 'is-active' : ''}`}>
      <div className="document__atmosphere" aria-hidden="true" />
      <div className="document__intro">
        <p className="eyebrow">{mentorStory.review.chapter}</p>
        <h2>{mentorStory.review.title}</h2>
        <p>{mentorStory.review.dragHint}</p>
      </div>
      <div
        className={`paper-sheet ${floating ? 'has-finished' : ''}`}
        role="group"
        aria-label="逐条显示批注的评审文件"
      >
        <div className="paper-sheet__crease paper-sheet__crease--one" />
        <div className="paper-sheet__crease paper-sheet__crease--two" />
        <div className="paper-sheet__header">
          <span>PRODUCT / REVIEW</span>
          <span>OPEN QUESTIONS</span>
        </div>
        <div className="paper-sheet__content">
          <div className="paper-sheet__title-line" />
          <div className="paper-sheet__title-line paper-sheet__title-line--short" />
          <div className="paper-sheet__columns">
            <div>
              <span /><span /><span /><span /><span /><span />
            </div>
            <div>
              <span /><span /><span /><span /><span />
            </div>
          </div>
          <div className="paper-sheet__diagram"><span /><i /><b /></div>
        </div>
        {mentorStory.review.annotations.map((annotation, index) => (
          <Annotation
            key={annotation.text}
            text={annotation.text}
            path={annotation.path}
            index={index}
            revealed={revealedCount > index}
          />
        ))}
        <div className="paper-sheet__stamp">LOOK CLOSER</div>
        <button
          className="paper-sheet__keyboard-action"
          type="button"
          onClick={continueToThinking}
          aria-label={revealedCount < annotationCount ? '显示下一条批注' : '继续进入下一页'}
        >
          继续揭开
        </button>
      </div>
      <div className={`document__narration ${narration > 0 ? 'is-visible' : ''}`} aria-live="polite">
        <p className={narration > 0 ? 'is-shown' : ''}>{mentorStory.review.narration[0]}</p>
        <p className={narration > 1 ? 'is-shown' : ''}>{mentorStory.review.narration[1]}</p>
      </div>
      <div className={`floating-words ${floating ? 'is-floating' : ''}`} aria-label="从文件上浮起的词语">
        {mentorStory.review.floatingWords.map((word, index) => (
          <span key={word} style={{ '--word-index': index } as React.CSSProperties}>{word}</span>
        ))}
      </div>
      <div className="document__progress" aria-label="批注揭示线">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="scene-index">02 / 07</div>
    </section>
  );
}
