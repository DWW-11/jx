import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { mentorStory } from '../../content/mentor';
import { Lamp } from '../../components/Lamp/Lamp';
import { playSoundEffect } from '../../components/AmbientSound/AmbientSound';
import { enterScene } from '../../animation/timeline';

type IntroSceneProps = {
  active: boolean;
  started: boolean;
  onComplete: () => void;
};

export function IntroScene({ active, started, onComplete }: IntroSceneProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [illumination, setIllumination] = useState(0);
  const completedRef = useRef(false);
  const illuminationRef = useRef(0);
  const lampSoundPlayedRef = useRef(false);
  const illuminationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) {
      completedRef.current = false;
      illuminationRef.current = 0;
      lampSoundPlayedRef.current = false;
      setIllumination(0);
      return;
    }
    if (active) enterScene(sceneRef.current);
  }, [active, started]);

  useEffect(() => () => {
    if (illuminationFrameRef.current !== null) window.cancelAnimationFrame(illuminationFrameRef.current);
  }, []);

  useEffect(() => {
    if (!started || completedRef.current) return;
    if (illumination >= 0.93) {
      completedRef.current = true;
      gsap.to(sceneRef.current, {
        '--intro-light': 1,
        duration: 1.8,
        ease: 'power1.inOut',
        onComplete,
      });
    }
  }, [illumination, onComplete, started]);

  function updateIllumination(clientX: number, clientY: number) {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect || !started) return;
    const targetX = rect.left + rect.width * 0.78;
    const targetY = rect.top + rect.height * 0.53;
    const distance = Math.hypot(clientX - targetX, clientY - targetY);
    const radius = Math.max(170, rect.width * 0.2);
    const nextIllumination = Math.min(1, Math.max(0, 1 - distance / radius));
    illuminationRef.current = nextIllumination;
    if (nextIllumination >= 0.22 && !lampSoundPlayedRef.current) {
      lampSoundPlayedRef.current = true;
      playSoundEffect('lamp-on');
    }
    if (illuminationFrameRef.current !== null) return;
    illuminationFrameRef.current = window.requestAnimationFrame(() => {
      illuminationFrameRef.current = null;
      setIllumination(illuminationRef.current);
    });
  }

  return (
    <section
      ref={sceneRef}
      className={`scene scene--intro ${active ? 'is-active' : ''}`}
      style={{ '--intro-light': illumination } as React.CSSProperties}
      onPointerMove={(event) => updateIllumination(event.clientX, event.clientY)}
    >
      <div className="intro__grain" aria-hidden="true" />
      <div className="intro__light-pool" aria-hidden="true" />
      <div className="intro__copy" aria-live="polite">
        <p className="eyebrow">{mentorStory.eyebrow}</p>
        <h1>{mentorStory.intro.quote}</h1>
      </div>
      <p className="intro__hint">{mentorStory.intro.hint}</p>
      <button
        type="button"
        className="intro__lamp-target"
        onPointerDown={(event) => {
          updateIllumination(event.clientX, event.clientY);
          illuminationRef.current = 1;
          if (!lampSoundPlayedRef.current) {
            lampSoundPlayedRef.current = true;
            playSoundEffect('lamp-on');
          }
          setIllumination(1);
        }}
        aria-label="靠近远处的微光"
      >
        <span className="sr-only">靠近远处的微光</span>
        <Lamp className="intro__lamp" active={started} />
      </button>
      <div className="intro__edge-note">00 / 02</div>
    </section>
  );
}
