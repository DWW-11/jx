import { useEffect, useMemo, useRef, useState } from 'react';
import { MemoryObject } from '../../components/MemoryObject/MemoryObject';
import { mentorStory, type MemoryObjectData } from '../../content/mentor';
import { playSoundEffect } from '../../components/AmbientSound/AmbientSound';
import { enterScene } from '../../animation/timeline';

type MemoriesSceneProps = {
  active: boolean;
  discoveredMemories: string[];
  onDiscover: (id: string) => void;
  onComplete: () => void;
};

const memoryOrder = ['coffee', 'document', 'message', 'meeting'];

export function MemoriesScene({ active, discoveredMemories, onDiscover, onComplete }: MemoriesSceneProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [activeMemory, setActiveMemory] = useState<MemoryObjectData | null>(null);
  const [memoryLine, setMemoryLine] = useState(0);
  const [pathVisible, setPathVisible] = useState(false);
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const parallaxFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const nextMemoryId = memoryOrder[discoveredMemories.length] ?? null;

  useEffect(() => {
    if (!active) {
      setActiveMemory(null);
      setMemoryLine(0);
      setPathVisible(false);
      if (parallaxFrameRef.current !== null) window.cancelAnimationFrame(parallaxFrameRef.current);
      parallaxFrameRef.current = null;
      return;
    }
    enterScene(sceneRef.current);
  }, [active]);

  useEffect(() => {
    if (!activeMemory) return;
    setMemoryLine(0);
    const interval = window.setInterval(() => {
      setMemoryLine((current) => Math.min(activeMemory.text.length - 1, current + 1));
    }, reducedMotion ? 900 : 2100);
    const dismiss = window.setTimeout(() => setActiveMemory(null), (reducedMotion ? 900 : 2100) * activeMemory.text.length + (reducedMotion ? 300 : 900));
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(dismiss);
    };
  }, [activeMemory, reducedMotion]);

  useEffect(() => {
    if (!active || discoveredMemories.length < mentorStory.memories.length || activeMemory) {
      setPathVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setPathVisible(true), reducedMotion ? 180 : 850);
    return () => window.clearTimeout(timer);
  }, [active, activeMemory, discoveredMemories.length, reducedMotion]);

  function openMemory(memory: MemoryObjectData) {
    if (activeMemory || memory.id !== nextMemoryId) return;
    playSoundEffect('memory-chime');
    onDiscover(memory.id);
    setActiveMemory(memory);
  }

  function updateParallax(clientX: number, clientY: number) {
    pointerRef.current = { x: clientX, y: clientY };
    if (parallaxFrameRef.current !== null) return;
    parallaxFrameRef.current = window.requestAnimationFrame(() => {
      parallaxFrameRef.current = null;
      const rect = sceneRef.current?.getBoundingClientRect();
      if (!rect) return;
      sceneRef.current?.style.setProperty('--memory-parallax-x', `${((pointerRef.current.x - rect.left) / rect.width - 0.5) * 2}`);
      sceneRef.current?.style.setProperty('--memory-parallax-y', `${((pointerRef.current.y - rect.top) / rect.height - 0.5) * 2}`);
    });
  }

  return (
    <section
      ref={sceneRef}
      className={`scene scene--memories ${active ? 'is-active' : ''} ${activeMemory ? 'has-memory-open' : ''}`}
      style={{ '--memory-parallax-x': 0, '--memory-parallax-y': 0 } as React.CSSProperties}
      onPointerMove={(event) => updateParallax(event.clientX, event.clientY)}
    >
      <div className="memories__grain" aria-hidden="true" />
      <div className="memories__room" aria-hidden="true">
        <span className="memories__wall-line memories__wall-line--one" />
        <span className="memories__wall-line memories__wall-line--two" />
        <span className="memories__floor" />
      </div>
      <div className="memories__copy">
        <p className="eyebrow">{mentorStory.memoriesScene.chapter}</p>
        <h2>{mentorStory.memoriesScene.title[0]}<br />{mentorStory.memoriesScene.title[1]}</h2>
        <p>{mentorStory.memoriesScene.body}</p>
      </div>
      <div className="memories__objects" aria-label="可以探索的记忆物件">
        {mentorStory.memories.map((memory) => (
          <MemoryObject
            key={memory.id}
            data={memory}
            discovered={discoveredMemories.includes(memory.id)}
            active={activeMemory?.id === memory.id}
            isNext={!activeMemory && memory.id === nextMemoryId}
            locked={!discoveredMemories.includes(memory.id) && memory.id !== nextMemoryId}
            activeText={activeMemory?.id === memory.id ? activeMemory.text[memoryLine] : undefined}
            onOpen={() => openMemory(memory)}
          />
        ))}
      </div>
      <div className={`memory-path ${pathVisible ? 'is-visible' : ''}`}>
        <span className="memory-path__line memory-path__line--one" />
        <span className="memory-path__line memory-path__line--two" />
        <span className="memory-path__light" />
        <button type="button" onClick={() => { playSoundEffect('paper-turn'); onComplete(); }} aria-label="跟随微光走向另一张桌子" />
      </div>
      <div className="scene-index">04 / 07</div>
    </section>
  );
}
