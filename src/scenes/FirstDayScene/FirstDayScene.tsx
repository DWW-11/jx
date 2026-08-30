import { useEffect, useRef } from 'react';
import { mentorStory } from '../../content/mentor';
import { Lamp } from '../../components/Lamp/Lamp';
import { playSoundEffect } from '../../components/AmbientSound/AmbientSound';
import { createSceneScrollParallax, enterScene } from '../../animation/timeline';
import { ArrowIcon } from '../../components/Icons';

type FirstDaySceneProps = {
  active: boolean;
  onOpenDocument: () => void;
};

export function FirstDayScene({ active, onOpenDocument }: FirstDaySceneProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const parallaxFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!active) return;
    enterScene(sceneRef.current);
    const releaseScroll = createSceneScrollParallax(sceneRef.current, (progress) => {
      sceneRef.current?.style.setProperty('--scroll-depth', `${progress}`);
    });
    return () => {
      releaseScroll();
      if (parallaxFrameRef.current !== null) window.cancelAnimationFrame(parallaxFrameRef.current);
      parallaxFrameRef.current = null;
    };
  }, [active]);

  function updateParallax(clientX: number, clientY: number) {
    pointerRef.current = { x: clientX, y: clientY };
    if (parallaxFrameRef.current !== null) return;
    parallaxFrameRef.current = window.requestAnimationFrame(() => {
      parallaxFrameRef.current = null;
      const rect = sceneRef.current?.getBoundingClientRect();
      if (!rect) return;
      sceneRef.current?.style.setProperty('--parallax-x', `${((pointerRef.current.x - rect.left) / rect.width - 0.5) * 2}`);
      sceneRef.current?.style.setProperty('--parallax-y', `${((pointerRef.current.y - rect.top) / rect.height - 0.5) * 2}`);
    });
  }

  function openDocument() {
    playSoundEffect('paper-turn');
    onOpenDocument();
  }

  return (
    <section
      ref={sceneRef}
      className={`scene scene--first-day ${active ? 'is-active' : ''}`}
      style={{ '--parallax-x': 0, '--parallax-y': 0 } as React.CSSProperties}
      onPointerMove={(event) => updateParallax(event.clientX, event.clientY)}
    >
      <div className="workspace__grain" aria-hidden="true" />
      <div className="workspace__window" aria-hidden="true">
        <div className="window__sky" />
        <div className="window__frame window__frame--one" />
        <div className="window__frame window__frame--two" />
        <div className="window__building window__building--one" />
        <div className="window__building window__building--two" />
      </div>
      <div className="workspace__shadow workspace__shadow--back" aria-hidden="true" />
      <div className="workspace__world" aria-hidden="true">
        <div className="desk">
          <div className="desk__top" />
          <div className="desk__leg desk__leg--left" />
          <div className="desk__leg desk__leg--right" />
        </div>
        <div className="laptop">
          <div className="laptop__screen"><span>new file / untitled</span></div>
          <div className="laptop__base" />
        </div>
        <div className="coffee"><div className="coffee__cup" /><div className="coffee__handle" /><div className="coffee__shadow" /></div>
        <div className="badge"><span>VISITOR</span><b>U&amp;M</b></div>
        <Lamp className="workspace__lamp" />
      </div>
      <button className="document-object" type="button" onClick={openDocument} aria-label="打开桌上的文件">
        <span className="document-object__line document-object__line--one" />
        <span className="document-object__line document-object__line--two" />
        <span className="document-object__mark">review / 01</span>
        <span className="document-object__hint">{mentorStory.firstDay.documentHint} <ArrowIcon size={15} /></span>
      </button>
      <div className="first-day__copy">
        <p className="eyebrow">{mentorStory.firstDay.chapter}</p>
        <h2>{mentorStory.firstDay.title}</h2>
        <p>{mentorStory.firstDay.body}</p>
      </div>
      <div className="scene-index">01 / 07</div>
    </section>
  );
}
