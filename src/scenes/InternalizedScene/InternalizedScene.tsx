import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { WorkspaceIllustration } from '../../components/Workspace/WorkspaceIllustration';
import { mentorStory } from '../../content/mentor';
import { playSoundEffect } from '../../components/AmbientSound/AmbientSound';
import { enterScene } from '../../animation/timeline';

type InternalizedSceneProps = { active: boolean; onComplete: () => void };

export function InternalizedScene({ active, onComplete }: InternalizedSceneProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const timelineStartedRef = useRef(false);
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [questionStage, setQuestionStage] = useState(0);
  const [narrationStage, setNarrationStage] = useState(0);
  const [lampActive, setLampActive] = useState(false);

  useEffect(() => {
    if (!active) {
      timelineStartedRef.current = false;
      setDocumentOpen(false);
      setQuestionStage(0);
      setNarrationStage(0);
      setLampActive(false);
      return;
    }
    enterScene(sceneRef.current);
  }, [active]);

  useEffect(() => {
    if (!active || !documentOpen || timelineStartedRef.current) return;
    timelineStartedRef.current = true;
    const timeline = gsap.timeline({ delay: reducedMotion ? 0 : 2.4 });
    timeline.call(() => setQuestionStage(1), [], reducedMotion ? 0.4 : 1.2);
    timeline.call(() => setQuestionStage(2), [], reducedMotion ? 0.8 : 2.4);
    timeline.call(() => setQuestionStage(3), [], reducedMotion ? 1.2 : 3.6);
    timeline.call(() => setQuestionStage(4), [], reducedMotion ? 1.6 : 4.8);
    timeline.call(() => setQuestionStage(5), [], reducedMotion ? 2 : 6);
    timeline.call(() => setNarrationStage(1), [], reducedMotion ? 2.3 : 2.6);
    timeline.call(() => setNarrationStage(2), [], reducedMotion ? 3 : 5.3);
    timeline.call(() => setNarrationStage(3), [], reducedMotion ? 3.6 : 8.7);
    timeline.call(() => {
      setLampActive(true);
      playSoundEffect('lamp-on');
    }, [], reducedMotion ? 4.2 : 10.3);
    timeline.call(onComplete, [], reducedMotion ? 6 : 15.5);
    return () => {
      timeline.kill();
    };
  }, [active, documentOpen, onComplete, reducedMotion]);

  function openDocument() {
    playSoundEffect('paper-turn');
    setDocumentOpen(true);
  }

  return (
    <section ref={sceneRef} className={`scene scene--internalized ${active ? 'is-active' : ''} ${documentOpen ? 'is-open' : ''}`}>
      <div className="internalized__grain" aria-hidden="true" />
      <WorkspaceIllustration variant="owned" lampActive={lampActive} onOpenDocument={!documentOpen ? openDocument : undefined} />
      {!documentOpen && (
        <div className="internalized__entry-copy">
          <p>有些问题，已经变成了自己的问题</p>
          <span>桌上的文档还留着</span>
        </div>
      )}
      {documentOpen && (
        <div className="internalized__questions" aria-live="polite" aria-label="逐渐浮现的问题">
          {mentorStory.internalizedQuestions.map((question, index) => (
            <p key={question} className={questionStage > index ? 'is-visible' : ''}>{question}</p>
          ))}
        </div>
      )}
      <div className={`internalized__narration ${narrationStage > 0 ? 'is-visible' : ''}`} aria-live="polite">
        {narrationStage > 0 && <p>{mentorStory.internalizedNarration[0]}</p>}
        {narrationStage > 1 && <p>{mentorStory.internalizedNarration[1]}</p>}
        {narrationStage > 2 && <p>{mentorStory.internalizedNarration[2]}</p>}
      </div>
      <div className="scene-index">05 / 07</div>
    </section>
  );
}
