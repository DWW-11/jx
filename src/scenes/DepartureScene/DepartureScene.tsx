import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Envelope } from '../../components/Envelope/Envelope';
import { WorkspaceIllustration } from '../../components/Workspace/WorkspaceIllustration';
import { mentorStory } from '../../content/mentor';
import { playSoundEffect } from '../../components/AmbientSound/AmbientSound';
import { enterScene } from '../../animation/timeline';
import { useIdleHint } from '../../hooks/useIdleHint';

type DepartureSceneProps = { active: boolean; onOpenLetter: () => void };

export function DepartureScene({ active, onOpenLetter }: DepartureSceneProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const departureStartedRef = useRef(false);
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [edgeProgress, setEdgeProgress] = useState(0);
  const [objectStage, setObjectStage] = useState(0);
  const [narrationStage, setNarrationStage] = useState(0);
  const [envelopeProximity, setEnvelopeProximity] = useState(0);
  const [envelopeVisible, setEnvelopeVisible] = useState(false);
  const idleHintLevel = useIdleHint({ active: active && edgeProgress < 0.84, delay: 7000 });
  const edgeFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const soundedObjectStageRef = useRef(0);

  useEffect(() => {
    if (!active) {
      departureStartedRef.current = false;
      setEdgeProgress(0);
      setObjectStage(0);
      setNarrationStage(0);
      setEnvelopeProximity(0);
      setEnvelopeVisible(false);
      soundedObjectStageRef.current = 0;
      if (edgeFrameRef.current !== null) window.cancelAnimationFrame(edgeFrameRef.current);
      edgeFrameRef.current = null;
      return;
    }
    enterScene(sceneRef.current);
  }, [active]);

  useEffect(() => {
    if (!active || departureStartedRef.current) return;
    departureStartedRef.current = true;
    const timeline = gsap.timeline({ delay: reducedMotion ? 0.35 : 1.8 });
    // Wait for the prompt ("位置正在慢慢变空 / 再看一眼") to fade before
    // showing the first narration line, so the two texts do not overlap.
    timeline.call(() => setObjectStage(1), [], reducedMotion ? 0.5 : 1.4);
    timeline.call(() => setNarrationStage(1), [], reducedMotion ? 1.4 : 2.6);
    timeline.call(() => setObjectStage(2), [], reducedMotion ? 0.9 : 2.7);
    timeline.call(() => setObjectStage(3), [], reducedMotion ? 1.3 : 4);
    timeline.call(() => setNarrationStage(2), [], reducedMotion ? 2.7 : 7.5);
    timeline.call(() => setObjectStage(4), [], reducedMotion ? 2.1 : 5.7);
    timeline.call(() => setObjectStage(5), [], reducedMotion ? 2.5 : 7.1);
    timeline.call(() => setObjectStage(6), [], reducedMotion ? 2.9 : 8.5);
    timeline.call(() => setNarrationStage(3), [], reducedMotion ? 4.5 : 12.4);
    return () => {
      timeline.kill();
    };
  }, [active, reducedMotion]);

  useEffect(() => {
    if (!active || objectStage === 0 || objectStage <= soundedObjectStageRef.current) return;
    soundedObjectStageRef.current = objectStage;
    playSoundEffect(objectStage === 6 ? 'lamp-off' : 'paper-settle');
  }, [active, objectStage]);

  // Wait until all three narration lines on the left have appeared before
  // revealing the envelope on the desk.
  useEffect(() => {
    if (!active || narrationStage < 3) return;
    const timer = window.setTimeout(() => {
      setEnvelopeVisible(true);
      playSoundEffect('envelope-arrive');
    }, reducedMotion ? 200 : 1400);
    return () => window.clearTimeout(timer);
  }, [active, narrationStage, reducedMotion]);

  useEffect(() => {
    if (!active || edgeProgress >= 0.84) return;
    if (idleHintLevel === 1) setEdgeProgress((current) => Math.max(current, 0.16));
    if (idleHintLevel === 2) setEdgeProgress((current) => Math.max(current, 0.42));
    if (idleHintLevel >= 3) setEdgeProgress((current) => Math.max(current, 0.88));
  }, [active, edgeProgress, idleHintLevel]);

  function updateEdgeProgress(clientX: number, clientY: number) {
    pointerRef.current = { x: clientX, y: clientY };
    if (edgeFrameRef.current !== null) return;
    edgeFrameRef.current = window.requestAnimationFrame(() => {
      edgeFrameRef.current = null;
      const scene = sceneRef.current;
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const xProgress = Math.max(0, (pointerRef.current.x - rect.left) / rect.width - 0.56) / 0.44;
      const yProgress = Math.max(0, (pointerRef.current.y - rect.top) / rect.height - 0.62) / 0.38;
      setEdgeProgress((current) => Math.max(current, Math.min(1, Math.max(xProgress, yProgress))));

      if (objectStage < 6) return;
      const envelope = scene.querySelector('.envelope');
      const envelopeRect = envelope?.getBoundingClientRect();
      if (!envelopeRect) return;
      const distance = Math.hypot(pointerRef.current.x - (envelopeRect.left + envelopeRect.width / 2), pointerRef.current.y - (envelopeRect.top + envelopeRect.height / 2));
      setEnvelopeProximity(Math.min(1, Math.max(0, 1 - distance / 260)));
    });
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (event.deltaY > 0) setEdgeProgress((current) => Math.min(1, current + 0.12));
  }

  const envelopeLabel = mentorStory.departure.envelopeLabel.replace('MENTOR_NAME', mentorStory.mentor.name);

  return (
    <section
      ref={sceneRef}
      className={`scene scene--departure ${active ? 'is-active' : ''} ${objectStage >= 6 ? 'is-empty' : ''}`}
      onPointerMove={(event) => updateEdgeProgress(event.clientX, event.clientY)}
      onWheel={handleWheel}
    >
      <div className="departure__grain" aria-hidden="true" />
      <div className="departure__camera" style={{ '--departure-progress': edgeProgress } as React.CSSProperties}>
        <WorkspaceIllustration variant="departure" objectStage={objectStage} lampActive={objectStage < 6} />
        {envelopeVisible && <Envelope label={envelopeLabel} proximity={envelopeProximity} onOpen={() => { playSoundEffect('envelope-open'); onOpenLetter(); }} />}
      </div>
      <div className={`departure__narration ${narrationStage > 0 ? 'is-visible' : ''}`} aria-live="polite">
        {narrationStage > 0 && <p>{mentorStory.departure.lines[0]}</p>}
        {narrationStage > 1 && <p>{mentorStory.departure.lines[1]}</p>}
        {narrationStage > 2 && <p>{mentorStory.departure.lines[2]}</p>}
      </div>
      <div className={`departure__prompt ${objectStage > 0 ? 'is-fading' : ''}`} aria-live="polite">
        <p>位置正在慢慢变空</p>
        <span>再看一眼</span>
      </div>
      <div className="departure__edge-hint" aria-hidden="true"> </div>
      <div className="scene-index">06 / 07</div>
    </section>
  );
}
